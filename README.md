🎬 Catálogo Audiovisual - Frontend

Aplicación web full-stack desarrollada con React y Vite para la administración y consulta de un catálogo audiovisual (películas, géneros, directores, productoras y tipos). Este cliente web consume una API REST desplegada en la nube y conectada a MongoDB Atlas.

🌐 Enlaces del Despliegue

Frontend en Producción (Vercel): https://frontend-movies-iudigital.vercel.app/

Backend API REST (Render): https://api-movies-iudigital.onrender.com/

🛠️ Tecnologías Utilizadas

React (Biblioteca de interfaz de usuario)

Vite (Entorno de desarrollo y empaquetador)

Axios (Cliente HTTP para consumo de la API REST)

CSS / Estilos modernos (Diseño responsivo de interfaz)

⚙️ Variables de Entorno

Para ejecutar este proyecto de forma local o en producción, crea un archivo .env en la raíz del proyecto tomando como referencia la siguiente variable:

VITE_API_URL=https://frontend-movies-iudigital.vercel.app/


Nota: Si deseas conectarlo a un servidor local en desarrollo, reemplaza el valor por http://localhost:4000

🚀 Instalación y Ejecución Local

Clonar el repositorio:

git clone https://github.com/[tu-usuario]/[nombre-repo-frontend].git
cd [nombre-repo-frontend]


Instalar las dependencias:

npm install


Configurar las variables de entorno:
Crea un archivo .env en la raíz y agrega VITE_API_URL.

Iniciar el servidor de desarrollo:

npm run dev


Compilar para producción:

npm run build

