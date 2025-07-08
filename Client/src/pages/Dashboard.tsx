import { Typography, Box, Button } from "@mui/material";
import BlogList from "../components/BlogList";
import SearchInput from "../components/inputs/SearchInput";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/Routes";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard – Blog Feed
      </Typography>
      <Box sx={{display: "flex", justifyContent:"space-between", alignItems:"center"}}>
        <SearchInput setSearchQuery={setSearchQuery} />
        {user?.role === "admin" && (
          <Button color="primary" variant="contained" component={Link} to={ROUTES.CreatePost}>
            Create Post
          </Button>
        )}
      </Box>
      <BlogList searchQuery={searchQuery} />
    </Box>
  );
};

export default Dashboard;
