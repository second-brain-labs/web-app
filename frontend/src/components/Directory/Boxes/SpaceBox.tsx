import React from 'react';
import "./smallbox.css";

interface ISmallBoxProps {
    title: string,
    type: "folder" | "file" | "link",
}



const SpaceBox = ({title, type}: ISmallBoxProps) => {
    return (
        <></>
    );
}
export default SpaceBox;