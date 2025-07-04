export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    exp?: number; // for JWT expiry
  }
  