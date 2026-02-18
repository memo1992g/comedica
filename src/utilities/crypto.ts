
// Variables de entorno necesarias para el encriptado y desencriptado
const AES_KEY_BASE64 = process.env.AES_KEY_BASE64 || ''

/**
 * Convierte una cadena base64 a ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Convierte un ArrayBuffer a base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Importa la clave AES desde base64 con operaciones configurables
 */
async function importAESKey(
  operations: KeyUsage[] = ['encrypt', 'decrypt']
): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(AES_KEY_BASE64)

  return await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-CBC',
      length: 256
    },
    false,
    operations
  )
}

/**
 * Genera un IV (Vector de Inicialización) aleatorio de 16 bytes
 * Equivalente a: new SecureRandom().nextBytes(iv)
 */
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

/**
 * Encripta datos usando AES/CBC/PKCS5Padding
 *
 * @param data - String a encriptar
 * @returns String encriptado en base64
 */
export async function encryptAES(data: string): Promise<string> {
  try {
    const key = await importAESKey(['encrypt'])
    const iv = generateIV()

    // Convertir string a bytes (equivalente a data.getBytes())
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    // Encriptar usando AES-CBC (equivalente a AES/CBC/PKCS5Padding)
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv: iv.buffer as ArrayBuffer
      },
      key,
      dataBuffer
    )

    // Combinar IV y datos encriptados (equivalente a System.arraycopy)
    const result = new Uint8Array(iv.length + encryptedBuffer.byteLength)
    result.set(iv, 0)
    result.set(new Uint8Array(encryptedBuffer), iv.length)

    // Convertir a base64 (equivalente a Base64.getEncoder().encodeToString)
    return arrayBufferToBase64(result.buffer)
  } catch (error) {
    console.error('Error al encriptar con AES:', error)
    throw new Error('Error al encriptar con AES')
  }
}

/**
 * Desencripta datos usando AES/CBC/PKCS5Padding
 *
 * @param encryptedData - String encriptado en base64
 * @returns String desencriptado
 */
export async function decryptAES(encryptedData: string): Promise<string> {
  try {
    const key = await importAESKey(['decrypt'])

    // Convertir de base64 a ArrayBuffer
    const encryptedBuffer = base64ToArrayBuffer(encryptedData.trim())
    const encryptedArray = new Uint8Array(encryptedBuffer)

    // Extraer IV (primeros 16 bytes) y datos encriptados
    const iv = encryptedArray.slice(0, 16)
    const encrypted = encryptedArray.slice(16)

    // Desencriptar usando AES-CBC
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv
      },
      key,
      encrypted
    )

    // Convertir buffer a string
    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch (error) {
    console.error('Error al desencriptar con AES:', error)
    throw new Error('Error al desencriptar con AES')
  }
}

/**
 * Encripta un objeto JSON usando AES/CBC/PKCS5Padding
 * Wrapper que convierte el objeto a JSON string antes de encriptar
 */
export async function encryptJSON(data: object): Promise<string> {
  const jsonString = JSON.stringify(data)
  return await encryptAES(jsonString)
}

/**
 * Desencripta un JSON string usando AES/CBC/PKCS5Padding y lo convierte a objeto
 * Wrapper que desencripta y luego parsea el JSON
 */
export async function decryptJSON<T = unknown>(
  encryptedData: string
): Promise<T> {
  try {
    const decryptedString = await decryptAES(encryptedData)
    return JSON.parse(decryptedString) as T
  } catch (error) {
    console.error('Error al desencriptar JSON:', error)
    throw new Error('Error al desencriptar JSON')
  }
}

/**
 * Encripta parámetros de URL para peticiones GET
 * Convierte un objeto de parámetros a un string encriptado
 */
export async function encryptURLParams(
  params: Record<string, unknown>
): Promise<string> {
  return await encryptJSON(params)
}

/**
 * Desencripta parámetros de URL
 * Convierte un string encriptado de vuelta a objeto de parámetros
 */
export async function decryptURLParams<T = Record<string, unknown>>(
  encryptedParams: string
): Promise<T> {
  return await decryptJSON<T>(encryptedParams)
}