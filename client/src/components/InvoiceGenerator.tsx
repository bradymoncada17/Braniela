import React from 'react';
import { FileText, Download, Share2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
  timestamp: Date;
}

interface InvoiceGeneratorProps {
  invoiceData: InvoiceData | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadPDF?: () => void;
  onShareWhatsApp?: () => void;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  invoiceData,
  isOpen,
  onClose,
  onDownloadPDF,
  onShareWhatsApp,
}) => {
  if (!isOpen || !invoiceData) return null;

  const invoiceDate = new Date().toLocaleDateString('es-CO');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          {/* Invoice Content */}
          <div className="px-12 py-12 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-200 pb-8"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl font-light text-amber-600">
                    BRANIELA
                  </p>
                  <p className="text-gray-600 text-sm font-light mt-1">Perfumería de Lujo</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-light tracking-widest uppercase">Factura No.</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900 mt-1">
                    {invoiceData.invoiceNumber}
                  </p>
                  <p className="text-xs text-gray-500 font-light mt-2">{invoiceDate}</p>
                </div>
              </div>
            </motion.div>

            {/* Client Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-amber-600 font-light tracking-widest uppercase mb-2">Cliente</p>
                <p className="text-gray-900 font-light">{invoiceData.clientName}</p>
                <p className="text-gray-600 text-sm font-light">{invoiceData.clientPhone}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-amber-600 font-light tracking-widest uppercase mb-2">Método de Pago</p>
                <p className="text-gray-900 font-light">{invoiceData.paymentMethod}</p>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-amber-600" strokeWidth={1.5} />
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900">
                  Detalles de la Factura
                </h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 text-amber-600 font-light text-sm">Descripción</th>
                    <th className="text-center py-3 text-amber-600 font-light text-sm">Cantidad</th>
                    <th className="text-right py-3 text-amber-600 font-light text-sm">Precio Unitario</th>
                    <th className="text-right py-3 text-amber-600 font-light text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="py-4 font-light text-gray-900">{item.name}</td>
                      <td className="text-center py-4 font-light text-gray-900">{item.quantity}</td>
                      <td className="text-right py-4 font-light text-gray-900">
                        ${item.price.toLocaleString('es-CO')}
                      </td>
                      <td className="text-right py-4 font-light text-amber-600">
                        ${item.total.toLocaleString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <p className="text-xs text-amber-600 font-light tracking-widest uppercase mb-2">Información de Envío</p>
              <p className="text-gray-900 font-light">{invoiceData.shippingMethod}</p>
            </motion.div>

            {/* Pricing Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end"
            >
              <div className="w-full max-w-sm space-y-3 border border-gray-200 p-6 rounded-lg">
                <div className="flex justify-between text-gray-600 font-light">
                  <span>Subtotal:</span>
                  <span>${invoiceData.subtotal.toLocaleString('es-CO')}</span>
                </div>
                {invoiceData.shipping > 0 && (
                  <div className="flex justify-between text-gray-600 font-light">
                    <span>Envío:</span>
                    <span>${invoiceData.shipping.toLocaleString('es-CO')}</span>
                  </div>
                )}
                {invoiceData.tax > 0 && (
                  <div className="flex justify-between text-gray-600 font-light">
                    <span>IVA (19%):</span>
                    <span>${invoiceData.tax.toLocaleString('es-CO')}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light text-gray-900">
                    Total:
                  </span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-amber-600">
                    ${invoiceData.total.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 text-center">
              <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light text-gray-900">
                Gracias por tu compra
              </p>
              <p className="text-gray-600 text-sm font-light mt-1">Braniela - Perfumería de Lujo</p>
              <p className="text-amber-600 font-light text-sm mt-2">WhatsApp: +57 304 1100640</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 border-t border-gray-200 px-12 py-6 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-light py-3 rounded-lg transition shadow-lg"
            >
              <Download size={18} strokeWidth={1.5} />
              Descargar PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onShareWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-light py-3 rounded-lg transition shadow-lg"
            >
              <Share2 size={18} strokeWidth={1.5} />
              Compartir WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-light py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <X size={18} strokeWidth={1.5} />
              Cerrar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
