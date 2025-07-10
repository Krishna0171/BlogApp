import prisma from "../config/prisma.js";

export const createSession = async (data) => {
  return await prisma.session.create({data});
};

export const getSessions = async (condition) => {
  return await prisma.session.findMany({
    where: condition,
  });
};

export const deleteSessionByRefreshToken = async (refreshToken) => {
  return await prisma.session.delete({
    where: {
      refreshToken,
    },
  });
};

export const deleteSessionById = async (id) => {
  return await prisma.session.delete({
    where: {
      id,
    },
  });
};

export const deleteAllUserSessions = async (userId) => {
  return await prisma.session.deleteMany({
    where: {
      userId,
    },
  });
};
