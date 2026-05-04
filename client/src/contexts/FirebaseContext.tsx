import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
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

export interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
}

interface FirebaseContextType {
  user: User | null;
  isLoading: boolean;
  products: any[];
  clients: Client[];
  sales: Sale[];
  categories: Category[];
  paymentPlans: PaymentPlan[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>;
  updateSale: (id: string, sale: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  addPaymentPlan: (plan: Omit<PaymentPlan, 'id' | 'createdAt'>) => Promise<void>;
  getSalesByClient: (clientId: string) => Sale[];
  getPaymentPlansBySale: (saleId: string) => PaymentPlan[];
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Acceder a Firebase global
declare global {
  interface Window {
    firebase: any;
  }
}

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);

  // Inicializar Firebase
  useEffect(() => {
    const initFirebase = async () => {
      try {
        if (window.firebase && !window.firebase.apps.length) {
          // Configuración de Firebase
          const firebaseConfig = {
            apiKey: 'AIzaSyDtNPjSEFAxLjuhsZaFbYmZgMuM8gyeyQ8',
            authDomain: 'braniela-4215f.firebaseapp.com',
            projectId: 'braniela-4215f',
            storageBucket: 'braniela-4215f.firebasestorage.app',
            messagingSenderId: '607325821508',
            appId: '1:607325821508:web:240cd7747253a31295fa11',
            measurementId: 'G-QFNEJB3SVR',
          };

          window.firebase.initializeApp(firebaseConfig);
          
          // Monitorear autenticación
          const auth = window.firebase.auth();
          auth.onAuthStateChanged((firebaseUser: any) => {
            if (firebaseUser) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                isAdmin: true, // Asumir admin por ahora
              });
              loadDataFromFirestore();
            } else {
              setUser(null);
            }
            setIsLoading(false);
          });
        }
      } catch (error) {
        console.error('Error inicializando Firebase:', error);
        setIsLoading(false);
      }
    };

    initFirebase();
  }, []);

  const loadDataFromFirestore = async () => {
    try {
      const db = window.firebase.firestore();
      const auth = window.firebase.auth();
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      // Cargar productos
      const productsSnapshot = await db.collection('products').get();
      const productsData: any[] = [];
      productsSnapshot.forEach((doc: any) => {
        productsData.push({
          id: doc.id,
          ...doc.data(),
          _firestoreId: doc.id,
        });
      });
      setProducts(productsData);

      // Cargar categorías
      const categoriesSnapshot = await db.collection('categories').get();
      const categoriesData: Category[] = [];
      categoriesSnapshot.forEach((doc: any) => {
        categoriesData.push({
          id: doc.id,
          name: doc.data().name,
        });
      });
      setCategories(categoriesData);

      // Cargar clientes
      const clientsSnapshot = await db.collection('clients').get();
      const clientsData: Client[] = [];
      clientsSnapshot.forEach((doc: any) => {
        const data = doc.data();
        clientsData.push({
          id: doc.id,
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

      // Cargar ventas
      const salesSnapshot = await db.collection('sales').get();
      const salesData: Sale[] = [];
      salesSnapshot.forEach((doc: any) => {
        const data = doc.data();
        salesData.push({
          id: doc.id,
          clientId: data.clientId,
          items: data.items || [],
          subtotal: data.subtotal || 0,
          tax: data.tax || 0,
          total: data.total || 0,
          includeIVA: data.includeIVA || false,
          paymentMethod: data.paymentMethod || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          _firestoreId: doc.id,
        });
      });
      setSales(salesData);

      // Cargar planes de pago
      const plansSnapshot = await db.collection('paymentPlans').get();
      const plansData: PaymentPlan[] = [];
      plansSnapshot.forEach((doc: any) => {
        const data = doc.data();
        plansData.push({
          id: doc.id,
          saleId: data.saleId,
          clientId: data.clientId,
          total: data.total || 0,
          installments: data.installments || 0,
          monthlyPayment: data.monthlyPayment || 0,
          interest: data.interest || 0,
          payments: data.payments || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          _firestoreId: doc.id,
        });
      });
      setPaymentPlans(plansData);
    } catch (error) {
      console.error('Error cargando datos de Firestore:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const auth = window.firebase.auth();
      await auth.signInWithEmailAndPassword(email, password);
      return true;
    } catch (error: any) {
      console.error('Error de login:', error);
      toast.error('Credenciales inválidas');
      return false;
    }
  };

  const logout = async () => {
    try {
      const auth = window.firebase.auth();
      await auth.signOut();
      setUser(null);
      toast.success('Sesión cerrada');
    } catch (error) {
      console.error('Error de logout:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const addProduct = async (product: any) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('products').add(product);
      await loadDataFromFirestore();
      toast.success('Producto creado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear producto');
    }
  };

  const updateProduct = async (id: string, product: any) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('products').doc(id).update(product);
      await loadDataFromFirestore();
      toast.success('Producto actualizado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar producto');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('products').doc(id).delete();
      await loadDataFromFirestore();
      toast.success('Producto eliminado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('clients').add({
        ...client,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      });
      await loadDataFromFirestore();
      toast.success('Cliente creado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear cliente');
    }
  };

  const updateClient = async (id: string, client: Partial<Client>) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('clients').doc(id).update(client);
      await loadDataFromFirestore();
      toast.success('Cliente actualizado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar cliente');
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('clients').doc(id).delete();
      await loadDataFromFirestore();
      toast.success('Cliente eliminado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar cliente');
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('sales').add({
        ...sale,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      });
      await loadDataFromFirestore();
      toast.success('Venta creada');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear venta');
    }
  };

  const updateSale = async (id: string, sale: Partial<Sale>) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('sales').doc(id).update(sale);
      await loadDataFromFirestore();
      toast.success('Venta actualizada');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar venta');
    }
  };

  const deleteSale = async (id: string) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('sales').doc(id).delete();
      await loadDataFromFirestore();
      toast.success('Venta eliminada');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar venta');
    }
  };

  const addPaymentPlan = async (plan: Omit<PaymentPlan, 'id' | 'createdAt'>) => {
    try {
      const db = window.firebase.firestore();
      await db.collection('paymentPlans').add({
        ...plan,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      });
      await loadDataFromFirestore();
      toast.success('Plan de pago creado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear plan de pago');
    }
  };

  const getSalesByClient = (clientId: string) => {
    return sales.filter((s) => s.clientId === clientId);
  };

  const getPaymentPlansBySale = (saleId: string) => {
    return paymentPlans.filter((p) => p.saleId === saleId);
  };

  const value: FirebaseContextType = {
    user,
    isLoading,
    products,
    clients,
    sales,
    categories,
    paymentPlans,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    addClient,
    updateClient,
    deleteClient,
    addSale,
    updateSale,
    deleteSale,
    addPaymentPlan,
    getSalesByClient,
    getPaymentPlansBySale,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase debe usarse dentro de FirebaseProvider');
  }
  return context;
};
