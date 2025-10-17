import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { addNewRecord, viewDetails, processAction, exportData } from '../../../utils/quickActions';

const InputSuppliers: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'loans', name: 'Loan Applications', icon: '💰', href: '/portal/producer/loans' },
    { id: 'anchor', name: 'Anchor Partners', icon: '⚓', href: '/portal/producer/anchors' },
    { id: 'insurance', name: 'Crop Insurance', icon: '🛡️', href: '/portal/producer/insurance' },
    { id: 'inputs', name: 'Input Suppliers', icon: '🌱', href: '/portal/producer/inputs' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/producer/extension' },
    { id: 'market', name: 'Market Prices', icon: '📈', href: '/portal/producer/market' },
    { id: 'cooperative', name: 'Cooperative', icon: '🤝', href: '/portal/producer/cooperative' }
  ];

  const inputStats = [
    { title: 'Active Orders', value: '5', change: '+2', icon: '📦' },
    { title: 'Total Spent', value: '₦485K', change: '+₦120K', icon: '💰' },
    { title: 'Suppliers Used', value: '3', change: '+1', icon: '🏪' },
    { title: 'Next Delivery', value: '2 days', change: 'Seeds & Fertilizer', icon: '🚚' }
  ];

  const recentOrders = [
    {
      orderId: 'ORD-2024-001',
      supplier: 'AgroTech Solutions',
      items: 'NPK Fertilizer (50kg x 10 bags)',
      quantity: '10 bags',
      unitPrice: '₦12,500',
      totalAmount: '₦125,000',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-18',
      status: 'Delivered',
      paymentStatus: 'Paid',
      deliveryAddress: 'Farm Location, Kaduna',
      contactPerson: 'Mr. John Okafor',
      phone: '+234 803 123 4567',
      qualityRating: '4.8/5'
    },
    {
      orderId: 'ORD-2024-002',
      supplier: 'FarmInputs Nigeria',
      items: 'Hybrid Maize Seeds (25kg x 2 bags)',
      quantity: '2 bags',
      unitPrice: '₦45,000',
      totalAmount: '₦90,000',
      orderDate: '2024-01-20',
      deliveryDate: '2024-01-23',
      status: 'In Transit',
      paymentStatus: 'Paid',
      deliveryAddress: 'Farm Location, Kaduna',
      contactPerson: 'Mrs. Sarah Ibrahim',
      phone: '+234 802 987 6543',
      qualityRating: '4.6/5'
    },
    {
      orderId: 'ORD-2024-003',
      supplier: 'GreenFields Agriculture',
      items: 'Herbicide Roundup (1L x 5 bottles)',
      quantity: '5 bottles',
      unitPrice: '₦8,500',
      totalAmount: '₦42,500',
      orderDate: '2024-01-25',
      deliveryDate: '2024-01-28',
      status: 'Processing',
      paymentStatus: 'Pending',
      deliveryAddress: 'Farm Location, Kaduna',
      contactPerson: 'Mr. David Musa',
      phone: '+234 805 321 0987',
      qualityRating: '4.7/5'
    }
  ];

  const availableSuppliers = [
    {
      supplier: 'AgroTech Solutions',
      specializations: ['Fertilizers', 'Seeds', 'Pesticides'],
      deliveryRegions: ['Kaduna', 'Kano', 'Katsina'],
      averageRating: '4.8/5',
      deliveryTime: '2-3 days',
      paymentTerms: 'Cash on Delivery, Credit (30 days)',
      minimumOrder: '₦50,000',
      contactPerson: 'Mr. John Okafor',
      phone: '+234 803 123 4567',
      email: 'orders@agrotech.com',
      specialOffers: '10% discount for bulk orders'
    },
    {
      supplier: 'FarmInputs Nigeria',
      specializations: ['Seeds', 'Equipment', 'Tools'],
      deliveryRegions: ['National'],
      averageRating: '4.6/5',
      deliveryTime: '3-5 days',
      paymentTerms: 'Prepayment, Bank Transfer',
      minimumOrder: '₦25,000',
      contactPerson: 'Mrs. Sarah Ibrahim',
      phone: '+234 802 987 6543',
      email: 'sales@farminputs.com',
      specialOffers: 'Free delivery for orders above ₦100K'
    },
    {
      supplier: 'GreenFields Agriculture',
      specializations: ['Pesticides', 'Herbicides', 'Fungicides'],
      deliveryRegions: ['North West', 'North Central'],
      averageRating: '4.7/5',
      deliveryTime: '1-2 days',
      paymentTerms: 'Cash on Delivery',
      minimumOrder: '₦30,000',
      contactPerson: 'Mr. David Musa',
      phone: '+234 805 321 0987',
      email: 'info@greenfields.com',
      specialOffers: 'Bulk pricing for cooperatives'
    },
    {
      supplier: 'AgriSupply Limited',
      specializations: ['Organic Fertilizers', 'Biostimulants', 'Soil Amendments'],
      deliveryRegions: ['Kaduna', 'Plateau', 'Nasarawa'],
      averageRating: '4.9/5',
      deliveryTime: '2-4 days',
      paymentTerms: 'Credit (45 days), Installment',
      minimumOrder: '₦75,000',
      contactPerson: 'Dr. Fatima Ahmed',
      phone: '+234 807 654 3210',
      email: 'orders@agrisupply.com',
      specialOffers: 'Technical support included'
    }
  ];

  const popularProducts = [
    {
      product: 'NPK Fertilizer 15-15-15',
      supplier: 'AgroTech Solutions',
      price: '₦12,500/50kg',
      stock: 'In Stock',
      rating: '4.8/5',
      description: 'Balanced NPK fertilizer for all crops'
    },
    {
      product: 'Hybrid Maize Seeds (DKC 8033)',
      supplier: 'FarmInputs Nigeria',
      price: '₦45,000/25kg',
      stock: 'In Stock',
      rating: '4.7/5',
      description: 'High-yield hybrid maize variety'
    },
    {
      product: 'Herbicide Roundup',
      supplier: 'GreenFields Agriculture',
      price: '₦8,500/1L',
      stock: 'Limited Stock',
      rating: '4.6/5',
      description: 'Non-selective herbicide for weed control'
    },
    {
      product: 'Organic Compost',
      supplier: 'AgriSupply Limited',
      price: '₦15,000/ton',
      stock: 'In Stock',
      rating: '4.9/5',
      description: 'Organic soil amendment for sustainable farming'
    }
  ];

  return (
    <PortalLayout role="Producer/Farmer" roleIcon="🌾" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Input Suppliers & Orders</h1>
          <p className="text-gray-200 font-serif">
            Source quality agricultural inputs from trusted suppliers, track orders, and manage your farming supplies efficiently.
          </p>
        </div>

        {/* Input Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {inputStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.title}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                  <p className="text-sm text-accent-400 font-serif">{stat.change}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={index} className="p-4 bg-primary-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold font-sans text-gray-100">{order.orderId}</h4>
                    <p className="text-sm text-gray-300 font-serif">{order.supplier}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-500 text-white' :
                      order.status === 'In Transit' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {order.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-gray-400 font-serif text-sm">Items</p>
                    <p className="font-semibold font-sans text-gray-100">{order.items}</p>
                    <p className="text-sm text-gray-300 font-serif">Quantity: {order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif text-sm">Amount</p>
                    <p className="font-semibold font-sans text-gray-100">{order.totalAmount}</p>
                    <p className="text-sm text-gray-300 font-serif">Unit Price: {order.unitPrice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 font-serif">Order Date</p>
                    <p className="text-gray-100 font-sans">{order.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif">Delivery Date</p>
                    <p className="text-gray-100 font-sans">{order.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-serif">Quality Rating</p>
                    <p className="text-gray-100 font-sans">⭐ {order.qualityRating}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-primary-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 font-serif text-sm">Contact</p>
                      <p className="text-gray-100 font-sans">{order.contactPerson}</p>
                      <p className="text-gray-300 font-serif">{order.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary text-sm">
                        📞 Contact
                      </button>
                      <button className="btn-secondary text-sm">
                        📋 View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Suppliers */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Available Suppliers</h3>
            <div className="space-y-4">
              {availableSuppliers.map((supplier, index) => (
                <div key={index} className="p-4 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold font-sans text-gray-100">{supplier.supplier}</h4>
                    <span className="text-sm text-accent-400 font-sans">⭐ {supplier.averageRating}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Specializations:</span>
                      <span className="text-gray-100 font-sans">{supplier.specializations.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Delivery Time:</span>
                      <span className="text-gray-100 font-sans">{supplier.deliveryTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Min Order:</span>
                      <span className="text-gray-100 font-sans">{supplier.minimumOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Regions:</span>
                      <span className="text-gray-100 font-sans">{supplier.deliveryRegions.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-primary-600 mb-3">
                    <p className="text-xs text-gray-400 font-serif mb-1">Special Offers:</p>
                    <p className="text-sm text-accent-400 font-sans">{supplier.specialOffers}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="btn-primary text-sm flex-1">
                      📦 Place Order
                    </button>
                    <button className="btn-secondary text-sm">
                      📞 Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Products */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Popular Products</h3>
            <div className="space-y-3">
              {popularProducts.map((product, index) => (
                <div key={index} className="p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-sans text-gray-100">{product.product}</h4>
                    <span className="text-sm text-accent-400 font-sans">⭐ {product.rating}</span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Supplier:</span>
                      <span className="text-gray-100 font-sans">{product.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Price:</span>
                      <span className="text-gray-100 font-sans">{product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-serif">Stock:</span>
                      <span className={`font-sans ${
                        product.stock === 'In Stock' ? 'text-green-400' :
                        product.stock === 'Limited Stock' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {product.stock}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-300 font-serif mt-2">{product.description}</p>
                  
                  <button className="btn-primary w-full mt-2 text-sm">
                    📦 Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Input Order')}
            >
              📦 Place New Order
            </button>
            <button 
              className="btn-secondary"
              onClick={() => viewDetails('Order History', 'ALL')}
            >
              📊 Order History
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Supplier Directory')}
            >
              🏪 Browse Suppliers
            </button>
            <button 
              className="btn-secondary"
              onClick={() => exportData('Payment History', 'PDF')}
            >
              💰 Payment History
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default InputSuppliers;
