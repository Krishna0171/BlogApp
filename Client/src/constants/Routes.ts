
export const ROUTES = {
    Login : '/login',
    Register: '/register',
    Dashboard: '/',
    ForgotPassword: '/forgot-password',
    Unauthorized: '/unauthorized',
    CreatePost: '/post/create',
    EditPost: (id?: string) => `/post/edit/${id ?? ":id"}`
}

export const API_ROUTES = {
    Login: '/auth/login',
    Register: '/auth/register',
    FetchBlogs: '/posts',
    CreatePost: '/posts',
    GetPostById: (id: string) => `/posts/${id}`,
    updatePost: (id: string) => `/posts/${id}`
}