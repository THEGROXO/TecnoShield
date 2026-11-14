# TecnoShield ERP

Sitio público y panel administrativo en español para operar TecnoShield en Perú. La aplicación conserva el sitio estático y agrega funciones serverless de Vercel con Supabase como almacenamiento privado. Moneda de operación: PEN (S/). La cuenta administrativa única es `ADMIN`.

## Módulos

- Resumen y reportes mensuales financieros y operativos.
- Consultas de la web, clientes y catálogo de servicios.
- Órdenes de servicio, diagnósticos, inventario y movimientos de stock.
- Cotizaciones con tasa IGV ajustable y vista de impresión para guardar como PDF.
- Ingresos, gastos, sesiones de caja y garantías.
- Registro de cambios administrativos.
- Exportación JSON manual, respaldo diario, retención de 90 días, verificación SHA-256 y restauración transaccional con copia previa.

## Requisitos y configuración

Node.js 20 o posterior, una cuenta/proyecto Supabase y un proyecto Vercel.

1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env.local` y completa las variables localmente.
3. Ejecuta `npm run hash-password` para crear el hash bcrypt de la contraseña de `ADMIN`. No guardes la contraseña en el repositorio.
4. En un proyecto Supabase nuevo, ejecuta `supabase/schema.sql` y luego `supabase/migrations/20261114_erp.sql`. Para la base de datos existente, ejecuta solo la migración ERP después de revisar y aprobar su contenido.
5. Ejecuta `npm run dev` para abrir el sitio y el panel en local.

**La migración no se aplica automáticamente.** Antes de ejecutarla en producción, revisa el archivo de migración y confirma su aplicación. Las claves privadas de Supabase solo se configuran en el servidor Vercel o `.env.local`; nunca en archivos públicos.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `ADMIN_USERNAME` | Usuario de acceso; debe ser `ADMIN`. |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt generado por `npm run hash-password`. |
| `ADMIN_SESSION_SECRET` | Secreto aleatorio de al menos 32 caracteres para firmar sesiones. |
| `SUPABASE_URL` | URL del proyecto Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave privada usada exclusivamente por las funciones de servidor. |
| `CRON_SECRET` | Secreto para autorizar la función de respaldo programado de Vercel. |

En Vercel, configura todas las variables en **Project Settings → Environment Variables** para los entornos correspondientes. `CRON_SECRET` debe configurarse en producción para que Vercel envíe el token al cron.

## Uso y respaldos

- Accede al panel en `/admin`.
- Configura la tasa de IGV (por defecto 18 %) y si los precios incluyen IGV desde Configuración. Las cotizaciones separan subtotal, impuesto y total; el navegador permite imprimir y guardar el documento como PDF.
- Un cron de Vercel invoca `GET /api/cron/backup` diariamente a las 12:00 UTC. La función requiere `Authorization: Bearer <CRON_SECRET>` y elimina respaldos anteriores a 90 días.
- En Respaldos, crea una copia manual y descarga el archivo JSON. La restauración comprueba su formato e integridad, guarda antes el estado actual y llama una función SQL transaccional.
- Conserva exportaciones fuera del mismo proyecto Supabase para tener una copia independiente.

## Seguridad

- Contraseña validada con bcrypt; sesión firmada en cookie `HttpOnly`, `SameSite=Strict` y `Secure` en producción, con vigencia de ocho horas.
- Límite de intentos fallidos compartido mediante la tabla de Supabase tras instalar la migración, con protección local por instancia como respaldo.
- RLS activado y permisos revocados a `anon` y `authenticated` para las tablas privadas. La aplicación accede usando la clave `service_role` exclusivamente en servidor.
- Funciones administrativas requieren sesión; operaciones de escritura filtran campos permitidos y validan formato y longitud.
- Cabeceras HTTP de seguridad definidas en `vercel.json`.

## Desarrollo y despliegue

- `npm run dev`: Vercel local.
- `npm test`: pruebas de sesión y lectura de cookies.
- `npm run check`: comprobación sintáctica de JavaScript.
- Despliegue: importa el repositorio en Vercel con preset **Other**, raíz `./`; conserva el build/output predeterminado y configura las variables de entorno.

Las migraciones se mantienen en `supabase/migrations/` y se aplican manualmente. No hay credenciales reales guardadas en este repositorio.
