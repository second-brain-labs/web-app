import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

interface ModalProps {
  handleClose: () => void;
  x: string;
  open: string;
  title: string;
  summary: string;
  onButtonClick: () => void;
}

const Popup = ({
  handleClose,
  x,
  open,
  title,
  summary,
  onButtonClick,
}: ModalProps) => {
  return (
    <Modal
      open={x === open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ position: "absolute", left: 500, top: 200 }}
    >
      <Box
        sx={{
          width: "460px",
          height: "298px",
          borderRadius: "15.12px",
          background: "#FFFFFF",
          boxShadow: "0px 0px 4.030760288238525px 0px #00000040",
          padding: "10px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Stack>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Typography>{title}</Typography>
            <IconButton></IconButton>
          </Stack>
          <Typography sx={{ wordWrap: "break-word" }}>
            {summary.split("\n").map((t, key) => {
              return <p key={key}>{t}</p>;
            })}
          </Typography>
          <Stack direction="row"></Stack>
          <Button
            variant="contained"
            onClick={(event) => {
              event.stopPropagation(); // Prevent event propagation to parent
              onButtonClick(); // Call button click handler
            }}
          >
            View File
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default Popup;
