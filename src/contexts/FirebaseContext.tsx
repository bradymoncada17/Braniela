import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export type { Product } from './ProductContext';

export interface Category {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalPurchases: number;
  totalDebt: number;
  createdAt: Date;
  _firestoreId?: string;
}

export interface Sale {
  id: string;
  clientId: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  includeIVA: boolean;
  paymentMethod: string;
  createdAt: Date;
  _firestoreId?: string;
}

export interface PaymentPlan {
  id: string;
  saleId: string;
  clientId: string;
  total: number;
  installments: number;
  monthlyPayment: number;
  interest: number;
  payments: PaymentSchedule[];
  createdAt: Date;
  _firestoreId?: string;
}

export interface PaymentSchedule {
  number: number;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
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
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | '_firestoreId'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | '_firestoreId'>) => Promise<void>;
  paymentPlans: PaymentPlan[];
  addPaymentPlan: (plan: Omit<PaymentPlan, 'id' | 'createdAt' | '_firestoreId'>) => Promise<void>;
  getSalesByClient: (clientId: string) => Sale[];
  getPaymentPlansBySale: (saleId: string) => PaymentPlan[];
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);

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
        let index = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Asegurar que cada producto tenga un ID único
          const productId = data.id !== undefined && data.id !== null ? data.id : index;
          productsData.push({
            id: typeof productId === 'number' ? productId : index,
            ...data,
            _firestoreId: doc.id,
          } as Product & { _firestoreId: string });
          index++;
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

  // Sincronizar clientes en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const clientsData: Client[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          clientsData.push({
            id: data.id || doc.id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            totalPurchases: data.totalPurchases || 0,
            totalDebt: data.totalDebt || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
            _firestoreId: doc.id,
          });
        });
        setClients(clientsData);
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
    return unsubscribe;
  }, []);

  // Sincronizar ventas en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'sales'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const salesData: Sale[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          salesData.push({
            id: data.id || doc.id,
            clientId: data.clientId,
            items: data.items || [],
            subtotal: data.subtotal || 0,
            tax: data.tax || 0,
            total: data.total || 0,
            includeIVA: data.includeIVA || false,
            paymentMethod: data.paymentMethod || 'Efectivo',
            createdAt: data.createdAt?.toDate() || new Date(),
            _firestoreId: doc.id,
          });
        });
        setSales(salesData);
      },
      (error) => {
        console.error('Error fetching sales:', error);
      }
    );
    return unsubscribe;
  }, []);

  // Sincronizar planes de pago en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'paymentPlans'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const plansData: PaymentPlan[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          plansData.push({
            id: data.id || doc.id,
            saleId: data.saleId,
            clientId: data.clientId,
            total: data.total || 0,
            installments: data.installments || 1,
            monthlyPayment: data.monthlyPayment || 0,
            interest: data.interest || 0,
            payments: (data.payments || []).map((p: any) => ({
              number: p.number,
              amount: p.amount,
              dueDate: p.dueDate?.toDate ? p.dueDate.toDate() : new Date(p.dueDate),
              status: p.status || 'pending',
            })),
            createdAt: data.createdAt?.toDate() || new Date(),
            _firestoreId: doc.id,
          });
        });
        setPaymentPlans(plansData);
      },
      (error) => {
        console.error('Error fetching payment plans:', error);
      }
    );
    return unsubscribe;
  }, []);

  const addClient = async (client: Omit<Client, 'id' | 'createdAt' | '_firestoreId'>) => {
    try {
      await addDoc(collection(db, 'clients'), {
        ...client,
        createdAt: new Date(),
      });
      toast.success('Cliente creado correctamente');
    } catch (error) {
      console.error('Add client error:', error);
      toast.error('Error al crear cliente');
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const client = clients.find(c => c._firestoreId === id || c.id === id);
      if (!client) {
        toast.error('Cliente no encontrado');
        return;
      }
      const firestoreId = client._firestoreId || id;
      await updateDoc(doc(db, 'clients', firestoreId), updates);
      toast.success('Cliente actualizado correctamente');
    } catch (error) {
      console.error('Update client error:', error);
      toast.error('Error al actualizar cliente');
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const client = clients.find(c => c._firestoreId === id || c.id === id);
      if (!client) {
        toast.error('Cliente no encontrado');
        return;
      }
      const firestoreId = client._firestoreId || id;
      await deleteDoc(doc(db, 'clients', firestoreId));
      toast.success('Cliente eliminado correctamente');
    } catch (error) {
      console.error('Delete client error:', error);
      toast.error('Error al eliminar cliente');
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'createdAt' | '_firestoreId'>) => {
    try {
      await addDoc(collection(db, 'sales'), {
        ...sale,
        createdAt: new Date(),
      });
      toast.success('Venta registrada correctamente');
    } catch (error) {
      console.error('Add sale error:', error);
      toast.error('Error al registrar venta');
    }
  };

  const addPaymentPlan = async (plan: Omit<PaymentPlan, 'id' | 'createdAt' | '_firestoreId'>) => {
    try {
      await addDoc(collection(db, 'paymentPlans'), {
        ...plan,
        createdAt: new Date(),
      });
      toast.success('Plan de pago creado correctamente');
    } catch (error) {
      console.error('Add payment plan error:', error);
      toast.error('Error al crear plan de pago');
    }
  };

  const getSalesByClient = (clientId: string): Sale[] => {
    return sales.filter(sale => sale.clientId === clientId);
  };

  const getPaymentPlansBySale = (saleId: string): PaymentPlan[] => {
    return paymentPlans.filter(plan => plan.saleId === saleId);
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
        clients,
        addClient,
        updateClient,
        deleteClient,
        sales,
        addSale,
        paymentPlans,
        addPaymentPlan,
        getSalesByClient,
        getPaymentPlansBySale,
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
