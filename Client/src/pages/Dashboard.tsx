import { Typography, Box, Button } from "@mui/material";
import BlogList from "../components/BlogList";
import SearchInput from "../components/inputs/SearchInput";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/Routes";
import BlogFilterTabs from "../components/BlogFilterTabs";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayFavorites, setDisplayFavorites] = useState<boolean>(false);
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard – Blog Feed
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchInput setSearchQuery={setSearchQuery} />
        {user?.role === "admin" && (
          <Button
            color="primary"
            variant="contained"
            component={Link}
            to={ROUTES.CreatePost}
          >
            Create Post
          </Button>
        )}
      </Box>

      <BlogFilterTabs displayFavorites={displayFavorites} setDisplayFavorites={setDisplayFavorites}/>
      <BlogList searchQuery={searchQuery} displayFavorites={displayFavorites}/>
    </Box>
  );
};

export default Dashboard;
