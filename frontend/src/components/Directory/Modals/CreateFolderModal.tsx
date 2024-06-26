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

interface CreateModalProps {
  handleClose: () => void;
  open: boolean;
  userId: string;
  setCreate: Dispatch<SetStateAction<boolean>>;
  created: boolean;
  path: string | null;
}

const CreateFolderModal = ({
  handleClose,
  open,
  userId,
  setCreate,
  created,
  path,
}: CreateModalProps) => {
  const [name, setName] = useState("");

  const createFolder = async () => {
    try {
      const createPath =
        path !== null && path !== "/" ? path + "/" + name : name;
      await post(`directories/create`, {
        name: createPath,
        user_uuid: userId,
      });
      setCreate(!created);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    createFolder();
    open = !open;
    handleClose();
  };

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
          <Typography>Create a New Folder</Typography>
          <div style={{ marginBottom: "10px" }} />
          <TextField
            label="Enter folder name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div style={{ marginBottom: "10px" }} />
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateFolderModal;
