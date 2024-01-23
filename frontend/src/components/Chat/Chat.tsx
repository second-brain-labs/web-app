import React, {useState, useRef, useEffect} from 'react';
import { Paper, InputBase, IconButton, Typography, Stack, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import traced from '../../assets/images/traced_brain.svg';
import rectangle from '../../assets/images/Rectangle36.svg';
import orangeRectangle from '../../assets/images/Rectangle38.svg';
import { useUser } from '../../util/redux/hooks/useUser';
import { current } from '@reduxjs/toolkit';
import './../Directory/image.css';

interface ChatProps {
    topic: string;
    setTopic: (topic: string) => void;
    
}

const Chat: React.FC<ChatProps> = ({topic, setTopic }) => {

  const {userID, username, userLogout} = useUser();
  const [messages, setMessages] = useState(['This is Second Brain! Ask me a question about any of your spaces in the box below!', "I have a question?", "I have an answer!"]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function getInitials(): string {
    if (username === null) return '';
    return username
      .split(' ') // Split the string into words
      .map(word => word[0]) // Map each word to its first letter
      .join(''); // Join all the first letters together
  }
  
  const handleEnter = async () => {
    // Custom logic for handleEnter
    const response = await fetch(`http://localhost:3500/chat/topic/${currentMessage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });

        // Check if the request was successful
        console.log("response: ", response)
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            setTopic(jsonResponse)
            console.log("topic: ", topic)
            const new_message = `Great! I've displayed all articles related to ${jsonResponse}`
            setMessages([...messages, currentMessage,  new_message]);
        } else {
            throw new Error(`Query failed with status code ${response.status}: ${await response.text()}`);
        }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentMessage.trim()) return; // Ignore empty messages
    // setMessages([...messages, currentMessage]);
    handleEnter();
    setCurrentMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
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
    <Stack className='fileview2' sx={{ width: "100%", height: "100%"}}>
    <Stack
        sx={{ width: "100%", height: "100%", maxHeight: '300px', overflowY: 'auto' }}
        justifyContent={"space-between"}
    >
        {messages.map((message, index) => (
            <React.Fragment key={index}>
            {
                index % 2 === 0 && 
                <Stack sx={{ p: '10px' }}>
                <Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} sx={{marginBottom:'5px'}} >
                <div className="image-container">
                <img src={rectangle} alt="Background" className="background-image" />
                <img src={traced} alt="Overlay" className="overlay-image" />
                </div>
            
                <Typography variant="subtitle1" sx={{fontWeight: 'bold', marginLeft: '10px'}}>Second Brain</Typography>
            </Stack>
                <Typography variant="caption" display="block" gutterBottom>{message}</Typography>
            
            </Stack>
            }
            {
                index % 2 === 1 &&
                <Stack sx={{ p: '10px' }}>
                <Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} sx={{marginBottom:'5px'}}>
                <div className="image-container">
                <img src={orangeRectangle} alt="Background" className="background-image" />
                <div className="overlay-letters">{getInitials()}</div>
                </div>
            
                <Typography variant="subtitle1" sx={{fontWeight: 'bold', marginLeft: '10px'}}>You</Typography>
            </Stack>
                <Typography variant="caption" display="block" gutterBottom>{message}</Typography>
            
            </Stack>
            }
            
                {index < messages.length - 1 && <Divider sx={{ backgroundColor: '555555' }} />} {/* Add Divider between messages */}
            </React.Fragment>
            // </Stack>
            // </Stack>
          ))}
        <div ref={messagesEndRef} />
      {/* <Box sx={{ flex: 1 }}>
        <Typography variant="caption" display="block" gutterBottom>
        This is Second Brain! Ask me a question about any of your spaces in the box below!
        </Typography>
      </Box> */}
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
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="send" onClick={handleSubmit}>
            <SendIcon />
          </IconButton>
      </Stack>
    </Stack>
    </Paper>
  );
};

export default Chat;