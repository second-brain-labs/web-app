import React, { ChangeEvent, useState, useRef } from "react";
import { Stack, Typography } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

interface IFileviewProps {
  user_uuid: string;
}

const PdfUpload = ({ user_uuid }: IFileviewProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const path =
    searchParams.get("path") === null ? "/" : searchParams.get("path");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const uploadArticle = async () => {
    try {
      const formData = new FormData();
      if (selectedFile && path) {
        formData.append("title", selectedFile.name);
        formData.append("user_uuid", user_uuid);
        formData.append("directory", path);
        formData.append("uploaded_file", selectedFile);
        console.log("Name: ", selectedFile?.name);
        console.log("user_id: ", user_uuid);
        console.log("directory: ", path);
        var formDataString = "";
        formData.forEach(function (value, key) {
          formDataString += key + "=" + value + "&";
        });

        // Remove the trailing '&' character
        formDataString = formDataString.slice(0, -1);
        console.log(formData);
        console.log(selectedFile);
        console.log(formDataString);

        // Convert the string to a Blob
        var blob = new Blob([selectedFile]);

        const response = axios.post(
          `http://localhost:3500/articles/article/upload?title=${selectedFile?.name}&user_uuid=${user_uuid}&directory=${path}`,
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    if (selectedFile) {
      console.log("WAY TO GO YOU MADE IT HERE");
      //   uploadArticle();
    } else {
      console.log("shit fuck");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        accept=".pdf"
        style={{ display: "none" }}
      />
      <Stack>
        {selectedFile != null && (
          <p style={{ fontSize: "11px", margin: "4px 0" }}>
            {selectedFile?.name}
          </p>
        )}
        <button
          onClick={handleFileButtonClick}
          style={{ width: "fit-content" }}
        >
          Select PDF
        </button>
        {selectedFile != null && (
          <button onClick={uploadArticle} style={{ width: "fit-content" }}>
            Upload PDF
          </button>
        )}
      </Stack>
    </div>
  );
};

export default PdfUpload;
