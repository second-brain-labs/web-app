import React, { useState } from 'react';
import { Typography } from '@mui/material';
import './Folder.css'


interface FolderProps {
    name: string;
}

const Folder = ({name}: FolderProps) => {
    return (
        <>
            <img className='folder-img' src={'folder.svg'}></img>
            <Typography 
                font-family="Carter One"
                font-size="32px"
                font-weight="400"
                text-align="left"
            >
                {name}
            </Typography>
        </>
    );
}

export default Folder;