
export const ROUTES = {
    Login : '/login',
    Register: '/register',
    ResetPassword: '/reset-password',
    Dashboard: '/',
    OAuthSuccess: '/oauth-success',
    ForgotPassword: '/forgot-password',
    Unauthorized: '/unauthorized',
    CreatePost: '/post/create',
    EditPost: (id?: string) => `/post/edit/${id ?? ":id"}`,
    SessionManager: '/sessions'
}

export const API_ROUTES = {
    Login: '/auth/login',
    Logout: '/auth/logout',
    Register: '/auth/register',
    ForgotPassword: '/auth/forgot-password',
    ResetPassword: '/auth/reset-password',
    OAuthGoogle: '/auth/google',
    RefreshToken: '/auth/refresh-token',

    GetSessions: '/auth/sessions',
    LogoutSession: (id:string) => `/auth/sessions/${id}`,
    LogoutAllSessions: '/auth/sessions',

    FetchBlogs: '/posts',
    FetchFavoriteBlogs: '/posts/favorites',
    CreatePost: '/posts',
    GetPostById: (id: string) => `/posts/${id}`,
    updatePost: (id: string) => `/posts/${id}`,
    deletePost: (id: string) => `/posts/${id}`,
    FavoritePost: (id: string) => `/posts/${id}`,
}