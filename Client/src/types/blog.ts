export type Blog = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  isDeleted: boolean;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
  };
};
