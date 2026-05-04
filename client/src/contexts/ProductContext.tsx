import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products as initialProducts } from '@/data/products';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  notes?: {
    top?: string;
    heart?: string;
    base?: string;
  };
  volume?: string;
  type: 'single';
  stock?: number;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

interface ProductContextType {
  products: Product[];
  user: User | null;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos desde localStorage al montar
  useEffect(() => {
    const savedProducts = localStorage.getItem('braniela_products');
    const savedUser = localStorage.getItem('braniela_user');

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(initialProducts.map((p, idx) => ({ ...p, stock: 100 })));
      }
    } else {
      // Inicializar con productos por defecto
      const productsWithStock = initialProducts.map((p, idx) => ({
        ...p,
        stock: 100,
      }));
      setProducts(productsWithStock);
      localStorage.setItem('braniela_products', JSON.stringify(productsWithStock));
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('braniela_products', JSON.stringify(products));
    }
  }, [products, isLoading]);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('braniela_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('braniela_user');
    }
  }, [user]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1,
      stock: product.stock || 100,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(products.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const login = (email: string, password: string): boolean => {
    // Credenciales de demostración (en producción usar autenticación real)
    if (email === 'admin@braniela.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        email,
        isAdmin: true,
      };
      setUser(adminUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        user,
        addProduct,
        updateProduct,
        deleteProduct,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de ProductProvider');
  }
  return context;
};
