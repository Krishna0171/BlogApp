import { useForm } from "react-hook-form";
import {
  LargeFileSizeError,
  MaxiLengthError,
  MinLengthError,
  Required,
} from "../../constants/ErrorMessage";
import type { CreatePostData } from "../../interfaces/interfaces";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type PostFormProps = {
  defaultValues?: Partial<CreatePostData>;
  onSubmit: (data: CreatePostData) => Promise<void>;
  isEditing?: boolean;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const getSchema = (isEditing: boolean) =>
  yup.object({
    title: yup
      .string()
      .required(Required("Title"))
      .min(3, MinLengthError("Title", 3))
      .max(100, MaxiLengthError("Title", 100)),

    content: yup
      .string()
      .required(Required("Content"))
      .max(1000, MaxiLengthError("Content", 1000)),

    image: yup
      .mixed<FileList>()
      .test("fileRequired", Required("Image"), (value, ctx) => {
        if (!isEditing && (!value || value.length === 0)) {
          return ctx.createError({ message: Required("Image") });
        }
        return true;
      })
      .test("fileSize", LargeFileSizeError, (files) => {
        const file = files?.[0];
        if (!file) return true;
        return file.size <= MAX_FILE_SIZE;
      })
      .test("fileType", "Unsupported file format", (files) => {
        const file = files?.[0];
        if (!file) return true;
        return SUPPORTED_FORMATS.includes(file.type);
      }),
  });

const PostForm = ({
  defaultValues,
  onSubmit,
  isEditing = false,
}: PostFormProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const schema = getSchema(isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePostData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(defaultValues);

    if (defaultValues?.imageUrl) {
      console.log(defaultValues.imageUrl);
      setPreview(import.meta.env.VITE_API_URL + defaultValues.imageUrl);
    }
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
          <Input
            type="file"
            inputProps={{ accept: SUPPORTED_FORMATS }}
            {...register("image")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
              }
            }}
            error={!!errors.image}
          />
          <Typography variant="subtitle2" color="error">
            {errors.image?.message}
          </Typography>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}
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
