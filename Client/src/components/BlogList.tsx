import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BlogCard from "./BlogCard";
import type { Blog } from "../types/blog";
import { Box, Stack } from "@mui/material";
import { toast } from "react-toastify";
import * as postService from "../services/blogService";
import { DeleteSuccess } from "../constants/SuccessMessages";
import { confirmDialog } from "../utils/sweetAlert";

type Props = {
  searchQuery: string;
  displayFavorites: boolean;
};

const BlogList = ({ searchQuery, displayFavorites = false }: Props) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBlogs = async (reset: boolean = false) => {
    const currentPage = reset? 1: page;

    let result;
    if (!displayFavorites) {
      result = await postService.fetchBlogs(searchQuery, currentPage);
    } else {
      result = await postService.fetchFavoriteBlogs(searchQuery, currentPage);
    }

    if (result.isSuccess) {
      const newBlogs = result.Data;
      setBlogs((prev) => [...prev, ...newBlogs]);
      setHasMore(newBlogs.length == 5);
      setPage(currentPage + 1);
    } else {
      toast.error(result.Message);
    }
  };

  const handleDeletePost = async (id: string) => {
    const confirmation = await confirmDialog({
      title: "Delete Confirmation?",
      text: "Are you sure you want to delete this post?",
    });
    if (!confirmation) {
      return;
    }

    const result = await postService.deletePost(id);
    if (result.isSuccess) {
      toast.success(DeleteSuccess("Post"));
      setPage(1);
      setBlogs([]);
      await fetchBlogs();
    } else {
      toast.error(result.Message);
    }
  };

  useEffect(() => {
    setPage(1);
    setBlogs([]);
    fetchBlogs(true);
  }, [searchQuery, displayFavorites]);

  return (
    <>
      <Box mt={2}>
        <InfiniteScroll
          dataLength={blogs.length}
          next={fetchBlogs}
          hasMore={hasMore}
          loader={<p>Loading more...</p>}
          endMessage={<p style={{ textAlign: "center" }}>No more blogs ✨</p>}
        >
          <Stack gap={2} direction={"row"} flexWrap={"wrap"}>
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                handleDeletePost={handleDeletePost}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </Box>
    </>
  );
};

export default BlogList;
