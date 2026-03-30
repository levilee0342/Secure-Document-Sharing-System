"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardContentProps {
  user: any
}

export default function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">0</div>
            <p className="text-xs text-muted-foreground mt-1">documents uploaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">0</div>
            <p className="text-xs text-muted-foreground mt-1">groups created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Shared With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">0</div>
            <p className="text-xs text-muted-foreground mt-1">users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">in the last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Start managing your documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-12 text-base" variant="default">
              📤 Upload Document
            </Button>
            <Button className="h-12 text-base bg-transparent" variant="outline">
              👥 Create Group
            </Button>
            <Button className="h-12 text-base bg-transparent" variant="outline">
              🔍 Browse Documents
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Features</CardTitle>
          <CardDescription>End-to-end encrypted document management</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>
                <strong>Digital Signatures:</strong> All documents are signed with your private key for authenticity
                verification
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>
                <strong>Watermarking:</strong> Documents include user ID and timestamp to prevent unauthorized sharing
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>
                <strong>End-to-End Encryption:</strong> Files encrypted with recipient public keys for secure sharing
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>
                <strong>Audit Logging:</strong> All access and modifications tracked for compliance and security
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>
                <strong>Group Management:</strong> Organize documents in groups with fine-grained access control
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
