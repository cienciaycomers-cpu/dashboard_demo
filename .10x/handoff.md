# Handoff

## Handoff History

- Fase 0 -> Strategy: diseno funcional y visual aprobado.
- Fase 1 -> Design: app local, alcance P0/P1 y criterios de exito aprobados.
- Fase 2 -> Planning: arquitectura React + TypeScript + Vite y estandares tecnicos aprobados.
- T1 -> T2: baseline validado con type-check y build.
- T2 -> T3: fixture de datos validada con tres tests.
- T3 -> T4: metricas puras validadas con tres tests.

## Current handoff

SDE completo T5-T8: shell visual, filtros, view models, secciones, alertas y detalle contextual.

## T3/T4 result

- Motor de metricas puro validado.
- Ventanas de comparacion y estados de variacion implementados.
- Alertas de ACOS, gasto sin conversiones, cambios de inversion y faltantes implementadas.
- Suite actual: diez tests pasando.

## T5-T8 result

- Dashboard interactivo implementado en `src/App.tsx` y `src/styles.css`.
- Vista principal con mes actual, selector de meses arriba a la derecha y comparacion contra mismos dias del mes anterior.
- Filtros por plataforma, campana y objetivo.
- Secciones separadas de Adquisicion, Conversion y Rentabilidad.
- ACOS visible en Overview y Conversion; incluye benchmark 10% y break-even dinamico.
- Alertas con severidad y detalle contextual seleccionable.
- Faltantes visibles como `N/D`, sin convertirlos en cero.
- Build, type-check y diez pruebas automatizadas pasan.

## Current constraints

- No modificar la fuente de Drive.
- No incluir marca real, campanas reales ni identificadores.
- Mantener faltantes como `null` o estado explicito.
- Mantener denominadores explicitos para ACOS bruto y margen neto.
- No usar runtime fetch externo.

## Correccion de lectura de ACOS y periodo

- El periodo visible se expresa como mes en curso o mes calendario.
- La comparacion conserva el mismo numero de dias transcurridos del mes anterior.
- ACOS menor al 10% se trata como senal de eficiencia y posible oportunidad de escalar.
- La alerta de oportunidad aparece cuando el ACOS esta debajo del benchmark y la inversion no aumento mas de 10% contra la base comparable.
- La regla fue cubierta con un test automatizado adicional.
