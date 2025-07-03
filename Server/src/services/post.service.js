import prisma from "../config/prisma.js";

export const createPost = async (data) => {
  await prisma.post.create({ data });
};

export const getAllPosts = async () => {
  return await prisma.post.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getPostById = async (id) => {
  return await prisma.post.findUnique({
    where: { id, isDeleted: false },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const updatePost = async (id, data) => {
  return await prisma.post.update({
    where: { id },
    data,
  });
};

export const deletePost = async (id) => {
  return await prisma.post.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
};
