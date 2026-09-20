## Conversión a sneakers — 2026-09-20

Se archivaron los productos de crochet y se crearon dos productos activos en Shopify: Runner Sage 01 (Nike / Running) y Court Clay 02 (Adidas / Court). El probe devolvió ambos con imagen, precio y variante disponible.

El storefront fue actualizado para copy de sneakers, filtros por marca/color/talla, tarjetas con marca visible y botones `Copiar imagen` y `Copiar info`. La búsqueda `rg -ni "whatsapp|wa\\.me|whats app" client server shared` no encontró coincidencias.

`pnpm check`, `pnpm build` y `pnpm test` pasan (7 tests, 1 skip esperado). La primera captura posterior al HMR mostró el estado de carga; se requiere una captura posterior para inspeccionar el contenido hidratado.

La revisión visual hidratada confirmó hero con sneaker, copy `Tu ritmo. Tu par.`, filtros Brand/Color/Size, marcas Adidas/Nike, tarjetas con `Copiar imagen` y `Copiar info`, y ausencia visible de WhatsApp. Se corrigió el filtro Size para leer tags `US 7`–`US 10` de Shopify.
