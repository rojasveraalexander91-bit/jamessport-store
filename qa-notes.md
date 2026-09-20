## Revisión visual inicial — 2026-09-20

La captura de escritorio de `/` y `/product/sage-loop-cardigan` confirmó que el storefront renderiza con el lenguaje visual previsto: crema cálido, salvia, terracota suave, tipografía editorial Cormorant Garamond + DM Sans, hero asimétrico, catálogo de dos columnas, banda de historia, carrusel recomendado, footer oscuro y PDP con galería, opciones, cantidad y CTA de carrito.

No se observaron desbordes, errores de ruta ni bloques vacíos en las capturas. Shopify devuelve y renderiza los precios en PEN porque la tienda de desarrollo fue creada con esa moneda; se mantiene el valor proveniente del backend para no falsear el checkout. El build de Vite y el chequeo TypeScript pasan sin errores.

## Revisión responsive móvil — 2026-09-20

La captura a 390×844 confirmó que el header colapsa a menú, el wordmark conserva escala, el hero apila contenido e imagen sin clipping, y el PDP muestra breadcrumbs, imagen, título y precio con buen ritmo vertical. No se observaron desbordes horizontales ni componentes ilegibles en la parte superior de home y PDP.

## Comprobación de preview — 2026-09-20

La vista previa pública carga correctamente después de la hidratación: el DOM expone navegación, hero, búsqueda, filtros Category/Color/Size, ambos productos, recomendaciones y formulario de newsletter. La ruta de preview funciona sin autenticación de usuario.

## Flujo de carrito — 2026-09-20

Desde `/product/sage-loop-cardigan`, la prueba de click en `Add to bag` creó la bolsa Shopify correctamente: el contador cambió de 0 a 1, el drawer se abrió, mostró imagen, nombre, variante `Small / Sage`, cantidad, subtotal en PEN 148 y el botón `Continue to checkout`. Esto confirma el flujo de creación de carrito y renderizado de líneas.
