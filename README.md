# Ecommerce Backend

## 📋 Descripción
Backend de un ecommerce desarrollado con Node.js y Express, utilizando PostgreSQL como base de datos principal y Prisma como ORM.

## 🛠 Stack Tecnológico
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Base de Datos**: PostgreSQL 14+
- **ORM**: Prisma
- **Autenticación**: JWT
- **Validaciones**: Zod
- **Encriptación**: Bcrypt

## 🗄 Base de Datos

### Modelos
```prisma
model User {
  id        Int        @id @default(autoincrement())
  user      String     @unique
  email     String     @unique
  password  String
  nickname  String?
  purchases Purchase[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Purchase {
  id        Int      @id @default(autoincrement())
  date      DateTime @default(now())
  products  Json
  total     Float
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Relaciones
```mermaid
erDiagram
    User ||--o{ Purchase : "tiene"
    User {
        int id
        string user
        string email
        string password
        string? nickname
        datetime createdAt
        datetime updatedAt
    }
    Purchase {
        int id
        datetime date
        json products
        float total
        int userId
        datetime createdAt
        datetime updatedAt
    }
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd ecommerceRefactor/backend
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

3. **Instalar dependencias**
```bash
npm install
```

4. **Configurar la base de datos**
```bash
# Crear base de datos
createdb ecommerce_db

# Ejecutar migraciones
npx prisma migrate dev
```

5. **Iniciar el servidor**
```bash
npm run dev
```

El servidor estará disponible en: http://localhost:3001

## 📁 Estructura del Proyecto
```
backend/
├── controllers/    # Controladores de la aplicación
├── routes/        # Definición de rutas
├── prisma/        # Configuración y esquema de Prisma
│   └── schema.prisma
└── server.js      # Punto de entrada de la aplicación
```

## 🔧 Comandos Útiles

### Prisma
```bash
# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
npx prisma migrate deploy

# Generar cliente Prisma
npx prisma generate

# Ver estado de la BD
npx prisma db pull

# Abrir Prisma Studio
npx prisma studio
```

## 🔐 Seguridad y Validaciones

### Validaciones con Zod
```typescript
const userSchema = z.object({
  user: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});
```

### Constraints de Base de Datos
- Campos únicos: email y user
- Integridad referencial: Compras vinculadas a usuarios
- Campos requeridos: password
- Campos opcionales: nickname

## 📝 Notas Adicionales
- El backend implementa autenticación JWT
- Las contraseñas se encriptan con bcrypt
- Se utiliza Zod para validación de datos
- Las relaciones entre modelos están manejadas por Prisma
