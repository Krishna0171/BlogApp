import prisma from "../config/prisma.js";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { id: "asc" },
    where: { isDeleted: false },
    select: userSafeSelect,
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id, isDeleted: false },
    select: userSafeSelect,
  });
};

export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email, isDeleted: false },
  });
};

export const createUser = async (data) => {
    return await prisma.user.create({
        data,
        select: userSafeSelect
    });
}

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id, isDeleted: false },
    data,
    select: userSafeSelect,
  });
};

export const deleteUser = async (id) => {
  return await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
    select: userSafeSelect,
  });
};