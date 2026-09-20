import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Instagram,
  Loader2,
  Mail,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import type { Product, ProductVariant } from "@shared/commerce/types";

const FALLBACK_HERO_IMAGE =
  "https://cdn.shopify.com/s/files/1/0753/5647/1389/files/yYKLoBvVmcsjGvWs.jpg?v=1789943979";

function formatMoney(amount: string, currencyCode = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function displayVariantTitle(title: string) {
  return title === "Default Title" ? "One size" : title;
}

function firstAvailableVariant(product: Product): ProductVariant | undefined {
  return product.variants.find(variant => variant.availableForSale) ?? product.variants[0];
}

function ImageFrame({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`image-frame ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} />
      ) : (
        <div className="image-placeholder" aria-hidden="true" />
      )}
      <div className="image-grain" aria-hidden="true" />
    </div>
  );
}

function Header() {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const goToShop = () => {
    setMenuOpen(false);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="announcement-bar">
        <span>Envío gratuito a partir de $120</span>
        <span className="announcement-dot" />
        <span>Hecho lentamente. Vestido a menudo.</span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <button className="mobile-menu-button" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="wordmark" aria-label="CrochetEra, inicio">
            <span className="wordmark-c">C</span>rochet<span className="wordmark-era">Era</span><span className="wordmark-dot">.</span>
          </Link>
          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
            <button onClick={goToShop}>Shop</button>
            <button onClick={() => { setMenuOpen(false); document.getElementById("story")?.scrollIntoView({ behavior: "smooth" }); }}>Our story</button>
            <button onClick={() => { setMenuOpen(false); document.getElementById("journal")?.scrollIntoView({ behavior: "smooth" }); }}>Journal</button>
          </nav>
          <div className="header-actions">
            <button className="header-icon-button search-button" aria-label="Buscar" onClick={goToShop}><Search size={19} strokeWidth={1.5} /></button>
            <button className="cart-button" onClick={openCart} aria-label={`Abrir carrito, ${itemCount} artículos`}>
              <ShoppingBag size={19} strokeWidth={1.5} />
              <span>Bag</span>
              <span className="cart-count">{itemCount}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function Hero({ featuredProduct }: { featuredProduct?: Product }) {
  const image = featuredProduct?.images[0]?.url || FALLBACK_HERO_IMAGE;
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={13} /> The soft edit / 01</div>
        <h1>Textura para<br /><em>sentir.</em></h1>
        <p className="hero-description">Piezas tejidas a mano para días que se sienten como una pausa. Siluetas suaves, color tranquilo y la belleza de lo imperfecto.</p>
        <div className="hero-actions">
          <button className="button button-dark" onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>Descubrir la colección <ArrowUpRight size={16} /></button>
          <span className="hero-note">Nueva colección<br /><strong>SS / 26</strong></span>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="hero-image-wrap">
          <ImageFrame src={image} alt={featuredProduct?.title || "Pieza de crochet CrochetEra"} priority />
          <span className="hero-stamp">Made<br />slowly</span>
        </div>
        <div className="hero-side-note"><span>01</span><span className="line" /><span>02</span></div>
      </div>
    </section>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const variant = firstAvailableVariant(product);
  const [liked, setLiked] = useState(false);
  const price = product.priceRange.min;
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link href={`/product/${product.handle}`} aria-label={`Ver ${product.title}`}>
          <ImageFrame src={product.images[0]?.url} alt={product.images[0]?.altText || product.title} />
        </Link>
        <div className="product-badge">New in</div>
        <button className={`heart-button ${liked ? "liked" : ""}`} onClick={() => setLiked(!liked)} aria-label={liked ? "Quitar de favoritos" : "Añadir a favoritos"}>
          <Heart size={17} fill={liked ? "currentColor" : "none"} strokeWidth={1.6} />
        </button>
        <button className="quick-add" onClick={() => variant && onAdd(product)} disabled={!variant?.availableForSale}>
          {variant?.availableForSale ? "Añadir a la bolsa" : "Agotado"}<ArrowUpRight size={15} />
        </button>
      </div>
      <div className="product-meta">
        <div>
          <p className="product-category">{product.productType || "Handmade"}</p>
          <Link href={`/product/${product.handle}`} className="product-title">{product.title}</Link>
        </div>
        <span className="product-price">{formatMoney(price.amount, price.currencyCode)}</span>
      </div>
      <div className="product-tags">
        {(product.tags || []).filter(tag => !["New in", "Soft accessories", "Everyday carry"].includes(tag)).slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}
      </div>
    </article>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)} aria-label={label}>
        <option value="all">All {label.toLowerCase()}</option>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown size={14} />
    </label>
  );
}

function ShopSection({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [color, setColor] = useState("all");
  const [size, setSize] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { addItem } = useCart();

  const categories = useMemo(() => Array.from(new Set(products.map(product => product.productType).filter(Boolean) as string[])), [products]);
  const colors = useMemo(() => Array.from(new Set(products.flatMap(product => product.tags).filter(tag => ["Sage", "Cream", "Oat", "Blush", "Charcoal", "Terracotta"].includes(tag)))), [products]);
  const sizes = useMemo(() => Array.from(new Set(products.flatMap(product => product.tags).filter(tag => ["Small", "Medium", "Large", "One size"].includes(tag)))), [products]);
  const filteredProducts = useMemo(() => products.filter(product => {
    const haystack = `${product.title} ${product.productType || ""} ${product.tags.join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase())
      && (category === "all" || product.productType === category)
      && (color === "all" || product.tags.includes(color))
      && (size === "all" || product.tags.includes(size));
  }), [products, query, category, color, size]);

  const addProduct = async (product: Product) => {
    const variant = firstAvailableVariant(product);
    if (!variant) return;
    try {
      await addItem(variant.id);
      toast.success(`${product.title} added to your bag`, { description: "Ready whenever you are." });
    } catch {
      toast.error("No pudimos añadir esta pieza", { description: "Inténtalo de nuevo en un momento." });
    }
  };

  return (
    <section className="shop-section" id="shop">
      <div className="section-intro">
        <div>
          <div className="eyebrow">Shop the edit <span className="eyebrow-line" /></div>
          <h2>Piezas para <em>quedarse.</em></h2>
        </div>
        <p className="section-caption">Diseñadas en pequeñas tandas,<br />tejidas con intención.</p>
      </div>
      <div className="shop-toolbar">
        <div className="search-field"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar piezas..." aria-label="Buscar productos" /></div>
        <button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} /> Filters <span>{[category, color, size].filter(value => value !== "all").length || ""}</span></button>
        <div className={`filters ${filtersOpen ? "is-open" : ""}`}>
          <FilterSelect label="Category" value={category} options={categories} onChange={setCategory} />
          <FilterSelect label="Color" value={color} options={colors} onChange={setColor} />
          <FilterSelect label="Size" value={size} options={sizes} onChange={setSize} />
        </div>
        <span className="results-count">{filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}</span>
      </div>
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map(product => <ProductCard product={product} onAdd={addProduct} key={product.id} />)}
        </div>
      ) : (
        <div className="empty-state"><Sparkles size={22} /><h3>Nothing here yet.</h3><p>Prueba con otro filtro o vuelve a ver la colección completa.</p><button className="text-button" onClick={() => { setQuery(""); setCategory("all"); setColor("all"); setSize("all"); }}>Reset filters <ArrowRight size={15} /></button></div>
      )}
    </section>
  );
}

