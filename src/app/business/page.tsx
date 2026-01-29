'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaShoppingCart, FaBoxOpen, FaChartLine, FaExclamationTriangle, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';

// ============================================================================
// TIPOS
// ============================================================================

interface Producto {
  id: string;
  nombre: string;
  sku: string;
  stock_actual: number;
  ventas_totales: number;
  fecha_inicio_stock: string; // ISO string
  fecha_ultimo_movimiento: string; // ISO string
  lead_time_dias: number;
  costo_unitario_puesto: number;
  precio_venta: number;
  historial_movimientos: Movimiento[];
}

interface Movimiento {
  tipo: 'venta' | 'ingreso';
  cantidad: number;
  fecha: string; // ISO string
}

interface MetricasProducto {
  dias_activos: number;
  dias_sin_stock: number;
  venta_diaria_promedio: number;
  dias_cobertura_restantes: number;
  punto_reposicion: number;
  capital_inmovilizado: number;
  margen_bruto_porcentaje: number;
  margen_bruto_unitario: number;
  utilidad_total: number;
  utilidad_diaria_promedio: number;
}

// ============================================================================
// UTILIDADES
// ============================================================================

const calcularMetricas = (producto: Producto): MetricasProducto => {
  const ahora = new Date();
  const fechaInicio = new Date(producto.fecha_inicio_stock);
  const diasTotales = Math.max(1, Math.floor((ahora.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)));

  // Calcular días sin stock (simplificado: asumimos que si stock es 0, cuenta como día sin stock)
  const dias_sin_stock = producto.stock_actual === 0 ? 1 : 0;
  
  // Días activos = días totales - días sin stock
  const dias_activos = Math.max(1, diasTotales - dias_sin_stock);

  // Venta diaria promedio
  const venta_diaria_promedio = producto.ventas_totales / dias_activos;

  // Días de cobertura restantes
  const dias_cobertura_restantes = venta_diaria_promedio > 0 
    ? producto.stock_actual / venta_diaria_promedio 
    : Infinity;

  // Punto de reposición
  const punto_reposicion = venta_diaria_promedio * producto.lead_time_dias;

  // Capital inmovilizado
  const capital_inmovilizado = producto.stock_actual * producto.costo_unitario_puesto;

  // Margen bruto
  const margen_bruto_unitario = producto.precio_venta - producto.costo_unitario_puesto;
  const margen_bruto_porcentaje = producto.precio_venta > 0 
    ? (margen_bruto_unitario / producto.precio_venta) * 100 
    : 0;

  // Utilidad total y diaria
  const utilidad_total = producto.ventas_totales * margen_bruto_unitario;
  const utilidad_diaria_promedio = utilidad_total / dias_activos;

  return {
    dias_activos,
    dias_sin_stock,
    venta_diaria_promedio,
    dias_cobertura_restantes,
    punto_reposicion,
    capital_inmovilizado,
    margen_bruto_porcentaje,
    margen_bruto_unitario,
    utilidad_total,
    utilidad_diaria_promedio,
  };
};

