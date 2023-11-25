import React, { useEffect, useState } from 'react';
import ArticleCard from '../../components/Article/ArticleCard';
import '../../styles/homepage.css';
import { Box, Button, Grid, Modal, Stack, Typography } from '@mui/material';
import ArticleView from '../ArticlePage/ArticleView';
import Logo from '../../components/Shared/Logo';
import DropDown from '../../components/Shared/DropDown';
import FileView from '../../components/Directory/FileView';
import Chat from '../../components/Chat/Chat';
import { IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import axios from "axios";


const HomePage = () => {
    const [user, setUser] = useState("");

    const getUsername = async (userID: string) => {
        const response = axios.get(`http://localhost:3500/users/${userID}`);
        const data = (await response).data;
        setUser(data.name);
    }
    const userID = "e0db2e0b-e3eb-484e-b96d-edaf9ae04fc2";
    useEffect(()=>{
        getUsername(userID);
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(1);

    const handleOpen = () => {
        setIsOpen(true);
        setCurrentArticle(1);
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    return (
        <Stack direction={"row"}
        sx={{width: "100%", height: "100%", margin: "10px"}}
        >
            <Stack sx={{width: "30%", height: "100%"}}>
                <Logo/>
                <DropDown/>
                <DropDown/>
                <Chat/>
            </Stack>

            <Stack sx={{width: "90%", height: "100%"}}>
                <Stack
                sx={{width: "90%", height: "100%"}}
                direction={"row"}
                justifyContent={"space-between"}
                >
                    <Stack
                        direction={"row"}
                        sx={{width: "100%", height: "100%"}}
                        >
                        <Typography>Space Title</Typography>
                    </Stack>
                    <Stack
                        direction={"row"}
                        >
                        <Typography>{user}</Typography>
                    </Stack>
                </Stack>
                <FileView user_uuid={userID}/>
            </Stack>

        </Stack>
    );
}

export default HomePage;
