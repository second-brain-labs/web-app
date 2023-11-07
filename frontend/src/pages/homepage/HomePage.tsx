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


const HomePage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(1);

    const handleOpen = () => {
        setIsOpen(true);
        setCurrentArticle(1);
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    useEffect(() => {

    }, []);

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

            <Stack sx={{width: "100%", height: "100%"}}>
                <Stack
                direction={"row"}
                justifyContent={"space-between"}
                >
                    <Stack
                        direction={"row"}
                        sx={{width: "100%", height: "100%"}}
                        >
                        <Typography>Space Title</Typography>
                        <IconButton>
                            <CreateIcon/>
                        </IconButton>
                    </Stack>
                    <Stack
                        direction={"row"}
                        >
                        <Typography>Rohan Gupta</Typography>
                    </Stack>
                </Stack>
                <FileView/>
            </Stack>

        </Stack>
    );
}

export default HomePage;
