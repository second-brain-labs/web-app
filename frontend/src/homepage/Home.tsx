import React, { useState } from 'react';
import Folders from '../components/Folders';
import { Stack } from '@mui/material';
import { Grid } from '@mui/material';


const Home = () => {
    return (
        <Grid container direction="row" >
            <Stack>
                <h1>Buttons</h1>
            </Stack>
            <Stack>

                <Folders/>
            </Stack>
        </Grid>

        
    );
}

export default Home;