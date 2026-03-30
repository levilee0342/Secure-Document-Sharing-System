import { type NextRequest, NextResponse } from "next/server"
import { decryptDocument } from "@/lib/crypto-utils"
import { logDocumentDownload } from "@/lib/audit-logger"

export async function POST(request: NextRequest) {
  try {
    const { encryptedContent, privateKey, userId, documentName } = await request.json()

    if (!encryptedContent || !privateKey) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Decrypt document
    const decryptedContent = decryptDocument(encryptedContent, privateKey)

    // Log the download
    const auditLog = logDocumentDownload(userId, documentName)

    return NextResponse.json({
      content: decryptedContent,
      decrypted: true,
      auditLog,
    })
  } catch (error) {
    return NextResponse.json({ error: "Decryption failed" }, { status: 500 })
  }
}
