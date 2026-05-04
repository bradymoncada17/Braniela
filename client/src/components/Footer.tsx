import { motion } from 'framer-motion';
import { Shield, Truck, Lock, Heart, LogIn } from 'lucide-react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useLocation } from 'wouter';

const trustSeals = [
  {
    icon: Shield,
    label: 'Pago Seguro',
    description: 'Transacciones protegidas',
  },
  {
    icon: Truck,
    label: 'Envío Garantizado',
    description: 'Entrega rápida y segura',
  },
  {
    icon: Lock,
    label: 'Datos Protegidos',
    description: 'Privacidad garantizada',
  },
  {
    icon: Heart,
    label: 'Satisfacción',
    description: 'Garantía de calidad',
  },
];

const footerLinks = [
  {
    title: 'Información',
    links: [
      { label: 'Sobre Nosotros', href: '#' },
      { label: 'Nuestros Perfumes', href: '#catalog' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Políticas',
    links: [
      { label: 'Política de Privacidad', href: '#' },
      { label: 'Términos y Condiciones', href: '#' },
      { label: 'Política de Devolución', href: '#' },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { label: 'WhatsApp', href: 'https://wa.me/3041100640' },
      { label: 'Email', href: 'mailto:info@braniela.com' },
      { label: 'Ubicación', href: '#' },
    ],
  },
];

export default function Footer() {
  const { user } = useFirebase();
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <footer id="contact" className="bg-foreground text-background pt-24 pb-8">
      <div className="container">
        {/* Trust Seals */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 pb-20 border-b border-background/20"
        >
          {trustSeals.map((seal, index) => {
            const Icon = seal.icon;
            return (
              <motion.div
                key={`seal-${seal.label}-${index}`}
                variants={itemVariants}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <Icon size={32} className="text-accent" />
                </div>
                <h3 className="font-medium text-sm tracking-wide mb-1">
                  {seal.label}
                </h3>
                <p className="text-xs text-background/70 font-light">
                  {seal.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <h2 className="text-2xl font-light mb-4">Braniela</h2>
            <p className="text-background/70 font-light text-sm leading-relaxed">
              Tu esencia, tu historia. Perfumes de lujo que reflejan tu personalidad única.
            </p>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={`section-${section.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-medium text-sm tracking-wide mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={`link-${section.title}-${link.label}-${linkIndex}`}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 4 }}
                      className="text-background/70 hover:text-accent font-light text-sm transition-colors duration-300"
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-8 mb-8" />

        {/* Bottom - Reorganized */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Copyright */}
          <p className="text-background/60 font-light text-sm order-2 md:order-1">
            © 2026 Braniela Perfumería. Todos los derechos reservados.
          </p>

          {/* Social & Login */}
          <div className="flex items-center gap-8 order-1 md:order-2">
            {/* Social Links */}
            <div className="flex gap-6 border-r border-background/20 pr-8">
              {['Instagram', 'Facebook', 'TikTok'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ color: '#C9A961' }}
                  className="text-background/60 font-light text-sm transition-colors duration-300 hover:text-accent"
                >
                  {social}
                </motion.a>
              ))}
            </div>

            {/* Login Button */}
            {!user && (
              <motion.button
                onClick={() => setLocation('/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-accent text-foreground px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:bg-accent/90 border border-accent/50 whitespace-nowrap"
              >
                <LogIn size={16} />
                Iniciar Sesión
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
