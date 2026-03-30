export interface Document {
  id: string
  title: string
  fileName: string
  fileSize: number
  mimeType: string
  ownerId: string
  ownerName: string
  createdAt: Date
  updatedAt: Date
  isEncrypted: boolean
  hash?: string
  signature?: string
  watermark?: string
  sharedWith: SharedAccess[]
}

export interface DocumentUploadRequest {
  title: string
  file: File
  description?: string
  isEncrypted?: boolean
}

export interface SharedAccess {
  userId: string
  userName: string
  accessLevel: AccessLevel
  grantedAt: Date
  grantedBy: string
}

export enum AccessLevel {
  VIEW = "view",
  DOWNLOAD = "download",
  EDIT = "edit",
  ADMIN = "admin",
}

export interface EncryptionMetadata {
  algorithm: "AES-256" | "GnuPG"
  keyId: string
  encryptedAt: Date
  encryptedBy: string
}
