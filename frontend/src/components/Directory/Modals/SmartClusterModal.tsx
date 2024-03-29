import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { post } from "../../../util/api";
import { Dispatch } from "react";
import { SetStateAction } from "react";

interface SmartClusterProps {
  handleClose: () => void;
  open: boolean;
  userId: string;
  setCreate: Dispatch<SetStateAction<boolean>>;
  created: boolean;
  path: string | null;
}

const SmartClusterModal = ({
  handleClose,
  open,
  userId,
  setCreate,
  created,
  path,
}: SmartClusterProps) => {
  const [name, setName] = useState("");
  const [folders, setFolders] = useState<string[]>([]);
  //   const createFolder = async () => {
  //     try {
  //       const createPath =
  //         path !== null && path !== "/" ? path + "/" + name : name;
  //       await post(`directories/create`, {
  //         name: createPath,
  //         user_uuid: userId,
  //       });
  //       setCreate(!created);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  const smartCluster = async () => {
    const raw_folder_names = folders.join("|");
    try {
      await post(
        `articles/article/smart_categorize?raw_folder_names=${raw_folder_names}&user_uuid=${userId}`,
        {
          // raw_folder_names: name,
          // user_uuid: userId,
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = () => {
    setFolders([...folders, name]);
    setName("");
  };
  const handleSubmit = () => {
    smartCluster();
    open = !open;
    setFolders([]);
    handleClose();
  };
  const listItems = folders.map((person) => <li key={person}>{person}</li>);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        position: "absolute",
        left: 500,
        top: 200,
      }}
    >
      <Box
        sx={{
          width: "460px",
          height: "298px",
          borderRadius: "15.12px",
          background: "#FFFFFF",
          boxShadow: "0px 0px 4.030760288238525px 0px #00000040",
          padding: "10px",
        }}
      >
        <Stack>
          <Button
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
            variant="contained"
            color="error"
            onClick={() => handleClose()} // Handle button click event here
          >
            Back
          </Button>
          <div style={{ marginBottom: "30px" }} />
          <Typography>List smart cluser names</Typography>
          <div style={{ marginBottom: "10px" }} />
          <TextField
            label="e.g. computer science"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div style={{ marginBottom: "10px" }} />
          <Button
            onClick={handleAdd}
            type="submit"
            variant="contained"
            sx={{ borderRadius: "12px", backgroundColor: "#8EC2FF" }}
          >
            Add
          </Button>
          <ul>{listItems}</ul>
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            sx={{ borderRadius: "12px", backgroundColor: "#A1C88E" }}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default SmartClusterModal;
