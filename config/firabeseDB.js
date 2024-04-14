
import dotenv from 'dotenv'; // Importar la librería dotenv para cargar variables de entorno desde un archivo .env

dotenv.config(); // Cargar variables de entorno desde el archivo .env

// Configuración de las credenciales utilizando variables de entorno
export const serviceAccount = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Ajuste para manejar saltos de línea en la clave privada
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
};

// Inicialización de Firebase Admin SDK



