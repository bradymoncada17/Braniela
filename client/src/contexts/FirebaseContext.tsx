import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Product } from './ProductContext';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
}

interface FirebaseContextType {
  user: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  categories: Category[];
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Monitorear autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sincronizar productos en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productsData: Product[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({
            id: data.id || 0, // Use the id from data if available, otherwise 0
            ...data,
            _firestoreId: doc.id, // Store the Firestore document ID separately
          } as Product & { _firestoreId: string });
        });
        setProducts(productsData);
      },
      (error) => {
        console.error('Error fetching products:', error);
        toast.error('Error al cargar productos');
      }
    );

    return unsubscribe;
  }, []);

  // Sincronizar categorías en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const categoriesData: Category[] = [];
        snapshot.forEach((doc) => {
          categoriesData.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
        setCategories(categoriesData);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Credenciales inválidas');
      return false;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('Sesión cerrada');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), product);
      toast.success('Producto creado correctamente');
    } catch (error) {
      console.error('Add product error:', error);
      toast.error('Error al crear producto');
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      // Find the product to get its Firestore document ID
      const product = products.find(p => {
        const pWithId = p as Product & { _firestoreId?: string };
        return pWithId._firestoreId === id || String(p.id) === id;
      });
      
      if (!product) {
        toast.error('Producto no encontrado');
        return;
      }
      
      const pWithId = product as Product & { _firestoreId?: string };
      const firestoreId = pWithId._firestoreId || id;
      
      const productRef = doc(db, 'products', firestoreId);
      await updateDoc(productRef, updates);
      toast.success('Producto actualizado correctamente');
    } catch (error) {
      console.error('Update product error:', error);
      toast.error('Error al actualizar producto');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      // Find the product to get its Firestore document ID
      const product = products.find(p => {
        const pWithId = p as Product & { _firestoreId?: string };
        return pWithId._firestoreId === id || String(p.id) === id;
      });
      
      if (!product) {
        toast.error('Producto no encontrado');
        return;
      }
      
      const pWithId = product as Product & { _firestoreId?: string };
      const firestoreId = pWithId._firestoreId || id;
      
      await deleteDoc(doc(db, 'products', firestoreId));
      toast.success('Producto eliminado correctamente');
    } catch (error) {
      console.error('Delete product error:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const addCategory = async (name: string) => {
    try {
      await addDoc(collection(db, 'categories'), { name });
      toast.success('Categoría creada correctamente');
    } catch (error) {
      console.error('Add category error:', error);
      toast.error('Error al crear categoría');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Categoría eliminada correctamente');
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error('Error al eliminar categoría');
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase debe ser usado dentro de FirebaseProvider');
  }
  return context;
};
