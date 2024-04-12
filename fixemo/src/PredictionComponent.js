import React, { useState } from 'react';
import axios from 'axios';
import './PredictionComponent.css';

function PredictionComponent() {
  const [text, setText] = useState('');
  //const [emoji, setEmoji] = useState('😐');
  //const [emotion, setEmotion] = useState('');
  const [messages, setMessages] = useState([]);

  const handleEmoji =(emotion) => {
    console.log(emotion);
     switch (emotion) {
      case 'neutral':
        return '😐';
      case 'joy':
        return '😊';
      case 'sadness':
        return '😢';
      case 'fear':
        return '😨';
      case 'surprise':
        return '😮';
      case 'anger':
        return '😡';
      case 'disgust':
        return '🤢';
      default:
        return '😐';
    }
  };
  

  const handlePredict = async () => {
    try {
      const response = await axios.post('http://localhost:5000/predict', { text });
      const newMessage = { text, type: 'sent' };
      
      const newEmotionMessage = { text: `${response.data.emotion} ${handleEmoji(response.data.emotion)}`, type: 'received' };
      setMessages([...messages, newMessage, newEmotionMessage]);
      setText('');
    } catch (error) {
      console.error('Error predicting emotion:', error);
    }
  };

  const handleMessageChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.type==='sent'?message.text:`You are feeling ${message.text}`}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={text}
          onChange={handleMessageChange}
          placeholder="Type a message..."
        />
        <button onClick={handlePredict}>Send</button>
      </div>
    </div>
  );
}

export default PredictionComponent;
