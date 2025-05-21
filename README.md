# 🚀 User CRUD - Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![SweetAlert](https://img.shields.io/badge/SweetAlert-FF6384?style=for-the-badge&logo=sweetalert&logoColor=white)

Interfaz de usuario para el sistema de gestión de usuarios y posiciones desarrollado como parte del proyecto de Ingeniería de Software II. Esta aplicación implementa un CRUD completo con autenticación basada en roles.

👉 **Repositorio del backend:** [User CRUD Backend](https://github.com/JarolParia/CRUD.git)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Seguridad y Autenticación](#-seguridad-y-autenticación)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Autores](#-autores)

---

## 📝 Descripción

El sistema permite gestionar usuarios y sus posiciones dentro de una empresa a través de una interfaz intuitiva y responsiva. Solo usuarios autenticados con roles de **admin** o **supervisor** pueden acceder al sistema.

⚠️ **Nota importante:** Es necesario tener el backend corriendo previamente para que el frontend funcione correctamente y pueda comunicarse con la API.

---

## 🔐 Funcionalidades Principales

- **Autenticación de Usuarios**
  - Login con validación de roles (admin/supervisor)
  - Persistencia de sesión
  - Rutas protegidas por roles
  - Logout seguro

- **Gestión de Usuarios**
  - Visualización tabulada con paginación
  - Filtros por nombre, correo y posición
  - Creación de nuevos usuarios con validación completa
  - Edición de datos de usuario existente
  - Cambio de estado (activo/inactivo)

- **Gestión de Posiciones**
  - Listado de posiciones disponibles
  - Creación de nuevas posiciones
  - Edición de posiciones existentes
  - Cambio de estado (activo/inactivo)

- **Interfaz Responsiva**
  - Diseño adaptable a móviles y escritorio
  - Feedback visual para todas las operaciones
  - Validación de formularios en tiempo real

---

## 🧰 Tecnologías Utilizadas

- **React** - Biblioteca para construir interfaces de usuario
- **React Router** - Manejo de rutas y navegación
- **Bootstrap** - Framework CSS para diseño responsivo
- **Axios** - Cliente HTTP para realizar peticiones a la API
- **SweetAlert** - Biblioteca para mostrar alertas personalizadas
- **JWT** - Autenticación basada en tokens

---

## 📂 Estructura del Proyecto

```
CRUD_FRONTEND/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── header/             # Barra de navegación principal
│   │   ├── login/              # Componente de inicio de sesión
│   │   ├── positionFormModal/  # Modal para crear/editar posiciones
│   │   ├── routes/             # Componente de rutas protegidas
│   │   ├── showPositions/      # Listado de posiciones
│   │   ├── showUsers/          # Listado de usuarios
│   │   └── UserFormModal/      # Modal para crear/editar usuarios
│   ├── services/
│   │   └── AuthService.js      # Servicios de autenticación
│   ├── App.css                 # Estilos globales
│   ├── App.js                  # Componente principal y rutas
│   ├── functions.js            # Funciones de utilidad
│   ├── index.js                # Punto de entrada de React
│   └── reportWebVitals.js      # Métricas de rendimiento
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

---

## 📦 Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- NPM (v6 o superior)
- Backend del proyecto en ejecución ([Ver repositorio](https://github.com/JarolParia/CRUD.git))

### Pasos

1. **Clonar el repositorio:**

```bash
git clone https://github.com/SamKarsa/user-crud-frontend.git
cd user-crud-frontend
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Iniciar la aplicación en modo desarrollo:**

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`.

4. **Compilar para producción:**

```bash
npm run build
```

---

## 🔒 Seguridad y Autenticación

El sistema implementa las siguientes medidas de seguridad:

- **Tokens JWT**: Almacenados en localStorage para mantener la sesión
- **Interceptores Axios**: Adjuntan automáticamente el token a todas las peticiones
- **Rutas Protegidas**: Verificación de autenticación y roles antes de mostrar contenido
- **Validaciones**: Todos los formularios incluyen validación tanto de cliente como de servidor
- **Retroalimentación**: Alertas y mensajes claros al usuario sobre el estado de las operaciones

---

## 📸 Capturas de Pantalla

### Pantalla de Login
![image](https://github.com/user-attachments/assets/60c741cf-3939-4506-b4f5-873113a07376)
*Interfaz de autenticación con validación de campos y feedback visual*

### Dashboard de Usuarios y Puesto
![image](https://github.com/user-attachments/assets/b29f4615-7893-4d53-8dde-3c11f9b73415)
![image](https://github.com/user-attachments/assets/860e71e4-83c9-4c60-8505-27225d0cec27)
*Tabla de usuarios y puesto con opciones de filtrado y acciones CRUD*

### Modal de creación de Usuario y Puesto
![image](https://github.com/user-attachments/assets/0280dce4-5f6c-45fa-8e34-070ce0bd0516) 
![image](https://github.com/user-attachments/assets/afacd909-43e7-4d72-adb6-b6f80cd4e491)

*Formulario para crear usuarios o puesto con validación en tiempo real*

### Modal de Edición de Usuario y position
![image](https://github.com/user-attachments/assets/c3bcf7ad-b8ff-4690-964f-45ae5bf1ce4b) 
![image](https://github.com/user-attachments/assets/67767ae7-2e49-4bc7-9224-591e54b1abac)

*Formulario para editar información de usuarios y puesto con validación en tiempo real*

---

## 👥 Autores

- [**Samuel López Marín**](https://github.com/SamKarsa)
- [**Jarol Stiben Paria Ramírez**](https://github.com/JarolParia)
- [**Karen Daniela Garzón Morales**](https://github.com/Karencita777)

Todos los desarrolladores participaron activamente en el diseño y desarrollo del **frontend** y **backend** del sistema User CRUD.
