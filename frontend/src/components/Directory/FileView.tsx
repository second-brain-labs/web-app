import { Grid, Stack, TextField } from '@mui/material';
import React, {useEffect, useState} from 'react';
import "./fileview.css";
import SmallBox from "./Boxes/SmallBox"
import { Button, Box, } from '@mui/material';
import IFile from '../../util/types/file';
import IFolder from '../../util/types/folder';
import Popup from './Modals/FilePopupModal';
import SpaceBox from './Boxes/SpaceBox';
import axios from "axios";
import CreateFolderModal from './Modals/CreateFolderModal';
import { useSearchParams } from 'react-router-dom';





interface IFileviewProps{
    user_uuid: string,
  }
  

const FileView = ({user_uuid}: IFileviewProps) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const path = (searchParams.get('path') === null) ? "/": searchParams.get('path');
    

    

    useEffect(()=> {
        console.log(path);
    }, []);



    const [create, setCreate] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [articles, setArticles] = useState<IFile[]>([]);
    const [folders, setFolders] = useState<IFolder[]>([]);

    const fetchArticlesFolders = async () => {
        try {
          const response = await axios.get(`http://localhost:3500/articles/directory/all?name=${path}&user_uuid=${user_uuid}`);
          const data = (await response).data
          setArticles(data.articles);
          setFolders(data.subdirectories);
        } catch (err) {
          console.error(err);
        }
    };

    useEffect(() => {
        fetchArticlesFolders();
    }, [path, create]);

    const [open, setOpen] = useState("-1");

    const handleFileOpen = (x: string) => {
        setOpen(x);
    }

    const handleFileClose = () => {
        setOpen("-1");
    }

    const handleClose = () => {
        setCreateModalOpen(!createModalOpen);
        console.log("bro");
    }

    const handleFolderClick = (name: string) => {
        setSearchParams({ path: name })
    }
    

    return (
       <Stack className='fileview'>

           <Box sx={{borderRadius: "100px"}}>
               <TextField className='search' placeholder='Type to run a search (e.g. articles about collagen from between 2018 and 2020)' sx={{width: "100%",}}/>
           </Box>
           <Stack direction={"row"}>
            <Button onClick={handleClose} variant="contained" sx={{borderRadius: "12px", marginRight: "10px"}}>Add to this space</Button>
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
                    <SmallBox onClick={() => handleFileOpen(x.id)} title={x.title} type={"file"}/>
                    <Popup title={x.title} summary={x.summary} handleClose={handleFileClose} x={x.id} open={open}/>
                </>
               }
               {false &&
                <>
                    <SpaceBox title="bro" type="folder" />
                </>
               }
           </>
           )}
           {folders.map((x) => <>
               {true &&
                <>
                    <SmallBox onClick={() => handleFolderClick(x.name)} title={x.name} type={"folder"}/>
                </>
               }
           </>
           )}
           <CreateFolderModal path={path} setCreate={setCreate} created={create} open={createModalOpen} handleClose={handleClose} userId={user_uuid}/>
               

           </Grid>
       </Stack>
        
    );
}

export default FileView;