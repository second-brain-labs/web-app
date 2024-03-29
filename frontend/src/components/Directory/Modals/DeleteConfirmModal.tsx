import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { post, deleteCall } from "../../../util/api";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import axios from "axios";
import { ElevatorSharp } from "@mui/icons-material";

interface CreateModalProps {
  handleClose: () => void;
  open: boolean;
  userId: string;
  setCreate: Dispatch<SetStateAction<boolean>>;
  created: boolean;
  path: string | null;
  toDeleteFolder: string;
  toDeleteFile: string;
}

const DeleteConfirmModal = ({
  handleClose,
  open,
  userId,
  setCreate,
  created,
  path,
  toDeleteFolder,
  toDeleteFile,
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

  const deleteJawns = async () => {
    try {
      if (toDeleteFile !== "Nothing") {
        await deleteCall(`articles/article/${toDeleteFile}`);
      } else {
        await deleteCall(
          `directories/delete?user_uuid=${userId}&directory_name=${toDeleteFolder}`,
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    deleteJawns();
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
          //   height: "298px",
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
            Cancel
          </Button>
          <div style={{ marginBottom: "30px" }} />
          <Typography>
            Press Confirm Below to Confirm Your Deletion of{" "}
            {toDeleteFile !== "Nothing" ? toDeleteFile : toDeleteFolder}
          </Typography>
          <div style={{ marginBottom: "20px" }} />
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            color="primary"
          >
            Delete {toDeleteFile !== "Nothing" ? "File" : "Folder"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmModal;
