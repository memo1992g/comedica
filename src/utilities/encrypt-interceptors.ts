import { decryptJSON, encryptJSON } from "./crypto";
// encrypt-interceptors.ts
const ENCRYPT = !!process.env.AES_KEY_BASE64;
/**
 * Encripta el body de la petición si la petición no es GET y tiene un body
 * @param options - Opciones de la petición
 * @returns { Promise<RequestInit> } - Opciones de la petición con el body encriptado
 */
async function encryptRequestBody(options: RequestInit): Promise<RequestInit> {
  if (!ENCRYPT) return options;
  // Solo encriptar el body si la petición no es GET y tiene un body
  if (options.method !== 'GET' && options.body) {
    try {
      // Parseo del body si es un string
      const bodyData = typeof options.body === 'string'
        ? JSON.parse(options.body)
        : options.body;

      // Encriptación de los datos del body
      const encryptedData = await encryptJSON(bodyData);

      // Se reemplaza el body con los datos encriptados como JSON string
      return {
        ...options,
        body: JSON.stringify({
          data: encryptedData
        }),
        headers: {
          ...options.headers,
          'Content-Type': 'application/json'
        }
      };
    } catch (error) {
      console.error('Error en la encriptación de la petición:', error);
      throw new Error('Error al encriptar la petición');
    }
  }
  return options;
}

/**
 * Desencripta el body de la respuesta si la respuesta tiene datos encriptados
 * @param response - Respuesta de la petición
 * @returns { Promise<any> } - Datos desencriptados
 */
async function responseInterceptor(response: Response): Promise<any> {
  if (!response.ok) {
    const errorData = await response.json();
    return Promise.reject(new Error(errorData.message));
  }

  try {
    const responseData = await response.json();

    // Solo desencriptar si la respuesta tiene datos encriptados (viene como string)
    if (responseData && typeof responseData.data === 'string') {
      console.log(`encrypted response data: ${responseData.data}`);
      try {
        const decryptedData = await decryptJSON(responseData.data);
        return decryptedData;
      } catch (decryptError) {
        console.error('Error al desencriptar la respuesta:', decryptError);
        return responseData;
      }
    }

    return responseData;
  } catch (error) {
    console.error('Error al procesar la respuesta:', error);
    return Promise.reject(new Error('Error al procesar la respuesta'));
  }
}

export { encryptRequestBody, responseInterceptor };

