import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Product } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import { ProductForm } from './ProductForm';

export const ProductTable: React.FC = () => {
  const { products, deleteProduct } = useFirebase();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const filteredProducts = useMemo(
    () =>
      products.filter(
        p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  const handleDelete = useCallback((product: Product, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      const productWithId = product as any;
      const firestoreId = productWithId._firestoreId || String(product.id);
      deleteProduct(firestoreId);
      toast.success('Producto eliminado correctamente');
    }
  }, [deleteProduct]);

  const handleImageError = useCallback((productId: string) => {
    setImageErrors(prev => new Set(prev).add(productId));
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o marca..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Edit Modal */}
      <AnimatePresence mode="wait">
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                <h3 className="text-2xl font-light text-foreground">Editar Producto</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <ProductForm
                  key={`${editingProduct.id}-${(editingProduct as any)._firestoreId}`}
                  product={editingProduct}
                  onSuccess={() => setEditingProduct(null)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 font-medium text-foreground/70">Nombre</th>
              <th className="text-left py-4 px-4 font-medium text-foreground/70">Marca</th>
              <th className="text-left py-4 px-4 font-medium text-foreground/70">Categoría</th>
              <th className="text-right py-4 px-4 font-medium text-foreground/70">Precio</th>
              <th className="text-right py-4 px-4 font-medium text-foreground/70">Stock</th>
              <th className="text-center py-4 px-4 font-medium text-foreground/70">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, idx) => {
                  const productWithId = product as any;
                  const firestoreId = productWithId._firestoreId || String(product.id);
                  const hasImageError = imageErrors.has(firestoreId);
                  return (
                    <motion.tr
                      key={firestoreId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border hover:bg-foreground/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-white flex-shrink-0 overflow-hidden flex items-center justify-center border border-border">
                            {!hasImageError && product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-1"
                                loading="lazy"
                                onError={() => handleImageError(firestoreId)}
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <span className="text-xs text-foreground/40 text-center px-1">No img</span>
                            )}
                          </div>
                          <span className="text-foreground font-medium text-sm truncate">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground/70">{product.brand}</td>
                      <td className="py-4 px-4 text-foreground/70">{product.category}</td>
                      <td className="py-4 px-4 text-right text-foreground font-medium">
                        ${product.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            (product.stock || 0) > 20
                              ? 'bg-green-500/20 text-green-700'
                              : (product.stock || 0) > 0
                                ? 'bg-yellow-500/20 text-yellow-700'
                                : 'bg-red-500/20 text-red-700'
                          }`}
                        >
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-2 hover:bg-blue-500/20 text-blue-600 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product, product.name)}
                            className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-foreground/60">
                      <AlertCircle size={32} />
                      <p>No se encontraron productos</p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-foreground/60 text-sm mb-1">Total de Productos</p>
          <p className="text-3xl font-light text-foreground">{products.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-foreground/60 text-sm mb-1">Stock Total</p>
          <p className="text-3xl font-light text-foreground">
            {products.reduce((sum, p) => sum + (p.stock || 0), 0)}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-foreground/60 text-sm mb-1">Valor Total</p>
          <p className="text-3xl font-light text-foreground">
            ${
              products
                .reduce((sum, p) => {
                  const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
                  const stock = typeof p.stock === 'string' ? parseInt(p.stock) : (p.stock || 0);
                  return sum + (price * stock);
                }, 0)
                .toLocaleString()
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
