import React from 'react';
import ArticleCard from '../../components/Article/ArticleCard';
import '../../styles/homepage.css';
import { Grid, Stack } from '@mui/material';


const HomePage: React.FC = () => {
    return (
        <Grid direction="row">
            <Stack className="home-container">
                <input type="text" placeholder="Type to Search (home)/Folder" className="search-input" />
                
                
                <Grid direction="row">
                    <h1>Sub-folder</h1>
                    <h1>NLP Models</h1>
                    <h1>F1 Racing</h1>
                    <ArticleCard title="Puppy Article" summary="This is a sample summary of the article." />
                </Grid>
            </Stack>
        </Grid>
    );
}

export default HomePage;
