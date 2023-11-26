import React from 'react';
import '../../util/styles/homepage.css';
import { Button, Stack, Typography } from '@mui/material';
import Logo from '../../components/Shared/Logo';
import DropDown from '../../components/Shared/DropDown';
import FileView from '../../components/Directory/FileView';
import Chat from '../../components/Chat/Chat';
import { useUser } from '../../util/redux/hooks/useUser';
import { useAuth } from '../../util/redux/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';


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
                        <Typography>{searchParams.get("path")}</Typography>
                    </Stack>
                    <Stack
                        direction={"row"}
                    >
                        <Typography>{username}</Typography>
                    </Stack>
                </Stack>
                <FileView user_uuid={userID!}/>
            </Stack>
            <Stack>
                <Button onClick={handleLogout} variant="contained" sx={{borderRadius: "12px", marginRight: "10px"}}>Logout</Button>
            </Stack>
            

        </Stack>
    );
}

export default HomePage;
