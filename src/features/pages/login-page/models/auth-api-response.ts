interface User {
  id: string;
  username: string;
}

interface Token {
  id: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

interface UserAndToken {
  user: User;
  token: string;
}

export interface AuthApiResponse {
  code: number;
  data: UserAndToken;
}

export interface VerifyTokenResponse {
  code: number;
  data: {
    token: Token;
  };
}
