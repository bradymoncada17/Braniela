import React, { useState } from 'react';
import { Truck, CreditCard, X, MessageCircle, User, MapPin, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/contexts/ProductContext';
import { toast } from 'sonner';

interface CheckoutFlowProps {
  product: Product;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
}

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  days: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

interface ShippingData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'pickup', name: 'Recoger en tienda', cost: 0, days: 0 },
  { id: 'antioquia', name: 'Envío a Antioquia', cost: 20000, days: 1 },
  { id: 'national', name: 'Envío nacional', cost: 50000, days: 3 },
  { id: 'express', name: 'Envío express', cost: 80000, days: 1 },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'transfer', name: 'Transferencia bancaria', description: 'Transferencia a cuenta bancaria' },
  { id: 'cash', name: 'Pago contra entrega', description: 'Paga cuando recibas el producto' },
];

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  product,
  quantity,
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<'options' | 'shipping'>('options');
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const subtotal = product.price * quantity;
  const shippingCost = selectedShipping.cost;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      shippingData.fullName.trim() !== '' &&
      shippingData.phone.trim() !== '' &&
      shippingData.address.trim() !== '' &&
      shippingData.city.trim() !== '' &&
      shippingData.postalCode.trim() !== ''
    );
  };

  const handleContinueToShipping = () => {
    if (selectedShipping.id === 'pickup') {
      handleSendToWhatsApp();
    } else {
      setStep('shipping');
    }
  };

  const handleSendToWhatsApp = () => {
    if (selectedShipping.id !== 'pickup' && !isFormValid()) {
      toast.error('Por favor completa todos los datos de envío');
      return;
    }

    const shippingText = selectedShipping.id === 'pickup' 
      ? 'Recoger en tienda' 
      : `${selectedShipping.name} ($${selectedShipping.cost.toLocaleString()})`;
    
    let message = `Hola, me gustaría hacer una cotización:\n\n*DATOS DEL CLIENTE*\nNombre: ${shippingData.fullName}\nTeléfono: ${shippingData.phone}\n`;
    
    if (selectedShipping.id !== 'pickup') {
      message += `\n*DATOS DE ENVÍO*\nDirección: ${shippingData.address}\nCiudad: ${shippingData.city}\nCódigo Postal: ${shippingData.postalCode}\n`;
    }
    
    message += `\n*PRODUCTO*\n${product.brand} - ${product.name}\nVolumen: ${product.volume || '100ml'}\nCantidad: ${quantity}\nPrecio unitario: $${product.price.toLocaleString('es-CO')}\n\n*ENVÍO*\n${shippingText}\n\n*MÉTODO DE PAGO*\n${selectedPayment.name}\n\n*TOTAL ESTIMADO*\n$${total.toLocaleString('es-CO')}\n\n¿Podemos proceder con esta cotización?`;
    
    const whatsappUrl = `https://wa.me/573041100640?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Abriendo WhatsApp...');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-white via-white to-gray-50 border-b border-gray-200 px-12 py-8 flex justify-between items-center">
            <div>
              <p className="text-amber-600 text-xs font-light tracking-[0.2em] uppercase">
                {step === 'options' ? 'Finalizar Compra' : 'Datos de Envío'}
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light text-gray-900 mt-1">
                {step === 'options' ? 'Resumen del Pedido' : 'Información de Envío'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-full transition text-gray-600"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div className="px-12 py-12 space-y-8">
            {step === 'options' ? (
              <>
                {/* Product Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-4">Producto</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-light text-gray-900">
                        {product.name}
                      </p>
                      <span className="text-amber-600 font-light">x{quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 font-light">
                      <span>${product.price.toLocaleString('es-CO')} c/u</span>
                      <span className="text-gray-900 font-medium">${subtotal.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Shipping Options */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Truck size={20} className="text-amber-600" strokeWidth={1.5} />
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900">
                      Opciones de Envío
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedShipping(option)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left font-light ${
                          selectedShipping.id === option.id
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-gray-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-gray-900">{option.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{option.days === 0 ? 'Inmediato' : `${option.days} día(s)`}</p>
                          </div>
                          <p className="text-amber-600 font-medium">${option.cost.toLocaleString()}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Payment Methods */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} className="text-amber-600" strokeWidth={1.5} />
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900">
                      Método de Pago
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedPayment(method)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left font-light ${
                          selectedPayment.id === method.id
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-gray-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <p className="text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Total */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="border-t border-gray-200 pt-6"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600 font-light">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString('es-CO')}</span>
                    </div>
                    {selectedShipping.cost > 0 && (
                      <div className="flex justify-between text-gray-600 font-light">
                        <span>Envío</span>
                        <span>${selectedShipping.cost.toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-light text-gray-900">
                        Total
                      </span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light text-amber-600">
                        ${total.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm font-light">
                    <strong className="font-medium">Nota:</strong> {selectedShipping.id === 'pickup' ? 'Completa tus datos y un asesor confirmará tu pedido.' : 'Completa tus datos de envío en el siguiente paso.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-light py-4 rounded-lg transition text-lg tracking-wide"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinueToShipping}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-light py-4 rounded-lg transition shadow-lg text-lg tracking-wide"
                  >
                    {selectedShipping.id === 'pickup' ? 'Continuar' : 'Datos de Envío'}
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                {/* Shipping Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-gray-600 font-light tracking-widest uppercase mb-2">
                      <User size={16} className="text-amber-600" strokeWidth={1.5} />
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-light focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-gray-600 font-light tracking-widest uppercase mb-2">
                      <Phone size={16} className="text-amber-600" strokeWidth={1.5} />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      placeholder="Tu número de teléfono"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-light focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-gray-600 font-light tracking-widest uppercase mb-2">
                      <MapPin size={16} className="text-amber-600" strokeWidth={1.5} />
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      placeholder="Calle, número y apartamento"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-light focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-gray-600 font-light tracking-widest uppercase mb-2">
                      <MapPin size={16} className="text-amber-600" strokeWidth={1.5} />
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={handleInputChange}
                      placeholder="Tu ciudad"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-light focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="text-xs text-gray-600 font-light tracking-widest uppercase mb-2 block">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Código postal"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-light focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                  </div>
                </motion.div>

                {/* Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <p className="text-xs text-gray-600 font-light tracking-widest uppercase mb-3">Resumen</p>
                  <div className="space-y-2 text-sm font-light">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">${subtotal.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío:</span>
                      <span className="text-gray-900">${selectedShipping.cost.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light text-gray-900">
                        Total:
                      </span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light text-amber-600">
                        ${total.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('options')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-light py-4 rounded-lg transition text-lg tracking-wide"
                  >
                    Atrás
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendToWhatsApp}
                    disabled={!isFormValid()}
                    className={`flex-1 flex items-center justify-center gap-2 text-white font-light py-4 rounded-lg transition shadow-lg text-lg tracking-wide ${
                      isFormValid()
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <MessageCircle size={20} strokeWidth={1.5} />
                    Solicitar Cotización
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
