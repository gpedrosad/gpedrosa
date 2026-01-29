# 📊 Dashboard de Inventario - Datos de Prueba

## 🎯 Descripción de los Datos

El archivo `db.json` contiene **10 productos de prueba** con diferentes escenarios para demostrar todas las funcionalidades del sistema:

### 📦 Productos Incluidos:

1. **Laptop Dell XPS 13** (TECH-001)
   - Stock: 15 unidades
   - Margen: 32% (Bueno)
   - Estado: Stock moderado, requiere atención

2. **iPhone 15 Pro 256GB** (MOB-002)
   - Stock: 8 unidades
   - Margen: 28% (Medio)
   - ⚠️ **CRÍTICO**: Stock por debajo del punto de reposición

3. **Monitor Samsung 27'' 4K** (ACC-003)
   - Stock: 42 unidades
   - Margen: 38% (Bueno)
   - Estado: Stock alto, baja rotación

4. **Mouse Logitech MX Master 3** (ACC-004)
   - Stock: 3 unidades
   - Margen: 44% (Excelente)
   - ⚠️ **URGENTE**: Stock crítico, alta rotación

5. **Teclado Mecánico Keychron K8** (ACC-005)
   - Stock: 0 unidades
   - Margen: 35% (Bueno)
   - 🔴 **SIN STOCK**: Requiere reposición inmediata

6. **Audífonos Sony WH-1000XM5** (AUD-006)
   - Stock: 25 unidades
   - Margen: 37% (Bueno)
   - Estado: Stock adecuado

7. **Tablet iPad Air 128GB** (TAB-007)
   - Stock: 18 unidades
   - Margen: 35% (Bueno)
   - Estado: Producto nuevo, aún en evaluación

8. **SSD Samsung 1TB NVMe** (STOR-008)
   - Stock: 65 unidades
   - Margen: 39% (Bueno)
   - Estado: Alta rotación, buen margen

9. **Webcam Logitech C920** (ACC-009)
   - Stock: 12 unidades
   - Margen: 46% (Excelente)
   - Estado: Rotación media

10. **Cable USB-C a USB-C 2m** (CABLE-010)
    - Stock: 5 unidades
    - Margen: 61% (Excelente)
    - ⚠️ **CRÍTICO**: Alta rotación, stock bajo

## 🔍 Escenarios Incluidos:

### 🟢 Stock Saludable:
- Monitor Samsung (42 unidades)
- SSD Samsung (65 unidades)
- Audífonos Sony (25 unidades)

### 🟡 Atención Requerida:
- Laptop Dell (15 unidades)
- iPhone 15 Pro (8 unidades)
- Webcam Logitech (12 unidades)

### 🔴 Situación Crítica:
- Mouse Logitech (3 unidades)
- Cable USB-C (5 unidades)
- Teclado Keychron (0 unidades - SIN STOCK)

## 💰 Análisis Financiero:

**Capital Total Inmovilizado**: ~$16,500,000 CLP

**Productos por Margen**:
- Alto (>40%): Mouse, Webcam, Cable USB-C
- Medio (30-40%): Laptop, Monitor, Teclado, Audífonos, Tablet, SSD
- Regular (20-30%): iPhone

## 📈 Métricas Destacadas:

1. **Mayor Rotación**: Cable USB-C (245 ventas totales)
2. **Mayor Capital Inmovilizado**: Monitor Samsung ($7,560,000)
3. **Mejor Margen**: Cable USB-C (61%)
4. **Lead Time más largo**: Monitor Samsung (45 días)
5. **Producto más reciente**: Tablet iPad Air

## 🚀 Cómo Usar:

### Opción 1: Carga Automática (Recomendado)

1. Inicia la aplicación en `/business`
2. Si no hay datos, verás un botón **"📊 Cargar Datos de Prueba"**
3. Haz clic y confirma
4. ¡Los datos se cargarán automáticamente!

### Opción 2: Carga Manual

```javascript
// En la consola del navegador:
fetch('/db.json')
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('inventario_productos', JSON.stringify(data.productos));
    location.reload();
  });
```

## 🔄 Reiniciar Datos:

Si quieres volver a cargar los datos de prueba:

1. Haz clic en **"🗑️ Limpiar Todos los Datos"**
2. Confirma la acción
3. Haz clic en **"📊 Cargar Datos de Prueba"**

## 📊 Qué Observar:

1. **Dashboard**: Verás 5 indicadores principales con métricas agregadas
2. **Productos en Riesgo**: 3 productos marcados como críticos
3. **Código de Colores**: 
   - Rojo: Días de cobertura < Lead Time
   - Amarillo: Días de cobertura < Lead Time × 2
   - Verde: Stock suficiente
4. **Capital Inmovilizado**: ~$16.5M en inventario
5. **Alertas**: Productos sin stock o con stock crítico resaltados

## 🎯 Casos de Prueba Sugeridos:

1. **Registrar venta del Mouse** (stock crítico) → Verás cómo se activa la alerta
2. **Ingresar stock del Teclado** (sin stock) → Observa cómo cambian las métricas
3. **Eliminar el Cable USB-C** → Nota cómo afecta al capital total
4. **Agregar un producto nuevo** → Experimenta con diferentes márgenes

## 📝 Notas:

- Los datos incluyen historial completo de movimientos
- Las fechas están distribuidas desde agosto 2025 hasta enero 2026
- Los precios son representativos del mercado chileno
- Todos los productos tienen datos realistas de rotación

---

¡Disfruta explorando el sistema! 🚀
