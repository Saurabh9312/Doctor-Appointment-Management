import React, { useState, useRef, useEffect } from 'react';
import { Box, Fab, Paper, Typography, TextField, IconButton, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import apiClient from '../api_client/apiClient';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm the hospital AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('chat_session_id') || null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const payload = { query: input };
      if (sessionId) payload.session_id = sessionId;

      const response = await apiClient.post('/bot/chat/', payload);

      // Persist session id for subsequent turns
      if (!sessionId && response.data.session_id) {
        setSessionId(response.data.session_id);
        localStorage.setItem('chat_session_id', response.data.session_id);
      }

      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {isOpen && (
        <Paper
          elevation={3}
          sx={{
            width: 350,
            height: 500,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #00bcd4 0%, #26a69a 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>AI Support</Typography>
            <IconButton size="small" onClick={toggleChat} sx={{ color: 'black' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#0a1929' }}>
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: msg.sender === 'user' ? '#00bcd4' : '#1e2a38',
                      color: msg.sender === 'user' ? 'white' : '#e3f2fd',
                      maxWidth: '80%',
                      borderRadius: 2,
                      boxShadow: msg.sender === 'user' ? '0px 2px 8px rgba(0, 188, 212, 0.3)' : '0px 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <ListItemText primary={msg.text} />
                  </Paper>
                </ListItem>
              ))}
              {isLoading && (
                <ListItem sx={{ justifyContent: 'flex-start' }}>
                  <CircularProgress size={20} />
                </ListItem>
              )}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: '#1e2a38', display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(0, 188, 212, 0.2)' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              sx={{
                color: '#00bcd4',
                '&:hover': {
                  bgcolor: 'rgba(0, 188, 212, 0.1)'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      <Fab
        sx={{
          background: 'linear-gradient(135deg, #00bcd4 0%, #26a69a 100%)',
          color: 'black',
          '&:hover': {
            background: 'linear-gradient(135deg, #008ba3 0%, #00766c 100%)',
            boxShadow: '0px 4px 12px rgba(0, 188, 212, 0.4)'
          }
        }}
        aria-label="chat"
        onClick={toggleChat}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </Box>
  );
};

export default ChatWidget;
