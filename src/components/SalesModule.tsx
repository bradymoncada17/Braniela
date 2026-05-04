import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Plus, X, ShoppingCart, FileText, DollarSign, Users, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import InvoiceComponent from './InvoiceComponent';
import { InvoiceGenerator, InvoiceData } from './InvoiceGenerator';
import { PaymentPlanGenerator, PaymentPlanData } from './PaymentPlanGenerator';

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Sale {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
  shippingCost: number;
  status: string;
  createdAt: Date;
  includeIVA: boolean;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number;
  createdAt: Date;
}

export const SalesModule: React.FC = () => {
  const { products, updateProduct, clients: firestoreClients, addSale, addPaymentPlan } = useFirebase();
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [paymentPlanData, setPaymentPlanData] = useState<PaymentPlanData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState('pickup');
  const [shippingCost, setShippingCost] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [installments, setInstallments] = useState(1);

  const clients = firestoreClients.map(c => ({
    id: c._firestoreId || c.id,
    name: c.name,
    phone: c.phone,
    email: c.email || '',
    totalPurchases: c.totalPurchases || 0,
    createdAt: c.createdAt,
  })) as Client[];

  const filteredProducts = useMemo(
    () =>
      products.filter(
        p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  const SHIPPING_OPTIONS = [
    { id: 'pickup', name: 'Recoger en tienda', cost: 0 },
    { id: 'local', name: 'Envío local (Bogotá)', cost: 15000 },
    { id: 'national', name: 'Envío nacional', cost: 35000 },
    { id: 'express', name: 'Envío express', cost: 60000 },
  ];

  const startNewSale = () => {
    setCurrentSale({
      id: `SALE-${Date.now()}`,
      clientId: undefined,
      clientName: '',
      clientPhone: '',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      paymentMethod: 'transfer',
      shippingMethod: 'pickup',
      shippingCost: 0,
      status: 'draft',
      createdAt: new Date(),
      includeIVA: true,
    });
    setSelectedClientId(null);
    setShippingMethod('pickup');
    setShippingCost(0);
    setInterestRate(0);
    setInstallments(1);
  };

  const selectClient = (client: Client) => {
    if (!currentSale) return;
    setCurrentSale({
      ...currentSale,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
    });
    setSelectedClientId(client.id);
    toast.success(`Cliente ${client.name} seleccionado`);
  };

  const calculateTotals = (items: SaleItem[], includeIVA: boolean, shipping: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = includeIVA ? subtotal * 0.19 : 0;
    return { subtotal, tax, total: subtotal + tax + shipping };
  };

  const addItemToSale = (product: any) => {
    if (!currentSale) return;

    const existingItem = currentSale.items.find(item => item.productId === String(product.id));

    let updatedItems;
    if (existingItem) {
      if (existingItem.quantity >= (product.stock || 0)) {
        toast.error(`Stock insuficiente. Disponible: ${product.stock}`);
        return;
      }
      updatedItems = currentSale.items.map(item =>
        item.productId === String(product.id)
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      );
    } else {
      if ((product.stock || 0) < 1) {
        toast.error('Producto sin stock');
        return;
      }
      updatedItems = [
        ...currentSale.items,
        {
          productId: String(product.id),
          productName: product.name,
          quantity: 1,
          price: product.price,
          total: product.price,
        },
      ];
    }

    const { subtotal, tax, total } = calculateTotals(updatedItems, currentSale.includeIVA, shippingCost);

    setCurrentSale({
      ...currentSale,
      items: updatedItems,
      subtotal,
      tax,
      total,
    });
  };

  const removeItemFromSale = (productId: string) => {
    if (!currentSale) return;

    const updatedItems = currentSale.items.filter(item => item.productId !== productId);
    const { subtotal, tax, total } = calculateTotals(updatedItems, currentSale.includeIVA, shippingCost);

    setCurrentSale({
      ...currentSale,
      items: updatedItems,
      subtotal,
      tax,
      total,
    });
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (!currentSale || newQuantity < 1) return;

    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;

    if (newQuantity > ((product.stock as number) || 0)) {
      toast.error(`Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    const updatedItems = currentSale.items.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    );

    const { subtotal, tax, total } = calculateTotals(updatedItems, currentSale.includeIVA, shippingCost);

    setCurrentSale({
      ...currentSale,
      items: updatedItems,
      subtotal,
      tax,
      total,
    });
  };

  const toggleIVA = () => {
    if (!currentSale) return;

    const newIncludeIVA = !currentSale.includeIVA;
    const { subtotal, tax, total } = calculateTotals(currentSale.items, newIncludeIVA, shippingCost);

    setCurrentSale({
      ...currentSale,
      includeIVA: newIncludeIVA,
      subtotal,
      tax,
      total,
    });

    toast.success(newIncludeIVA ? 'IVA aplicado' : 'IVA removido');
  };

  const handleShippingChange = (option: any) => {
    setShippingMethod(option.name);
    setShippingCost(option.cost);
    
    if (currentSale) {
      const { subtotal, tax, total } = calculateTotals(currentSale.items, currentSale.includeIVA, option.cost);
      setCurrentSale({
        ...currentSale,
        shippingMethod: option.name,
        shippingCost: option.cost,
        subtotal,
        tax,
        total,
      });
    }
  };

  const generateInvoice = async () => {
    if (!currentSale || !currentSale.clientName || currentSale.items.length === 0) {
      toast.error('Completa los datos del cliente y agrega productos');
      return;
    }

    try {
      // Descontar stock
      for (const item of currentSale.items) {
        const product = products.find(p => String(p.id) === String(item.productId));
        if (product) {
          const newStock = ((product.stock as number) || 0) - item.quantity;
          const pWithId = product as any;
          const firestoreId = pWithId._firestoreId || item.productId;
          await updateProduct(firestoreId, { stock: newStock });
        }
      }

      // Guardar venta
      await addSale({
        clientId: selectedClientId || '',
        items: currentSale.items,
        subtotal: currentSale.subtotal,
        tax: currentSale.tax,
        total: currentSale.total,
        includeIVA: currentSale.includeIVA,
        paymentMethod: currentSale.paymentMethod,
      });

      // Crear datos de factura
      const invoiceNum = `FAC-${Date.now()}`;
      const invoiceDataObj: InvoiceData = {
        invoiceNumber: invoiceNum,
        clientName: currentSale.clientName,
        clientPhone: currentSale.clientPhone,
        items: currentSale.items.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        subtotal: currentSale.subtotal,
        shipping: shippingCost,
        tax: currentSale.tax,
        total: currentSale.total,
        paymentMethod: currentSale.paymentMethod,
        shippingMethod: currentSale.shippingMethod,
        timestamp: new Date(),
      };

      setInvoiceData(invoiceDataObj);
      setShowInvoice(true);
      toast.success('Factura generada');
    } catch (error) {
      toast.error('Error al generar factura');
      console.error(error);
    }
  };

  const generatePaymentPlan = async () => {
    if (!invoiceData) {
      toast.error('Genera la factura primero');
      return;
    }

    if (installments < 2) {
      toast.error('El plan de pagos requiere al menos 2 cuotas');
      return;
    }

    const totalWithInterest = invoiceData.total + (invoiceData.total * interestRate / 100);
    const monthlyPayment = totalWithInterest / installments;

    const payments = Array.from({ length: installments }, (_, i) => {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      return {
        number: i + 1,
        amount: monthlyPayment,
        dueDate,
        status: 'pending' as const,
      };
    });

    const planId = `PLAN-${Date.now()}`;
    const planDataObj: PaymentPlanData = {
      planId,
      invoiceNumber: invoiceData.invoiceNumber,
      clientName: invoiceData.clientName,
      clientPhone: invoiceData.clientPhone,
      total: totalWithInterest,
      installments,
      monthlyPayment,
      interest: interestRate,
      payments,
    };

    // Guardar plan en Firestore
    await addPaymentPlan({
      saleId: invoiceData.invoiceNumber,
      clientId: selectedClientId || '',
      total: totalWithInterest,
      installments,
      monthlyPayment,
      interest: interestRate,
      payments,
    });

    setPaymentPlanData(planDataObj);
    setShowPaymentPlan(true);
    toast.success('Plan de pagos generado');
  };

  const cancelSale = () => {
    setCurrentSale(null);
    setShowInvoice(false);
    setShowPaymentPlan(false);
    setInvoiceData(null);
    setPaymentPlanData(null);
  };

  if (showInvoice && invoiceData) {
    return (
      <div className="space-y-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={cancelSale}
          className="flex items-center gap-2 px-6 py-3 bg-foreground/10 text-foreground rounded-xl font-medium hover:bg-foreground/20 transition-all"
        >
          <X size={20} />
          Volver
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InvoiceGenerator
              invoiceData={invoiceData}
              isOpen={true}
              onClose={() => {}}
              onDownloadPDF={() => toast.info('PDF en desarrollo')}
              onShareWhatsApp={() => {
                const message = `Factura: ${invoiceData.invoiceNumber}\nCliente: ${invoiceData.clientName}\nTotal: $${invoiceData.total.toLocaleString('es-CO')}\n\nDetalles en el documento adjunto.`;
                const whatsappUrl = `https://wa.me/573041100640?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
            />
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-xl p-6 h-fit space-y-4">
            <h3 className="text-lg font-bold text-foreground">Plan de Pagos</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-foreground/70">Número de Cuotas</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={installments}
                  onChange={(e) => setInstallments(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-sm text-foreground/70">Interés (%)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-bold text-accent min-w-12">{interestRate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="bg-accent/10 p-3 rounded-lg">
                <p className="text-sm text-foreground/70">Cuota mensual:</p>
                <p className="text-2xl font-bold text-accent">
                  ${((invoiceData.total + (invoiceData.total * interestRate / 100)) / installments).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generatePaymentPlan}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all"
              >
                <Calculator size={20} />
                Generar Plan
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPaymentPlan && paymentPlanData) {
    return (
      <div className="space-y-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={cancelSale}
          className="flex items-center gap-2 px-6 py-3 bg-foreground/10 text-foreground rounded-xl font-medium hover:bg-foreground/20 transition-all"
        >
          <X size={20} />
          Volver
        </motion.button>

        <PaymentPlanGenerator
          planData={paymentPlanData}
          isOpen={true}
          onClose={() => {}}
          onDownloadPDF={() => toast.info('PDF en desarrollo')}
          onShareWhatsApp={() => {
            const message = `Plan de Pagos\nCliente: ${paymentPlanData.clientName}\n${paymentPlanData.installments} cuotas de $${paymentPlanData.monthlyPayment.toLocaleString('es-CO')}\nInterés: ${paymentPlanData.interest}%\nTotal: $${paymentPlanData.total.toLocaleString('es-CO')}`;
            const whatsappUrl = `https://wa.me/573041100640?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!currentSale ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startNewSale}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-all shadow-lg"
        >
          <Plus size={20} />
          Nueva Venta
        </motion.button>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border shadow-xl p-6"
            >
              <h3 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
                <Users size={20} />
                Seleccionar Cliente
              </h3>
              <div className="space-y-4">
                {selectedClientId ? (
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm text-foreground/70">Cliente seleccionado:</p>
                    <p className="text-lg font-medium text-foreground">{currentSale?.clientName}</p>
                    <p className="text-sm text-foreground/60">{currentSale?.clientPhone}</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedClientId(null);
                        setCurrentSale({
                          ...currentSale!,
                          clientId: undefined,
                          clientName: '',
                          clientPhone: '',
                        });
                      }}
                      className="mt-3 px-4 py-2 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-all text-sm font-medium"
                    >
                      Cambiar Cliente
                    </motion.button>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {clients.map(client => (
                      <motion.button
                        key={client.id}
                        whileHover={{ x: 4 }}
                        onClick={() => selectClient(client)}
                        className="w-full text-left p-3 rounded-lg hover:bg-foreground/5 transition-colors border border-border"
                      >
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-sm text-foreground/60">{client.phone}</p>
                      </motion.button>
                    ))}
                  </div>
                )}

                {!selectedClientId && (
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-foreground/70 mb-3">O crear cliente nuevo:</p>
                    <input
                      type="text"
                      placeholder="Nombre del cliente"
                      value={currentSale?.clientName || ''}
                      onChange={(e) =>
                        setCurrentSale({ ...currentSale!, clientName: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent mb-2"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono del cliente"
                      value={currentSale?.clientPhone || ''}
                      onChange={(e) =>
                        setCurrentSale({ ...currentSale!, clientPhone: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Shipping Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border shadow-xl p-6"
            >
              <h3 className="text-xl font-light text-foreground mb-4">Opciones de Envío</h3>
              <div className="space-y-2">
                {SHIPPING_OPTIONS.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ x: 4 }}
                    onClick={() => handleShippingChange(option)}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      shippingMethod === option.name
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:bg-foreground/5'
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="font-medium text-foreground">{option.name}</p>
                      <p className="text-accent font-semibold">${option.cost.toLocaleString()}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Search Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border shadow-xl p-6"
            >
              <h3 className="text-xl font-light text-foreground mb-4">Buscar Productos</h3>
              <input
                type="text"
                placeholder="Buscar por nombre o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent mb-4"
              />

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredProducts.map((product) => (
                  <motion.button
                    key={product.id}
                    whileHover={{ x: 4 }}
                    onClick={() => addItemToSale(product)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-foreground/60">{product.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-accent">${product.price.toLocaleString()}</p>
                      <p className={`text-xs ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Stock: {product.stock || 0}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sale Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20 shadow-xl p-6 h-fit sticky top-24"
          >
            <h3 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
              <ShoppingCart size={20} />
              Resumen de Venta
            </h3>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {currentSale?.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col p-3 bg-card rounded-lg border border-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{item.productName}</p>
                      <p className="text-xs text-foreground/60">${item.price.toLocaleString()} c/u</p>
                    </div>
                    <button
                      onClick={() => removeItemFromSale(item.productId)}
                      className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    >
                      <X size={16} className="text-destructive" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                      className="px-2 py-1 bg-foreground/10 hover:bg-foreground/20 rounded text-sm transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItemQuantity(item.productId, parseInt(e.target.value) || 1)
                      }
                      className="w-12 px-2 py-1 text-center border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button
                      onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-1 bg-foreground/10 hover:bg-foreground/20 rounded text-sm transition-colors"
                    >
                      +
                    </button>
                    <span className="ml-auto font-medium text-accent">
                      ${item.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/70">Subtotal:</span>
                <span className="font-medium text-foreground">
                  ${currentSale?.subtotal.toLocaleString()}
                </span>
              </div>

              {shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Envío:</span>
                  <span className="font-medium text-foreground">
                    ${shippingCost.toLocaleString()}
                  </span>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleIVA}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  currentSale?.includeIVA
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-foreground/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <DollarSign
                    size={18}
                    className={currentSale?.includeIVA ? 'text-accent' : 'text-foreground/60'}
                  />
                  <span
                    className={`font-medium ${
                      currentSale?.includeIVA ? 'text-accent' : 'text-foreground/70'
                    }`}
                  >
                    IVA (19%)
                  </span>
                </div>
                <span className="font-bold text-lg">${currentSale?.tax.toLocaleString()}</span>
              </motion.button>

              <div className="flex justify-between text-lg border-t border-border pt-3">
                <span className="font-light text-foreground">Total:</span>
                <span className="font-bold text-accent">${currentSale?.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <select
                value={currentSale?.paymentMethod || 'transfer'}
                onChange={(e) =>
                  setCurrentSale({
                    ...currentSale!,
                    paymentMethod: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="transfer">Transferencia</option>
                <option value="cash">Pago Contra Entrega</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateInvoice}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
              >
                <FileText size={20} />
                Generar Factura
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={cancelSale}
                className="w-full px-6 py-3 bg-foreground/10 text-foreground rounded-xl font-medium hover:bg-foreground/20 transition-all"
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SalesModule;
