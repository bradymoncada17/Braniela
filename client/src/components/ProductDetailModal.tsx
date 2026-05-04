import React, { useState } from 'react';
import { X, ShoppingCart, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/contexts/ProductContext';
import { CheckoutFlow } from './CheckoutFlow';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen || !product) return null;

  const handleBuy = () => {
    setShowCheckout(true);
  };

  const totalPrice = product.price * quantity;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {/* Header Elegante */}
          <div className="sticky top-0 bg-gradient-to-r from-white via-white to-gray-50 border-b border-gray-200 px-12 py-8 flex justify-between items-start">
            <div className="flex-1">
              <p className="text-amber-600 text-xs font-light tracking-[0.2em] uppercase">Braniela Collection</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-5xl font-light text-gray-900 mt-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 text-sm mt-3 font-light">{product.brand}</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-full transition text-gray-600 hover:text-gray-900"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div className="px-12 py-12 space-y-12">
            {/* Image and Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Product Image - Columna Izquierda */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <div className="bg-gray-50 rounded-2xl overflow-hidden h-[500px] flex items-center justify-center border border-gray-200 shadow-sm">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/500x600?text=Product';
                      }}
                    />
                  ) : (
                    <div className="text-gray-400">Imagen no disponible</div>
                  )}
                </div>
              </motion.div>

              {/* Detalles Rápidos - Columna Derecha */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Volumen */}
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-2">Volumen</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light text-gray-900">
                    {product.volume || '100ml'}
                  </p>
                </div>

                {/* Stock */}
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-2">Disponibilidad</p>
                  <p className="text-lg font-light text-green-600">
                    {product.stock && product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                  </p>
                </div>

                {/* Categoría */}
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-2">Categoría</p>
                  <p className="text-lg font-light text-gray-900">{product.category}</p>
                </div>

                {/* Precio */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-3">Precio</p>
                  <div className="flex items-baseline gap-3">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl font-light text-gray-900">
                      ${product.price.toLocaleString('es-CO')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm line-through text-gray-400">
                        ${product.originalPrice.toLocaleString('es-CO')}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Descripción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-t border-gray-200 pt-12"
            >
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light text-gray-900 mb-6">
                Descripción
              </h2>
              <p className="text-gray-700 leading-relaxed text-base font-light max-w-3xl">
                {product.description}
              </p>
            </motion.div>

            {/* Notas Olfativas */}
            {product.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border-t border-gray-200 pt-12"
              >
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light text-gray-900 mb-8">
                  Notas Olfativas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {product.notes.top && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <Droplet size={18} className="text-amber-600" strokeWidth={1.5} />
                        <p className="text-xs text-gray-500 font-light tracking-widest uppercase">Salida</p>
                      </div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900 group-hover:text-amber-600 transition">
                        {product.notes.top}
                      </p>
                    </div>
                  )}
                  {product.notes.heart && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <Droplet size={18} className="text-amber-600" strokeWidth={1.5} />
                        <p className="text-xs text-gray-500 font-light tracking-widest uppercase">Corazón</p>
                      </div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900 group-hover:text-amber-600 transition">
                        {product.notes.heart}
                      </p>
                    </div>
                  )}
                  {product.notes.base && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <Droplet size={18} className="text-amber-600" strokeWidth={1.5} />
                        <p className="text-xs text-gray-500 font-light tracking-widest uppercase">Base</p>
                      </div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900 group-hover:text-amber-600 transition">
                        {product.notes.base}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Selector de Cantidad y Compra */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-t border-gray-200 pt-12 space-y-6"
            >
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-3">Cantidad</p>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900 transition font-light text-lg"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 bg-transparent text-gray-900 font-light text-lg focus:outline-none"
                      min="1"
                      max={product.stock || 100}
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock || 100, quantity + 1))
                      }
                      className="px-3 py-2 text-gray-600 hover:text-gray-900 transition font-light text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-3">Total</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl font-light text-gray-900">
                    ${totalPrice.toLocaleString('es-CO')}
                  </p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuy}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-light py-4 rounded-lg flex items-center justify-center gap-3 transition shadow-lg text-lg tracking-wide"
                >
                  <ShoppingCart size={20} strokeWidth={1.5} />
                  Comprar Ahora
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-light py-4 rounded-lg transition text-lg tracking-wide"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8 text-center">
              <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-light text-gray-600">
                Braniela — Perfumería de Lujo
              </p>
              <p className="text-xs text-gray-400 font-light mt-2 tracking-widest uppercase">
                Cada fragancia es una expresión única de tu personalidad
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Checkout Flow */}
      <CheckoutFlow
        product={product}
        quantity={quantity}
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </AnimatePresence>
  );
};
