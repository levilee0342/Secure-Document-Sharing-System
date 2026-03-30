"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Group {
  id: string
  name: string
  description: string
  members: string[]
  created: string
}

interface GroupsListProps {
  groups: Group[]
  onDelete: (id: string) => void
  onUpdateMembers: (id: string, members: string[]) => void
}

export default function GroupsList({ groups, onDelete, onUpdateMembers }: GroupsListProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No groups yet</h3>
            <p className="text-muted-foreground">Create your first group to organize document sharing</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.id}>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <span>{expandedGroup === group.id ? "▼" : "▶"}</span>
                  {group.name}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">{group.members.length} members</span>
                <span className="text-muted-foreground">Created {formatDate(group.created)}</span>
              </div>
            </div>
          </CardHeader>

          {expandedGroup === group.id && (
            <CardContent className="border-t pt-4 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Group Members</h4>
                <div className="space-y-2">
                  {group.members.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{member}</span>
                      <button
                        onClick={() =>
                          onUpdateMembers(
                            group.id,
                            group.members.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  📄 Add Documents
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  👤 Manage Members
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(group.id)}
                  className="text-destructive hover:text-destructive"
                >
                  🗑️ Delete
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
