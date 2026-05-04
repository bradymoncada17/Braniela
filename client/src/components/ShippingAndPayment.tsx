import React, { useState, useMemo } from 'react';
import { Truck, CreditCard, DollarSign } from 'lucide-react';

export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  days: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

interface ShippingAndPaymentProps {
  subtotal: number;
  onShippingChange: (shipping: ShippingOption | null) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onInstallmentsChange?: (installments: number) => void;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'pickup', name: 'Recoger en tienda', cost: 0, days: 0 },
  { id: 'local', name: 'Envío local (Bogotá)', cost: 15000, days: 1 },
  { id: 'national', name: 'Envío nacional', cost: 35000, days: 3 },
  { id: 'express', name: 'Envío express', cost: 60000, days: 1 },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cash', name: 'Pago contra entrega', description: 'Paga cuando recibas el producto' },
  { id: 'transfer', name: 'Transferencia bancaria', description: 'Transferencia a cuenta bancaria' },
  { id: 'quote', name: 'Cotización', description: 'Recibe una cotización sin compromiso' },
];

export const ShippingAndPayment: React.FC<ShippingAndPaymentProps> = ({
  subtotal,
  onShippingChange,
  onPaymentMethodChange,
  onInstallmentsChange,
}) => {
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(SHIPPING_OPTIONS[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [installments, setInstallments] = useState(1);

  const handleShippingChange = (option: ShippingOption) => {
    setSelectedShipping(option);
    onShippingChange(option);
  };

  const handlePaymentChange = (method: PaymentMethod) => {
    setSelectedPayment(method);
    onPaymentMethodChange(method);
  };

  const handleInstallmentsChange = (value: number) => {
    setInstallments(value);
    onInstallmentsChange?.(value);
  };

  const total = subtotal + (selectedShipping?.cost || 0);
  const installmentAmount = total / installments;

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      {/* Shipping Options */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Truck className="text-amber-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Opciones de Envío</h3>
        </div>
        <div className="space-y-3">
          {SHIPPING_OPTIONS.map((option) => (
            <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={selectedShipping?.id === option.id}
                onChange={() => handleShippingChange(option)}
                className="w-4 h-4 text-amber-600"
              />
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-900">{option.name}</p>
                {option.days > 0 && (
                  <p className="text-sm text-gray-600">Entrega en {option.days} día(s)</p>
                )}
              </div>
              <p className="font-semibold text-amber-600">
                {option.cost === 0 ? 'Gratis' : `$${option.cost.toLocaleString('es-CO')}`}
              </p>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="text-amber-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Método de Pago</h3>
        </div>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <label key={method.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedPayment.id === method.id}
                onChange={() => handlePaymentChange(method)}
                className="w-4 h-4 text-amber-600"
              />
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Installments */}
      {selectedPayment.id !== 'quote' && (
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-amber-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Plan de Pagos</h3>
          </div>
          <div className="space-y-3">
            <label className="block">
              <p className="text-sm font-semibold text-gray-700 mb-2">Número de cuotas</p>
              <select
                value={installments}
                onChange={(e) => handleInstallmentsChange(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 6, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} cuota{num > 1 ? 's' : ''} - ${(total / num).toLocaleString('es-CO')} c/u
                  </option>
                ))}
              </select>
            </label>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Valor por cuota:</p>
              <p className="text-2xl font-bold text-amber-600">
                ${installmentAmount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </p>
              {installments > 1 && (
                <p className="text-xs text-gray-600 mt-2">
                  Total: ${total.toLocaleString('es-CO')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="border-t pt-6 bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${subtotal.toLocaleString('es-CO')}</span>
          </div>
          {selectedShipping && selectedShipping.cost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Envío:</span>
              <span className="font-semibold">${selectedShipping.cost.toLocaleString('es-CO')}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-amber-600">${total.toLocaleString('es-CO')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
