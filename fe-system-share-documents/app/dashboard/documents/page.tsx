"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout"
import DocumentsList from "@/components/documents/documents-list"
import UploadModal from "@/components/documents/upload-modal"
import { Button } from "@/components/ui/button"

export default function DocumentsPage() {
  const [user, setUser] = useState<any>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])
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

    // Load documents from localStorage
    const savedDocs = localStorage.getItem("documents")
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs))
    }
  }, [router])

  const handleUpload = (newDoc: any) => {
    const updatedDocs = [...documents, newDoc]
    setDocuments(updatedDocs)
    localStorage.setItem("documents", JSON.stringify(updatedDocs))
    setShowUploadModal(false)
  }

  const handleDelete = (id: string) => {
    const updatedDocs = documents.filter((doc) => doc.id !== id)
    setDocuments(updatedDocs)
    localStorage.setItem("documents", JSON.stringify(updatedDocs))
  }

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground">Manage and share your encrypted documents</p>
          </div>
          <Button onClick={() => setShowUploadModal(true)} className="text-base">
            📤 Upload Document
          </Button>
        </div>

        <DocumentsList documents={documents} onDelete={handleDelete} />
      </div>

      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} onUpload={handleUpload} userId={user.id} />
      )}
    </DashboardLayout>
  )
}
