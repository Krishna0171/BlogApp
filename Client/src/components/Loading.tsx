import React, { useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Backdrop,
  Stack,
} from "@mui/material";
import { LOADING } from "../constants/Constants";

const Loading: React.FC = () => {
  return (
    // <Box
    //   display="flex"
    //   flexDirection="column"
    //   justifyContent="center"
    //   alignItems="center"
    //   height="100vh"
    //   width={"100vw"}
    //   zIndex={10000}
    //   top={0}
    //   left={0}
    //   bgcolor="#f0f0f0"
    //   position={"absolute"}
    //   sx={{
    //     opacity:"40%"
    //   }}
    // >
    //   <CircularProgress />
    //   <Typography variant="h6" mt={2}>
    //     {LOADING}
    //   </Typography>
    // </Box>
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Stack gap={1} justifyContent="center" alignItems="center">
        <CircularProgress color="inherit" />
        <Typography>{LOADING}</Typography>
      </Stack>
    </Backdrop>
  );
};

export default Loading;
