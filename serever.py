from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from sklearn.preprocessing import LabelEncoder
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the saved model
model = load_model('emotion_model.h5')

# Load tokenizer and label encoder
with open('tokenizer.json', 'r') as f:
    tokenizer = tokenizer_from_json(f.read())
label_encoder = LabelEncoder()
label_encoder.classes_ = np.load('label_encoder_classes.npy', allow_pickle=True)


# Define function to predict emotion
def predict_emotion(text):
    text_sequence = tokenizer.texts_to_sequences([text])
    padded_sequence = pad_sequences(text_sequence, maxlen=100)
    predicted_prob = model.predict(padded_sequence)[0]
    predicted_label_index = np.argmax(predicted_prob)
    predicted_label = label_encoder.inverse_transform([predicted_label_index])[0]
    return predicted_label

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data['text']
    predicted_emotion = predict_emotion(text)
    return jsonify({'emotion': predicted_emotion})

if __name__ == '__main__':
    app.run(debug=True)
