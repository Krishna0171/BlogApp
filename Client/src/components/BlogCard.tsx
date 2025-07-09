import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  styled,
  Menu,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { Blog } from "../types/blog";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/Routes";
import { useShare } from "../hooks/useShare";
import { useAuth } from "../hooks/useAuth";
import * as postService from "../services/blogService";
import { ADMIN } from "../constants/Constants";

type Props = {
  expand: boolean;
} & React.ComponentProps<typeof IconButton>;

const ExpandMore = styled((props: Props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})<Props>(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const BlogCard = ({
  blog,
  handleDeletePost,
}: {
  blog: Blog;
  handleDeletePost: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState<null | HTMLElement>(
    null
  );
  const [isFavorite, setIsFavorite] = useState<boolean>(blog.isFavorite);

  const navigate = useNavigate();
  const { share } = useShare();
  const { user } = useAuth();

  const handleOpenAction = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElAction(e.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}`;
    share(blog.title, postUrl);
  };

  const toggleFavoritePost = async () => {
    const result = await postService.toggleFavoritePost(blog.id);
    if (result.isSuccess) {
      setIsFavorite((prev) => !prev);
    }
  };

  const favoriteIconColor = isFavorite ? "error" : "default";

  return (
    <Card sx={{ maxWidth: 600, minWidth: 250, marginBottom: 3, width: "40%" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="author">
            {blog.author.name.substring(0, 2).toUpperCase()}
          </Avatar>
        }
        action={
          <>
            {user?.id == blog.authorId ? (
              <>
                <Tooltip title="Action">
                  <IconButton aria-label="settings" onClick={handleOpenAction}>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  open={Boolean(anchorElAction)}
                  onClose={handleCloseAction}
                  anchorEl={anchorElAction}
                >
                  <MenuItem onClick={() => navigate(ROUTES.EditPost(blog.id))}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleDeletePost(blog.id);
                      handleCloseAction();
                    }}
                  >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                  </MenuItem>
                </Menu>
              </>
            ) : null}
          </>
        }
        title={blog.title}
        subheader={
          blog.author.name + " " + new Date(blog.createdAt).toLocaleDateString()
        }
      />

      <CardMedia
        component="img"
        height="200"
        image={
          "https://img.freepik.com/free-photo/online-message-blog-chat-communication-envelop-graphic-icon-concept_53876-139717.jpg?semt=ais_hybrid&w=740"
        }
        alt="Blog image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {blog.content.slice(0, 150)}...
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {user?.role === ADMIN ? (
          <IconButton
            color={favoriteIconColor}
            aria-label="add to favorites"
            onClick={toggleFavoritePost}
          >
            <FavoriteIcon />
          </IconButton>
        ) : null}
        <IconButton aria-label="share" onClick={handleShare}>
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Full Content:
          </Typography>
          <Typography variant="body2">{blog.content}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default BlogCard;
