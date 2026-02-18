# 🔌 GUÍA DE INTEGRACIÓN CON BACKEND JAVA

## 📋 Resumen

Este proyecto está **100% preparado** para conectarse con un backend Java Spring Boot. Los mocks actuales replican exactamente la estructura que debe tener el backend real.

---

## 🎯 Pasos para Conectar con Java

### 1️⃣ Configurar URL del Backend

Editar el archivo: `/src/lib/api/api-client.ts`

```typescript
// DESARROLLO (Mock)
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' }
});

// PRODUCCIÓN (Java Backend)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});
```

### 2️⃣ Variables de Entorno

Crear archivo `.env.local`:

```bash
# Backend Java URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# O para producción
NEXT_PUBLIC_API_URL=https://api.comedica.com/api
```

---

## 📡 Endpoints que el Backend Java Debe Implementar

### 🔐 Autenticación (`auth-routes.js`)

```java
// Spring Boot Controller Example
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Implementar lógica
        return ResponseEntity.ok(new LoginResponse(user, token));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    @PostMapping("/first-password-change")
    public ResponseEntity<?> firstPasswordChange(@RequestBody PasswordChangeRequest request) {
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request) {
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    @GetMapping("/session")
    public ResponseEntity<?> getSession(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(Map.of("success", true, "user", user));
    }
}
```

### ⚙️ Parámetros (`parameters-routes.js`)

**Límites y Montos:**
- `GET /api/parameters/limits/general`
- `PUT /api/parameters/limits/general`
- `GET /api/parameters/limits/users`
- `PUT /api/parameters/limits/users/:userId`
- `DELETE /api/parameters/limits/users/:userId`

**Configuraciones de Seguridad:**
- `GET /api/parameters/security`
- `PUT /api/parameters/security`

**Red Transfer365:**
- `GET /api/parameters/transfer365/local`
- `POST /api/parameters/transfer365/local`
- `PUT /api/parameters/transfer365/local/:id`
- `DELETE /api/parameters/transfer365/local/:id`
- `GET /api/parameters/transfer365/card`
- `POST /api/parameters/transfer365/card`
- `PUT /api/parameters/transfer365/card/:id`
- `DELETE /api/parameters/transfer365/card/:id`

**Auditoría:**
- `GET /api/parameters/audit`
- `GET /api/parameters/audit/recent`

### 🔧 Mantenimiento (`maintenance-routes.js`)

**Atención y Soporte:**
- `GET /api/maintenance/support-reasons`
- `POST /api/maintenance/support-reasons`
- `PUT /api/maintenance/support-reasons/:id`
- `DELETE /api/maintenance/support-reasons/:id`

**Cuestionario de Seguridad:**
- `GET /api/maintenance/security-questions`
- `POST /api/maintenance/security-questions`
- `PUT /api/maintenance/security-questions/:id`
- `DELETE /api/maintenance/security-questions/:id`

**Imágenes:**
- `GET /api/maintenance/security-images`
- `POST /api/maintenance/security-images` (multipart/form-data)
- `DELETE /api/maintenance/security-images/:id`

**Catálogo de Productos:**
- `GET /api/maintenance/product-catalog`
- `POST /api/maintenance/product-catalog`
- `PUT /api/maintenance/product-catalog/:id`
- `DELETE /api/maintenance/product-catalog/:id`

**Auditoría:**
- `GET /api/maintenance/audit`

---

## 🏗️ Estructura de Respuestas

Todas las respuestas siguen el mismo formato:

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa" // Opcional
}

// Error Response
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}

// Paginated Response
{
  "success": true,
  "data": {
    "data": [ ... ],  // Array de registros
    "total": 100      // Total de registros
  }
}
```

---

## 🔒 Autenticación

El frontend envía el token JWT en el header:

```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

**Java Spring Boot Example:**

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String header = request.getHeader("Authorization");
        
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            // Validar token
            // Setear SecurityContext
        }
        
        filterChain.doFilter(request, response);
    }
}
```

---

## 📦 Modelos de Datos (Entities)

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String role;
    private String associateNumber;
    private String dui;
    private String phone;
    
    @Column(name = "requires_password_change")
    private Boolean requiresPasswordChange;
    
    private String status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "last_password_change")
    private LocalDateTime lastPasswordChange;
}
```

### TransactionLimits Entity
```java
@Entity
@Table(name = "transaction_limits")
public class TransactionLimits {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String category; // 'canales_electronicos', etc.
    private BigDecimal maxPerTransaction;
    private BigDecimal maxDaily;
    private BigDecimal maxMonthly;
    private Integer maxMonthlyTransactions;
    
    private LocalDateTime updatedAt;
    private String updatedBy;
}
```

### UserLimits Entity
```java
@Entity
@Table(name = "user_limits")
public class UserLimits {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private String userId;
    
    private String userName;
    
    @Column(name = "limit_type")
    private String limitType; // 'general' or 'personalizado'
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<CustomLimit> limits;
    
    private LocalDateTime lastUpdate;
}
```

---

## 🚀 Deployment

### Configuración de Producción

**Frontend (Next.js):**
```bash
# Build
npm run build

# Start
npm start

# O con PM2
pm2 start npm --name "comedica-frontend" -- start
```

**Backend (Java Spring Boot):**
```bash
# Build
mvn clean package

# Run
java -jar target/comedica-backend.jar

# O con Docker
docker build -t comedica-backend .
docker run -p 8080:8080 comedica-backend
```

### CORS Configuration (Java)

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000", "https://backoffice.comedica.com")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

---

## 📝 Checklist de Integración

- [ ] Configurar `NEXT_PUBLIC_API_URL` en `.env.local`
- [ ] Implementar endpoints de autenticación en Java
- [ ] Implementar endpoints de parámetros en Java
- [ ] Implementar endpoints de mantenimiento en Java
- [ ] Configurar CORS en Java
- [ ] Implementar JWT authentication
- [ ] Crear entidades JPA
- [ ] Crear repositorios Spring Data
- [ ] Crear servicios de negocio
- [ ] Implementar manejo de errores
- [ ] Agregar validaciones
- [ ] Configurar base de datos (PostgreSQL/MySQL)
- [ ] Ejecutar migraciones
- [ ] Probar integración end-to-end
- [ ] Deploy a producción

---

## 🔍 Testing

**Frontend:**
```bash
# Con mock server
npm run mock  # Terminal 1
npm run dev   # Terminal 2

# Con backend Java
# (No iniciar mock server)
npm run dev
```

**Backend Java:**
```bash
# Unit tests
mvn test

# Integration tests
mvn verify
```

---

## 📞 Soporte

Para dudas sobre la integración:
1. Revisar los archivos de rutas mock (`*-routes.js`)
2. Revisar los servicios TypeScript (`*.service.ts`)
3. Verificar estructura de respuestas en el código mock
4. Consultar esta documentación

---

## ✅ Estado Actual

- ✅ **Mock Completo:** Todos los endpoints funcionan
- ✅ **Interfaces TypeScript:** Definidas y documentadas
- ✅ **Servicios:** Listos para consumir API real
- ✅ **Componentes:** Funcionando con mock
- ✅ **Estructura de Datos:** Documentada
- ⏳ **Backend Java:** Pendiente de implementación

---

**¡El frontend está 100% listo para conectarse con Java!** 🎉
