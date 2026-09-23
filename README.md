# Peluquería premium

Prototipo privado de una web de peluquería con portada editorial 16:9, servicios, galería y un recorrido interactivo de reserva.

## Reserva de demostración

La persona elige un servicio, una fecha y un horario, añade nombre y teléfono y ve cómo sería la confirmación. Los horarios son ilustrativos. La web no consulta disponibilidad, no crea citas reales, no envía los datos y no los guarda. Bloquea fechas y horas pasadas. Para activar reservas reales haría falta definir servicios, horarios y conectar un sistema de disponibilidad con aprobación previa.

## Desarrollo

Proyecto Next.js/Vinext preparado para Sites. Requiere Node.js 22.13 o superior y pnpm.

```bash
pnpm install
pnpm dev
```

La portada utiliza imágenes de referencia preparadas para esta peluquería, optimizadas en `public/images/`. Los archivos principales del producto están en `app/page.tsx`, `app/globals.css` y `app/layout.tsx`.

## Despliegue actual

La versión publicada en Sites tiene acceso restringido al propietario. Este repositorio contiene una copia del código; las modificaciones hechas aquí no actualizan automáticamente la web desplegada.
