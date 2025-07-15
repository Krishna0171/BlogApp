export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  image?: FileList;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  sessionId: string;
  exp?: number;
}
