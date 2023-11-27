import React from 'react';
import { Box, Paper, InputBase, IconButton, Typography, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Chat = () => {
  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: '20px',
        background: '#F2F2F2',
        marginRight: '20px',
        marginLeft: '20px',
        fontFamily: 'IBM Plex Sans'
      }}
    >
    <Stack className='fileview' sx={{ width: "100%", height: "100%"}}>
    <Stack
        sx={{ width: "90%", height: "100%", marginTop: "10px", marginBottom: "15px" }}
        direction={"row"}
        justifyContent={"space-between"}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        <ChatBubbleOutlineIcon color="success" />
      </IconButton>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1">This is Second Brain!</Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Ask me a question about any of your spaces in the box below!
        </Typography>
      </Box>
    </Stack>
    <Stack
        sx={{ width: "90%", height: "100%", background: '#FFFFFF', marginLeft: "10px", marginBottom: '10px', borderRadius: '20px',  justifyContent: 'center' }}
        direction={"row"}
        justifyContent={"space-between"}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Write a message..."
        inputProps={{ 'aria-label': 'write a message' }}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SendIcon />
      </IconButton>
      </Stack>
    </Stack>
    </Paper>
  );
};

export default Chat;