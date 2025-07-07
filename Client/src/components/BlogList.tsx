import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BlogCard from "./BlogCard";
import * as blogService from "../services/blogService";
import type { Blog } from "../types/blog";
import { useAppSnackbar } from "../hooks/useAppSnackbar";
import { Box, Stack } from "@mui/material";

type Props = {
    searchQuery: string;
}

const BlogList = ({searchQuery}: Props) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { showError } = useAppSnackbar();

  const fetchBlogs = async () => {
    const result = await blogService.fetchBlogs(searchQuery, page);
    if (result.isSuccess) {
      const newBlogs = result.Data;
      setBlogs((prev) => [...prev, ...newBlogs]);
      setHasMore(newBlogs.length > 0);
      setPage((prev) => prev + 1);
    } else {
      showError(result.Message);
    }
  };

  useEffect(() => {
    setPage(1);
    setBlogs([]);
    fetchBlogs();
  }, [searchQuery]);

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
          <Stack spacing={2} rowGap={2} direction={"row"} flexWrap={"wrap"}>
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </Stack>
        </InfiniteScroll>
      </Box>
    </>
  );
};

export default BlogList;
