# Cómo publicar un flujo

No uses la pantalla.

## Crear

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

La respuesta trae el esquema y el feedback de la IA para mejorarlo. No hagas otro POST para corregir: eso crea un flujo nuevo.

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

Las conexiones son anuncio → h1 → intro → valor → cta. `puntuacion` va de 0 a 100. Usá `recomendacion` y `brechas` para reescribir solo esos campos.

## Mejorar el mismo flujo

PATCH {ORIGEN}/api/esquemas/{id}
Content-Type: application/json

Mandá únicamente los campos que cambian.

```json
{
  "h1": "headline corregido",
  "cta": "llamado corregido"
}
```

La respuesta tiene la misma forma que el POST. Las conexiones que tocan un campo editado se vuelven a analizar. Las demás conservan el feedback anterior. El esquema queda en la misma `url` y no se mueve.

## Borrar

DELETE {ORIGEN}/api/esquemas/{id}

```json
{ "id": "el-id", "borrado": true }
```

Para ver los flujos y borrar los que sobran:

GET {ORIGEN}/api/esquemas

```json
{ "flujos": [{ "id": "el-id", "titulo": "nombre", "url": "{ORIGEN}/esquema?flujo=el-id" }] }
```

Para releer el feedback sin volver a analizar:

GET {ORIGEN}/api/esquemas/{id}

Si falta un campo al crear, la respuesta es `{"error":"Faltan: h1, cta"}`. Si una conexión no se pudo evaluar, esa entrada trae `error` y el esquema igual queda publicado.
