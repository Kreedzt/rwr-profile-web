// SPDX-License-Identifier: GPL-3.0-only
export interface ErrorResponse {
  status: number;
  code: number;
  message: string;
}

export interface LoginResponse {
  name: string;
  user_id: number;
  password: string;
  admin: number;
}
