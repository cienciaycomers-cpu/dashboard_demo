# FM Signal / Paid Media Intelligence

## Estado

Diseño aprobado por el usuario. Define una segunda experiencia visual dentro del mismo proyecto. No autoriza todavía la implementación.

## Objetivo

Crear una experiencia de portfolio inmersiva e innovadora para el dashboard de paid media, preservando la lógica analítica actual y elevando la presentación visual.

## Arquitectura de experiencia

- La versión actual continúa disponible en `/`.
- FM Signal se implementará en `/signal`.
- Una landing inicial permite elegir entre `Classic Dashboard` y `FM Signal`.
- Ambas experiencias comparten dataset, motor de métricas, filtros, alertas y reglas de rentabilidad.
- FM Signal no reemplaza ni modifica la vista operativa actual hasta una aprobación posterior.

## Dirección visual aprobada

- Concepto: Data Cinema.
- Estética: luxury editorial.
- Nombre: FM Signal / Paid Media Intelligence.
- Fondo grafito/negro, marfil, dorado suave y acentos semánticos controlados.
- Tipografía editorial de alto contraste combinada con una sans funcional.
- Métricas protagonistas y gráficos como escenas narrativas.

## Interacción

- Scroll vertical narrativo.
- Parallax sutil, capas de profundidad y transiciones cinematográficas.
- SVG/CSS para gráficos y métricas, sin dependencia de WebGL pesado.
- Responsive completo, con prioridad visual desktop.
- Respeto por `prefers-reduced-motion` y navegación accesible.

## Narrativa de contenido

1. Entrada directa al dashboard, sin portada separada dentro de FM Signal.
2. Primera escena centrada en rentabilidad.
3. ACOS, ROAS, margen de contribución, ACOS de equilibrio y resultado después de pauta como protagonistas.
4. Escena de Adquisición.
5. Escena de Conversión.
6. Cierre con recomendación de inversión y oportunidad de escala.

## Alcance funcional

Se mantienen todos los controles y cálculos actuales: filtro mensual de calendario, comparación contra mismos días transcurridos del mes anterior, filtros por plataforma/campaña/objetivo, métricas de adquisición/conversión/rentabilidad, benchmark ACOS 10%, ACOS de equilibrio, alertas y tratamiento explícito de faltantes.

## Restricciones

- No modificar la fuente original de Drive.
- No exponer marca fuente real ni nombres reales de campañas.
- No mostrar etiquetas visibles de datos sintéticos.
- No alterar la experiencia actual hasta que FM Signal sea revisado y aprobado.
- No agregar runtime fetch externo para esta etapa.

## Criterios de éxito

- `/` sigue funcionando sin regresiones.
- `/signal` presenta una experiencia visual claramente distinta y memorable.
- La lectura de rentabilidad aparece primero y mantiene precisión.
- Los mismos filtros y métricas producen resultados consistentes en ambas vistas.
- La experiencia funciona en desktop y mobile.
- El movimiento aporta jerarquía y contexto, no sólo decoración.
