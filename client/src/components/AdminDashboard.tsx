import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useLocation } from 'wouter';
import { LogOut, Package, Plus, Menu, X } from 'lucide-react';
import ProductTable from './ProductTable';
import { ProductForm } from './ProductForm';

type AdminView = 'products' | 'add-product';

export const AdminDashboard: React.FC = () => {
  const { logout } = useFirebase();
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<AdminView>('products');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -256, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial="open"
        animate={sidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
        className="w-64 bg-foreground/5 border-r border-border fixed left-0 top-0 h-screen z-40 md:relative md:translate-x-0"
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-light text-foreground">Braniela</h2>
          <p className="text-sm text-foreground/60">Panel Administrativo</p>
        </div>

        <nav className="p-6 space-y-4">
          <button
            onClick={() => {
              setCurrentView('products');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'products'
                ? 'bg-accent text-accent-foreground'
                : 'text-foreground/70 hover:bg-foreground/5'
            }`}
          >
            <Package size={20} />
            <span>Lista de Productos</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('add-product');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'add-product'
                ? 'bg-accent text-accent-foreground'
                : 'text-foreground/70 hover:bg-foreground/5'
            }`}
          >
            <Plus size={20} />
            <span>Añadir Nuevo</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Top Bar */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-light text-foreground">Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'products' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-4xl font-light text-foreground mb-2">
                    Gestión de Productos
                  </h2>
                  <p className="text-foreground/60">
                    Administra el catálogo de perfumes de Braniela
                  </p>
                </div>
                <ProductTable />
              </div>
            )}

            {currentView === 'add-product' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-4xl font-light text-foreground mb-2">
                    Añadir Nuevo Producto
                  </h2>
                  <p className="text-foreground/60">
                    Crea un nuevo perfume en el catálogo
                  </p>
                </div>
                <ProductForm onSuccess={() => setCurrentView('products')} />
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
