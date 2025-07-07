import { Typography, Box, Button } from "@mui/material";
import BlogList from "../components/BlogList";
import SearchInput from "../components/inputs/SearchInput";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard – Blog Feed
      </Typography>
      <Box>
        <SearchInput setSearchQuery={setSearchQuery} />
        {user?.role === "admin" && (
          <Button color="inherit" component={Link} to="/create-post">
            Create Post
          </Button>
        )}
      </Box>
      <BlogList searchQuery={searchQuery} />
    </Box>
  );
};

export default Dashboard;
