# Diseño aprobado para revisión: dashboard paid media Faithis

## 1. Propósito

Crear una app web pública de portfolio que demuestre criterio de paid media, análisis de datos, diseño de producto y lectura de rentabilidad para un cliente demo de e-commerce.

La app no será un panel operativo conectado en tiempo real. Será una experiencia navegable con una base de datos de demostración estructurada a partir de un reporte de referencia, sin exponer la marca original ni los nombres reales de campañas.

## 2. Usuario y decisiones

El usuario principal es el profesional de paid media que presenta su trabajo. La experiencia debe permitir responder rápidamente:

- cuánto se invirtió;
- qué volumen de impresiones y clics se obtuvo;
- cuántas conversiones se generaron;
- cuánto costó cada conversión;
- cuánto facturó la pauta;
- si el ACOS está dentro del benchmark del 10%;
- si la inversión está por debajo o por encima del punto de equilibrio;
- qué plataforma o campaña requiere atención.

## 3. Contexto de negocio

- Cliente demo: Faithis.
- URL de referencia: https://faithis-n6pc.vercel.app/
- Vertical: e-commerce.
- Mercado: Argentina.
- Moneda: ARS.
- Plataformas: Google Ads y Meta Ads.
- Sin autenticación para la demo pública.

## 4. Datos y anonimización

La fuente de referencia en Drive es un archivo Excel. Se considera de solo lectura y no se modificará.

Se usarán los 90 días disponibles como benchmark de estructura y comportamiento. Se extenderá el período a 12 meses mediante datos modelados a partir de ese benchmark para que el producto pueda mostrar selección mensual, comparación interperíodo y anomalías. La interfaz se presentará como un caso de cliente demo y no incorporará una etiqueta visible de “datos sintéticos”.

La capa de datos deberá reemplazar:

- nombre de marca original;
- nombres reales de campañas;
- cualquier identificador que permita reconstruir la fuente.

La nomenclatura deberá usar nombres demo coherentes con plataforma, etapa y objetivo, por ejemplo `Google | Prospecting | Shopping 01` o `Meta | Remarketing | Conversion 02`.

## 5. Navegación temporal y filtros

- Estado inicial: mes actual.
- Selector: meses calendario en la parte superior derecha.
- Filtros: plataforma, campaña y objetivo.
- Todos los filtros actualizan KPIs, gráficos, tablas y alertas.
- Comparación principal: mismos días transcurridos del mes anterior.
- Los períodos parciales deben indicarse en el contexto del período, sin compararlos contra un mes completo.

## 6. Taxonomía del funnel

### Adquisición

Awareness, alcance, tráfico y prospecting.

Métricas: inversión, impresiones, clics, CTR y CPC.

### Conversión

Ventas, compras y remarketing.

Métricas: conversiones, CPA, facturación bruta, ACOS y facturación por campaña.

### Rentabilidad

Evaluación económica de la pauta.

Métricas: facturación neta, margen de contribución, costo publicitario, margen después de pauta, ACOS de equilibrio y retorno sobre margen.

## 7. Métricas y fórmulas

### Adquisición

- CTR = clics / impresiones × 100.
- CPC = inversión / clics.

### Conversión

- CPA = inversión / conversiones.
- Tasa de conversión = conversiones / clics × 100.
- ACOS = inversión / facturación bruta atribuida × 100.
- ACOS objetivo = 10%.

### Rentabilidad

- Facturación neta = facturación bruta menos descuentos, devoluciones y cancelaciones modeladas.
- Margen de contribución antes de pauta = facturación neta menos costos variables no publicitarios.
- Margen después de pauta = margen de contribución antes de pauta menos inversión.
- ACOS de equilibrio = margen de contribución antes de pauta / facturación bruta × 100, siempre que la base de ingresos sea comparable y esté documentada.

El ACOS objetivo del 10% es un benchmark operativo. No debe confundirse automáticamente con el ACOS de equilibrio, que depende del margen del negocio.

## 8. Estructura de interfaz

### Barra superior

- nombre del dashboard;
- contexto Faithis;
- selector de mes en la esquina superior derecha;
- filtros de plataforma, campaña y objetivo;
- estado del período seleccionado.

### Overview

Cards de inversión, facturación bruta, ACOS, ROAS, facturación neta y margen de contribución. Cada card incluye valor, variación contra el período comparable y estado.

La tendencia principal muestra gasto, facturación bruta y ACOS con referencia visual al objetivo de 10%. Evitar escalas que exageren diferencias o gráficos de doble eje engañosos.

### Adquisición

- serie temporal de impresiones, clics, CTR y CPC;
- comparación Google Ads vs. Meta Ads;
- tabla de campañas con inversión, impresiones, clics, CTR y CPC.

### Conversión

- conversiones y CPA por plataforma;
- facturación bruta atribuida por campaña;
- ACOS real contra benchmark de 10%;
- tabla ordenable por conversiones, CPA, facturación y ACOS.

### Rentabilidad

- facturación neta;
- margen de contribución antes de pauta;
- inversión publicitaria;
- margen después de pauta;
- ACOS real, objetivo y de equilibrio.

### Panel contextual

Al seleccionar una campaña o alerta, mostrar evolución temporal, comparación, contribución a resultados y métricas relacionadas sin abandonar el Overview.

## 9. Alertas

Sistema híbrido:

- reglas fijas: gasto sin conversiones, ACOS crítico, datos faltantes o período incompleto;
- comparación contra los mismos días del mes anterior;
- desvíos contra el comportamiento histórico disponible.

Severidades:

- informativa;
- advertencia;
- crítica.

Toda alerta debe incluir métrica, período, segmento afectado y motivo. No afirmar una causa causal si solo existe una anomalía estadística.

## 10. Dirección visual

- fondo grafito casi negro;
- tarjetas gris carbón;
- tipografía sans serif limpia;
- acento marfil o verde suave;
- adquisición en azul;
- conversión en violeta;
- rentabilidad en verde;
- advertencia en ámbar y crítica en rojo;
- bordes finos, sombras suaves y espacio negativo.

El color no será el único indicador: cada estado debe incluir texto, icono o etiqueta.

## 11. Criterios de aceptación funcional

- El estado inicial corresponde al mes actual.
- El selector de meses cambia toda la información visible.
- Los filtros se aplican de forma consistente a KPIs, gráficos, tablas y alertas.
- El ACOS aparece en Overview y Conversión.
- El benchmark del ACOS es 10% y se ve separado del ACOS de equilibrio.
- El punto de equilibrio se calcula con la fórmula definida y se explica en tooltip o metodología.
- La comparación utiliza los mismos días transcurridos del mes anterior.
- Las campañas y marcas visibles son demo, no las de la fuente original.
- Los datos faltantes no se presentan como ceros ni como hechos confirmados.
- La app es usable en desktop y responsive en pantallas menores.

## 12. Fuera de alcance de esta especificación

- conexión en tiempo real con Google Ads o Meta Ads;
- login, roles o permisos;
- edición de campañas;
- publicación automática;
- exportación de reportes;
- decisiones de presupuesto ejecutadas desde la app.

## Estado

Diseño funcional y visual aprobado durante brainstorming. Strategy también fue aprobada; la implementación continúa bloqueada hasta completar Design, Planning y sus checkpoints de estado.
