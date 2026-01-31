import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ENCRYPTION_KEY = process.env.MEDICATION_ENCRYPTION_KEY!
const ALGORITHM = 'aes-256-gcm'

if (!ENCRYPTION_KEY) {
  throw new Error('MEDICATION_ENCRYPTION_KEY environment variable is required')
}

if (Buffer.from(ENCRYPTION_KEY, 'hex').length !== 32) {
  throw new Error('MEDICATION_ENCRYPTION_KEY must be a 32-byte hex string (64 characters)')
}

export interface EncryptedData {
  encrypted: string
  iv: string
  authTag: string
}

export function encryptText(text: string): EncryptedData {
  if (!text) {
    return { encrypted: '', iv: '', authTag: '' }
  }

  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag().toString('hex')

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag,
  }
}

export function decryptText(encrypted: string, iv: string, authTag: string): string {
  if (!encrypted || !iv || !authTag) {
    return ''
  }

  try {
    const decipher = createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(iv, 'hex')
    )

    decipher.setAuthTag(Buffer.from(authTag, 'hex'))

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption failed:', error)
    return ''
  }
}

// Helper to generate encryption key (run once)
export function generateEncryptionKey(): string {
  return randomBytes(32).toString('hex')
}
