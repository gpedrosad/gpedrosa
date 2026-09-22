---
name: marketing
description: >-
  Mantiene la landing de captación (Meta Ads → lead magnet) y el esquema de
  markdown en /esquema. Usar al trabajar la landing, /captacion, el esquema,
  los nodos, el lead magnet, Meta Ads, o marketing.md.
---

# Marketing

Mapa: `marketing.md` en la raíz del repo.
Los flujos publicados viven en Supabase, proyecto KaWa (`dkpihigjlifjvxiszkew`), tabla `gpedrosa_flujos`. Una fila por flujo: `titulo`, `texto` (formato plano) y `esquema` (grafo). El editor `/esquema` lee y escribe esa tabla. El contrato para leer, crear y reemplazar flujos es `marketing/FORMATO_FLUJO.md`, servido en `GET /api/esquema/formato`. Para escribir un flujo: `POST /api/esquema/flujos` solo con `{"titulo"}` y después `PUT /api/esquema/flujos/{id}` con `Content-Type: text/plain` y el texto plano en el cuerpo. Ese PUT reemplaza solo ese id.
Los archivos `marketing/esquema.json` y `marketing/nodos/` solo siembran la primera fila si la tabla está vacía.
Editor: `/esquema`. Landing: `src/app/captacion/page.tsx`.

Cada flujo sirve para crear un anuncio coherente con una landing. El anuncio promete lo que la landing continúa. Los mensajes de la landing se escriben por componente, en este orden: Hero (headline, subheadline, visual, CTA) → Problema → Beneficios → Qué recibes → Autoridad → CTA final → Footer. No juntes la landing en un solo texto.

Al editar desde el front, guardar el nodo en Supabase. No reescribir `marketing.md` salvo que el usuario cambie el mapa.

Los nombres y las uniones del flujo se crean en `/esquema`. No armes nodos ni copy que el usuario no haya pedido. Al unir dos nodos aparece entre ellos un nodo criterio, de otro color. El texto de ese criterio lo escribe el usuario. No agregues nodos, criterios ni uniones que el usuario no haya pedido.

En `/esquema`, «Qué incluir» lista las piezas del nodo (si es landing, los campos de ese componente). «Generar» escribe el mensaje de ese nodo —anuncio o componente— con el título y los criterios hacia atrás como contexto, de modo que siga siendo coherente con el anuncio y con la landing. El criterio no se genera solo.

## Criterios previos

Antes de escribir el anuncio o la landing, aplicar los criterios de `marketing.md` en «Criterios previos entre landing y ad». No rellenarlos con copy inventado. El texto de cada criterio se mantiene literal.

## Reglas

- No inventar copy. Si un campo de `marketing.md` está vacío, la landing muestra el nombre del bloque, sin texto de relleno.
- Al recibir contenido, escribirlo primero en `marketing.md` y después reflejarlo en la página.
- Orden fijo: Hero → Problema → Beneficios → Qué recibes → Autoridad → CTA → Footer.
- No agregar bloques, claims, credenciales ni disclaimers que no estén en `marketing.md`.
- Privacidad y términos apuntan a `/privacidad` y `/terminos` salvo que `marketing.md` diga otra cosa.
- El disclaimer del footer solo se muestra cuando ese campo tiene texto.

## Cómo rellenar

1. Actualizar el campo correspondiente en `marketing.md`.
2. Pasar ese texto al slot del mismo nombre en `src/app/captacion/page.tsx`.
3. Dejar vacíos los campos que el usuario todavía no definió.
