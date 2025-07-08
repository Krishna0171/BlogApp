import { Typography } from "@mui/material";
import PostForm from "../../components/forms/PostForm";
import { toast } from "react-toastify";
import type { CreatePostData } from "../../interfaces/interfaces";
import { ROUTES } from "../../constants/Routes";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as postService from "../../services/blogService";
import type { Blog } from "../../types/blog";
import Loading from "../../components/Loading";

const EditPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    postService.getPostById(id!).then((res) => {
      if (res.isSuccess) setBlog(res.Data);
      else toast.error(res.Message);
    });
  }, [id]);

  const handleUpdate = async (data: CreatePostData) => {
    const result = await postService.updatePost(id!, data);
    if (result.isSuccess) {
      toast.success("Post updated");
      navigate(ROUTES.Dashboard);
    } else {
      toast.error(result.Message);
    }
  };

  return blog ? (
    <PostForm onSubmit={handleUpdate} defaultValues={blog} isEditing />
  ) : (
    <Loading />
  );
};

export default EditPost;