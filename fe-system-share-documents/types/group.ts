export interface Group {
  id: string
  name: string
  description?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  members: GroupMember[]
  documents: string[]
}

export interface GroupMember {
  userId: string
  userName: string
  email: string
  role: GroupRole
  joinedAt: Date
}

export enum GroupRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

export interface GroupCreateRequest {
  name: string
  description?: string
  members: string[]
}
