import { Grid, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./fileview.css";
import SmallBox from "./Boxes/SmallBox";
import { Button, Box } from "@mui/material";
import IFile from "../../util/types/file";
import IFolder from "../../util/types/folder";
import Popup from "./Modals/FilePopupModal";
import SpaceBox from "./Boxes/SpaceBox";
import { get, post, vespaUrl } from "../../util/api";
import CreateFolderModal from "./Modals/CreateFolderModal";
import { useSearchParams } from "react-router-dom";
import PdfUpload from "../Shared/PdfUpload";
import DeleteConfirmModal from "./Modals/DeleteConfirmModal";
import { delay } from "@reduxjs/toolkit/dist/utils";
import SmartClusterModal from "./Modals/SmartClusterModal";

interface IFileviewProps {
  user_uuid: string;
  topic: string;
  setTopic: (topic: string) => void;
}

const FileView: React.FC<IFileviewProps> = ({ user_uuid, topic, setTopic }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const path =
    searchParams.get("path") === null ? "/" : searchParams.get("path");
  const [toDeleteFolder, setToDeleteFolder] = useState("Nothing");
  const [toDeleteFile, setToDeleteFile] = useState("Nothing");

  const [create, setCreate] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [smartModalOpen, setSmartModalOpen] = useState(false);
  const [createDeletePageOpen, setDeletePageOpen] = useState(false);

  const [smartFolders, setSmartFolders] = useState<String[]>([]);

  const [articles, setArticles] = useState<IFile[]>([]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function make_title_readable(title: string): string {
    let re = /%../g;
    return title.replace(re, " ");
  }

  const updateFolder = async (article_id: string, new_directory: string) => {
    try {
      const directory_path =
        path !== null && path !== "/"
          ? path + "/" + new_directory
          : new_directory;
      await post(`articles/article/update/`, {
        article_id: article_id,
        directory_name: directory_path,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchArticlesFolders = async () => {
    try {
      const response = await get(
        `articles/directory/all?name=${path}&user_uuid=${user_uuid}`,
      );
      const data = (await response).data;

      if (data.articles == null) {
        console.log("no articles or folders yet");
      }

      if (data.articles != null) {
        data.articles.forEach(function (article: any) {
          article.title = make_title_readable(article.title);
        });
        const parent_folder: IFolder = {
          name: path
            ? path.lastIndexOf("/") == -1
              ? "/"
              : path.substring(0, path.lastIndexOf("/"))
            : "",
          user_uuid: user_uuid,
          parent: "/",
        };
        if (parent_folder.name !== "") {
          data.subdirectories.unshift(parent_folder);
        }
        setArticles(data.articles);
        setFolders(data.subdirectories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (searchString: string) => {
    // Constructing the Vespa YQL query URL
    const queryUrl = `${vespaUrl}/search/`;

    // const params = {
    //   "streaming.groupname": user_uuid,
    //   format: "json",
    //   yql: "select * from articles where {targetHits:10}nearestNeighbor(embedding, q) or userQuery()",
    //   hits: 1,
    //   "ranking.profile": "semantic",
    //   timeout: "3s",
    //   "input.query(threshold)": 0.7,
    //   "input.query(q)": `embed(e5, "${searchString}")`,
    // };

    const params = new URLSearchParams({
      "streaming.groupname": user_uuid,
      format: "json",
      yql: "select * from articles where {targetHits:10}nearestNeighbor(embedding, q) or userQuery()",
      hits: "1",
      "ranking.profile": "semantic",
      timeout: "3s",
      "input.query(threshold)": "0.7",
      "input.query(q)": `embed(e5, "${searchString}")`,
    });

    try {
      // Sending the GET request to Vespa
      const response = await fetch(`${queryUrl}?${params}`);

      // Check if the request was successful
      if (response.ok) {
        const jsonResponse = await response.json();
        // return jsonResponse
        if (jsonResponse.root.fields.totalCount > 0) {
          const transformedArticles: IFile[] = jsonResponse.root.children.map(
            (x: any) => {
              return {
                directory: x.fields.directory,
                id: x.fields.id,
                summary: x.fields.summary,
                time_created: x.fields.time_created,
                title: make_title_readable(x.fields.title),
                user_id: x.fields.user_uuid,
              };
            },
          );
          setArticles(transformedArticles);
        } else {
          setArticles([]);
        }
        setFolders([]);
      } else {
        throw new Error(
          `Query failed with status code ${
            response.status
          }: ${await response.text()}`,
        );
      }
    } catch (error) {
      throw new Error(`Error while querying Vespa: ${error}`);
    }
  };

  useEffect(() => {
    fetchArticlesFolders();
    if (topic) {
      handleSearch(topic);
    }
    if (searchValue) {
      setTopic("");
      handleSearch(searchValue);
    }
  }, [path, create, searchValue, topic]);

  const [open, setOpen] = useState("-1");

  const handleFileOpen = (x: string) => {
    setOpen(x);
  };

  const handleFileClose = () => {
    setOpen("-1");
  };

  const handleClose = () => {
    setCreateModalOpen(!createModalOpen);
  };

  const handleSmartClose = () => {
    setSmartModalOpen(!smartModalOpen);
  };

  const handleOpenDeletePageFile = (name: string) => {
    setDeletePageOpen(!createDeletePageOpen);
    setToDeleteFile(name);
  };

  const handleOpenDeletePageFolder = (name: string) => {
    setDeletePageOpen(!createDeletePageOpen);
    setToDeleteFolder(name);
  };

  const handleCloseDeletePage = async () => {
    setDeletePageOpen(!createDeletePageOpen);
    setToDeleteFile("Nothing");
    setToDeleteFolder("Nothing");
    await wait(500);
    fetchArticlesFolders();
  };

  const handleAllTags = async (tags: String[], userId: string) => {
    await Promise.all(
      tags.map((tag) =>
        post(`articles/directory/create`, {
          name: tag,
          user_uuid: userId,
        }).then((response) => console.log(response)),
      ),
    );
  };

  const handleGrouping = async () => {
    const queryUrl = `${vespaUrl}/search/`;

    // Parameters for the query
    const params = new URLSearchParams({
      yql: "select * from articles where true limit 0 | all( group(tag) each(output(count())) )",
      "streaming.groupname": user_uuid,
      format: "json",
    });
    try {
      // Sending the GET request to Vespa
      const response = await fetch(`${queryUrl}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the request was successful
      if (response.ok) {
        const jsonResponse = await response.json();
        // return jsonResponse
        if (jsonResponse.root.fields.totalCount > 0) {
          let allTags: String[] = [];
          let allPaths: String[] = [];
          jsonResponse.root.children[0].children[0].children.forEach(
            (x: any) => {
              const tag = x.value;
              // Create new directory with tag name
              allTags.push(tag);
              const createPath =
                path !== null && path !== "/" ? path + "/" + tag : tag;
              allPaths.push(createPath);
            },
          );
          await handleAllTags(allPaths, user_uuid);
          setSmartFolders(allTags);
        }
      } else {
        throw new Error(
          `Query failed with status code ${
            response.status
          }: ${await response.text()}`,
        );
      }
    } catch (error) {
      throw new Error(`Error while querying Vespa: ${error}`);
    }
  };

  const wait = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleFolderClick = async (name: string) => {
    // // delay(2);
    // setIsLoading(true); // Set loading state to true
    // await wait(500); // Wait for 3 seconds
    // setIsLoading(false); // Se
    // if (createDeletePageOpen) {
    //   return;
    // } else {
    setSearchParams({ path: name });
  };

  const popUpDeleteWarning = () => {};

  return (
    <Stack className="fileview" sx={{ background: "#F2F2F2" }}>
      <Box
        sx={{
          marginTop: "16px", // Adjust the value as needed for the desired space
          marginBottom: "16px", // Adjust the value as needed for the desired space
          display: "flex",
          justifyContent: "center",
          borderRadius: "20px",
        }}
      >
        <TextField
          className="search"
          placeholder="Type to run a search (e.g. articles about collagen from between 2018 and 2020)"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ width: "90%", background: "#FFFFFF", borderRadius: "9px" }}
        />
      </Box>

      <Stack
        direction={"row"}
        sx={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}
      >
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            borderRadius: "12px",
            marginRight: "10px",
            background: "#8EC2FF",
          }}
        >
          Add folder to this space
        </Button>
        <Button
          onClick={handleSmartClose}
          variant="contained"
          color="success"
          sx={{
            borderRadius: "12px",
            marginRight: "10px",
            background: "#A1C88E",
          }}
        >
          Smart categorize my view
        </Button>
        <PdfUpload user_uuid={user_uuid} update_func={fetchArticlesFolders} />
      </Stack>

      <Grid
        container
        rowGap={"20px"}
        columnGap={"30px"}
        paddingLeft={"70px"}
        overflow={"auto"}
      >
        {folders.map((x, index) => (
          <>
            {true && (
              <>
                <SmallBox
                  onClick={() => handleFolderClick(x.name)}
                  onButtonClick={() => handleOpenDeletePageFolder(x.name)}
                  // title={x.name}
                  title={
                    index === 0 && path != null && path != "/"
                      ? ".."
                      : x.name.split("/").slice(-1)[0]
                  }
                  type={
                    index === 0 && path != null && path != "/"
                      ? "backFolder"
                      : smartFolders.includes(x.name)
                      ? "smartfolder"
                      : "folder"
                  }
                />
              </>
            )}
          </>
        ))}
        {articles.map((x) => (
          <>
            {true && (
              <>
                <SmallBox
                  onClick={() => handleFileOpen(x.id)}
                  onButtonClick={() => handleOpenDeletePageFile(x.id)}
                  title={x.title}
                  type={"file"}
                />
                <Popup
                  title={x.title}
                  summary={x.summary}
                  handleClose={handleFileClose}
                  x={x.id}
                  open={open}
                  onButtonClick={() =>
                    window.open(
                      x.local_path
                        ? x.local_path.replace(
                            "/code/backend/app",
                            "https://secondbrainlabs.xyz/api",
                          )
                        : x.url,
                      "_blank",
                    )
                  } // window.open(x.local_path, "_blank")}
                />
              </>
            )}
            {false && (
              <>
                <SpaceBox title="bro" type="folder" />
              </>
            )}
          </>
        ))}
        <CreateFolderModal
          path={path}
          setCreate={setCreate}
          created={create}
          open={createModalOpen}
          handleClose={handleClose}
          userId={user_uuid}
        />
        <DeleteConfirmModal
          path={path}
          setCreate={setCreate}
          created={create}
          open={createDeletePageOpen}
          handleClose={handleCloseDeletePage}
          userId={user_uuid}
          toDeleteFolder={toDeleteFolder}
          toDeleteFile={toDeleteFile}
        />
        <SmartClusterModal
          path={path}
          setCreate={setCreate}
          created={create}
          open={smartModalOpen}
          handleClose={handleSmartClose}
          userId={user_uuid}
        />
      </Grid>
    </Stack>
  );
};

export default FileView;
