"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface CreateGroupModalProps {
  onClose: () => void
  onCreate: (group: any) => void
  userId: string
}

export default function CreateGroupModal({ onClose, onCreate, userId }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [members, setMembers] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName) return

    setLoading(true)

    try {
      const newGroup = {
        id: "group_" + Math.random().toString(36).substr(2, 9),
        name: groupName,
        description: description || "No description",
        members: members
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m),
        created: new Date().toISOString(),
        owner: userId,
      }

      onCreate(newGroup)
    } catch (error) {
      console.error("Failed to create group:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Create Group</h2>
            <p className="text-sm text-muted-foreground">Organize team members for document sharing</p>
          </div>

          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              type="text"
              placeholder="e.g., Marketing Team"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Group purpose and scope"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="members">Members (comma-separated emails)</Label>
            <Input
              id="members"
              type="text"
              placeholder="user1@example.com, user2@example.com"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">You can add more members later</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !groupName}>
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Fine-grained access control by role</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Share documents with entire group</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Track access for each member</span>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
