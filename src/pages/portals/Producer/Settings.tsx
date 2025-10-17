import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const ProducerSettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'loans', name: 'Loan Applications', icon: '💰', href: '/portal/producer/loans' },
    { id: 'anchors', name: 'Anchor Partners', icon: '🤝', href: '/portal/producer/anchors' },
    { id: 'inputs', name: 'Input Suppliers', icon: '🌱', href: '/portal/producer/inputs' },
    { id: 'insurance', name: 'Crop Insurance', icon: '🛡️', href: '/portal/producer/insurance' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/producer/extension' },
    { id: 'prices', name: 'Market Prices', icon: '📈', href: '/portal/producer/prices' },
    { id: 'cooperative', name: 'Cooperative', icon: '👥', href: '/portal/producer/cooperative' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/producer/settings' }
  ];

  return (
    <PortalLayout 
      role="Producer/Farmer" 
      roleIcon="🌾" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Profile Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  defaultValue="Ahmadu Ibrahim"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  defaultValue="ahmadu.ibrahim@email.com"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  defaultValue="+234 801 234 5678"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Farm Location</label>
                <input 
                  type="text" 
                  className="input-field" 
                  defaultValue="Kaduna State, Nigeria"
                  placeholder="Enter your farm location"
                />
              </div>
              <button 
                className="btn-primary"
                onClick={() => processAction('Update Profile')}
              >
                Update Profile
              </button>
            </div>
          </div>

          {/* Farm Information */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Farm Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Farm Size (Hectares)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  defaultValue="5.5"
                  placeholder="Enter farm size"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Crops</label>
                <select className="input-field">
                  <option>Rice</option>
                  <option>Maize</option>
                  <option>Cassava</option>
                  <option>Wheat</option>
                  <option>Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Farming Experience (Years)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  defaultValue="8"
                  placeholder="Enter years of experience"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cooperative Membership</label>
                <select className="input-field">
                  <option>Kaduna Rice Farmers Cooperative</option>
                  <option>Kano Maize Growers Association</option>
                  <option>None</option>
                </select>
              </div>
              <button 
                className="btn-primary"
                onClick={() => processAction('Update Farm Info')}
              >
                Update Farm Info
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 font-sans font-medium">Price Alerts</p>
                  <p className="text-sm text-gray-400 font-serif">Get notified when crop prices change</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-primary-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 font-sans font-medium">Weather Updates</p>
                  <p className="text-sm text-gray-400 font-serif">Receive weather forecasts and alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-primary-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 font-sans font-medium">Extension Services</p>
                  <p className="text-sm text-gray-400 font-serif">Notifications about training and advisory services</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-primary-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 font-sans font-medium">Loan Updates</p>
                  <p className="text-sm text-gray-400 font-serif">Updates about loan applications and approvals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-primary-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <button 
                className="btn-primary"
                onClick={() => processAction('Save Notifications')}
              >
                Save Notifications
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Confirm new password"
                />
              </div>
              <button 
                className="btn-primary"
                onClick={() => processAction('Change Password')}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => processAction('Export Data')}
            >
              📤 Export Data
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Account Summary', 'PDF')}
            >
              📊 Account Summary
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Download Reports')}
            >
              📋 Download Reports
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Delete Account')}
            >
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ProducerSettings;