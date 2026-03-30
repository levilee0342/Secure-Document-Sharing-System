"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout"
import GroupsList from "@/components/groups/groups-list"
import CreateGroupModal from "@/components/groups/create-group-modal"
import { Button } from "@/components/ui/button"

export default function GroupsPage() {
  const [user, setUser] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [groups, setGroups] = useState<any[]>([])
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

    // Load groups from localStorage
    const savedGroups = localStorage.getItem("groups")
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups))
    }
  }, [router])

  const handleCreateGroup = (newGroup: any) => {
    const updatedGroups = [...groups, newGroup]
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
    setShowCreateModal(false)
  }

  const handleDelete = (id: string) => {
    const updatedGroups = groups.filter((group) => group.id !== id)
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
  }

  const handleUpdateMembers = (id: string, members: string[]) => {
    const updatedGroups = groups.map((group) => (group.id === id ? { ...group, members } : group))
    setGroups(updatedGroups)
    localStorage.setItem("groups", JSON.stringify(updatedGroups))
  }

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Groups</h1>
            <p className="text-muted-foreground">Manage teams and document access</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="text-base">
            👥 Create Group
          </Button>
        </div>

        <GroupsList groups={groups} onDelete={handleDelete} onUpdateMembers={handleUpdateMembers} />
      </div>

      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateGroup} userId={user.id} />
      )}
    </DashboardLayout>
  )
}
