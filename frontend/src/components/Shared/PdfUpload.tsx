import React, { ChangeEvent, useState } from "react";
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
      uploadArticle();
    } else {
      console.log("shit fuck");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
        }}
      />
      <button>Upload PDF</button>
    </div>
  );
};

export default PdfUpload;
