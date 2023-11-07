import { Grid, Stack } from '@mui/material';
import React, {useEffect, useState} from 'react';
import "./fileview.css";
import SmallBox from "./Boxes/SmallBox"
import { Box, Modal, Typography } from '@mui/material';
import ISpace from '../../types/space';
import IFile from '../../types/file';
import ILink from '../../types/link';
import Popup from './Popup';
import SpaceBox from './Boxes/SpaceBox';




const FileView = () => {

    

    useEffect(() => {
        //fetch data for current space

    }, []);
    const temp = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    const [open, setOpen] = useState("-1");

    const handleOpen = (x: string) => {
        setOpen(x);
        console.log("bro");
    }

    const handleClose = () => {
        setOpen("-1");
    }
    return (
       <Stack className='fileview'>

           <Grid
           container
           rowGap={"20px"}
           columnGap={"30px"}
           padding={"10px"}
           >
               {temp.map((x) => <>
               {true &&
                <>
                    <SmallBox onClick={() => handleOpen(x)} title={x} type={"file"}/>
                    <Popup title="Link title" summary="Lorem ipsum" handleClose={handleClose} x={x} open={open}/>
                </>
               }
               {false &&
                <>
                    <SpaceBox title="bro" type="folder" />
                </>
               }
           </>
           )}
               

           </Grid>
       </Stack>
        
    );
}

export default FileView;