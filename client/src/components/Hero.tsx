import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/manus-storage/khamrah_hero_806c4f61.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5
        </video>
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container text-center"
      >
        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-7xl font-light text-foreground mb-6 tracking-tight"
        >
          Braniela
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-foreground/80 font-light mb-8 max-w-2xl mx-auto"
        >
          Tu esencia, tu historia
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="w-16 h-px bg-accent mx-auto mb-8"
        />

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-foreground/70 font-light mb-12 max-w-xl mx-auto"
        >
          Descubre nuestra colección de perfumes de lujo, cuidadosamente seleccionados para reflejar tu personalidad única.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(184, 134, 11, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore}
          className="px-8 py-3 bg-accent text-accent-foreground rounded-sm font-medium transition-all duration-300 hover:bg-accent/90 active:scale-95 inline-block"
        >
          Explorar Colección
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="text-accent" size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}
