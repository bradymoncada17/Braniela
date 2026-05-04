import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useFirebase, type Product } from '@/contexts/FirebaseContext';
import { ProductDetailModal } from './ProductDetailModal';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

function ProductCard({ product, onProductClick }: ProductCardProps) {
  const whatsappMessage = `Hola Braniela, me interesa el perfume ${product.name} de ${product.brand}. Me gustaría conocer más detalles y disponibilidad.`;
  const whatsappLink = `https://wa.me/3041100640?text=${encodeURIComponent(whatsappMessage)}`;

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPrice = typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice;
  
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="card-luxury group"
    >
      {/* Image Container */}
      <div className="relative h-96 overflow-hidden bg-white flex items-center justify-center border-b border-gray-100">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-6 bg-white"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6 }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2212%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-sm text-xs font-medium tracking-wide">
          {product.category}
        </div>
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-sm text-xs font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Brand and Title */}
        <p className="text-xs text-accent font-medium tracking-widest mb-2">
          {product.brand}
        </p>
        <h3 className="text-xl font-light text-foreground mb-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-foreground/70 font-light mb-4 line-clamp-2">
          {product.description || 'Perfume de lujo de alta calidad'}
        </p>

        {/* Volume */}
        <p className="text-xs text-foreground/60 font-light mb-4">
          Volumen: {product.volume || 'N/A'}
        </p>

        {/* Notes (if available) */}
        {product.notes && (
          <div className="space-y-2 mb-4 text-xs">
            {product.notes.top && (
              <div>
                <span className="text-accent font-medium">Salida:</span>
                <p className="text-foreground/70 font-light">{product.notes.top}</p>
              </div>
            )}
            {product.notes.heart && (
              <div>
                <span className="text-accent font-medium">Corazón:</span>
                <p className="text-foreground/70 font-light">{product.notes.heart}</p>
              </div>
            )}
            {product.notes.base && (
              <div>
                <span className="text-accent font-medium">Fondo:</span>
                <p className="text-foreground/70 font-light">{product.notes.base}</p>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mb-6 flex items-baseline gap-3">
          <span className="text-2xl font-light text-foreground">
            ${price.toLocaleString()}
          </span>
          {originalPrice > price && (
            <span className="text-sm text-foreground/50 line-through">
              ${originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Button */}
        <div className="flex gap-3">
          <motion.button
            onClick={() => onProductClick(product)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-sm font-medium text-sm transition-all duration-300 hover:shadow-lg"
          >
            <MessageCircle size={16} />
            Ver Detalles
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Catalog() {
  const { products: firestoreProducts } = useFirebase();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Sincronizar con categoría seleccionada desde sessionStorage
  useEffect(() => {
    const category = sessionStorage.getItem('selectedCategory');
    if (category) {
      setSelectedCategory(category);
      sessionStorage.removeItem('selectedCategory');
    }
  }, []);

  // Filtrar productos en tiempo real
  const filteredProducts = useMemo(() => {
    if (selectedCategory) {
      return firestoreProducts.filter(p => p.category === selectedCategory);
    }
    return firestoreProducts;
  }, [firestoreProducts, selectedCategory]);

  // Obtener categorías únicas en tiempo real
  const categories = useMemo(() => {
    return Array.from(new Set(firestoreProducts.map(p => p.category)));
  }, [firestoreProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="catalog" className="py-24 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-foreground mb-4">
            Catálogo de Productos
          </h2>
          <div className="w-16 h-px bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/70 font-light max-w-2xl mx-auto">
            Descubre nuestra colección exclusiva de perfumes de lujo de las mejores marcas internacionales.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-sm font-medium text-sm transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-accent text-accent-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Todos
          </motion.button>
          {categories.map((category, idx) => (
            <motion.button
              key={`category-${category}-${idx}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-sm font-medium text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, idx) => {
            const keyValue = product._firestoreId || `product-${product.id}-${idx}`;
            return (
              <motion.div key={keyValue} variants={itemVariants}>
                <ProductCard product={product} onProductClick={handleProductClick} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-foreground/70 font-light text-lg">
              No hay productos disponibles en esta categoría.
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 pt-12 border-t border-border text-center"
        >
          <p className="text-lg text-foreground/70 font-light">
            Mostrando <span className="text-accent font-medium">{filteredProducts.length}</span> de <span className="text-accent font-medium">{firestoreProducts.length}</span> productos disponibles.
          </p>
        </motion.div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
