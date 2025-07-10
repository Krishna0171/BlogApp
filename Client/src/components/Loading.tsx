import React from "react";
import {
  CircularProgress,
  Typography,
  Backdrop,
  Stack,
} from "@mui/material";
import { LOADING } from "../constants/Constants";

const Loading: React.FC = () => {
  return (
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
