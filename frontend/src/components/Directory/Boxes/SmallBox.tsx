import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import "./smallbox.css";
import file from "../../../assets/images/file.svg";
import link from "../../../assets/images/link.svg";
import folder from "../../../assets/images/folder.svg";
import smartfolder from "../../../assets/images/smart_folder.svg";
import traced_image from "../../../assets/images/traced_logo.svg";

interface ISmallBoxProps {
  title: string;
  type: "backFolder" | "folder" | "file" | "link" | "smartfolder";
  onClick: () => void;
  onButtonClick: () => void;
}

const SmallBox = ({ title, type, onClick, onButtonClick }: ISmallBoxProps) => {
  return (
    <Box
      onClick={onClick}
      className="file"
      sx={{
        border: 0.25,
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        position: "relative",
      }}
    >
      <Stack alignItems="center">
        {type === "file" && (
          <Button
            variant="contained"
            color="error"
            onClick={(event) => {
              event.stopPropagation(); // Prevent event propagation to parent
              onButtonClick(); // Call button click handler
            }} // Handle button click event here
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: "8px",
              padding: "10px",
              minWidth: "auto",
            }}
          >
            x
          </Button>
        )}
        {type === "file" && (
          <img
            className="image"
            src={file}
            style={{ width: "50px", height: "50px" }}
            alt="File"
          />
        )}
        {type === "folder" && (
          <Button
            variant="contained"
            color="error"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: "8px",
              padding: "10px",
              minWidth: "auto",
            }}
            onClick={(event) => {
              event.stopPropagation(); // Prevent event propagation to parent
              onButtonClick(); // Call button click handler
            }}
          >
            x
          </Button>
        )}
        {type === "folder" && (
          <img
            className="image"
            src={folder}
            style={{ width: "50px", height: "50px" }}
            alt="Folder"
          />
        )}
        {type === "backFolder" && (
          <img
            className="image"
            src={folder}
            style={{ width: "50px", height: "50px" }}
            alt="Folder"
          />
        )}
        {type === "smartfolder" && (
          <img
            className="image"
            src={smartfolder}
            style={{ width: "50px", height: "50px" }}
            alt="SmartFolder"
          />
        )}
        {type === "link" && (
          <img
            className="image"
            src={link}
            style={{ width: "50px", height: "50px" }}
            alt="Link"
          />
        )}
        <Typography
          className="font"
          sx={{
            maxWidth: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textAlign: "center",
          }}
        >
          {title.length > 15 ? title.substring(0, 14) + "..." : title}
        </Typography>
      </Stack>
    </Box>
  );
  // (title.split('/').length > 0) ? (title.split('/').slice(-1)) : title
};

export default SmallBox;
