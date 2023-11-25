import { Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import "./smallbox.css";
import IFile from '../../../types/file';
import file from '../../../assets/images/file.svg';
import link from '../../../assets/images/link.svg';
import folder from '../../../assets/images/folder.svg';
import ".././image.css"

interface ISmallBoxProps {
    title: string,
    type: "folder" | "file" | "link",
    onClick: () => void;
}



const SmallBox = ({title, type, onClick}: ISmallBoxProps) => {
    return (
        <Box onClick={onClick}  className="file" sx={{ border: 1, padding: "10px", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Stack>
                {type == "file" &&
                <img className='image' src={file} />
                }
                {type == "folder" &&
                <img className='image' src={folder} />
                }
                {type == "link" &&
                <img className='image' src={link} />
                }
                <Typography className='font'>{title}</Typography>
            </Stack>
        </Box>  
    );
}

export default SmallBox;