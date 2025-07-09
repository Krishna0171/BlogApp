import { useForm } from "react-hook-form";
import {
  MaxiLengthError,
  MinLengthError,
  Required,
} from "../../constants/ErrorMessage";
import type { CreatePostData } from "../../interfaces/interfaces";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

type PostFormProps = {
  defaultValues?: Partial<CreatePostData>;
  onSubmit: (data: CreatePostData) => Promise<void>;
  isEditing?: boolean;
};

const PostForm = ({
  defaultValues ,
  onSubmit,
  isEditing = false,
}: PostFormProps) => {
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
    reset,
  } = useForm<CreatePostData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues); 
  }, [defaultValues]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mb={3}>
        {isEditing ? "Edit Post" : "Create New Post"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update"
              : "Create"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default PostForm;
