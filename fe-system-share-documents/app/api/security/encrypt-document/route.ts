import { type NextRequest, NextResponse } from "next/server"
import { encryptDocument, addWatermark, createSignature, hashDocument } from "@/lib/crypto-utils"

export async function POST(request: NextRequest) {
  try {
    const { documentContent, recipientPublicKeys, userId, timestamp } = await request.json()

    if (!documentContent || !recipientPublicKeys) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Add watermark
    const watermarkedContent = addWatermark(documentContent, userId, new Date(timestamp))

    // Calculate hash
    const documentHash = hashDocument(watermarkedContent)

    // Create signature
    const signature = createSignature(documentHash, userId)

    // Encrypt for each recipient
    const encryptedVersions = recipientPublicKeys.map((key: string) => ({
      recipient: key,
      encrypted: encryptDocument(watermarkedContent, key),
    }))

    return NextResponse.json({
      documentHash,
      signature,
      watermarked: true,
      encryptedVersions,
      encryptionLevel: "hybrid",
    })
  } catch (error) {
    return NextResponse.json({ error: "Encryption failed" }, { status: 500 })
  }
}
