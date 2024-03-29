import React, { ChangeEvent, useState, useRef } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { get, post } from "../../util/api";
import { useSearchParams } from "react-router-dom";

interface IFileviewProps {
  user_uuid: string;
  update_func: () => void;
}

const PdfUpload = ({ user_uuid, update_func }: IFileviewProps) => {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchParams, _] = useSearchParams();
  const path =
    searchParams.get("path") === null ? "/" : searchParams.get("path");

  const uploadArticle = async (fileObject: File | null) => {
    if (fileObject === null) {
      return;
    }
    try {
      const formData = new FormData();
      if (fileObject && path) {
        formData.append("title", fileObject.name);
        formData.append("user_uuid", user_uuid);
        formData.append("directory", path);
        formData.append("uploaded_file", fileObject);
        var formDataString = "";
        formData.forEach(function (value, key) {
          formDataString += key + "=" + value + "&";
        });

        // Remove the trailing '&' character
        formDataString = formDataString.slice(0, -1);

        // Convert the string to a Blob
        var blob = new Blob([fileObject]);
        const directory = get(
          `directories/query?name=${path}&user_uuid=${user_uuid}`,
        );
        const directoryData = (await directory).data;
        const response = post(
          `articles/article/upload?title=${fileObject?.name}&user_uuid=${user_uuid}&directory=${directoryData.id}`,
          formData,
        );
        const data = (await response).data;
        // console.log(data);
        update_func();
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
        style={{ display: "none" }}
        onChange={(e) =>
          uploadArticle(e.target.files ? e.target.files[0] : null)
        }
      />
      <Button
        variant="contained"
        onClick={handleButtonClick}
        sx={{ borderRadius: "12px", backgroundColor: "#ffd556" }}
      >
        Upload PDF
      </Button>
    </>
  );
};

export default PdfUpload;
