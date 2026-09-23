# [Peluquería premium](https://guillesrl.github.io/peluqueria-premium/)

Web pública de demostración para una peluquería, con portada editorial 16:9, servicios, galería y un recorrido interactivo de reserva.

## Reserva de demostración

La persona elige un servicio, una fecha y un horario, añade nombre y teléfono y ve cómo sería la confirmación. Los horarios son ilustrativos. La web no consulta disponibilidad, no crea citas reales, no envía los datos y no los guarda. Bloquea fechas y horas pasadas. Para activar reservas reales haría falta definir servicios, horarios y conectar un sistema de disponibilidad con aprobación previa.

## Desarrollo local

Proyecto Next.js/Vinext. Requiere Node.js 22.13 o superior y pnpm.

```bash
pnpm install
pnpm dev
```

La portada utiliza imágenes de referencia preparadas para esta peluquería, optimizadas en `public/images/`. Los archivos principales del producto están en `app/page.tsx`, `app/globals.css` y `app/layout.tsx`.

## Despliegue

Cada cambio en `main` compila la versión estática y la publica automáticamente en GitHub Pages.
