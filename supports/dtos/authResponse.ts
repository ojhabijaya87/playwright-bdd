export interface AuthResponse {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    __v: number;
  };
  token: string;
}
