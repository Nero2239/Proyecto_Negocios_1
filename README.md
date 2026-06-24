<<<<<<< HEAD
# Ruta Salvaje - Sitio Web de Camping

##  Estructura del Proyecto

```
Proyecto/
├── index.html                    # Archivo HTML principal
├── styles/
│   ├── main.css                 # Estilos CSS personalizados
│   └── tailwind-config.js       # Configuración de Tailwind CSS
└── README.md                    # Este archivo
```

## Características del Diseño

### Paleta de Colores
- **Verde Bosque** (`#2d5016`): Títulos y textos principales
- **Naranja Cálido** (`#e07856`): Botones (CTA) y elementos de resalte
- **Crema** (`#faf8f3`): Fondo base (aspecto orgánico)

### Tipografía
- **Serif** (Georgia, Garamond): Títulos (sensación de aventura)
- **Sans-serif** (Segoe UI, Roboto): Cuerpo del texto (legibilidad)

### Componentes Principales

#### 1. **Header (Navegación)**
- Sticky navigation bar con menú responsivo
- Logo: "Ruta Salvaje"
- Botón CTA: "Planifica tu viaje"

#### 2. **Hero Section**
- Imagen de fondo con overlay
- Título principal y subtítulo
- CTA: "Ver colecciones para principiantes"

#### 3. **El Rincón del Campista**
- 3 tarjetas con iconos (Checklist, Tips, Cocina)
- Hover effect: elevación y cambio de color
- Grid responsivo

#### 4. **Equipo Destacado**
- Grid de 4 productos (responsive: 1 col móvil → 4 cols desktop)
- Renderizado dinámico con JavaScript
- Etiqueta "Recomendado" condicional
- Placeholder de imágenes

#### 5. **Nosotros**
- Historia corta del negocio
- Misión/Propuesta de valor
- Datos básicos (fundación, clientes, etc.)

#### 6. **Contacto**
- Formulario con validación (Nombre, Correo, Mensaje)
- Mensaje de éxito simulado (desaparece en 5 seg)
- Información de contacto (Email, ubicación, teléfono)
- Enlaces a redes sociales

#### 7. **Footer**
- Newsletter de suscripción
- Enlaces rápidos
- Redes sociales
- Copyright

## Funcionalidades

### JavaScript
- Renderizado dinámico de productos
- Manejador de formulario de contacto
- Validación básica de formularios
- Mensajes de éxito/error animados

### CSS
- Variables CSS personalizadas
- Efectos hover suave
- Animaciones (slideIn, spin)
- Responsividad completa

### Tailwind CSS
- Utilidades personalizadas
- Colores extendidos
- Grid y flexbox responsivos

## Responsividad

La página está optimizada para:
- Móvil (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## Personalización

### Modificar Productos
Edita el array `productos` en el script de `index.html`:
```javascript
const productos = [
    {
        nombre: 'Tu Producto',
        precio: '$XX.00',
        descripcion: 'Descripción del producto',
        esRecomendado: true/false,
    },
    // ... más productos
];
```

### Cambiar Colores
Actualiza las variables CSS en `styles/main.css`:
```css
:root {
    --color-bosque: #2d5016;
    --color-naranja: #e07856;
    --color-crema: #faf8f3;
}
```

O en `styles/tailwind-config.js`:
```javascript
colors: {
    bosque: '#2d5016',
    naranja: '#e07856',
    crema: '#faf8f3',
}
```

## Checklist de Cumplimiento

-  HTML limpio y semántico
-  Estilos en carpeta aparte (`styles/`)
-  JavaScript para renderizado dinámico
-  Tailwind CSS para utilidades
-  Formulario de contacto funcional (simulado)
-  Sección "Nosotros" con Historia/Misión/Datos
-  Sección "Contacto" con formulario y redes
-  Diseño responsivo
-  Micro-interacciones (hover effects)
-  Paleta de colores tema camping

##  Tecnologías Utilizadas

- HTML5
- CSS3 (con variables personalizadas)
- Tailwind CSS (v3+)
- JavaScript (vanilla)

---

**Materia:** Negocios Electronicos I
**Autor:** RUiz Diaz Miguel Angel
=======
Requerimientos Funcionales

1.-Visualización de contenido: El usuario puede leer artículos, tips y consejos sobre camping en la página principal.

2.-Catálogo de productos: El sistema muestra una lista de artículos de camping (tiendas, sacos, etc.) con sus precios.

3.-Búsqueda y navegación: El usuario puede navegar entre las secciones de "Guías" y "Tienda" mediante un menú principal.

4.-Acción de compra: El usuario puede identificar productos recomendados y seleccionar artículos para ver detalles o realizar una compra.

5.-Suscripción: El usuario puede registrarse para recibir boletines informativos sobre nuevas guías y rutas.
>>>>>>> bb3adaba768e7176c4f0920467d5c34a9dcd73f3
