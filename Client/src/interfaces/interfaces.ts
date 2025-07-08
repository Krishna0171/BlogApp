export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  exp?: number;
}
