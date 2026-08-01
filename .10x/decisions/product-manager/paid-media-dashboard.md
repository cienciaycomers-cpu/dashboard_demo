# Product decision: paid-media-dashboard

## Problem statement

El usuario necesita una pieza pública de portfolio que permita mostrar, de manera convincente y navegable, cómo analiza inversión publicitaria desde adquisición hasta rentabilidad para un cliente demo de e-commerce.

## Target user

Visitante del portfolio: potencial cliente, colaborador o hiring manager que necesita evaluar rápidamente criterio de paid media, capacidad analítica, diseño de producto y ejecución técnica.

## Recommendation

Construir la primera versión recomendada: Overview del mes actual + selector de meses + filtros globales + detalle contextual por campaña, con tres áreas: adquisición, conversión y rentabilidad.

## User stories

- Como visitante, quiero entender el rendimiento del mes actual sin leer una explicación extensa para evaluar rápidamente el trabajo.
- Como analista, quiero cambiar de mes y filtrar por plataforma, campaña y objetivo para investigar segmentos concretos.
- Como responsable de paid media, quiero comparar ACOS real contra el benchmark de 10% y contra el punto de equilibrio para distinguir eficiencia de rentabilidad.
- Como visitante, quiero ver alertas con severidad y contexto para entender qué requiere atención.
- Como lector cuidadoso, quiero conocer las fórmulas de ACOS, margen y comparación para interpretar correctamente la demo.

## MVP / P0

- Overview del mes actual.
- Selector de meses calendario.
- Filtros de plataforma, campaña y objetivo.
- KPIs de inversión, impresiones, clics, CTR, CPC, conversiones, CPA, ROAS, ACOS, facturación neta y margen.
- Secciones separadas de adquisición, conversión y rentabilidad.
- Variación contra los mismos días transcurridos del mes anterior.
- Alertas de anomalías con tres severidades.
- ACOS objetivo del 10% y ACOS de equilibrio dinámico.
- Diseño oscuro premium, responsive y público.

## P1

- Panel contextual por campaña o alerta.
- Tooltips de fórmulas.
- Comparación Google vs. Meta.
- Tabla ordenable por campaña.
- Explicación breve de facturación neta y costos variables.

## P2 / fuera de la primera entrega

- Conectores reales de Google Ads y Meta Ads.
- Autenticación y permisos.
- Exportación de reportes.
- Simulador de presupuesto.
- Vista multi-cliente.

## Success criteria

- El visitante identifica el estado del mes actual en menos de un minuto.
- Puede cambiar de mes y aplicar filtros sin inconsistencias.
- Puede explicar qué significa un ACOS de 10% y cómo se diferencia del equilibrio.
- Puede localizar al menos una campaña con alerta y abrir su detalle.
- La experiencia funciona en desktop y mantiene legibilidad en viewport menor.

## Riesgos de producto

- Demasiadas métricas pueden competir por atención. Mitigación: jerarquía P0, secciones y detalle bajo demanda.
- La rentabilidad modelada puede parecer exacta. Mitigación: mostrar definiciones y supuestos sin convertirlos en claims de un cliente real.
- El mes actual parcial puede inducir comparaciones injustas. Mitigación: usar los mismos días transcurridos del mes anterior.

## Scope boundary

La primera versión demuestra análisis y producto; no pretende sustituir una plataforma de reporting conectada ni ejecutar decisiones sobre campañas.
