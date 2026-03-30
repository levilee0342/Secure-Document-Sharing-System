"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AuditLog, AuditAction } from "@/types/audit"

interface AuditLogViewerProps {
  logs: AuditLog[]
  onFilterChange?: (action: AuditAction | null) => void
}

const ACTION_ICONS: Record<string, string> = {
  LOGIN: "🔑",
  LOGOUT: "🚪",
  REGISTER: "📝",
  UPLOAD_DOCUMENT: "📤",
  DOWNLOAD_DOCUMENT: "📥",
  DELETE_DOCUMENT: "🗑️",
  SHARE_DOCUMENT: "🔗",
  REVOKE_ACCESS: "🚫",
  CREATE_GROUP: "👥",
  DELETE_GROUP: "👤",
  ADD_GROUP_MEMBER: "➕",
  REMOVE_GROUP_MEMBER: "➖",
  VERIFY_SIGNATURE: "✓",
  ENCRYPT_DOCUMENT: "🔐",
  DECRYPT_DOCUMENT: "🔓",
}

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "User Login",
  LOGOUT: "User Logout",
  REGISTER: "User Registration",
  UPLOAD_DOCUMENT: "Document Uploaded",
  DOWNLOAD_DOCUMENT: "Document Downloaded",
  DELETE_DOCUMENT: "Document Deleted",
  SHARE_DOCUMENT: "Document Shared",
  REVOKE_ACCESS: "Access Revoked",
  CREATE_GROUP: "Group Created",
  DELETE_GROUP: "Group Deleted",
  ADD_GROUP_MEMBER: "Member Added",
  REMOVE_GROUP_MEMBER: "Member Removed",
  VERIFY_SIGNATURE: "Signature Verified",
  ENCRYPT_DOCUMENT: "Document Encrypted",
  DECRYPT_DOCUMENT: "Document Decrypted",
}

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: "text-accent",
  FAILURE: "text-destructive",
  PARTIAL: "text-yellow-600",
}

export default function AuditLogViewer({ logs, onFilterChange }: AuditLogViewerProps): React.ReactElement {
  const getActionIcon = (action: string): string => {
    return ACTION_ICONS[action] || "📋"
  }

  const getActionLabel = (action: string): string => {
    return ACTION_LABELS[action] || action
  }

  const getStatusColor = (status: string): string => {
    return STATUS_COLORS[status] || "text-foreground"
  }

  const formatTime = (timestamp: Date | string): string => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No audit logs</h3>
            <p className="text-muted-foreground">Activities will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>All system activities are recorded for security and compliance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-2xl">{getActionIcon(log.action)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{getActionLabel(log.action)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {log.resourceName ? `Resource: ${log.resourceName}` : log.details?.toString?.()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${getStatusColor(log.status)}`}>
                    {log.status === "SUCCESS" && "✓ Success"}
                    {log.status === "FAILURE" && "✗ Failed"}
                    {log.status === "PARTIAL" && "⚠ Partial"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 flex-wrap">
                  <span>by {log.userName}</span>
                  <span>type: {log.resourceType}</span>
                  <span>{formatTime(log.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