const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatearNumero = (num: number, decimales: number = 2): string => {
  if (!isFinite(num)) return '∞';
  return num.toFixed(decimales);
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function InventarioDashboard() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [mostrarModalVenta, setMostrarModalVenta] = useState(false);
  const [mostrarModalIngreso, setMostrarModalIngreso] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // Formulario nuevo producto
  const [formNombre, setFormNombre] = useState('');
  const [formSKU, setFormSKU] = useState('');
  const [formStockInicial, setFormStockInicial] = useState('');
  const [formLeadTime, setFormLeadTime] = useState('');
  const [formCostoUnitario, setFormCostoUnitario] = useState('');
  const [formPrecioVenta, setFormPrecioVenta] = useState('');

  // Formulario venta/ingreso
  const [formCantidad, setFormCantidad] = useState('');

  // ============================================================================
  // PERSISTENCIA
  // ============================================================================

  useEffect(() => {
    const productosGuardados = localStorage.getItem('inventario_productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    }
  }, []);

  useEffect(() => {
    if (productos.length > 0 || localStorage.getItem('inventario_productos')) {
      localStorage.setItem('inventario_productos', JSON.stringify(productos));
    }
  }, [productos]);

  // ============================================================================
  // ACCIONES
  // ============================================================================

  const agregarProducto = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formNombre || !formSKU || !formStockInicial || !formLeadTime || !formCostoUnitario || !formPrecioVenta) {
      alert('Por favor completa todos los campos');
      return;
    }

    const ahora = new Date().toISOString();
    const nuevoProducto: Producto = {
      id: Date.now().toString(),
      nombre: formNombre,
      sku: formSKU,
      stock_actual: parseInt(formStockInicial),
      ventas_totales: 0,
      fecha_inicio_stock: ahora,
      fecha_ultimo_movimiento: ahora,
      lead_time_dias: parseInt(formLeadTime),
      costo_unitario_puesto: parseFloat(formCostoUnitario),
      precio_venta: parseFloat(formPrecioVenta),
      historial_movimientos: [
        {
          tipo: 'ingreso',
          cantidad: parseInt(formStockInicial),
          fecha: ahora,
        },
      ],
    };

    setProductos([...productos, nuevoProducto]);
    limpiarFormularioProducto();
    setMostrarModalProducto(false);
  };

  const registrarVenta = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productoSeleccionado || !formCantidad) {
      alert('Por favor ingresa una cantidad');
      return;
    }

    const cantidad = parseInt(formCantidad);
    if (cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    if (cantidad > productoSeleccionado.stock_actual) {
      alert('No hay suficiente stock disponible');
      return;
    }

    const ahora = new Date().toISOString();
    const movimiento: Movimiento = {
      tipo: 'venta',
      cantidad,
      fecha: ahora,
    };

    setProductos(
      productos.map((p) =>
        p.id === productoSeleccionado.id
          ? {
              ...p,
              stock_actual: p.stock_actual - cantidad,
              ventas_totales: p.ventas_totales + cantidad,
              fecha_ultimo_movimiento: ahora,
              historial_movimientos: [...p.historial_movimientos, movimiento],
            }
          : p
      )
    );

    setFormCantidad('');
    setMostrarModalVenta(false);
    setProductoSeleccionado(null);
  };

  const registrarIngreso = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productoSeleccionado || !formCantidad) {
      alert('Por favor ingresa una cantidad');
      return;
    }

    const cantidad = parseInt(formCantidad);
    if (cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    const ahora = new Date().toISOString();
    const movimiento: Movimiento = {
      tipo: 'ingreso',
      cantidad,
      fecha: ahora,
    };

    setProductos(
      productos.map((p) =>
        p.id === productoSeleccionado.id
          ? {
              ...p,
              stock_actual: p.stock_actual + cantidad,
              fecha_ultimo_movimiento: ahora,
              historial_movimientos: [...p.historial_movimientos, movimiento],
            }
          : p
      )
    );

    setFormCantidad('');
    setMostrarModalIngreso(false);
    setProductoSeleccionado(null);
  };

  const eliminarProducto = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  const cargarDatosPrueba = async () => {
    if (confirm('¿Cargar datos de prueba? Esto reemplazará todos los datos actuales.')) {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        setProductos(data.productos);
        alert('Datos de prueba cargados exitosamente!');
      } catch (error) {
        alert('Error al cargar datos de prueba');
        console.error(error);
      }
    }
  };

  const limpiarTodosDatos = () => {
    if (confirm('¿Estás seguro de eliminar TODOS los productos? Esta acción no se puede deshacer.')) {
      setProductos([]);
      localStorage.removeItem('inventario_productos');
      alert('Todos los datos han sido eliminados');
    }
  };

  const descargarExcel = () => {
    if (productos.length === 0) {
      alert('No hay productos para exportar');
      return;
    }

    // Preparar los datos para el Excel
    const datosExcel = productos.map((producto) => {
      const metricas = calcularMetricas(producto);
      return {
        'Nombre': producto.nombre,
        'SKU': producto.sku,
        'Stock Actual': producto.stock_actual,
        'Ventas Totales': producto.ventas_totales,
        'Costo Unitario': producto.costo_unitario_puesto,
        'Precio Venta': producto.precio_venta,
        'Margen Bruto %': parseFloat(formatearNumero(metricas.margen_bruto_porcentaje, 2)),
        'Margen Bruto Unitario': parseFloat(formatearNumero(metricas.margen_bruto_unitario, 2)),
        'Utilidad Total': parseFloat(formatearNumero(metricas.utilidad_total, 2)),
        'Utilidad Diaria Promedio': parseFloat(formatearNumero(metricas.utilidad_diaria_promedio, 2)),
        'Capital Inmovilizado': parseFloat(formatearNumero(metricas.capital_inmovilizado, 2)),
        'Días Activos': metricas.dias_activos,
        'Días Sin Stock': metricas.dias_sin_stock,
        'Venta Diaria Promedio': parseFloat(formatearNumero(metricas.venta_diaria_promedio, 2)),
        'Días Cobertura Restantes': isFinite(metricas.dias_cobertura_restantes) 
          ? parseFloat(formatearNumero(metricas.dias_cobertura_restantes, 2))
          : 999999,
        'Lead Time (días)': producto.lead_time_dias,
        'Punto Reposición': parseFloat(formatearNumero(metricas.punto_reposicion, 2)),
        'Fecha Inicio Stock': formatearFecha(producto.fecha_inicio_stock),
        'Último Movimiento': formatearFecha(producto.fecha_ultimo_movimiento),
      };
    });

    // Crear el libro de trabajo
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);

    // Ajustar el ancho de las columnas
    const columnWidths = [
      { wch: 20 }, // Nombre
      { wch: 15 }, // SKU
      { wch: 12 }, // Stock Actual
      { wch: 15 }, // Ventas Totales
      { wch: 18 }, // Costo Unitario
      { wch: 18 }, // Precio Venta
      { wch: 15 }, // Margen Bruto %
      { wch: 22 }, // Margen Bruto Unitario
      { wch: 20 }, // Utilidad Total
      { wch: 24 }, // Utilidad Diaria Promedio
      { wch: 22 }, // Capital Inmovilizado
      { wch: 15 }, // Días Activos
      { wch: 15 }, // Días Sin Stock
      { wch: 22 }, // Venta Diaria Promedio
      { wch: 24 }, // Días Cobertura Restantes
      { wch: 18 }, // Lead Time (días)
      { wch: 20 }, // Punto Reposición
      { wch: 18 }, // Fecha Inicio Stock
      { wch: 18 }, // Último Movimiento
    ];
    ws['!cols'] = columnWidths;

    // Aplicar formato numérico con separadores de miles y decimales
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      // Costo Unitario (columna E - índice 4)
      const cellCosto = XLSX.utils.encode_cell({ r: row, c: 4 });
      if (ws[cellCosto]) {
        ws[cellCosto].z = '#,##0';
      }
      
      // Precio Venta (columna F - índice 5)
      const cellPrecio = XLSX.utils.encode_cell({ r: row, c: 5 });
      if (ws[cellPrecio]) {
        ws[cellPrecio].z = '#,##0';
      }
      
      // Margen Bruto % (columna G - índice 6)
      const cellMargenPct = XLSX.utils.encode_cell({ r: row, c: 6 });
      if (ws[cellMargenPct]) {
        ws[cellMargenPct].z = '#,##0.00';
      }
      
      // Margen Bruto Unitario (columna H - índice 7)
      const cellMargenUnit = XLSX.utils.encode_cell({ r: row, c: 7 });
      if (ws[cellMargenUnit]) {
        ws[cellMargenUnit].z = '#,##0.00';
      }
      
      // Utilidad Total (columna I - índice 8)
      const cellUtilidadTotal = XLSX.utils.encode_cell({ r: row, c: 8 });
      if (ws[cellUtilidadTotal]) {
        ws[cellUtilidadTotal].z = '#,##0.00';
      }
      
      // Utilidad Diaria Promedio (columna J - índice 9)
      const cellUtilidadDiaria = XLSX.utils.encode_cell({ r: row, c: 9 });
      if (ws[cellUtilidadDiaria]) {
        ws[cellUtilidadDiaria].z = '#,##0.00';
      }
      
      // Capital Inmovilizado (columna K - índice 10)
      const cellCapital = XLSX.utils.encode_cell({ r: row, c: 10 });
      if (ws[cellCapital]) {
        ws[cellCapital].z = '#,##0.00';
      }
      
      // Venta Diaria Promedio (columna N - índice 13)
      const cellVentaDiaria = XLSX.utils.encode_cell({ r: row, c: 13 });
      if (ws[cellVentaDiaria]) {
        ws[cellVentaDiaria].z = '#,##0.00';
      }
      
      // Días Cobertura Restantes (columna O - índice 14)
      const cellCobertura = XLSX.utils.encode_cell({ r: row, c: 14 });
      if (ws[cellCobertura]) {
        ws[cellCobertura].z = '#,##0.00';
      }
      
      // Punto Reposición (columna Q - índice 16)
      const cellPuntoRepo = XLSX.utils.encode_cell({ r: row, c: 16 });
      if (ws[cellPuntoRepo]) {
        ws[cellPuntoRepo].z = '#,##0.00';
      }
    }

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    // Generar el nombre del archivo con la fecha actual
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `inventario_${fecha}.xlsx`;

    // Descargar el archivo
    XLSX.writeFile(wb, nombreArchivo);
  };

  const limpiarFormularioProducto = () => {
    setFormNombre('');
    setFormSKU('');
    setFormStockInicial('');
    setFormLeadTime('');
    setFormCostoUnitario('');
    setFormPrecioVenta('');
  };

  const abrirModalVenta = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setFormCantidad('');
    setMostrarModalVenta(true);
  };

  const abrirModalIngreso = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setFormCantidad('');
    setMostrarModalIngreso(true);
  };

  // ============================================================================
  // ESTADÍSTICAS GENERALES
  // ============================================================================

  const totalProductos = productos.length;
  const totalStockActual = productos.reduce((sum, p) => sum + p.stock_actual, 0);
  const totalVentas = productos.reduce((sum, p) => sum + p.ventas_totales, 0);
  const totalCapitalInmovilizado = productos.reduce((sum, p) => {
    const metricas = calcularMetricas(p);
    return sum + metricas.capital_inmovilizado;
  }, 0);
  const totalUtilidadGenerada = productos.reduce((sum, p) => {
    const metricas = calcularMetricas(p);
    return sum + metricas.utilidad_total;
  }, 0);
  const productosEnRiesgo = productos.filter((p) => {
    const metricas = calcularMetricas(p);
    return metricas.dias_cobertura_restantes < p.lead_time_dias;
  }).length;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-[1600px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-3">
            <FaChartLine className="w-8 h-8 text-blue-600" />
            Dashboard de Inventario
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sistema de gestión y control de stock con métricas automáticas
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Productos</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalProductos}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Stock Total</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalStockActual}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ventas Totales</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalVentas}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Utilidad Generada</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${totalUtilidadGenerada.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Capital Inmovilizado</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${totalCapitalInmovilizado.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Productos en Riesgo</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              {productosEnRiesgo > 0 && <FaExclamationTriangle className="w-5 h-5" />}
              {productosEnRiesgo}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            onClick={() => setMostrarModalProducto(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow"
          >
            <FaPlus className="w-4 h-4" />
            Nuevo Producto
          </button>
          
          {productos.length > 0 && (
            <button
              onClick={descargarExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow"
            >
              <FaFileExcel className="w-4 h-4" />
              Descargar Excel
            </button>
          )}
          
          {productos.length === 0 && (
            <button
              onClick={cargarDatosPrueba}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow"
            >
              📊 Cargar Datos de Prueba
            </button>
          )}

          {productos.length > 0 && (
            <button
              onClick={limpiarTodosDatos}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow"
            >
              🗑️ Limpiar Todos los Datos
            </button>
          )}
        </div>

        {/* Tabla */}
        {productos.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 shadow border border-slate-200 dark:border-slate-700 text-center">
            <FaChartLine className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No hay productos
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6">
              Comienza agregando tu primer producto al inventario
            </p>
            <button
              onClick={() => setMostrarModalProducto(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              <FaPlus className="w-5 h-5" />
              Agregar Producto
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">SKU</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Stock</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Ventas Tot.</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Costo Unit.</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Precio Venta</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Margen %</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Utilidad Total</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Utilidad Diaria</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Capital Inmov.</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Días Activos</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Vta. Diaria Prom.</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Días Cobertura</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Lead Time</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Pto. Reposición</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Último Mov.</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-200">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {productos.map((producto) => {
                    const metricas = calcularMetricas(producto);
                    const necesitaReposicion = producto.stock_actual <= metricas.punto_reposicion;

                    return (
                      <tr
                        key={producto.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                          necesitaReposicion ? 'bg-red-50 dark:bg-red-900/10' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                          {producto.nombre}
                          {necesitaReposicion && (
                            <FaExclamationTriangle className="inline ml-2 w-4 h-4 text-red-600" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs">
                          {producto.sku}
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${
                          producto.stock_actual === 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}>
                          {producto.stock_actual}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                          {producto.ventas_totales}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                          ${formatearNumero(producto.costo_unitario_puesto, 0)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                          ${formatearNumero(producto.precio_venta, 0)}
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${
                          metricas.margen_bruto_porcentaje < 20
                            ? 'text-red-600 dark:text-red-400'
                            : metricas.margen_bruto_porcentaje < 40
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {formatearNumero(metricas.margen_bruto_porcentaje, 1)}%
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                          ${formatearNumero(metricas.utilidad_total, 0)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                          ${formatearNumero(metricas.utilidad_diaria_promedio, 0)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-purple-600 dark:text-purple-400">
                          ${formatearNumero(metricas.capital_inmovilizado, 0)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                          {metricas.dias_activos}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                          {formatearNumero(metricas.venta_diaria_promedio, 2)}
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${
                          metricas.dias_cobertura_restantes < producto.lead_time_dias
                            ? 'text-red-600 dark:text-red-400'
                            : metricas.dias_cobertura_restantes < producto.lead_time_dias * 2
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {formatearNumero(metricas.dias_cobertura_restantes, 1)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                          {producto.lead_time_dias}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-600 dark:text-blue-400">
                          {formatearNumero(metricas.punto_reposicion, 0)}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">
                          {formatearFecha(producto.fecha_ultimo_movimiento)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => abrirModalVenta(producto)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                              title="Registrar Venta"
                            >
                              <FaShoppingCart className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => abrirModalIngreso(producto)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                              title="Ingreso de Stock"
                            >
                              <FaBoxOpen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => eliminarProducto(producto.id)}
                              className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-xs"
                              title="Eliminar"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leyenda */}
        {productos.length > 0 && (
          <div className="mt-4 bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <div className="font-semibold mb-2">Indicadores:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>• <span className="text-red-600 dark:text-red-400 font-semibold">Días Cobertura (Rojo):</span> Menor a Lead Time (¡Urgente!)</div>
              <div>• <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Días Cobertura (Amarillo):</span> Menor a Lead Time × 2 (Atención)</div>
              <div>• <span className="text-green-600 dark:text-green-400 font-semibold">Días Cobertura (Verde):</span> Stock suficiente</div>
              <div>• <span className="text-blue-600 dark:text-blue-400 font-semibold">Punto Reposición:</span> Stock mínimo antes de pedir</div>
              <div>• <span className="text-purple-600 dark:text-purple-400 font-semibold">Capital Inmovilizado:</span> Stock actual × Costo unitario</div>
              <div>• <span className="font-semibold">Margen Bruto:</span> (Precio venta - Costo) / Precio venta × 100</div>
              <div>• <span className="text-green-600 dark:text-green-400 font-semibold">Utilidad Total:</span> Ventas totales × Margen bruto unitario</div>
              <div>• <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Utilidad Diaria:</span> Utilidad total / Días activos</div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Nuevo Producto */}
      {mostrarModalProducto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-md w-full">
            <div className="border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Nuevo Producto</h2>
              <button
                onClick={() => {
                  setMostrarModalProducto(false);
                  limpiarFormularioProducto();
                }}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={agregarProducto} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Producto A"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  value={formSKU}
                  onChange={(e) => setFormSKU(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: PROD-001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stock Inicial *
                </label>
                <input
                  type="number"
                  value={formStockInicial}
                  onChange={(e) => setFormStockInicial(e.target.value)}
                  required
                  min="0"
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lead Time (días) *
                </label>
                <input
                  type="number"
                  value={formLeadTime}
                  onChange={(e) => setFormLeadTime(e.target.value)}
                  required
                  min="1"
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="7"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tiempo de espera para recibir nuevo stock
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Costo Unitario ($) *
                  </label>
                  <input
                    type="number"
                    value={formCostoUnitario}
                    onChange={(e) => setFormCostoUnitario(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Incluye flete + aduana
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Precio Venta ($) *
                  </label>
                  <input
                    type="number"
                    value={formPrecioVenta}
                    onChange={(e) => setFormPrecioVenta(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalProducto(false);
                    limpiarFormularioProducto();
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Venta */}
      {mostrarModalVenta && productoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-md w-full">
            <div className="border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Registrar Venta</h2>
              <button
                onClick={() => {
                  setMostrarModalVenta(false);
                  setProductoSeleccionado(null);
                  setFormCantidad('');
                }}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={registrarVenta} className="p-4 space-y-4">
              <div className="bg-slate-100 dark:bg-slate-700 rounded p-3">
                <div className="text-sm text-slate-600 dark:text-slate-400">Producto:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">{productoSeleccionado.nombre}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">Stock actual:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">{productoSeleccionado.stock_actual}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cantidad a vender *
                </label>
                <input
                  type="number"
                  value={formCantidad}
                  onChange={(e) => setFormCantidad(e.target.value)}
                  required
                  min="1"
                  max={productoSeleccionado.stock_actual}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalVenta(false);
                    setProductoSeleccionado(null);
                    setFormCantidad('');
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors"
                >
                  Registrar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ingreso de Stock */}
      {mostrarModalIngreso && productoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-md w-full">
            <div className="border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ingreso de Stock</h2>
              <button
                onClick={() => {
                  setMostrarModalIngreso(false);
                  setProductoSeleccionado(null);
                  setFormCantidad('');
                }}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={registrarIngreso} className="p-4 space-y-4">
              <div className="bg-slate-100 dark:bg-slate-700 rounded p-3">
                <div className="text-sm text-slate-600 dark:text-slate-400">Producto:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">{productoSeleccionado.nombre}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">Stock actual:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">{productoSeleccionado.stock_actual}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cantidad a ingresar *
                </label>
                <input
                  type="number"
                  value={formCantidad}
                  onChange={(e) => setFormCantidad(e.target.value)}
                  required
                  min="1"
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalIngreso(false);
                    setProductoSeleccionado(null);
                    setFormCantidad('');
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
                >
                  Ingresar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
