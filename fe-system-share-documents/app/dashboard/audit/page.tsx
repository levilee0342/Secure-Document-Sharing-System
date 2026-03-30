"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout"
import AuditLogViewer from "@/components/audit/audit-log-viewer"
import { Button } from "@/components/ui/button"

export default function AuditPage() {
  const [user, setUser] = useState<any>(null)
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [filterType, setFilterType] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/")
      return
    }

    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName")
    setUser({ id: userId, name: userName })

    // Load audit logs from localStorage
    const savedLogs = localStorage.getItem("auditLogs")
    if (savedLogs) {
      setAuditLogs(JSON.parse(savedLogs))
    } else {
      // Initialize with sample logs
      const sampleLogs = [
        {
          id: "log_1",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action: "document_upload",
          actor: userName,
          resource: "test-document.pdf",
          details: "Document uploaded and encrypted with 2 recipients",
          status: "success",
        },
        {
          id: "log_2",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          action: "document_download",
          actor: "john.doe@example.com",
          resource: "test-document.pdf",
          details: "Document downloaded and decrypted",
          status: "success",
        },
        {
          id: "log_3",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          action: "signature_verified",
          actor: userName,
          resource: "test-document.pdf",
          details: "Digital signature verified successfully",
          status: "success",
        },
        {
          id: "log_4",
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          action: "group_created",
          actor: userName,
          resource: "Marketing Team",
          details: "Group created with 3 members",
          status: "success",
        },
        {
          id: "log_5",
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          action: "access_granted",
          actor: userName,
          resource: "jane.smith@example.com",
          details: "User added to group Marketing Team",
          status: "success",
        },
        {
          id: "log_6",
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          action: "login",
          actor: userName,
          resource: "SecureShare",
          details: "User logged in successfully",
          status: "success",
        },
      ]
      setAuditLogs(sampleLogs)
      localStorage.setItem("auditLogs", JSON.stringify(sampleLogs))
    }
  }, [router])

  const addAuditLog = (action: string, resource: string, details: string) => {
    const newLog = {
      id: "log_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      actor: user?.name || "Unknown",
      resource,
      details,
      status: "success",
    }
    const updatedLogs = [newLog, ...auditLogs]
    setAuditLogs(updatedLogs)
    localStorage.setItem("auditLogs", JSON.stringify(updatedLogs))
  }

  const filteredLogs = filterType === "all" ? auditLogs : auditLogs.filter((log) => log.action === filterType)

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground">Track all system activities and security events</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant={filterType === "all" ? "default" : "outline"} onClick={() => setFilterType("all")}>
            All Events ({auditLogs.length})
          </Button>
          <Button
            variant={filterType === "document_upload" ? "default" : "outline"}
            onClick={() => setFilterType("document_upload")}
          >
            Uploads
          </Button>
          <Button
            variant={filterType === "document_download" ? "default" : "outline"}
            onClick={() => setFilterType("document_download")}
          >
            Downloads
          </Button>
          <Button
            variant={filterType === "signature_verified" ? "default" : "outline"}
            onClick={() => setFilterType("signature_verified")}
          >
            Signatures
          </Button>
          <Button
            variant={filterType === "access_granted" ? "default" : "outline"}
            onClick={() => setFilterType("access_granted")}
          >
            Access Changes
          </Button>
        </div>

        <AuditLogViewer logs={filteredLogs} />
      </div>
    </DashboardLayout>
  )
}
