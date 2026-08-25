import { UserRole } from '@shared/types';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  memberId: number;
  name: string;
  nickname: string;
  role: UserRole;
  authLevel: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterProtectorRequest {
  name: string;
  phone: string;
  authNumber: string;
  password: string;
  passwordCheck: string;
  address: string;
}

export interface RegisterProtectorResponse {
  memberId: number;
  name: string;
  phone: string;
  protectorCode: string;
}

export interface RegisterWardRequest extends RegisterProtectorRequest {
  diseases: string[];
}

export interface RegisterWardResponse {
  memberId: number;
  name: string;
  phone: string;
  diseases: string[];
}

export interface RefreshTokenResponse {
  accessToken: string;
}
