import React from 'react';
import '../../util/styles/homepage.css';
import { Button, Stack, Typography, Box } from '@mui/material';
import Logo from '../../components/Shared/Logo';
import DropDown from '../../components/Shared/DropDown';
import FileView from '../../components/Directory/FileView';
import Chat from '../../components/Chat/Chat';
import { useUser } from '../../util/redux/hooks/useUser';
import { useAuth } from '../../util/redux/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';


const HomePage = () => {

    
    const {userID, username, userLogout} = useUser();
    const {logout} = useAuth();

    const [searchParams, setSearchParams] = useSearchParams();

    const handleLogout = () => {
        logout();
        userLogout();
    }


    return (
        <Stack direction={"row"}
            sx={{ width: "100%", height: "100%", margin: "10px" }}
        >
            <Stack sx={{ width: "35%", height: "calc(100vh - 10%)", paddingBottom: '10%', overflow: 'auto' }}>
                <Box sx={{ marginBottom: "20px" }}>
                    <Logo />
                </Box>
                <Box sx={{ marginBottom: "20px" }}>
                    <DropDown title="My Spaces" spaces={["Space 1", "Space 2"]} />
                    <DropDown title="Previous Chats" spaces={["October 1, 2023: 7:50 PM", "September 19, 2023: 6:57 AM"]} />
                </Box>
                <Box sx={{ width: '100%', mt: 'auto' }}> {/* This will push the Chat component to the bottom */}
                    <Chat />
                </Box>
            </Stack>

            <Stack sx={{ width: "90%", height: "100%"}}>
                <Stack
                    sx={{ width: "90%", height: "100%" }}
                    direction={"row"}
                    justifyContent={"space-between"}
                >
                    <Stack
                        direction={"row"}
                        sx={{ width: "100%", height: "100%",  }}
                    >
                        <Typography>{searchParams.get("path")}</Typography>
                    </Stack>
                    <Stack
                        direction={"row"}
                        sx={{ width: "100%", height: "100%", justifyContent: "flex-end", marginBottom: "10px" }}
                    >
                        {/* <Typography>{username}</Typography> */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: "20px"}}>
                            <SettingsIcon style={{ fontSize: '24px', color: '#CACACA'}} /> {username}
                        </div>
                        <Button onClick={handleLogout} variant="contained" sx={{borderRadius: "12px", marginRight: "25px", background: '#8EC2FF'}}>Logout</Button>
                    </Stack>
                </Stack>
                <FileView user_uuid={userID!}/>
            </Stack>
        </Stack>
    );
}

export default HomePage;
