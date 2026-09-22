# Contrato de flujos

Leé este documento y seguí los pasos de «Cómo accionar». No infieras otro formato ni otra API.

Un flujo es un anuncio coherente con una landing. El anuncio promete. Cada mensaje de la landing continúa esa promesa. La landing no es un solo paso: es un paso por componente, en este orden.

1. Anuncio
2. Hero (headline, subheadline, visual, CTA)
3. Problema
4. Beneficios
5. Qué recibes
6. Autoridad
7. CTA final
8. Footer

Entre dos pasos va una conexión. El criterio de esa conexión dice qué tiene que cumplir el paso de destino respecto del de origen. Los criterios entre anuncio y landing tienen que poder cubrir, cuando corresponda: seguir el anuncio, el nivel de conciencia, la motivación, las preguntas importantes, la fricción y el camino a la conversión.

No inventes ofertas, hechos ni credenciales que no estén ya en el flujo que leíste.

Cada flujo es una fila aparte. Crear o importar uno no modifica a los demás. Reemplazar solo toca el `id` que indiques.

## Cómo accionar

Base: `{ORIGEN}`

1. Listá los flujos.

`GET {ORIGEN}/api/esquema/flujos`

Respuesta: `{"flujos":[{"id":"esquema","titulo":"Esquema","updated_at":"..."}]}`

2. Leé uno en texto plano. La respuesta es el flujo, no JSON.

`GET {ORIGEN}/api/esquema/flujos/{id}`

3. Creá un flujo en dos llamadas. La primera solo pide el nombre. La segunda manda el texto plano tal cual, sin envolverlo en JSON.

`POST {ORIGEN}/api/esquema/flujos`
`Content-Type: application/json`

```json
{"titulo":"Nombre del flujo"}
```

Respuesta: `{"id":"nombre-del-flujo","titulo":"Nombre del flujo","url":"/esquema?flujo=nombre-del-flujo"}`

`PUT {ORIGEN}/api/esquema/flujos/{id}`
`Content-Type: text/plain; charset=utf-8`

El cuerpo es el flujo completo, empezando por `# FLUJO EN TEXTO PLANO`.

Respuesta: `{"id":"...","url":"/esquema?flujo/..."}`

4. Para cambiar un flujo que ya existe, repetí el `PUT` del paso 3 sobre ese `id`. El `PUT` sustituye todos los pasos y todas las conexiones de ese flujo.

5. Abrí el resultado en `{ORIGEN}` más el campo `url`.

Si una llamada responde `{"error":"..."}`, corregí el texto y reintentá ese mismo `PUT`. No crees otro flujo para el mismo intento.

Errores frecuentes:

- `No encontré bloques === PASO === en el texto`
- `Cada PASO necesita TÍTULO`
- `El ID {id} está repetido`
- `La conexión {desde} → {hasta} apunta a un paso inexistente`
- `La conexión {desde} → {hasta} necesita CRITERIO`
- `No existe ese flujo`
- `El flujo necesita un nombre`

## Formato que tenés que devolver

Copiá esta estructura. `CONTENIDO:` y `CRITERIO:` van solos en su línea. El texto de cada uno empieza en la línea siguiente. `DESDE` y `HASTA` son el `ID` del paso, no el título. Omití `POSICIÓN`.

```text
# FLUJO EN TEXTO PLANO

=== PASO ===
ID: anuncio
TÍTULO: Anuncio
CONTENIDO:
Mensaje del anuncio.

=== PASO ===
ID: hero
TÍTULO: Hero
CONTENIDO:
Headline:
Subheadline:
Visual:
CTA:

=== PASO ===
ID: problema
TÍTULO: Problema
CONTENIDO:
Situaciones:
Para quién:

=== PASO ===
ID: beneficios
TÍTULO: Beneficios
CONTENIDO:
Beneficios:
Aprendizajes:

=== PASO ===
ID: que-recibes
TÍTULO: Qué recibes
CONTENIDO:
Formato:
Qué incluye:
Cómo se recibe:

=== PASO ===
ID: autoridad
TÍTULO: Autoridad
CONTENIDO:
Quién:
Credenciales:
Motivo:

=== PASO ===
ID: cta-final
TÍTULO: CTA final
CONTENIDO:
Propuesta:
Formulario:
Botón:

=== PASO ===
ID: footer
TÍTULO: Footer
CONTENIDO:
Disclaimer:

=== CONEXIÓN ===
DESDE: anuncio
HASTA: hero
CRITERIO:
El Hero continúa la promesa del anuncio.

=== CONEXIÓN ===
DESDE: hero
HASTA: problema
CRITERIO:
El Problema habla a la misma persona que el Hero.

=== CONEXIÓN ===
DESDE: problema
HASTA: beneficios
CRITERIO:
Los beneficios responden al problema enunciado.

=== CONEXIÓN ===
DESDE: beneficios
HASTA: que-recibes
CRITERIO:
Qué recibes concreta los beneficios, sin agregar otra oferta.

=== CONEXIÓN ===
DESDE: que-recibes
HASTA: autoridad
CRITERIO:
La autoridad sostiene lo que el recurso dice que incluye.

=== CONEXIÓN ===
DESDE: autoridad
HASTA: cta-final
CRITERIO:
El CTA repite la misma propuesta y deja un solo paso siguiente.

=== CONEXIÓN ===
DESDE: cta-final
HASTA: footer
CRITERIO:
El footer no contradice la promesa ni el CTA.
```

Esa plantilla muestra la forma. Al escribir un flujo real, reemplazá los textos con el material del flujo que leíste. Si un campo no tiene datos, dejá la etiqueta vacía. No completes huecos con una oferta inventada.

## Reglas del texto

- Un paso empieza con una línea exacta `=== PASO ===`.
- Una conexión empieza con una línea exacta `=== CONEXIÓN ===`. También se acepta `=== CONEXION ===`.
- `ID:` es una sola línea. Minúsculas, números y guiones. Sin espacios ni acentos. Único dentro del flujo. Si no cumple, se normaliza a un slug de hasta 32 caracteres.
- `TÍTULO:` es obligatorio y es una sola línea.
- `CONTENIDO:` es una línea que termina ahí. Todo lo que sigue, hasta el próximo `=== PASO ===` o `=== CONEXIÓN ===`, es el mensaje del paso.
- `DESDE:` y `HASTA:` son una sola línea cada una y tienen que ser un `ID` de un paso de este mismo texto.
- `CRITERIO:` es una línea que termina ahí. Todo lo que sigue, hasta el próximo marcador, es el criterio. No puede quedar vacío.
- No escribas `=== PASO ===` ni `=== CONEXIÓN ===` dentro de un contenido o un criterio.
- No incluyas los nodos de criterio como pasos. El criterio vive solo dentro de `=== CONEXIÓN ===`.
- `POSICIÓN: x, y` es opcional. Si no está, el editor acomoda los pasos.
- Las puntuaciones de evaluación no se escriben en este texto. Si el flujo se reemplaza, esas puntuaciones se descartan.

## En el editor

`/esquema?flujo={id}` abre un flujo.

- **Crear flujo** pide un nombre y abre una fila vacía.
- **Agregar como otro flujo** crea una fila nueva llamada `Importado` (o `Importado-2`, `Importado-3`) y la llena con el texto pegado. No lo dibuja debajo del flujo que estaba abierto.
- **Reemplazar flujo actual** sustituye solo el flujo abierto. El botón pide una segunda confirmación.

Las líneas de `ID` que el texto pegado trae se conservan. Si ese `ID` ya existe dentro del mismo texto, la importación falla.
