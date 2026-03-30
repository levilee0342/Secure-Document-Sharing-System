export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: AuditAction
  resourceType: ResourceType
  resourceId: string
  resourceName?: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  status: AuditStatus
  details: Record<string, unknown>
  changes?: ChangeLog[]
}

export enum AuditAction {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
  UPLOAD_DOCUMENT = "UPLOAD_DOCUMENT",
  DOWNLOAD_DOCUMENT = "DOWNLOAD_DOCUMENT",
  DELETE_DOCUMENT = "DELETE_DOCUMENT",
  SHARE_DOCUMENT = "SHARE_DOCUMENT",
  REVOKE_ACCESS = "REVOKE_ACCESS",
  CREATE_GROUP = "CREATE_GROUP",
  DELETE_GROUP = "DELETE_GROUP",
  ADD_GROUP_MEMBER = "ADD_GROUP_MEMBER",
  REMOVE_GROUP_MEMBER = "REMOVE_GROUP_MEMBER",
  VERIFY_SIGNATURE = "VERIFY_SIGNATURE",
  ENCRYPT_DOCUMENT = "ENCRYPT_DOCUMENT",
  DECRYPT_DOCUMENT = "DECRYPT_DOCUMENT",
}

export enum ResourceType {
  USER = "USER",
  DOCUMENT = "DOCUMENT",
  GROUP = "GROUP",
  KEY = "KEY",
}

export enum AuditStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  PARTIAL = "PARTIAL",
}

export interface ChangeLog {
  field: string
  oldValue: unknown
  newValue: unknown
  timestamp: Date
}

export interface AuditFilterOptions {
  userId?: string
  action?: AuditAction
  resourceType?: ResourceType
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}
