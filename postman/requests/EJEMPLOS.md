# Cuerpos de ejemplo para probar en Postman

Solo `POST /reviews` y `PUT /reviews/:id` llevan body.
En Postman: pestaña **Body** → **raw** → **JSON**.

Datos sembrados al arrancar:

| Usuarios | | Vehículos | |
|---|---|---|---|
| 1 | Rodrigo Salinas | 1 Porsche 911 GT3 | 5 Chevrolet Camaro SS |
| 2 | Sofía Reyes | 2 Toyota Land Cruiser | 6 Jeep Wrangler |
| 3 | Iván Pérez | 3 Ford Mustang '67 | 7 VW Beetle '65 |
| | | 4 Tesla Model 3 | 8 Ford Ranger |

Todos los códigos de abajo están verificados contra el servidor corriendo.

---

## POST http://localhost:3000/reviews

### Válidos → 201

**A. Porsche, nota máxima**
```json
{
  "userId": 1,
  "vehicleId": 1,
  "rating": 5,
  "comment": "Una bestia en pista. El sonido del motor es otra cosa."
}
```

**B. Tesla, nota alta**
```json
{
  "userId": 2,
  "vehicleId": 4,
  "rating": 4,
  "comment": "Silencioso y rapidisimo, pero la autonomia real es menor."
}
```

**C. Mustang clásico**
```json
{
  "userId": 3,
  "vehicleId": 3,
  "rating": 5,
  "comment": "Un clasico irrepetible. Duro de manejar pero vale la pena."
}
```

**D. Nota mínima (rating 0 es válido)**
```json
{
  "userId": 1,
  "vehicleId": 2,
  "rating": 0,
  "comment": "Se averio a los dos meses, decepcionante."
}
```

**E. Sin comment (es opcional)**
```json
{
  "userId": 2,
  "vehicleId": 6,
  "rating": 3
}
```

### Errores

**F. Usuario inexistente → 404** `{"error":"Usuario no encontrado"}`
```json
{ "userId": 999, "vehicleId": 1, "rating": 5, "comment": "prueba" }
```

**G. Vehículo inexistente → 404** `{"error":"Vehículo no encontrado"}`
```json
{ "userId": 1, "vehicleId": 999, "rating": 5, "comment": "prueba" }
```

**H. Sin rating → 400** `{"error":"El rating es obligatorio"}`
```json
{ "userId": 1, "vehicleId": 1, "comment": "Me olvide la nota" }
```

**I. Rating fuera de rango → 400** `{"error":"El rating debe ser un entero entre 0 y 5"}`
```json
{ "userId": 1, "vehicleId": 1, "rating": 9, "comment": "prueba" }
```

También dan 400: `"rating": -1`, `"rating": 4.5`, `"rating": "cinco"`.

---

## PUT http://localhost:3000/reviews/:id

Usa el `id` que devolvió el POST.

### Válidos → 200

**J. Cambiar nota y comentario**
```json
{
  "rating": 3,
  "comment": "Lo volvi a probar y el consumo es altisimo."
}
```

**K. Solo la nota (el comment se conserva)**
```json
{ "rating": 2 }
```

**L. Solo el comentario (la nota se conserva)**
```json
{ "comment": "Actualizo solo el texto, la nota queda igual." }
```

### Casos especiales

**M. Intento de reasignar usuario/vehículo → 200, pero se IGNORAN**
```json
{ "userId": 3, "vehicleId": 8, "rating": 4 }
```
Aplica `rating: 4`, pero la respuesta conserva el `userId` y `vehicleId` originales.
Es intencional: la review no debe desasociarse.

**N. Rating fuera de rango → 400**
```json
{ "rating": 10 }
```

**O. Review inexistente (PUT /reviews/999) → 404** `{"error":"Review no encontrada"}`
```json
{ "rating": 4 }
```

---

## GET y DELETE — sin body

| Método | URL |
|---|---|
| GET | `http://localhost:3000/vehicles` |
| GET | `http://localhost:3000/vehicles/1` |
| GET | `http://localhost:3000/users/1` |
| GET | `http://localhost:3000/vehicles/1/reviews` |
| GET | `http://localhost:3000/users/1/reviews` |
| DELETE | `http://localhost:3000/reviews/1` → 204 sin contenido |

Errores: `/users/999` → 404, `/vehicles/999` → 404, `DELETE /reviews/999` → 404.
`GET /vehicles/999/reviews` devuelve `[]` con 200 (no 404).
