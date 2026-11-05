# Conectar las reseñas en tiempo real

La página `servicios.html` ya incluye el formulario, la lectura de reseñas aprobadas y la suscripción a cambios en tiempo real. Para activarlos hace falta un proyecto Supabase de TECNOSHIELD.

1. Crea un proyecto en Supabase y abre **SQL Editor**.
2. Copia y ejecuta el contenido de `supabase-reviews.sql`.
3. En la configuración API del proyecto, copia la **Project URL** y la clave pública **anon/publishable**. No uses ni publiques la `service_role` key.
4. Pega esos dos valores en las constantes `SUPABASE_URL` y `SUPABASE_ANON_KEY` al final de `servicios.html`, reemplazando los textos `PEGA_AQUI...`.
5. Publica juntos `index.html`, `servicios.html`, la carpeta `assets` y los archivos de configuración. El formulario se habilita cuando detecta valores configurados.
6. Revisa cada envío en la tabla `website_reviews` de Supabase. Cambia `status` de `pending` a `approved` para que aparezca en la página; la lista se actualiza en tiempo real. Elimina los envíos que deban rechazarse.

La política permite que visitantes anónimos envíen reseñas pendientes y que cualquiera lea únicamente reseñas aprobadas. La moderación evita que un envío aparezca públicamente antes de revisarlo.
