import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Folder from './Folder';



const Folders = () => {
    return (
        <Grid sx={{
            background: '#EEEEEE', 
            width: "1000px",
            height: "400px",
            top: "149px",
            left: "199px",
            padding: "10px"
        }}>
            <Folder name={"bro"}/>

        </Grid>
    );
}

export default Folders;