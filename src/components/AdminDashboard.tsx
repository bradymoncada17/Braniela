import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useLocation } from 'wouter';
import { LogOut, Package, Plus, Menu, X, ShoppingCart, Users, TrendingUp, BarChart3 } from 'lucide-react';
import ProductTable from './ProductTable';
import { ProductForm } from './ProductForm';
import SalesModule from './SalesModule';
import { ClientManager } from './ClientManager';
import AnalyticsPanel from './AnalyticsPanel';

type AdminView = 'products' | 'add-product' | 'sales' | 'clients' | 'analytics';

export const AdminDashboard: React.FC = () => {
  const { logout } = useFirebase();
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<AdminView>('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const menuItems = [
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'sales', label: 'Ventas/POS', icon: ShoppingCart },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'analytics', label: 'Análisis', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-foreground/5 flex flex-col md:flex-row">
      {/* Floating Sidebar - Desktop */}
      <motion.aside
        className="hidden md:flex md:flex-col w-64 bg-card border-r border-border shadow-2xl"
      >
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-light text-foreground">Braniela</h2>
          <p className="text-xs text-foreground/60 uppercase tracking-widest mt-1">POS</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'products' && currentView === 'add-product');
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                onClick={() => setCurrentView(item.id as AdminView)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'text-foreground/70 hover:bg-foreground/5'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-border">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 hover:from-red-500/20 hover:to-red-600/20 transition-all border border-red-500/20"
          >
            <LogOut size={18} />
            <span className="font-medium">Salir</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-card border-r border-border z-40 md:hidden shadow-2xl flex flex-col"
      >
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'products' && currentView === 'add-product');
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                onClick={() => {
                  setCurrentView(item.id as AdminView);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'text-foreground/70 hover:bg-foreground/5'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Logout Button Mobile */}
        <div className="p-3 border-t border-border">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 hover:from-red-500/20 hover:to-red-600/20 transition-all border border-red-500/20"
          >
            <LogOut size={18} />
            <span className="font-medium">Salir</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Bar - Floating */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-foreground/5 rounded-lg transition-all md:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg md:text-xl font-light text-foreground truncate">
              {menuItems.find(m => m.id === currentView)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <BarChart3 size={18} className="text-accent" />
            <span className="text-xs text-foreground/60">Braniela POS</span>
          </div>
        </motion.div>

        {/* Content Area with Modern Scroll */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Products View */}
                {currentView === 'products' && (
                  <div>
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-1">
                          Gestión de Productos
                        </h2>
                        <p className="text-sm text-foreground/60">
                          Administra el catálogo de perfumes
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentView('add-product')}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-all shadow-md"
                      >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Nuevo</span>
                      </motion.button>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
                    >
                      <ProductTable />
                    </motion.div>
                  </div>
                )}

                {/* Add Product View */}
                {currentView === 'add-product' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-light text-foreground mb-1">
                        Nuevo Producto
                      </h2>
                      <p className="text-sm text-foreground/60">
                        Crea un nuevo perfume en el catálogo
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-card rounded-2xl border border-border shadow-xl p-8"
                    >
                      <ProductForm onSuccess={() => setCurrentView('products')} />
                    </motion.div>
                  </div>
                )}

                {/* Sales View */}
                {currentView === 'sales' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-light text-foreground mb-1">
                        Ventas y Cotizaciones
                      </h2>
                      <p className="text-sm text-foreground/60">
                        Gestiona cotizaciones, facturas y ventas
                      </p>
                    </div>
                    <SalesModule />
                  </div>
                )}

                {/* Clients View */}
                {currentView === 'clients' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-light text-foreground mb-1">
                        Clientes
                      </h2>
                      <p className="text-sm text-foreground/60">
                        Administra clientes, préstamos y pagos
                      </p>
                    </div>
                    <ClientManager />
                  </div>
                )}

                {/* Analytics View */}
                {currentView === 'analytics' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-light text-foreground mb-1">
                        Análisis
                      </h2>
                      <p className="text-sm text-foreground/60">
                        Márgenes, ventas y rentabilidad
                      </p>
                    </div>
                    <AnalyticsPanel />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
