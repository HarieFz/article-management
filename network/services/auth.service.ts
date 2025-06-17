import { AuthEndpoint } from "../apis/auth.api";
import request from "../config/request";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: "Admin" | "User";
}

interface RegisterRequest {
  username: string;
  password: string;
  role: string;
}

interface RegisterResponse {
  username: string;
  password: string;
  role: "Admin" | "User";
  createdAt: string;
  upadtedAt: string;
}

interface ProfileResponse {
  id: string;
  username: string;
  role: "Admin" | "User";
}

const AuthService = {
  login: ({ username, password }: LoginRequest): Promise<LoginResponse> => {
    return request({
      url: AuthEndpoint.login(),
      method: "POST",
      data: {
        username,
        password,
      },
    });
  },
  register: ({ username, password, role }: RegisterRequest): Promise<RegisterResponse> => {
    return request({
      url: AuthEndpoint.register(),
      method: "POST",
      data: {
        username,
        password,
        role,
      },
    });
  },
  profile: (): Promise<ProfileResponse> => {
    return request({
      url: AuthEndpoint.profile(),
      method: "GET",
    });
  },
};

export { AuthService };
export type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ProfileResponse };
