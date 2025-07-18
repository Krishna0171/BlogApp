import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const AppLayout = () => {
  return (
    <>
      <Navbar />

      <Box component="main" sx={{ p: 3 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </>
  );
};

export default AppLayout;
