import { useState } from "react";
import { TextField, Button, Container, Typography, Stack } from "@mui/material";
import { useAppSnackbar } from "../hooks/useAppSnackbar";
import { useNavigate } from "react-router-dom";
import * as postService from "../services/blogService";
import { useAuth } from "../hooks/useAuth";
import { Routes } from "../constants/Routes";
import yup, { string } from "yup";
import {
  MaxiLengthError,
  MinLengthError,
  Required,
} from "../constants/ErrorMessage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { CreatePostData } from "../interfaces/interfaces";

const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useAppSnackbar();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const schema = yup.object({
    title: yup
      .string()
      .required(Required("Title"))
      .min(3, MinLengthError("Title", 3))
      .max(100, MaxiLengthError("Title", 100)),
    content: yup
      .string()
      .required(Required("Content"))
      .max(1000, MaxiLengthError("Content", 1000)),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostData>({
    resolver: yupResolver(schema),
  });

  const createPostHandler = async (data: CreatePostData) => {
    e.preventDefault();
    if (!title || !content) return showError("All fields required");

    const response = await postService.createPost({ title, content });

    if (response.isSuccess) {
      showSuccess("Post created successfully");
      navigate(Routes.Dashboard);
    } else {
      showError(response.Message || "Failed to create post");
    }
  };

  if (user?.role !== "admin") {
    return <Typography>Unauthorized</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mb={3}>
        Create New Post
      </Typography>
      <form onSubmit={handleSubmit(createPostHandler)}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            margin="normal"
            fullWidth
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Content"
            margin="normal"
            fullWidth
            {...register("content")}
            error={!!errors.content}
            helperText={errors.content?.message}
          />
          <Button type="submit" variant="contained" color="primary">
            Create Post
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default CreatePostPage;
