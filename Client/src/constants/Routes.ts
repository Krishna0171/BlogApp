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
    Logout: '/auth/logout',
    Register: '/auth/register',
    FetchBlogs: '/posts',
    OAuthGoogle: '/auth/google',
    FetchFavoriteBlogs: '/posts/favorites',
    CreatePost: '/posts',
    GetPostById: (id: string) => `/posts/${id}`,
    updatePost: (id: string) => `/posts/${id}`,
    deletePost: (id: string) => `/posts/${id}`,
    FavoritePost: (id: string) => `/posts/${id}`
}