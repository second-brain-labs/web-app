import React, { useState } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { WindowRounded } from "@mui/icons-material";

interface DropDownProps {
  title: string;
  spaces: string[];
}

const DropDown = (props: DropDownProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <Box
          onClick={() => setOpen(true)}
          sx={{ color: "#A1C88E", display: "flex", alignItems: "center" }}
        >
          <span>▶</span> {/* This is a right-pointing triangle (arrow) */}
          <Typography variant="body1" sx={{ marginLeft: "8px" }}>
            {props.title}
          </Typography>
        </Box>
      )}
      {open && (
        <>
          <Box
            onClick={() => setOpen(false)}
            sx={{ color: "#A1C88E", display: "flex", alignItems: "center" }}
          >
            <span>▼</span> {/* This is a right-pointing triangle (arrow) */}
            <Typography variant="body1" sx={{ marginLeft: "8px" }}>
              {props.title}
            </Typography>
          </Box>
          <Box
            component="ul"
            sx={{
              color: "#A1C88E",
              listStyleType: "disc" /* This creates the bullet points */,
              padding: 0 /* Removes default padding */,
              marginLeft: "40px" /* Adjust as needed for indentation */,
            }}
          >
            {props.spaces.map((space, index) => {
              const handleClick = () => {
                if (index === 0) {
                  window.location.href = "https://secondbrainlabs.xyz";
                } else {
                  window.location.href =
                    "https://secondbrainlabs.xyz/smart_page";
                }
              };
              return (
                <li key={index} onClick={handleClick}>
                  {" "}
                  {space}{" "}
                </li>
              );
            })}
          </Box>
        </>
      )}
    </>
  );
};

export default DropDown;
