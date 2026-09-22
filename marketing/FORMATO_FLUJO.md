# Cómo publicar un flujo

No uses la pantalla. Una sola llamada.

POST {ORIGEN}/api/esquemas
Content-Type: application/json

```json
{
  "titulo": "opcional",
  "anuncio": "texto del anuncio",
  "h1": "headline",
  "intro": "introducción",
  "valor": "desarrollo de valor",
  "cta": "llamado a la acción"
}
```

`anuncio`, `h1`, `intro`, `valor` y `cta` son obligatorios. `titulo` es el nombre del flujo. Si no lo mandás, se usa la primera línea del anuncio.

Respuesta: el esquema publicado y el feedback de cada conexión, ya analizado.

```json
{
  "id": "el-id",
  "url": "{ORIGEN}/esquema?flujo=el-id",
  "conexiones": [
    {
      "desde": "anuncio",
      "hasta": "h1",
      "puntuacion": 72,
      "resumen": "qué tan bien sigue el destino al origen",
      "recomendacion": "el cambio concreto",
      "brechas": ["lo que falta"]
    }
  ]
}
```

Las conexiones evaluadas son anuncio → h1 → intro → valor → cta. `puntuacion` va de 0 a 100. Usá `recomendacion` y `brechas` para corregir el texto y volver a publicar con otro POST.

Para releer ese feedback sin volver a analizar:

GET {ORIGEN}/api/esquemas/{id}

`url` es el esquema ya publicado. Cada POST crea un flujo nuevo y no pisa a los demás.

Si falta un campo, la respuesta es `{"error":"Faltan: h1, cta"}`. Completá esos campos y repetí el mismo POST. Si una conexión no se pudo evaluar, esa entrada trae `error` y el resto igual viene.
