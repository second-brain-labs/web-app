import { Grid, Stack, TextField } from '@mui/material';
import React, {useEffect, useState} from 'react';
import "./fileview.css";
import SmallBox from "./Boxes/SmallBox"
import { Button, Box, Modal, Typography } from '@mui/material';
import ISpace from '../../types/space';
import IFile from '../../types/file';
import ILink from '../../types/link';
import Popup from './Popup';
import SpaceBox from './Boxes/SpaceBox';
import axios from "axios";

const FileView = () => {

    

    const [articles, setArticles] = useState<IFile[]>([]);
    const [folders, setFolders] = useState([]);

    const fetchArticlesFolders = async () => {
        try {
          const response = await axios.get(`http://localhost:3500/articles/directory/all?name=string&user_uuid=1`);
          const data = (await response).data
          setArticles(data.articles);
          setFolders(data.subdirectories);
        } catch (err) {
          console.error(err);
        }
    };


    useEffect(() => {
        fetchArticlesFolders();
    }, []);

    const [open, setOpen] = useState(-1);

    const handleOpen = (x: number) => {
        setOpen(x);
    }

    const handleClose = () => {
        setOpen(-1);
    }
    return (
       <Stack className='fileview'>

           <Box sx={{borderRadius: "100px"}}>
               <TextField className='search' placeholder='Type to run a search (e.g. articles about collagen from between 2018 and 2020)' sx={{width: "100%",
            }}></TextField>
           </Box>

           <Stack direction={"row"}>
            <Button variant="contained" sx={{borderRadius: "12px", marginRight: "10px"}}>Add to this space</Button>
            <Button variant="contained" color="success" sx={{borderRadius: "12px"}}>Smart categorize my view</Button>
           </Stack>

           <Grid
           container
           rowGap={"20px"}
           columnGap={"30px"}
           paddingLeft={"70px"}
           overflow={"auto"}
           >
               {articles.map((x) => <>
               {true &&
                <>
                    <SmallBox onClick={() => handleOpen(x.id)} title={x.title} type={"file"}/>
                    <Popup title="Link title" summary="Lorem ipsum" handleClose={handleClose} x={x.id} open={open}/>
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