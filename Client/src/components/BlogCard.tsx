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

type ExpandMoreProps = {
  expand: boolean;
} & React.ComponentProps<typeof IconButton>;

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})<ExpandMoreProps>(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const BlogCard = ({
  blog,
}: {
  blog: Blog;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState<null | HTMLElement>(
    null
  );

  const navigate = useNavigate();

  const handleOpenAction = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElAction(e.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Card  sx={{ maxWidth: 600, minWidth: 250, marginBottom: 3, width: "40%" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="author">
            {blog.author.name.substring(0, 2).toUpperCase()}
          </Avatar>
        }
        action={
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
              <MenuItem>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </Menu>
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
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
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
