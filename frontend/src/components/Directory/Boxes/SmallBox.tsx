import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import "./smallbox.css";
import file from '../../../assets/images/file.svg';
import link from '../../../assets/images/link.svg';
import folder from '../../../assets/images/folder.svg';

interface ISmallBoxProps {
    title: string,
    type: "folder" | "file" | "link",
    onClick: () => void;
}



const SmallBox = ({title, type, onClick}: ISmallBoxProps) => {
    return (
        <Box onClick={onClick}  className="file" sx={{ border: 0.25, padding: "10px", display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>
            <Stack alignItems="center">
                {type === "file" &&
                <img className='image' src={file} style={{ width: '50px', height: '50px' }} alt="File" />
                }
                {type === "folder" &&
                <img className='image' src={folder} style={{ width: '50px', height: '50px' }} alt="Folder" />
                }
                {type === "link" &&
                <img className='image' src={link} style={{ width: '50px', height: '50px' }} alt="Link" />
                }
                <Typography className='font' 
                sx={{ 
                    maxWidth: '100px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'normal', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical',
                    textAlign: 'center'
                }}>
                    {(title.length > 15) ? (title.substring(0, 14)) + "..." : title}
                </Typography>
            </Stack>
        </Box>  
    );
    // (title.split('/').length > 0) ? (title.split('/').slice(-1)) : title
}

export default SmallBox;