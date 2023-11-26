import React from 'react';
import '../../styles/homepage.css';
import { Stack, Typography } from '@mui/material';
import Logo from '../../components/Shared/Logo';
import DropDown from '../../components/Shared/DropDown';
import FileView from '../../components/Directory/FileView';
import Chat from '../../components/Chat/Chat';
import { useUser } from '../../redux/hooks/useUser';


const HomePage = () => {

    
    const {userID, username} = useUser();


    return (
        <Stack direction={"row"}
            sx={{ width: "100%", height: "100%", margin: "10px" }}
        >
            <Stack sx={{ width: "30%", height: "100%" }}>
                <Logo />
                <DropDown />
                <DropDown />
                <Chat />
            </Stack>

            <Stack sx={{ width: "90%", height: "100%" }}>
                <Stack
                    sx={{ width: "90%", height: "100%" }}
                    direction={"row"}
                    justifyContent={"space-between"}
                >
                    <Stack
                        direction={"row"}
                        sx={{ width: "100%", height: "100%" }}
                    >
                        <Typography>Space Title</Typography>
                    </Stack>
                    <Stack
                        direction={"row"}
                    >
                        <Typography>{username}</Typography>
                    </Stack>
                </Stack>
                <FileView user_uuid={userID!}/>
            </Stack>

        </Stack>
    );
}

export default HomePage;