function RecommendedRail({ products }: { products: Product[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollRail = (direction: number) => railRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  const { addItem } = useCart();
  return (
    <section className="recommended-section" id="journal">
      <div className="recommended-header">
        <div><div className="eyebrow">You may also like <span className="eyebrow-line" /></div><h2>Small joys,<br /><em>well made.</em></h2></div>
        <div className="rail-controls"><button onClick={() => scrollRail(-1)} aria-label="Anterior"><ChevronLeft size={18} /></button><button onClick={() => scrollRail(1)} aria-label="Siguiente"><ChevronRight size={18} /></button></div>
      </div>
      <div className="recommended-rail" ref={railRef}>
        {products.concat(products).slice(0, 4).map((product, index) => {
          const variant = firstAvailableVariant(product);
          return <Link href={`/product/${product.handle}`} className="recommended-card" key={`${product.id}-${index}`}>
            <ImageFrame src={product.images[0]?.url} alt={product.title} />
            <div className="recommended-card-meta"><span>{product.productType || "Crochet"}</span><strong>{product.title}</strong><span>{formatMoney(product.priceRange.min.amount, product.priceRange.min.currencyCode)}</span></div>
            <button className="recommended-add" aria-label={`Añadir ${product.title}`} onClick={async event => { event.preventDefault(); event.stopPropagation(); if (variant) { await addItem(variant.id); toast.success("Added to your bag"); } }}>+</button>
          </Link>;
        })}
      </div>
    </section>
  );
}

function StoryBand() {
  return (
    <section className="story-band" id="story">
      <div className="story-mark">CE<span>•</span>26</div>
      <div className="story-copy"><div className="eyebrow">A little more human</div><h2>Hecho para<br /><em>sentir.</em></h2><p>CrochetEra nace de una idea sencilla: que vestirse puede ser un ritual. Creamos piezas con las manos, en colores que dejan espacio para respirar y formas que acompañan, no que compiten.</p><button className="text-button">Conoce nuestra historia <ArrowRight size={15} /></button></div>
      <div className="story-details"><div><span>01</span><strong>Textura táctil</strong><p>Hilos seleccionados<br />para durar.</p></div><div><span>02</span><strong>Ritmo lento</strong><p>Pequeñas tandas,<br />menos desperdicio.</p></div><div><span>03</span><strong>Diseño suave</strong><p>Color tranquilo,<br />formas honestas.</p></div></div>
    </section>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><div><Link href="/" className="wordmark footer-wordmark"><span className="wordmark-c">C</span>rochet<span className="wordmark-era">Era</span><span className="wordmark-dot">.</span></Link><p className="footer-tagline">Textura para sentir.<br />Piezas para quedarse.</p></div><div className="footer-column"><span className="footer-label">Explore</span><a href="#shop">Shop all</a><a href="#story">Our story</a><a href="#journal">Journal</a></div><div className="footer-column"><span className="footer-label">Care</span><a href="#shipping">Shipping & returns</a><a href="#size">Size guide</a><a href="#care">Product care</a></div><div className="footer-newsletter"><span className="footer-label">Stay soft</span><p>Notas de la colección, directo a tu inbox.</p><form onSubmit={event => { event.preventDefault(); toast.success("You're on the list", { description: "Mira tu inbox para la bienvenida." }); }}><input type="email" placeholder="Tu email" required aria-label="Correo electrónico" /><button type="submit" aria-label="Suscribirse"><ArrowUpRight size={17} /></button></form><div className="footer-social"><a href="#instagram" aria-label="Instagram"><Instagram size={17} /></a><a href="#mail" aria-label="Email"><Mail size={17} /></a></div></div></div><div className="footer-bottom"><span>© 2026 CrochetEra Studio</span><span>Made with intention in small batches</span><span>Privacy · Terms · Cookies</span></div></footer>;
}

function CartDrawer() {
  const { cart, isOpen, loading, closeCart, updateQuantity, removeItem, proceedToCheckout } = useCart();
  if (!isOpen) return null;
  const items = cart?.items ?? [];
  return <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Shopping bag"><button className="cart-backdrop" onClick={closeCart} aria-label="Cerrar carrito" /><aside className="cart-drawer"><div className="cart-drawer-header"><div><span className="eyebrow">Your edit</span><h2>Your bag <span>{cart?.itemCount ?? 0}</span></h2></div><button onClick={closeCart} className="drawer-close" aria-label="Cerrar"><X size={19} /></button></div>{items.length === 0 ? <div className="cart-empty"><ShoppingBag size={28} strokeWidth={1.2} /><h3>Your bag is waiting.</h3><p>Empieza con una pieza que te haga sentir.</p><button className="button button-dark" onClick={closeCart}>Volver a la tienda</button></div> : <><div className="cart-items">{items.map(item => <div className="cart-item" key={item.lineId}><ImageFrame src={item.image?.url} alt={item.productTitle} /><div className="cart-item-info"><Link href={`/product/${item.productHandle}`} onClick={closeCart}>{item.productTitle}</Link><span>{displayVariantTitle(item.variantTitle)}</span><strong>{formatMoney(item.unitPrice.amount, item.unitPrice.currencyCode)}</strong><div className="quantity-control"><button onClick={() => updateQuantity(item.lineId, Math.max(0, item.quantity - 1))} aria-label="Disminuir"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.lineId, item.quantity + 1)} aria-label="Aumentar"><Plus size={13} /></button></div></div><button className="remove-item" onClick={() => removeItem(item.lineId)}>Remove</button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{formatMoney(cart?.subtotal.amount || "0", cart?.subtotal.currencyCode || "USD")}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="button button-dark checkout-button" onClick={proceedToCheckout} disabled={loading}>{loading ? <Loader2 size={16} className="spin" /> : <Truck size={16} />} Continue to checkout <ArrowUpRight size={16} /></button><button className="continue-shopping" onClick={closeCart}>Continue shopping</button></div></>}</aside></div>;
}

export default function Home() {
  const productQueryInput = useMemo(() => ({ first: 24 }), []);
  const { data: products = [], isLoading, isError } = trpc.commerce.products.list.useQuery(productQueryInput);
  const featuredProduct = products.find(product => product.productType === "Cardigans") || products[0];
  return <div className="storefront"><Header />{isLoading ? <main className="loading-state"><Loader2 className="spin" size={28} /><span>Preparing the soft edit...</span></main> : isError ? <main className="error-state"><Sparkles size={24} /><h1>We’re taking a quiet moment.</h1><p>El catálogo de Shopify no está disponible todavía.</p></main> : <><main><Hero featuredProduct={featuredProduct} /><ShopSection products={products} /><StoryBand /><RecommendedRail products={products} /></main><Footer /></>}<CartDrawer /></div>;
}

export function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [, navigate] = useLocation();
  const { data: product, isLoading, isError } = trpc.commerce.products.byHandle.useQuery({ handle: handle || "" }, { enabled: Boolean(handle) });
  const { addItem, loading } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const variant = product?.variants.find(item => item.id === selectedVariantId) || product?.variants.find(item => item.availableForSale) || product?.variants[0];

  if (isLoading) return <div className="storefront"><Header /><main className="loading-state pdp-loading"><Loader2 className="spin" size={28} /><span>Opening the piece...</span></main></div>;
  if (isError || !product) return <div className="storefront"><Header /><main className="error-state"><h1>Piece not found.</h1><button className="text-button" onClick={() => navigate("/")}>Back to shop <ArrowRight size={15} /></button></main></div>;
  const addToBag = async () => { if (!variant) return; try { await addItem(variant.id, quantity); toast.success(`${product.title} added to your bag`); } catch { toast.error("No pudimos añadir esta pieza"); } };
  return <div className="storefront"><Header /><main className="pdp"><div className="pdp-breadcrumb"><button onClick={() => navigate("/")}><ArrowLeft size={15} /> Back to shop</button><span>/</span><span>{product.title}</span></div><div className="pdp-grid"><div className="pdp-gallery"><div className="pdp-main-image"><ImageFrame src={product.images[activeImage]?.url} alt={product.title} priority /></div>{product.images.length > 1 && <div className="pdp-thumbnails">{product.images.map((image, index) => <button key={image.url} className={index === activeImage ? "active" : ""} onClick={() => setActiveImage(index)}><img src={image.url} alt={`${product.title} vista ${index + 1}`} /></button>)}</div>}</div><div className="pdp-info"><div className="eyebrow">{product.productType || "CrochetEra"} <span className="eyebrow-line" /></div><h1>{product.title}</h1><div className="pdp-price">{formatMoney(product.priceRange.min.amount, product.priceRange.min.currencyCode)}</div><p className="pdp-description">{product.description}</p><div className="pdp-rule" />{product.options.map(option => <div className="option-group" key={option.name}><div><span>{option.name}</span><span className="option-hint">{option.values.length === 1 ? option.values[0] : "Select one"}</span></div><div className="option-chips">{option.values.map(value => <button key={value} className={option.values.length === 1 || variant?.selectedOptions.some(selected => selected.value === value) ? "selected" : ""} onClick={() => { const matching = product.variants.find(item => item.selectedOptions.some(selected => selected.value === value)); if (matching) setSelectedVariantId(matching.id); }}>{value}{(option.values.length === 1 || variant?.selectedOptions.some(selected => selected.value === value)) && <Check size={13} />}</button>)}</div></div>)}<div className="pdp-add-row"><div className="quantity-control large"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Disminuir cantidad"><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Aumentar cantidad"><Plus size={14} /></button></div><button className="button button-dark add-button" onClick={addToBag} disabled={loading || !variant?.availableForSale}>{loading ? <Loader2 size={17} className="spin" /> : <ShoppingBag size={17} />} Add to bag <ArrowUpRight size={16} /></button></div><div className="pdp-benefits"><div><Truck size={17} /><span>Free shipping<br /><small>On orders over $120</small></span></div><div><Heart size={17} /><span>Made to last<br /><small>Soft care included</small></span></div></div><details className="pdp-details"><summary>Details <Plus size={15} /></summary><p>{product.description || "Pieza tejida a mano con materiales seleccionados para acompañarte durante años."}</p></details><details className="pdp-details"><summary>Shipping & returns <Plus size={15} /></summary><p>Envíos gratuitos sobre $120. Cambios y devoluciones dentro de 14 días.</p></details></div></div></main><Footer /><CartDrawer /></div>;
}
