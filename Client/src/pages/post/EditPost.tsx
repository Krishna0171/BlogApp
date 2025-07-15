import PostForm from "../../components/forms/PostForm";
import { toast } from "react-toastify";
import type { CreatePostData } from "../../interfaces/interfaces";
import { ROUTES } from "../../constants/Routes";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as postService from "../../services/blogService";
import type { Blog } from "../../types/blog";
import Loading from "../../components/Loading";
import { UpdateSuccess } from "../../constants/SuccessMessages";

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
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    } else if (blog) {
      formData.append("imageUrl", blog.imageUrl);
    }
    console.log(data);
    const result = await postService.updatePost(id!, formData);
    if (result.isSuccess) {
      toast.success(UpdateSuccess("Post"));
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
