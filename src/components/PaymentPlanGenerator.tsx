import React from 'react';
import { Calendar, DollarSign, Download, Share2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PaymentPlanData {
  planId: string;
  invoiceNumber: string;
  clientName: string;
  clientPhone: string;
  total: number;
  installments: number;
  monthlyPayment: number;
  interest: number;
  payments: Array<{
    number: number;
    amount: number;
    dueDate: Date;
    status: 'pending' | 'paid' | 'overdue';
  }>;
}

interface PaymentPlanGeneratorProps {
  planData: PaymentPlanData | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadPDF?: () => void;
  onShareWhatsApp?: () => void;
}

export const PaymentPlanGenerator: React.FC<PaymentPlanGeneratorProps> = ({
  planData,
  isOpen,
  onClose,
  onDownloadPDF,
  onShareWhatsApp,
}) => {
  if (!isOpen || !planData) return null;

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
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-white via-white to-gray-50 border-b border-gray-200 px-12 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={24} className="text-amber-600" strokeWidth={1.5} />
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light text-gray-900">
                Plan de Pagos
              </h1>
            </div>
            <p className="text-gray-600 text-sm font-light">Documento de referencia para el seguimiento de cuotas</p>
          </div>

          {/* Content */}
          <div className="px-12 py-12 space-y-8">
            {/* Client Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <p className="text-xs text-amber-600 font-light tracking-widest uppercase mb-2">Cliente</p>
              <p className="text-gray-900 font-light">{planData.clientName}</p>
              <p className="text-gray-600 text-sm font-light">{planData.clientPhone}</p>
              <p className="text-gray-500 text-xs font-light mt-2">Factura: {planData.invoiceNumber}</p>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-2">Monto Total</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900">
                  ${planData.total.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-2">Número de Cuotas</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900">
                  {planData.installments}
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-xs text-gray-500 font-light tracking-widest uppercase mb-2">Interés Aplicado</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900">
                  {planData.interest.toFixed(2)}%
                </p>
              </div>
            </motion.div>

            {/* Monthly Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-amber-50 border-2 border-amber-200 p-6 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="text-amber-600" size={20} strokeWidth={1.5} />
                <p className="text-xs text-amber-700 font-light tracking-widest uppercase">Valor de Cada Cuota</p>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl font-light text-amber-600">
                ${planData.monthlyPayment.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </p>
            </motion.div>

            {/* Payment Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Calendar className="text-amber-600" size={20} strokeWidth={1.5} />
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-gray-900">
                  Cronograma de Pagos
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-amber-600 font-light text-sm">Cuota</th>
                      <th className="px-4 py-3 text-left text-amber-600 font-light text-sm">Fecha de Vencimiento</th>
                      <th className="px-4 py-3 text-right text-amber-600 font-light text-sm">Valor</th>
                      <th className="px-4 py-3 text-center text-amber-600 font-light text-sm">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planData.payments.map((payment: any, index: number) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-light text-gray-900">
                          Cuota {payment.number}
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-light">
                          {new Date(payment.dueDate).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-light text-amber-600">
                          ${payment.amount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-light ${
                            payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                              : payment.status === 'paid'
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-red-100 text-red-700 border border-red-300'
                          }`}>
                            {payment.status === 'pending' ? 'Pendiente' : payment.status === 'paid' ? 'Pagado' : 'Vencido'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 border border-gray-200 p-6 rounded-lg"
            >
              <h3 className="font-light text-gray-900 mb-3">Notas Importantes</h3>
              <ul className="space-y-2 text-sm text-gray-700 font-light">
                <li>• Las cuotas vencen en las fechas especificadas en el cronograma</li>
                <li>• El pago debe realizarse en la cuenta bancaria proporcionada</li>
                <li>• En caso de retraso, se aplicarán intereses adicionales según lo acordado</li>
                <li>• Conserve este documento como comprobante del acuerdo de pago</li>
                <li>• Para consultas, comuníquese al WhatsApp: +57 304 1100640</li>
              </ul>
            </motion.div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 text-center">
              <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light text-gray-900">
                Braniela - Perfumería de Lujo
              </p>
              <p className="text-gray-600 text-sm font-light">Documento generado el {new Date().toLocaleDateString('es-CO')}</p>
              <p className="text-gray-500 text-xs font-light mt-2">ID del Plan: {planData.planId}</p>
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
