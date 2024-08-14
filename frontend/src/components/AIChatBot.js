import React, { useState } from 'react';
import axios from 'axios';

const AIChatbot = ({ userId }) => {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleInputChange = (e) => {
        setUserMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        // Add user message to chat history
        setChatHistory([...chatHistory, { sender: 'user', message: userMessage }]);

        try {
            // Send user message to the AI model
            const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
                prompt: `The user asked: "${userMessage}". Provide financial advice based on their data.`,
                max_tokens: 150,
                temperature: 0.7,
            }, {
                headers: {
                    'Authorization': `Bearer YOUR_API_KEY`,
                },
            });

            const aiMessage = response.data.choices[0].text.trim();

            // Add AI response to chat history
            setChatHistory([...chatHistory, { sender: 'user', message: userMessage }, { sender: 'ai', message: aiMessage }]);
        } catch (error) {
            console.error('Error generating AI response', error);
        }

        // Clear the user input
        setUserMessage('');
    };

    return (
        <div className="ai-chatbot">
            <h2>AI Financial Chatbot</h2>
            <div className="chat-window">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`chat-message ${chat.sender}`}>
                        <p>{chat.message}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={userMessage}
                    onChange={handleInputChange}
                    placeholder="Ask your financial question..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default AIChatbot;
