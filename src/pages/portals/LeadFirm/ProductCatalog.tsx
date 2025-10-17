import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const ProductCatalog: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/lead-firm' },
    { id: 'products', name: 'Product Catalog', icon: '🌱', href: '/portal/lead-firm/products' },
    { id: 'orders', name: 'Orders', icon: '📦', href: '/portal/lead-firm/orders' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/lead-firm/producers' },
    { id: 'credit', name: 'Credit Sales', icon: '💰', href: '/portal/lead-firm/credit' },
    { id: 'delivery', name: 'Delivery', icon: '🚚', href: '/portal/lead-firm/delivery' },
    { id: 'quality', name: 'Quality Control', icon: '✅', href: '/portal/lead-firm/quality' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/lead-firm/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/lead-firm/settings' }
  ];

  const products = [
    {
      id: 'PROD-001',
      name: 'Premium Rice Seeds',
      category: 'Seeds',
      variety: 'FARO 44',
      price: 2500,
      stock: 1500,
      unit: 'kg',
      supplier: 'National Seed Company',
      quality: 'Grade A',
      status: 'Available',
      description: 'High-yielding rice variety suitable for Nigerian conditions'
    },
    {
      id: 'PROD-002',
      name: 'NPK Fertilizer 15-15-15',
      category: 'Fertilizers',
      variety: 'Compound',
      price: 1800,
      stock: 2500,
      unit: '50kg bag',
      supplier: 'Notore Chemical',
      quality: 'Grade A',
      status: 'Available',
      description: 'Balanced NPK fertilizer for general crop nutrition'
    },
    {
      id: 'PROD-003',
      name: 'Herbicide Roundup',
      category: 'Agrochemicals',
      variety: 'Glyphosate',
      price: 3500,
      stock: 800,
      unit: '1L bottle',
      supplier: 'Bayer CropScience',
      quality: 'Grade A',
      status: 'Low Stock',
      description: 'Broad-spectrum herbicide for weed control'
    }
  ];

  const productStats = [
    { label: 'Total Products', value: '156', change: '+12', trend: 'up' },
    { label: 'Available Stock', value: '89', change: '+8', trend: 'up' },
    { label: 'Low Stock Items', value: '23', change: '+3', trend: 'up' },
    { label: 'Out of Stock', value: '4', change: '-1', trend: 'down' }
  ];

  return (
    <PortalLayout 
      role="Lead Firm" 
      roleIcon="🏭" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Product Catalog</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your agricultural input products and inventory</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Product Catalog Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Product')}
            >
              ➕ Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {productStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.label}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Product Inventory</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Categories</option>
                <option>Seeds</option>
                <option>Fertilizers</option>
                <option>Agrochemicals</option>
                <option>Equipment</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Available</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Products', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Product ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Product Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Category</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Price</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Stock</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Supplier</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{product.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{product.name}</p>
                        <p className="text-sm text-gray-400 font-serif">{product.variety}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{product.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{product.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-400 font-serif">per {product.unit}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{product.stock.toLocaleString()}</p>
                        <p className="text-sm text-gray-400 font-serif">{product.unit}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{product.supplier}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'Available' ? 'bg-green-500 text-white' :
                        product.status === 'Low Stock' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Product Details', product.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Edit Product')}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Update Stock')}
                        >
                          Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Product Addition')}
            >
              🌱 Add Product
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Inventory Update')}
            >
              📦 Update Inventory
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Supplier Management')}
            >
              🏭 Manage Suppliers
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Inventory Report', 'PDF')}
            >
              📊 Inventory Report
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ProductCatalog;
