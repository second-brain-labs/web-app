import React from "react";
import { Grid, Link, Typography } from "@mui/material";
import "../../util/styles/footer.css";

const Footer = () => {
  return (
    <Grid
      container
      className="footer"
      alignContent={"center"}
      justifyContent={"center"}
    >
      <Link
        href="#"
        color="inherit"
        sx={{ color: "white", marginRight: "5px" }}
      >
        {"Terms of Use"}
      </Link>
      <Typography sx={{ color: "white" }}> | </Typography>
      <Link
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
        color="inherit"
        sx={{ color: "white", marginLeft: "5px" }}
      >
        {"Privacy Policy"}
      </Link>
    </Grid>
  );
};

export default Footer;
