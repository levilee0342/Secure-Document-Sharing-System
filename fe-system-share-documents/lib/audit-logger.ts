import type { AuditLog, AuditAction, ResourceType, AuditStatus, ChangeLog } from "@/types/audit"
import {
  AuditAction as AuditActionEnum,
  ResourceType as ResourceTypeEnum,
  AuditStatus as AuditStatusEnum,
} from "@/types/audit"

interface AuditLoggerConfig {
  maxLogs?: number
  storageKey?: string
}

interface CreateAuditLogParams {
  userId: string
  userName: string
  action: AuditAction
  resourceType: ResourceType
  resourceId: string
  resourceName?: string
  status: AuditStatus
  details?: Record<string, unknown>
  changes?: ChangeLog[]
  ipAddress?: string
  userAgent?: string
}

class AuditLogger {
  private maxLogs = 10000
  private storageKey = "auditLogs"

  constructor(config?: AuditLoggerConfig) {
    if (config?.maxLogs) this.maxLogs = config.maxLogs
    if (config?.storageKey) this.storageKey = config.storageKey
  }

  /**
   * Creates and logs an audit entry
   */
  public createLog(params: CreateAuditLogParams): AuditLog {
    const log: AuditLog = {
      id: this.generateId(),
      userId: params.userId,
      userName: params.userName,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      resourceName: params.resourceName,
      timestamp: new Date(),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      status: params.status,
      details: params.details || {},
      changes: params.changes,
    }

    this.store([log])
    return log
  }

  /**
   * Logs document upload activity
   */
  public logDocumentUpload(
    userId: string,
    userName: string,
    documentId: string,
    documentName: string,
    recipientCount: number,
  ): AuditLog {
    return this.createLog({
      userId,
      userName,
      action: AuditActionEnum.UPLOAD_DOCUMENT,
      resourceType: ResourceTypeEnum.DOCUMENT,
      resourceId: documentId,
      resourceName: documentName,
      status: AuditStatusEnum.SUCCESS,
      details: {
        recipientCount,
        fileName: documentName,
      },
    })
  }

  /**
   * Logs document download activity
   */
  public logDocumentDownload(userId: string, userName: string, documentId: string, documentName: string): AuditLog {
    return this.createLog({
      userId,
      userName,
      action: AuditActionEnum.DOWNLOAD_DOCUMENT,
      resourceType: ResourceTypeEnum.DOCUMENT,
      resourceId: documentId,
      resourceName: documentName,
      status: AuditStatusEnum.SUCCESS,
      details: { fileName: documentName },
    })
  }

  /**
   * Logs signature verification activity
   */
  public logSignatureVerification(
    userId: string,
    userName: string,
    documentId: string,
    documentName: string,
    verified: boolean,
  ): AuditLog {
    return this.createLog({
      userId,
      userName,
      action: AuditActionEnum.VERIFY_SIGNATURE,
      resourceType: ResourceTypeEnum.DOCUMENT,
      resourceId: documentId,
      resourceName: documentName,
      status: verified ? AuditStatusEnum.SUCCESS : AuditStatusEnum.FAILURE,
      details: {
        verified,
        fileName: documentName,
      },
    })
  }

  /**
   * Logs access grant activity
   */
  public logAccessGrant(
    grantedBy: string,
    grantedByName: string,
    grantedToUserId: string,
    grantedToUserName: string,
    resourceId: string,
    resourceName: string,
  ): AuditLog {
    return this.createLog({
      userId: grantedBy,
      userName: grantedByName,
      action: AuditActionEnum.SHARE_DOCUMENT,
      resourceType: ResourceTypeEnum.DOCUMENT,
      resourceId,
      resourceName,
      status: AuditStatusEnum.SUCCESS,
      details: {
        grantedTo: grantedToUserName,
        grantedToId: grantedToUserId,
      },
    })
  }

  /**
   * Logs group creation
   */
  public logGroupCreation(
    userId: string,
    userName: string,
    groupId: string,
    groupName: string,
    memberCount: number,
  ): AuditLog {
    return this.createLog({
      userId,
      userName,
      action: AuditActionEnum.CREATE_GROUP,
      resourceType: ResourceTypeEnum.GROUP,
      resourceId: groupId,
      resourceName: groupName,
      status: AuditStatusEnum.SUCCESS,
      details: { memberCount },
    })
  }

  /**
   * Logs user authentication
   */
  public logLogin(userId: string, userName: string, email: string): AuditLog {
    return this.createLog({
      userId,
      userName,
      action: AuditActionEnum.LOGIN,
      resourceType: ResourceTypeEnum.USER,
      resourceId: userId,
      resourceName: email,
      status: AuditStatusEnum.SUCCESS,
      details: { email },
    })
  }

  /**
   * Retrieves all audit logs
   */
  public getLogs(): AuditLog[] {
    try {
      const logs = localStorage.getItem(this.storageKey)
      return logs ? JSON.parse(logs) : []
    } catch (error) {
      console.error("[v0] Error retrieving audit logs:", error)
      return []
    }
  }

  /**
   * Filters audit logs based on criteria
   */
  public filterLogs(userId?: string, action?: AuditAction, resourceType?: ResourceType): AuditLog[] {
    const logs = this.getLogs()
    return logs.filter((log) => {
      if (userId && log.userId !== userId) return false
      if (action && log.action !== action) return false
      if (resourceType && log.resourceType !== resourceType) return false
      return true
    })
  }

  /**
   * Stores audit log entries
   */
  private store(entries: AuditLog[]): void {
    try {
      const existingLogs = this.getLogs()
      const updatedLogs = [...entries, ...existingLogs].slice(0, this.maxLogs)
      localStorage.setItem(this.storageKey, JSON.stringify(updatedLogs))
    } catch (error) {
      console.error("[v0] Error storing audit logs:", error)
    }
  }

  /**
   * Generates unique ID for log entry
   */
  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

// Export singleton instance
const auditLogger = new AuditLogger()

// Named exports for commonly used logging functions
export const logDocumentDownload = (userId: string, userName: string, documentId: string, documentName: string) =>
  auditLogger.logDocumentDownload(userId, userName, documentId, documentName)

export const logSignatureVerification = (
  userId: string,
  userName: string,
  documentId: string,
  documentName: string,
  verified: boolean,
) => auditLogger.logSignatureVerification(userId, userName, documentId, documentName, verified)

export const logDocumentUpload = (
  userId: string,
  userName: string,
  documentId: string,
  documentName: string,
  recipientCount: number,
) => auditLogger.logDocumentUpload(userId, userName, documentId, documentName, recipientCount)

export const logAccessGrant = (
  grantedBy: string,
  grantedByName: string,
  grantedToUserId: string,
  grantedToUserName: string,
  resourceId: string,
  resourceName: string,
) => auditLogger.logAccessGrant(grantedBy, grantedByName, grantedToUserId, grantedToUserName, resourceId, resourceName)

export const logGroupCreation = (
  userId: string,
  userName: string,
  groupId: string,
  groupName: string,
  memberCount: number,
) => auditLogger.logGroupCreation(userId, userName, groupId, groupName, memberCount)

export const logLogin = (userId: string, userName: string, email: string) =>
  auditLogger.logLogin(userId, userName, email)

export const getLogs = () => auditLogger.getLogs()
export const filterLogs = (userId?: string, action?: AuditAction, resourceType?: ResourceType) =>
  auditLogger.filterLogs(userId, action, resourceType)
