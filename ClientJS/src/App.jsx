import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";

function App() {
  return (
    <>
      <Box sx={{ width: "100vw", minHeight: "100vh" }}>
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </Box>
    </>
  );
}

export default App;
