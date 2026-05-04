import React from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, Send } from 'lucide-react';
import { toast } from 'sonner';

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Sale {
  id: string;
  clientName: string;
  clientPhone: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: Date;
}

interface InvoiceComponentProps {
  sale: Sale;
}

export const InvoiceComponent: React.FC<InvoiceComponentProps> = ({ sale }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const message = `Hola ${sale.clientName}, tu factura #${sale.id} por $${sale.total.toLocaleString()} ha sido generada. Medio de pago: ${sale.paymentMethod}`;
    const whatsappUrl = `https://wa.me/573041100640?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Abriendo WhatsApp...');
  };

  const handleDownloadPDF = () => {
    toast.success('Descargando PDF...');
    // Implementar descarga de PDF
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Invoice Preview */}
      <motion.div
        className="bg-white text-black rounded-2xl shadow-2xl overflow-hidden print:shadow-none"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-light">BRANIELA</h1>
              <p className="text-amber-100 text-sm">Perfumería de Lujo</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">FACTURA</p>
              <p className="text-amber-100">#{sale.id}</p>
            </div>
          </div>
          <div className="border-t border-amber-400 pt-4">
            <p className="text-sm">Fecha: {new Date(sale.createdAt).toLocaleDateString('es-CO')}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="p-8 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Cliente</p>
              <p className="text-lg font-semibold text-gray-900">{sale.clientName}</p>
              <p className="text-sm text-gray-600">{sale.clientPhone}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Método de Pago</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{sale.paymentMethod}</p>
              <p className="text-sm text-gray-600">Estado: {sale.status}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-8 border-b border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 text-xs font-semibold text-gray-700 uppercase">Producto</th>
                <th className="text-right py-3 text-xs font-semibold text-gray-700 uppercase">Cantidad</th>
                <th className="text-right py-3 text-xs font-semibold text-gray-700 uppercase">Precio Unit.</th>
                <th className="text-right py-3 text-xs font-semibold text-gray-700 uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, idx) => (
                <tr key={item.productId} className="border-b border-gray-100">
                  <td className="py-4 text-gray-900">{item.productName}</td>
                  <td className="py-4 text-right text-gray-900">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-900">${item.price.toLocaleString()}</td>
                  <td className="py-4 text-right font-semibold text-gray-900">
                    ${item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-8 bg-gray-50">
          <div className="flex justify-end mb-4">
            <div className="w-64">
              <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold text-gray-900">${sale.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b-2 border-gray-300">
                <span className="text-gray-700">IVA (19%):</span>
                <span className="font-semibold text-gray-900">${sale.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-900">TOTAL:</span>
                <span className="font-bold text-amber-600 text-2xl">${sale.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-100 text-center text-sm text-gray-600">
          <p>Gracias por su compra. Braniela - Perfumería de Lujo</p>
          <p className="text-xs mt-2">WhatsApp: +57 304 110 0640</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center print:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg"
        >
          <Printer size={20} />
          Imprimir
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg"
        >
          <Download size={20} />
          Descargar PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendWhatsApp}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all shadow-lg"
        >
          <Send size={20} />
          Enviar por WhatsApp
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InvoiceComponent;
