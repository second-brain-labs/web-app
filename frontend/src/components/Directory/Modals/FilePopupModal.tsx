import { Box, IconButton, Modal, Stack, Typography } from "@mui/material";
import React from "react";

interface ModalProps {
  handleClose: () => void;
  x: string;
  open: string;
  title: string;
  summary: string;
}

const Popup = ({ handleClose, x, open, title, summary }: ModalProps) => {
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
          <Typography sx={{ wordWrap: "break-word" }}>{summary}</Typography>
          <Stack direction="row"></Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default Popup;
