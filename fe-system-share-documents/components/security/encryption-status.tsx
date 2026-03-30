"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EncryptionStatusProps {
  documentId: string
  isSigned: boolean
  isWatermarked: boolean
  encryptionLevel: "aes-256" | "rsa-2048" | "hybrid"
  recipients: string[]
}

export default function EncryptionStatus({
  documentId,
  isSigned,
  isWatermarked,
  encryptionLevel,
  recipients,
}: EncryptionStatusProps) {
  const getEncryptionLabel = (level: string) => {
    const labels: Record<string, string> = {
      "aes-256": "AES-256 Encryption",
      "rsa-2048": "RSA-2048 Encryption",
      hybrid: "Hybrid Encryption (RSA + AES)",
    }
    return labels[level] || level
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Security Status</CardTitle>
        <CardDescription>Document #{documentId}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Encryption</span>
            <Badge className="bg-accent text-accent-foreground">{getEncryptionLabel(encryptionLevel)}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Digital Signature</span>
            <Badge variant={isSigned ? "default" : "secondary"}>{isSigned ? "✓ Signed" : "Not Signed"}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Watermark</span>
            <Badge variant={isWatermarked ? "default" : "secondary"}>
              {isWatermarked ? "✓ Protected" : "Not Protected"}
            </Badge>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm font-medium mb-2">Encrypted for:</p>
            <div className="space-y-1">
              {recipients.map((recipient, idx) => (
                <div key={idx} className="text-xs text-muted-foreground">
                  • {recipient}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
