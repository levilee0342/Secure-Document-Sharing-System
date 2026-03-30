export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  lastLogin?: Date
}

export interface AuthResponse {
  token: string
  userId: string
  userName: string
  userRole: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  VIEWER = "viewer",
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}
