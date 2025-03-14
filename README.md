# Asistente Telefónico Inteligente

Un asistente telefónico basado en IA que utiliza modelos de lenguaje grandes (LLM) y la API de Twilio para proporcionar servicios telefónicos conversacionales para pequeñas empresas.

## 📋 Descripción

Este proyecto implementa un asistente telefónico inteligente que permite a pequeñas empresas (como restaurantes) ofrecer asistencia automatizada a sus clientes a través de llamadas telefónicas. El sistema:

- Entiende lenguaje natural mediante LLMs
- Procesa llamadas telefónicas con Twilio
- Mantiene el contexto de la conversación
- Proporciona respuestas coherentes y naturales
- Ayuda con información y reservas

Ideal para pequeños negocios que desean mejorar su accesibilidad sin la complejidad de los sistemas IVR tradicionales.

## 🚀 Características

- **Atención 24/7**: Responde a llamadas incluso fuera del horario laboral
- **Comprensión de lenguaje natural**: Entiende consultas en lenguaje conversacional
- **Mantenimiento de contexto**: Recuerda información previa durante la conversación
- **Gestión de reservas**: Puede recopilar información para reservas
- **Implementación sencilla**: Mínima configuración necesaria
- **Integración con sistemas existentes**: Puede conectarse con sistemas de reservas
- **Accesibilidad mejorada**: Especialmente útil para personas mayores o con limitaciones tecnológicas

## 🔧 Tecnologías

- **TypeScript**: Lenguaje principal
- **Hono**: Framework web ligero y rápido
- **OpenAI API**: Modelos de lenguaje
- **Twilio API**: Integración de telefonía
- **Pino**: Sistema de logging

## ⚙️ Requisitos

- Node.js 16.x o superior
- Cuenta de Twilio con un número de teléfono
- Clave API de OpenAI
- Conexión a internet estable

## 📥 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tuusuario/asistente-telefonico.git
cd asistente-telefonico
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

4. Actualiza el archivo `.env` con tus credenciales:
```
# OpenAI API configuration
OPENAI_API_KEY=tu_clave_api_openai
OPENAI_MODEL=gpt-3.5-turbo

# Twilio configuration
TWILIO_ACCOUNT_SID=tu_account_sid_twilio
TWILIO_AUTH_TOKEN=tu_auth_token_twilio
TWILIO_PHONE_NUMBER=tu_numero_telefono_twilio

# Server configuration
PORT=3000
NODE_ENV=development

# Restaurant specific configuration
RESTAURANT_NAME="Tu Restaurante"
RESTAURANT_OPENING_HOURS="12:00 - 22:00"
MAX_RESERVATION_SIZE=10
```

## 🏃‍♂️ Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm run start
```

## 🌐 Configuración de Twilio

1. Accede a tu [Dashboard de Twilio](https://www.twilio.com/console)
2. Configura un webhook para tu número telefónico:
   - URL de webhook: `https://tu-dominio.com/api/incoming-call`
   - Método HTTP: `POST`

## 🔄 Estructura del Proyecto

```
asistente-telefonico/
│
├── src/
│   ├── index.ts              # Punto de entrada principal del servidor
│   ├── config/
│   │   ├── openai.ts         # Configuración del cliente OpenAI
│   │   ├── twilio.ts         # Configuración de Twilio
│   │   └── constants.ts      # Constantes y prompts del sistema
│   │
│   ├── controllers/
│   │   ├── callController.ts # Controlador para manejar llamadas
│   │   ├── reservationController.ts # Controlador para reservas
│   │   └── miscController.ts # Controlador para funciones misceláneas
│   │
│   ├── services/
│   │   ├── openaiService.ts  # Servicios para comunicación con OpenAI
│   │   ├── twilioService.ts  # Servicios para generación de TwiML
│   │   └── stateService.ts   # Gestión del estado de conversación
│   │
│   ├── utils/
│   │   ├── logger.ts         # Utilidades de logging
│   │   └── helpers.ts        # Funciones auxiliares
│   │
│   ├── types/
│   │   └── index.ts          # Definición de tipos TypeScript
│   │
│   └── routes/
│       └── index.ts          # Definición de rutas del servidor
│
├── tests/
│   ├── unit/                 # Tests unitarios
│   └── integration/          # Tests de integración
│
├── docs/                     # Documentación
│
└── public/                   # Archivos estáticos
```

## 📊 Endpoints

### Telefonía
- `POST /api/incoming-call`: Endpoint para llamadas entrantes
- `POST /api/respond`: Endpoint para procesar respuestas del usuario

### Reservas (opcional)
- `POST /api/reservations`: Crear una nueva reserva
- `GET /api/reservations`: Listar reservas existentes

### Sistema
- `GET /api/health`: Verificar el estado del sistema
- `GET /api/stats`: Obtener estadísticas
- `GET /api/config`: Obtener configuración actual
- `GET /api/echo`: Endpoint de prueba para depuración

## 🧪 Testing

### Ejecución de Tests
```bash
npm test
```

### Tests Unitarios
```bash
npm run test:unit
```

### Tests de Integración
```bash
npm run test:integration
```

## 🔍 Monitorización

El sistema cuenta con un endpoint `/api/health` que permite verificar el estado de todos los componentes. Puedes integrarlo con servicios de monitorización como Uptime Robot o Pingdom.

## 📈 Resultados Esperados

Basados en estudios recientes:
- Comprensión de voz: ~90% en condiciones ideales
- Coherencia conversacional: ~80% 
- Precisión de información: ~75%
- Satisfacción del cliente: ~70%

## 🛠️ Personalización

### Prompt del Sistema

Para modificar el comportamiento del asistente, puedes editar el prompt del sistema en `src/config/constants.ts`:

```typescript
export const SYSTEM_PROMPT = `Eres un asistente telefónico para...`;
```

## 📚 Documentación Adicional

Para más información, consulta:
- [Arquitectura del Sistema](docs/architecture.md)
- [API Reference](docs/api.md)
- [Guía de Despliegue](docs/deployment.md)

## 🚧 Limitaciones Conocidas

- No es posible transferir llamadas a operadores humanos (en esta versión)
- El reconocimiento de voz puede tener dificultades en entornos ruidosos
- Limitaciones inherentes a la disponibilidad de los servicios de OpenAI y Twilio

## 🔜 Mejoras Futuras

- Integración con sistemas de CRM
- Soporte para múltiples idiomas
- Análisis de sentimiento
- Transferencia a operadores humanos
- Panel de administración web

