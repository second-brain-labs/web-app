import { Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import "./smallbox.css";
import IFile from '../../../types/file';
import file from '../../assets/images/file.svg';
import link from '../../assets/images/link.svg';
import folder from '../../assets/images/folder.svg';

interface ISmallBoxProps {
    title: string,
    type: "folder" | "file" | "link",
}



const SpaceBox = ({title, type}: ISmallBoxProps) => {
    return (
        <></>
    );
}
export default SpaceBox;