import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'María González',
    role: 'Diseñadora Gráfica',
    text: 'Braniela cambió mi forma de entender la perfumería. Cada fragancia es una experiencia sensorial completa. El Bosque Nocturno se ha convertido en mi firma personal.',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  },
  {
    id: 2,
    name: 'Carlos Mendez',
    role: 'Empresario',
    text: 'La calidad es incomparable. He probado muchas marcas de lujo, pero Braniela ofrece algo especial: autenticidad y elegancia en cada botella.',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  },
  {
    id: 3,
    name: 'Valentina Rossi',
    role: 'Abogada',
    text: 'El Jardín Secreto es simplemente perfecto. Fresco, sofisticado y duradero. Recomiendo Braniela a todas mis amigas sin dudarlo.',
    rating: 5,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina',
  },
];

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card-luxury p-8"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className="fill-accent text-accent"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-foreground/80 font-light mb-6 leading-relaxed italic">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 pt-6 border-t border-border">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-medium text-foreground">{testimonial.name}</p>
          <p className="text-sm text-foreground/60">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
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

  return (
    <section className="py-24 bg-background">
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
            Lo que dicen nuestros clientes
          </h2>
          <div className="w-16 h-px bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/70 font-light max-w-2xl mx-auto">
            Historias reales de personas que han encontrado su esencia con Braniela.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
