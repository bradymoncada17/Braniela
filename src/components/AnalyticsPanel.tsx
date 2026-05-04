import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFirebase } from '@/contexts/FirebaseContext';
import { TrendingUp, DollarSign, Percent, Package } from 'lucide-react';

interface ProductWithMargin {
  id: string | number;
  name: string;
  brand: string;
  price: number;
  costPrice: number;
  margin: number;
  marginPercent: number;
  stock: number;
}

export const AnalyticsPanel: React.FC = () => {
  const { products } = useFirebase();

  const analytics = useMemo(() => {
    const productsWithMargin: ProductWithMargin[] = products.map((p: any) => {
      const costPrice = p.costPrice || 0;
      const margin = p.price - costPrice;
      const marginPercent = costPrice > 0 ? (margin / costPrice) * 100 : 0;
      return {
        id: String(p.id),
        name: p.name,
        brand: p.brand,
        price: p.price,
        costPrice,
        margin,
        marginPercent,
        stock: p.stock || 0,
      };
    });

    const totalRevenue = productsWithMargin.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalCost = productsWithMargin.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
    const totalMargin = totalRevenue - totalCost;
    const avgMarginPercent = productsWithMargin.length > 0
      ? productsWithMargin.reduce((sum, p) => sum + p.marginPercent, 0) / productsWithMargin.length
      : 0;

    return {
      productsWithMargin: productsWithMargin.sort((a, b) => b.marginPercent - a.marginPercent),
      totalRevenue,
      totalCost,
      totalMargin,
      avgMarginPercent,
    };
  }, [products]);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg border border-white/10`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{label}</p>
          <p className="text-3xl font-light mt-2">{value}</p>
        </div>
        <Icon size={32} className="opacity-50" />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          label="Ingresos Totales"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Package}
          label="Costo Total"
          value={`$${analytics.totalCost.toLocaleString()}`}
          color="from-orange-500 to-orange-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Ganancia Total"
          value={`$${analytics.totalMargin.toLocaleString()}`}
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={Percent}
          label="Margen Promedio"
          value={`${analytics.avgMarginPercent.toFixed(1)}%`}
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-light text-foreground">Análisis de Margen por Producto</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-foreground/5">
                <th className="text-left py-4 px-6 font-medium text-foreground/70">Producto</th>
                <th className="text-right py-4 px-6 font-medium text-foreground/70">Costo</th>
                <th className="text-right py-4 px-6 font-medium text-foreground/70">Precio</th>
                <th className="text-right py-4 px-6 font-medium text-foreground/70">Margen</th>
                <th className="text-right py-4 px-6 font-medium text-foreground/70">% Margen</th>
                <th className="text-right py-4 px-6 font-medium text-foreground/70">Stock</th>
                <th className="text-right py-4 px-6 font-medium text-foreground/70">Ganancia Total</th>
              </tr>
            </thead>
            <tbody>
              {analytics.productsWithMargin.map((product, idx) => (
                <motion.tr
                  key={String(product.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-border hover:bg-foreground/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-foreground/60">{product.brand}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-foreground">
                    ${product.costPrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right text-foreground font-medium">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-green-600 font-medium">
                      ${product.margin.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-foreground/10 rounded-full h-2">
                        <div
                          className="bg-green-500 h-full rounded-full"
                          style={{ width: `${Math.min(product.marginPercent, 100)}%` }}
                        />
                      </div>
                      <span className="text-green-600 font-medium w-12 text-right">
                        {product.marginPercent.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-foreground">
                    {product.stock}
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-green-600">
                    ${(product.margin * product.stock).toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPanel;
