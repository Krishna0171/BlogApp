import { toast } from "react-toastify";
import PostForm from "../../components/forms/PostForm";
import { CreateSuccess } from "../../constants/SuccessMessages";
import type { CreatePostData } from "../../interfaces/interfaces";
import { ROUTES } from "../../constants/Routes";
import { useNavigate } from "react-router-dom";
import * as postService from "../../services/blogService";

const CreatePost = () => {
  const navigate = useNavigate();

  const handleCreate = async (data: CreatePostData) => {
    const result = await postService.createPost(data);
    if (result.isSuccess) {
      toast.success(CreateSuccess("Post"));
      navigate(ROUTES.Dashboard);
    } else {
      toast.error(result.Message);
    }
  };

  return <PostForm onSubmit={handleCreate}  />;
};

export default CreatePost;
