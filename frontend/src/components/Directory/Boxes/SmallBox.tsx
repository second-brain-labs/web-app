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
        <Box onClick={onClick}  className="file" sx={{ border: 1, padding: "10px", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Stack alignItems="center" justifyContent="center" sx={{height: "100%", width: "100%", }}>
                {type === "file" &&
                <img className='image' src={file} />
                }
                {type === "folder" &&
                <img className='image' src={folder} />
                }
                {type === "link" &&
                <img className='image' src={link} />
                }
                <Typography className='font'>{(title.split('/').length > 0) ? (title.split('/').slice(-1)) : title}</Typography>
            </Stack>
        </Box>  
    );
}

export default SmallBox;