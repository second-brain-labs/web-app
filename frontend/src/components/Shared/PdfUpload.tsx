import React, { ChangeEvent, useState, useRef } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

interface IFileviewProps {
  user_uuid: string;
}

const PdfUpload = ({ user_uuid }: IFileviewProps) => {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchParams, _] = useSearchParams();
  const path =
    searchParams.get("path") === null ? "/" : searchParams.get("path");

  const uploadArticle = async (fileObject: File | null) => {
    if (fileObject === null) {
      return
    }
    try {
      const formData = new FormData();
      if (fileObject && path) {
        formData.append("title", fileObject.name);
        formData.append("user_uuid", user_uuid);
        formData.append("directory", path);
        formData.append("uploaded_file", fileObject);
        console.log("Name: ", fileObject?.name);
        console.log("user_id: ", user_uuid);
        console.log("directory: ", path);
        var formDataString = "";
        formData.forEach(function (value, key) {
          formDataString += key + "=" + value + "&";
        });

        // Remove the trailing '&' character
        formDataString = formDataString.slice(0, -1);
        console.log(formData);
        console.log(fileObject);
        console.log(formDataString);

        // Convert the string to a Blob
        var blob = new Blob([fileObject]);

        const response = axios.post(
          `http://localhost:3500/articles/article/upload?title=${fileObject?.name}&user_uuid=${user_uuid}&directory=${path}`,
          formData
          //   {
          //     headers: {
          //       "Content-Type": "multipart/form-data",
          //     },
          //   }
        );
        const data = (await response).data;
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fileInput = React.useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();

    }
  };

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => uploadArticle(e.target.files ? e.target.files[0] : null)}
      />
      <Button variant="contained" color="secondary" onClick={handleButtonClick} sx={{ borderRadius: "12px" }}>
        Upload File
      </Button>
    </>
  );
};

export default PdfUpload;
