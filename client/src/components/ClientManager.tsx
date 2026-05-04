import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, AlertCircle, CheckCircle, Clock, TrendingUp, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useFirebase, Client } from '@/contexts/FirebaseContext';

interface Loan {
  id: string;
  amount: number;
  paid: number;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  movements: Movement[];
}

interface Movement {
  id: string;
  amount: number;
  date: Date;
  note: string;
}

export const ClientManager: React.FC = () => {
  const { clients, addClient, updateClient, getSalesByClient, getPaymentPlansBySale } = useFirebase();
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [newMovement, setNewMovement] = useState({ amount: '', note: '' });

  const handleAddClient = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Completa los datos del cliente');
      return;
    }

    try {
      await addClient({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        totalPurchases: 0,
        totalDebt: 0,
      });
      setFormData({ name: '', phone: '', email: '' });
      setShowForm(false);
      toast.success('Cliente agregado correctamente');
    } catch (error) {
      toast.error('Error al agregar cliente');
    }
  };

  const handleUpdateClient = async (client: Client, updates: Partial<Client>) => {
    try {
      const firestoreId = client._firestoreId || client.id;
      await updateClient(firestoreId, updates);
      toast.success('Cliente actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar cliente');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const clientSales = selectedClient ? getSalesByClient(selectedClient._firestoreId || selectedClient.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Clientes</h2>
          <p className="text-sm text-foreground/60">Administra clientes, facturas y planes de pago</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </motion.button>
      </div>

      {/* Add Client Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-lg p-4 space-y-3"
          >
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="email"
              placeholder="Email (opcional)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddClient}
                className="flex-1 bg-accent text-white py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-foreground/10 text-foreground py-2 rounded-lg hover:bg-foreground/20 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {clients.length === 0 ? (
          <div className="col-span-full text-center py-8 text-foreground/50">
            <p>No hay clientes registrados</p>
          </div>
        ) : (
          clients.map((client) => (
            <motion.div
              key={client._firestoreId || client.id}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-lg p-4 space-y-3 cursor-pointer hover:border-accent/50 transition-colors"
              onClick={() => setSelectedClient(client)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-foreground">{client.name}</h3>
                  <p className="text-sm text-foreground/60">{client.phone}</p>
                  {client.email && <p className="text-sm text-foreground/60">{client.email}</p>}
                </div>
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-foreground/5 p-2 rounded">
                  <p className="text-foreground/60">Compras</p>
                  <p className="font-bold text-foreground">${(client.totalPurchases || 0).toLocaleString()}</p>
                </div>
                <div className="bg-foreground/5 p-2 rounded">
                  <p className="text-foreground/60">Deuda</p>
                  <p className="font-bold text-red-600">${(client.totalDebt || 0).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Client Details with Invoices and Payment Plans */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-card border border-border rounded-lg p-6 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-foreground">{selectedClient.name}</h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-foreground/60 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-border">
              <div>
                <p className="text-sm text-foreground/60">Teléfono</p>
                <p className="font-semibold text-foreground">{selectedClient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Email</p>
                <p className="font-semibold text-foreground">{selectedClient.email || 'No registrado'}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Total de Compras</p>
                <p className="font-semibold text-foreground">${(selectedClient.totalPurchases || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Deuda Total</p>
                <p className="font-semibold text-red-600">${(selectedClient.totalDebt || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="text-sm text-foreground/50">
              Cliente desde: {new Date(selectedClient.createdAt).toLocaleDateString('es-CO')}
            </div>

            {/* Invoices Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Facturas ({clientSales.length})
              </h4>
              
              {clientSales.length === 0 ? (
                <div className="text-center py-6 text-foreground/50 bg-foreground/5 rounded-lg">
                  <p>No hay facturas registradas para este cliente</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {clientSales.map((sale, idx) => {
                    const paymentPlans = getPaymentPlansBySale(sale._firestoreId || sale.id);
                    return (
                      <motion.div
                        key={`sale-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-foreground/5 border border-border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-foreground">Factura #{sale._firestoreId?.slice(-8) || sale.id}</p>
                            <p className="text-sm text-foreground/60">
                              {new Date(sale.createdAt).toLocaleDateString('es-CO')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-accent">${sale.total.toLocaleString()}</p>
                            <p className="text-xs text-foreground/60">{sale.paymentMethod}</p>
                          </div>
                        </div>

                        {/* Items in Sale */}
                        <div className="text-sm space-y-1 bg-background/50 p-2 rounded">
                          {sale.items.map((item: any, itemIdx: number) => (
                            <div key={`item-${itemIdx}`} className="flex justify-between text-foreground/70">
                              <span>{item.name || 'Producto'} x{item.quantity}</span>
                              <span>${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        {/* Payment Plans for this Sale */}
                        {paymentPlans.length > 0 && (
                          <div className="border-t border-border pt-3 space-y-2">
                            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-accent" />
                              Planes de Pago ({paymentPlans.length})
                            </p>
                            {paymentPlans.map((plan, planIdx) => (
                              <div key={`plan-${planIdx}`} className="bg-accent/10 p-2 rounded text-sm">
                                <div className="flex justify-between">
                                  <span className="font-semibold text-foreground">
                                    {plan.installments} cuotas de ${plan.monthlyPayment.toLocaleString()}
                                  </span>
                                  <span className="text-accent">{plan.interest}% interés</span>
                                </div>
                                <div className="text-foreground/60 mt-1">
                                  Total: ${plan.total.toLocaleString()}
                                </div>
                                {/* Payment Schedule */}
                                <div className="mt-2 space-y-1 text-xs">
                                  {plan.payments.slice(0, 3).map((payment, payIdx) => (
                                    <div key={`payment-${payIdx}`} className="flex justify-between text-foreground/50">
                                      <span>Cuota {payment.number}</span>
                                      <span className={payment.status === 'paid' ? 'text-green-600' : payment.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'}>
                                        {payment.status === 'paid' ? '✓ Pagada' : payment.status === 'overdue' ? '✗ Vencida' : '○ Pendiente'}
                                      </span>
                                    </div>
                                  ))}
                                  {plan.payments.length > 3 && (
                                    <div className="text-foreground/50 italic">
                                      +{plan.payments.length - 3} cuotas más
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
