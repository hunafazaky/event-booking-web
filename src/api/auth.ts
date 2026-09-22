import { api } from '../lib/api'
import type { User, Role } from '../types/user'

export interface SignUpInput {
  name: string
  email: string
  password: string
  role?: Role // 'admin' is rejected by the backend — only attendee/organizer here
}

export interface SignInInput {
  email: string
  password: string
}

export interface SignInResult {
  token: string
  user: User
}

export const authApi = {
  signUp: (input: SignUpInput) => api.post<User>('/auth/signup', input, false),
  signIn: (input: SignInInput) => api.post<SignInResult>('/auth/signin', input, false),
  getMe: () => api.get<User>('/auth/me'),
  updateInterests: (interests: string[]) =>
    api.put<User>('/auth/me/interests', { interests }),
}
