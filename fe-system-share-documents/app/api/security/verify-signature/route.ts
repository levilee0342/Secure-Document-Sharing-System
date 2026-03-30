import { type NextRequest, NextResponse } from "next/server"
import { verifySignature } from "@/lib/crypto-utils"
import { logSignatureVerification } from "@/lib/audit-logger"

export async function POST(request: NextRequest) {
  try {
    const { documentHash, signature, publicKey, userId, documentName } = await request.json()

    if (!documentHash || !signature || !publicKey) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Verify the signature
    const isValid = verifySignature(documentHash, signature, publicKey)

    // Log the verification attempt
    const auditLog = logSignatureVerification(userId, documentName, isValid)

    return NextResponse.json({
      valid: isValid,
      message: isValid ? "Signature verified successfully" : "Signature verification failed",
      auditLog,
    })
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
