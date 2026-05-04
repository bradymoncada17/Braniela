import { motion } from 'framer-motion';
import { Menu, X, Settings, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useLocation } from 'wouter';

interface HeaderProps {
  onNavClick: (section: string) => void;
}

export default function Header({ onNavClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useFirebase();
  const [, setLocation] = useLocation();

  const navItems = [
    { label: 'Inicio', id: 'hero' },
    { label: 'Catálogo', id: 'catalog' },
    { label: 'Identidad Olfativa', id: 'categories' },
    { label: 'Contacto', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavClick(id);
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNavClick('hero')}
        >
          <img src="/logo.png" alt="Braniela" className="h-16 w-auto" />
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ color: '#C9A961' }}
              onClick={() => handleNavClick(item.id)}
              className="text-foreground font-light text-sm tracking-wide transition-colors duration-300 hover:text-accent"
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Admin Dashboard Button */}
        {user && (
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={() => setLocation('/admin/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-sm font-medium text-sm transition-all duration-300 hover:bg-blue-700"
            >
              <Settings size={18} />
              Dashboard
            </motion.button>
            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-sm font-medium text-sm transition-all duration-300 hover:bg-red-700"
            >
              <LogOut size={18} />
              Salir
            </motion.button>
          </div>
        )}
        
        {/* WhatsApp Button */}
        <motion.a
          href="https://wa.me/3041100640?text=Hola%20Braniela%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20sus%20perfumes"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2 rounded-sm font-medium text-sm transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.335 1.236-3.356 2.258-1.02 1.02-1.756 2.119-2.259 3.359-.433 1.079-.67 2.255-.67 3.563 0 2.537.798 4.85 2.327 6.83 1.52 1.978 3.868 3.368 6.291 3.795 1.965.33 3.808.212 5.541-.379 1.852-.635 3.632-1.776 5.044-3.181 1.412-1.406 2.278-3.174 2.914-5.012.636-1.838.954-3.548.954-5.231 0-2.065-.424-4.011-1.227-5.675-.803-1.665-1.946-3.134-3.349-4.317-1.402-1.183-3.054-2.008-4.814-2.435-1.760-.427-3.368-.427-4.814 0z" />
          </svg>
          WhatsApp
        </motion.a>



        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <motion.nav
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-background border-t border-border"
      >
        <div className="container py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 8 }}
              onClick={() => handleNavClick(item.id)}
              className="text-foreground text-left font-light text-sm tracking-wide transition-colors duration-300 hover:text-accent"
            >
              {item.label}
            </motion.button>
          ))}
          {user && (
            <>
              <motion.button
                onClick={() => {
                  setLocation('/admin/dashboard');
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-sm font-medium text-sm w-full justify-center"
              >
                <Settings size={18} />
                Dashboard
              </motion.button>
              <motion.button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-sm font-medium text-sm w-full justify-center"
              >
                <LogOut size={18} />
                Salir
              </motion.button>
            </>
          )}

          <motion.a
            href="https://wa.me/3041100640?text=Hola%20Braniela%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20sus%20perfumes"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2 rounded-sm font-medium text-sm w-full justify-center"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.335 1.236-3.356 2.258-1.02 1.02-1.756 2.119-2.259 3.359-.433 1.079-.67 2.255-.67 3.563 0 2.537.798 4.85 2.327 6.83 1.52 1.978 3.868 3.368 6.291 3.795 1.965.33 3.808.212 5.541-.379 1.852-.635 3.632-1.776 5.044-3.181 1.412-1.406 2.278-3.174 2.914-5.012.636-1.838.954-3.548.954-5.231 0-2.065-.424-4.011-1.227-5.675-.803-1.665-1.946-3.134-3.349-4.317-1.402-1.183-3.054-2.008-4.814-2.435-1.760-.427-3.368-.427-4.814 0z" />
            </svg>
            WhatsApp
          </motion.a>
        </div>
      </motion.nav>
    </motion.header>
  );
}
