import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Product } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, AlertCircle, Plus, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { DEFAULT_CATEGORIES } from '@/lib/categories';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  volume?: string;
  stock?: number;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const { addProduct, updateProduct, categories, addCategory } = useFirebase();
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: product
      ? {
          name: product.name,
          brand: product.brand,
          category: product.category,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          volume: product.volume,
          stock: product.stock || 100,
        }
      : {
          stock: 100,
        },
  });

  const selectedCategory = watch('category');

  // Combinar categorías de Firestore con categorías por defecto
  const allCategories = useMemo(() => {
    const firebaseNames = new Set(categories.map(c => c.name));
    const defaults = DEFAULT_CATEGORIES.filter(d => !firebaseNames.has(d));
    return [...categories, ...defaults.map(name => ({ id: name, name }))];
  }, [categories]);

  const onSubmit = async (data: FormData) => {
    try {
      if (product) {
        const productWithId = product as any;
        const firestoreId = productWithId._firestoreId || String(product.id);
        await updateProduct(firestoreId, {
          ...data,
          type: 'single',
        });
      } else {
        await addProduct({
          ...data,
          type: 'single',
        });
        reset();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('El nombre de la categoría no puede estar vacío');
      return;
    }

    setIsCreatingCategory(true);
    try {
      await addCategory(newCategoryName);
      setValue('category', newCategoryName);
      setNewCategoryName('');
      setShowNewCategoryInput(false);
    } catch (error) {
      toast.error('Error al crear la categoría');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card rounded-lg border border-border p-8 max-w-2xl"
    >
      <div className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nombre del Producto *
          </label>
          <Input
            {...register('name', {
              required: 'El nombre es requerido',
              minLength: {
                value: 3,
                message: 'El nombre debe tener al menos 3 caracteres',
              },
            })}
            placeholder="Ej: Lattafa Opulent Oud"
            className="w-full"
          />
          {errors.name && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle size={16} />
              {errors.name.message}
            </div>
          )}
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Marca *
          </label>
          <Input
            {...register('brand', {
              required: 'La marca es requerida',
            })}
            placeholder="Ej: Lattafa"
            className="w-full"
          />
          {errors.brand && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle size={16} />
              {errors.brand.message}
            </div>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Categoría *
          </label>
          {!showNewCategoryInput ? (
            <div className="flex gap-2">
              <select
                {...register('category', {
                  required: 'La categoría es requerida',
                })}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Selecciona una categoría</option>
                {allCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategoryInput(true)}
                className="px-4 py-2 rounded-lg border border-border bg-secondary text-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Nueva
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                className="flex-1"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={isCreatingCategory}
                className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewCategoryInput(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 rounded-lg border border-border bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          )}
          {errors.category && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle size={16} />
              {errors.category.message}
            </div>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Descripción (mínimo 50 caracteres) *
          </label>
          <Textarea
            {...register('description', {
              required: 'La descripción es requerida',
              minLength: {
                value: 50,
                message: 'La descripción debe tener al menos 50 caracteres',
              },
            })}
            placeholder="Describe el perfume, notas olfativas, características..."
            className="w-full min-h-32"
          />
          {errors.description && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle size={16} />
              {errors.description.message}
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Precio Final ($) *
            </label>
            <Input
              type="number"
              {...register('price', {
                required: 'El precio es requerido',
                min: {
                  value: 0,
                  message: 'El precio debe ser positivo',
                },
              })}
              placeholder="0"
              className="w-full"
            />
            {errors.price && (
              <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                <AlertCircle size={16} />
                {errors.price.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Precio Original ($) *
            </label>
            <Input
              type="number"
              {...register('originalPrice', {
                required: 'El precio original es requerido',
                min: {
                  value: 0,
                  message: 'El precio debe ser positivo',
                },
              })}
              placeholder="0"
              className="w-full"
            />
            {errors.originalPrice && (
              <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                <AlertCircle size={16} />
                {errors.originalPrice.message}
              </div>
            )}
          </div>
        </div>

        {/* URL de Imagen */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            URL de la Imagen *
          </label>
          <Input
            {...register('image', {
              required: 'La URL de la imagen es requerida',
              validate: (value) => {
                if (!value) return 'La URL es requerida';
                // Permitir URLs que comiencen con http:// o https:// o /manus-storage/
                if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/manus-storage/')) {
                  return true;
                }
                return 'Debe ser una URL válida (http://, https://) o ruta interna (/manus-storage/...)';
              },
            })}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full"
          />
          <p className="text-xs text-foreground/60 mt-2">
            Usa URLs públicas (ej: Amazon, Google Images). Las imágenes se mostrarán en la tabla.
          </p>
          {errors.image && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle size={16} />
              {errors.image.message}
            </div>
          )}
        </div>

        {/* Volumen */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Volumen
          </label>
          <Input
            {...register('volume')}
            placeholder="Ej: 100ml, 75ml"
            className="w-full"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Stock
          </label>
          <Input
            type="number"
            {...register('stock', {
              min: {
                value: 0,
                message: 'El stock debe ser positivo',
              },
            })}
            placeholder="100"
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {product ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </div>
      </div>
    </motion.form>
  );
};
