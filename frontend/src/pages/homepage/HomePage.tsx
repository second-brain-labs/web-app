import React, { useEffect, useState } from 'react';
import ArticleCard from '../../components/Article/ArticleCard';
import '../../styles/homepage.css';
import { Box, Button, Grid, Modal, Stack, Typography } from '@mui/material';
import ArticleView from './ArticleView';


const HomePage: React.FC = () => {

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
        <Grid container
        direction="row"
        
        alignItems="center">
            <Stack>
                <Stack>
                    <Button>+</Button>
                    <Typography className='side-text'>Upload</Typography>
                </Stack>
            </Stack>
            <Stack className="home-container">
                <input type="text" placeholder="Type to Search (home)/Folder" className="search-input" />
                <Grid className="home-article-container" direction="row">
                    <ArticleCard title="Puppy Article" onClick={handleOpen} />
                    <ArticleCard title="bro" onClick={handleOpen} />
                </Grid>
            </Stack>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ArticleView article_id={currentArticle} />
            </Modal>
        </Grid>
    );
}

export default HomePage;
