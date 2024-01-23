import { Grid, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
import PdfUpload from '../Shared/PdfUpload';



interface IFileviewProps {
    user_uuid: string,
    topic: string,
    setTopic: (topic: string) => void;
}


const FileView: React.FC<IFileviewProps> = ({ user_uuid, topic, setTopic }) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const path = (searchParams.get('path') === null) ? "/" : searchParams.get('path');

    useEffect(() => {
        console.log(path);
    }, []);

    const [create, setCreate] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [articles, setArticles] = useState<IFile[]>([]);
    const [folders, setFolders] = useState<IFolder[]>([]);
    const [searchValue, setSearchValue] = useState('');

    function make_title_readable(title: string): string {
        let re = /%../g;
        return title.replace(re, " ");
    }

    const fetchArticlesFolders = async () => {
        try {
            const response = await axios.get(`http://localhost:3500/articles/directory/all?name=${path}&user_uuid=${user_uuid}`);
            const data = (await response).data
            console.log(data)

            data.articles.forEach(function (article: any) {
                article.title = make_title_readable(article.title);
            });

            setArticles(data.articles);
            setFolders(data.subdirectories);
        } catch (err) {
            console.error(err);
        }
    };

    function transformStringToYQL(inputString: string): string {
        // var words = inputString.replace(/\s/g, '","');
        return `select * from articles where default contains phrase("${inputString}") or directory contains phrase("${inputString}")`;
    }

    const handleSearch = async (searchString: string) => {
        // Constructing the Vespa YQL query URL
        const vespaUrl = 'http://localhost:4545';
        const queryUrl = `${vespaUrl}/search/`;

        // Parameters for the query
        const params = new URLSearchParams({
            yql: transformStringToYQL(searchString),
            format: 'json',
        });
        try {
            // Sending the GET request to Vespa
            console.log("query string: ", `${queryUrl}?${params.toString()}`)
            const response = await fetch(`${queryUrl}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if the request was successful
            console.log("response: ", response)
            if (response.ok) {
                const jsonResponse = await response.json();
                // return jsonResponse
                console.log(jsonResponse)
                if (jsonResponse.root.fields.totalCount > 0) {
                    const transformedArticles: IFile[] = jsonResponse.root.children.map((x: any) => {
                        return {
                            directory: x.fields.directory,
                            id: x.fields.id,
                            summary: x.fields.summary,
                            time_created: x.fields.time_created,
                            title: make_title_readable(x.fields.title),
                            user_id: x.fields.user_uuid,
                        }
                    })
                    setArticles(transformedArticles);
                } else {
                    setArticles([]);
                }
                setFolders([])

            } else {
                throw new Error(`Query failed with status code ${response.status}: ${await response.text()}`);
            }
        } catch (error) {
            throw new Error(`Error while querying Vespa: ${error}`);
        }
    };


    useEffect(() => {
        fetchArticlesFolders();
        if (topic) {
            handleSearch(topic)
        }
        if (searchValue) {
            setTopic('')
            handleSearch(searchValue)
        }

    }, [path, create, searchValue, topic]);

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
        <Stack className='fileview' sx={{ background: '#F2F2F2' }}>
            <Box sx={{
                marginTop: "16px", // Adjust the value as needed for the desired space
                marginBottom: "16px", // Adjust the value as needed for the desired space
                display: 'flex', justifyContent: 'center',
                borderRadius: "20px",

            }}>
                <TextField
                    className='search'
                    placeholder='Type to run a search (e.g. articles about collagen from between 2018 and 2020)'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{ width: "90%", background: '#FFFFFF', borderRadius: "9px" }}
                />
            </Box>

            <Stack direction={"row"} sx={{ marginBottom: "16px", display: 'flex', justifyContent: 'center', }}>
                <Button
                    onClick={handleClose}
                    variant="contained"
                    sx={{ borderRadius: "12px", marginRight: "10px", background: "#8EC2FF" }}
                >
                    Add folder to this space
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: "12px", marginRight: "10px", background: "#A1C88E" }}
                >
                    Smart categorize my view
                </Button>
                <PdfUpload user_uuid={user_uuid} />
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
                            <SmallBox onClick={() => handleFileOpen(x.id)} title={x.title} type={"file"} />
                            <Popup title={x.title} summary={x.summary} handleClose={handleFileClose} x={x.id} open={open} />
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
                            <SmallBox onClick={() => handleFolderClick(x.name)} title={x.name} type={"folder"} />
                        </>
                    }
                </>
                )}
                <CreateFolderModal path={path} setCreate={setCreate} created={create} open={createModalOpen} handleClose={handleClose} userId={user_uuid} />


            </Grid>
        </Stack>

    );
}

export default FileView;
