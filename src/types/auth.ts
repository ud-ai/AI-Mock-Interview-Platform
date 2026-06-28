export interface User {
  id: string;
  name: string;
  email: string;
  jobRole: string;
  experienceLevel: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
