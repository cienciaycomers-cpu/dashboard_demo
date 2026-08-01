# Estado del proyecto

## Proyecto

Dashboard web de seguimiento de paid media para el cliente demo Faithis.

## Fase actual

Fase 4 - Implementation in progress.

## Task progress

- T1 baseline y toolchain - completado y verificado.
- T2 contrato y fixture segura de datos - completado y verificado.
- T3 motor de metricas - completado y verificado.
- T4 comparacion y anomalias - completado y verificado.
- T5 shell visual - completado y verificado.
- T6 estado y view models - completado y verificado.
- T7 secciones del dashboard - completado y verificado.
- T8 detalle contextual y alertas - completado y verificado.
- T9 responsive y accesibilidad - en revision.
- T10 verificacion y portfolio readiness - pendiente.

## Proyecto paralelo: FM Signal

- Fase 0 - Brainstorming y diseño inicial: completado y aprobado.
- Fase 1 - Estrategia: pendiente.
- Fase 2 - Arquitectura visual y técnica: pendiente.
- Fase 3 - Plan de implementación: pendiente.
- Fase 4 - Implementación: bloqueada hasta completar estrategia, arquitectura y planificación.

## Decisiones aprobadas

- Nueva experiencia en `/signal` dentro del mismo proyecto.
- Landing inicial para elegir `Classic Dashboard` o `FM Signal`.
- Dirección Data Cinema + luxury editorial.
- Scroll vertical narrativo con interacción experimental.
- Responsive completo, con prioridad visual desktop.
- Híbrido SVG/CSS con profundidad y parallax controlado.
- Primera escena enfocada en rentabilidad.
- Nombre de producto: FM Signal / Paid Media Intelligence.

## Ultima correccion

- El contexto de fechas comunica mes en curso o mes calendario, no una ventana movil de 30 dias.
- La comparacion mantiene los mismos dias transcurridos del mes anterior.
- ACOS menor al benchmark se interpreta como mayor eficiencia.
- Se agrega alerta de oportunidad de escalar inversion cuando el ACOS esta debajo del objetivo y el gasto no crece al mismo ritmo.

## Restricciones

- No mostrar etiquetas visibles de datos sinteticos.
- No usar el nombre real de la marca fuente ni nombres reales de campanas.
- No modificar la fuente original de Drive.
- No usar runtime fetch externo.
- No convertir faltantes en ceros.

## Riesgos activos

- npm audit reporto tres vulnerabilidades en dependencias instaladas; no se aplico una actualizacion forzada.
- La fuente Drive es un archivo Excel; el fixture usa su estructura aprobada sin copiar identificadores ni exponer valores sensibles.

## Estado de commit

No se pudo crear el commit de estado porque esta carpeta no esta dentro de un repositorio Git operativo.
