# 🏫 Campus Market ITL

Proyecto universitario para **compra y venta de artículos entre estudiantes** del Instituto Tecnológico de León.

---

## ⚙️ Configuración rápida

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tuusuario/campusmarket-itl.git
cd campusmarket-itl

#crear un .env donde estan las variables par ala conexion de la bd y agregarle lo siguiente 
# ⚙️ Servidor Express
PORT=3000

# 🗄️ Base de datos Clever Cloud
DB_HOST=bhwtroyehlzdichwfbld-mysql.services.clever-cloud.com
DB_NAME=bhwtroyehlzdichwfbld
DB_USER=u1dtxwgtcxs7hkrl
DB_PASSWORD=qm6A9qITSB5smoybdW1Y
DB_PORT=3306


## Instalar las dependencias para el backend
# Para comprobar la conexion a la bd de clever cloud mysql 
cd backend 
npm install 
npm server.js 

# Intalar dependencias front end 
cd frontend
npm install
npm run dev # correr el front