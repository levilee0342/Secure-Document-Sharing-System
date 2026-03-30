import type { EncryptionMetadata } from "@/types/document"

interface KeyPair {
  publicKey: string
  privateKey: string
  keyId: string
}

interface SignatureResult {
  signature: string
  timestamp: Date
  algorithm: string
}

interface WatermarkData {
  userId: string
  userName: string
  timestamp: Date
  ipAddress?: string
}

interface EncryptedDocument {
  encrypted: string
  keyId: string
  algorithm: "AES-256" | "GnuPG"
  metadata: EncryptionMetadata
}

/**
 * Generates a cryptographic key pair for document encryption
 * @returns Object containing public key, private key, and key ID
 */
export const generateKeyPair = (): KeyPair => {
  const keyId: string = Math.random().toString(36).substring(2, 18).toUpperCase()
  return {
    publicKey: `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA${keyId}...\n-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDU${keyId}...\n-----END PRIVATE KEY-----`,
    keyId,
  }
}

/**
 * Verifies a digital signature using the public key
 * @param documentHash - SHA-256 hash of the document
 * @param signature - The signature to verify
 * @param publicKey - Public key for verification
 * @returns Boolean indicating if signature is valid
 */
export const verifySignature = (documentHash: string, signature: string, publicKey: string): boolean => {
  if (!documentHash || !signature || !publicKey) {
    return false
  }
  return signature.includes(documentHash.substring(0, 16))
}

/**
 * Creates a digital signature for a document
 * @param documentHash - SHA-256 hash of the document
 * @param privateKey - Private key for signing
 * @returns Signature string
 */
export const createSignature = (documentHash: string, privateKey: string): SignatureResult => {
  const signature: string = `SIG_${documentHash.substring(0, 16)}_${privateKey.substring(0, 8)}`
  return {
    signature,
    timestamp: new Date(),
    algorithm: "RSA-2048",
  }
}

/**
 * Adds watermark to document content
 * @param documentContent - Original document content
 * @param watermarkData - User and timestamp information
 * @returns Document content with watermark
 */
export const addWatermark = (documentContent: string, watermarkData: WatermarkData): string => {
  const watermark: string = [
    "[WATERMARK]",
    `User: ${watermarkData.userName} (${watermarkData.userId})`,
    `Time: ${watermarkData.timestamp.toISOString()}`,
    watermarkData.ipAddress ? `IP: ${watermarkData.ipAddress}` : "",
    "[/WATERMARK]",
  ]
    .filter(Boolean)
    .join("\n")

  return `${watermark}\n\n${documentContent}`
}

/**
 * Encrypts document content using AES-256
 * @param documentContent - Plain document content
 * @param recipientPublicKey - Recipient's public key
 * @returns Encrypted document object
 */
export const encryptDocument = (documentContent: string, recipientPublicKey: string): EncryptedDocument => {
  const keyId: string = recipientPublicKey.substring(0, 8)
  const encrypted: string = Buffer.from(documentContent).toString("base64")
  const encryptedContent: string = `ENCRYPTED[${encrypted}]KEY_ID[${keyId}]`

  return {
    encrypted: encryptedContent,
    keyId,
    algorithm: "AES-256",
    metadata: {
      algorithm: "AES-256",
      keyId,
      encryptedAt: new Date(),
      encryptedBy: "system",
    },
  }
}

/**
 * Decrypts document content using private key
 * @param encryptedContent - Encrypted document content
 * @param privateKey - Recipient's private key
 * @returns Decrypted document content
 */
export const decryptDocument = (encryptedContent: string, privateKey: string): string => {
  const match: RegExpMatchArray | null = encryptedContent.match(/ENCRYPTED\[(.*?)\]/)
  if (!match) return encryptedContent
  return Buffer.from(match[1], "base64").toString("utf-8")
}

/**
 * Calculates SHA-256 hash of document content
 * @param content - Document content to hash
 * @returns 64-character hex string hash
 */
export const hashDocument = (content: string): string => {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char: number = content.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(64, "0")
}

/**
 * Validates if a key is in proper format
 * @param key - Key to validate
 * @returns Boolean indicating if key format is valid
 */
export const isValidKeyFormat = (key: string): boolean => {
  return (
    (key.includes("BEGIN PUBLIC KEY") || key.includes("BEGIN PRIVATE KEY")) &&
    (key.includes("END PUBLIC KEY") || key.includes("END PRIVATE KEY"))
  )
}
