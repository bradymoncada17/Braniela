import { motion } from 'framer-motion';
import { Leaf, Flower2, Trees, Sparkles } from 'lucide-react';
import { useState } from 'react';

const categories = [
  {
    id: 'Cítricas',
    name: 'Cítricas',
    description: 'Frescas, energéticas y radiantes. Notas de bergamota, limón y naranja que despiertan los sentidos.',
    icon: Sparkles,
    color: '#F4B860',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663624848842/kqG7dogWPknaqKJVvtUpFG/braniela-citrus-jwssmGaQZRbsRxp5AF78rS.webp',
  },
  {
    id: 'Florales',
    name: 'Florales',
    description: 'Delicadas y románticas. Rosas, jazmín y peonías que evocan jardines en primavera.',
    icon: Flower2,
    color: '#E8B4D0',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663624848842/kqG7dogWPknaqKJVvtUpFG/braniela-floral-7wU9xSLz3hriDNqupbmq9Y.webp',
  },
  {
    id: 'Amaderadas',
    name: 'Amaderadas',
    description: 'Profundas y sofisticadas. Sándalo, cedro y oud que transmiten elegancia y misterio.',
    icon: Trees,
    color: '#A0826D',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663624848842/kqG7dogWPknaqKJVvtUpFG/braniela-woody-oBhCLEw4jzfHpzUyQkNU6H.webp',
  },
  {
    id: 'Orientales',
    name: 'Orientales',
    description: 'Sensuales y exóticas. Especias, vainilla y ámbar que crean una aura de misterio.',
    icon: Leaf,
    color: '#C4846A',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663624848842/kqG7dogWPknaqKJVvtUpFG/braniela-oriental-kndP5XfEkzyUi47mitqZfD.webp',
  },
  {
    id: 'Gourmand',
    name: 'Gourmand',
    description: 'Dulces y adictivas. Vainilla, caramelo y notas gourmand que envuelven los sentidos.',
    icon: Sparkles,
    color: '#D4A574',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663624848842/kqG7dogWPknaqKJVvtUpFG/braniela-citrus-jwssmGaQZRbsRxp5AF78rS.webp',
  },
];

export default function Categories() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const handleCategoryClick = (categoryId: string) => {
    // Store selected category in sessionStorage
    sessionStorage.setItem('selectedCategory', categoryId);
    
    // Scroll to catalog section
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-foreground mb-4">
            Identidad Olfativa
          </h2>
          <div className="w-16 h-px bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/70 font-light max-w-2xl mx-auto">
            Explora nuestras familias de fragancias, cada una con su propia historia y esencia.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                onClick={() => handleCategoryClick(category.id)}
                className="card-luxury overflow-hidden group cursor-pointer transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-64 md:h-72 overflow-hidden bg-secondary">
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="p-3 rounded-sm"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <IconComponent
                        size={24}
                        style={{ color: category.color }}
                      />
                    </div>
                    <h3 className="text-2xl font-light text-foreground">
                      {category.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-foreground/70 font-light leading-relaxed">
                    {category.description}
                  </p>

                  {/* Divider */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <motion.button
                      whileHover={{ x: 4 }}
                      className="text-accent font-medium text-sm tracking-wide"
                    >
                      Ver Colección →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
