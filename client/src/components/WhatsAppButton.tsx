import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/3041100640?text=Hola%20Braniela%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20sus%20perfumes"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-16 h-16 bg-accent text-accent-foreground rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
