# AFCF - Agricultural Finance Coordination Framework

A comprehensive digital platform designed to facilitate the efficient flow of funds and resources within Nigeria's agricultural ecosystem. The system provides role-based portals for all stakeholders in the agricultural value chain, enabling seamless coordination, financial management, and data-driven decision making.

## ✨ Key Features

- **12 Role-Based Portals** - Dedicated dashboards for each stakeholder type
- **Interconnected Ecosystem** - Real-time data sharing between all stakeholders
- **Dark Theme UI** - Modern, professional interface with custom color scheme
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Notifications** - Custom notification system for all actions
- **Comprehensive Reporting** - Detailed analytics and reporting for all roles
- **Multi-step Registration** - Role-specific registration with validation
- **Lazy Loading** - Optimized performance with intersection observer
- **Functional Quick Actions** - Interactive buttons with real feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Navigate to Development Directory**
   ```bash
   cd "C:\Users\HP\AFCF Project\DEVELOPMENT"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access the Application**
   - The server will automatically open your browser to `http://localhost:3000`
   - If it doesn't open automatically, manually navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

### 🛠️ Troubleshooting

#### If the server doesn't start:
1. **Check if you're in the correct directory:**
   ```bash
   pwd  # On Unix/Mac
   cd   # On Windows
   ```
   Make sure you're in the `DEVELOPMENT` folder.

2. **Verify Node.js installation:**
   ```bash
   node --version
   npm --version
   ```

3. **Clear npm cache and reinstall:**
   ```bash
   npm cache clean --force
   npm install
   ```

4. **Check if port 3000 is available:**
   ```bash
   netstat -an | findstr :3000  # Windows
   lsof -i :3000                # Mac/Linux
   ```

#### If you get "package.json not found" error:
- Make sure you're in the `DEVELOPMENT` directory, not the root project directory
- The `package.json` file should be in the `DEVELOPMENT` folder

#### If the page doesn't load:
- Wait a few seconds for the development server to fully start
- Check the terminal for any error messages
- Try refreshing the browser page
- Clear your browser cache

## 📁 Project Structure

```
DEVELOPMENT/
├── public/                    # Static assets and images
│   └── images/               # Project images and assets
│       └── logo/             # AFCF logo files
├── src/                      # Frontend source code
│   ├── components/           # Reusable React components
│   │   ├── Navbar.tsx        # Navigation component
│   │   ├── Footer.tsx        # Footer component
│   │   ├── PortalLayout.tsx  # Portal layout wrapper
│   │   └── LazySection.tsx   # Lazy loading component
│   ├── pages/                # Page components
│   │   ├── Home.tsx          # Landing page
│   │   ├── About.tsx         # About page
│   │   ├── ELearning.tsx     # E-Learning page
│   │   ├── Contact.tsx       # Contact page
│   │   ├── Login.tsx         # Login page
│   │   ├── Register.tsx      # Registration page
│   │   └── portals/          # Role-based portal pages
│   │       ├── FundProviderPortal.tsx
│   │       ├── ProducerPortal.tsx
│   │       ├── PFIPortal.tsx
│   │       ├── CoordinatingAgencyPortal.tsx
│   │       ├── InsurancePortal.tsx
│   │       ├── PMTPortal.tsx
│   │       ├── AnchorPortal.tsx
│   │       ├── LeadFirmPortal.tsx
│   │       ├── CooperativePortal.tsx
│   │       ├── DeRiskingPortal.tsx
│   │       ├── ExtensionPortal.tsx
│   │       └── ResearcherPortal.tsx
│   ├── hooks/                # Custom React hooks
│   │   └── useIntersectionObserver.ts
│   └── utils/                # Utility functions
│       └── quickActions.ts   # Quick action handlers
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## 🎨 Design System

### Color Palette
- **Primary Color**: #036572 - Used throughout the application for branding and primary actions
- **Dark Theme**: Custom dark color scheme with primary-900 to primary-50 variations
- **Accent Colors**: Blue accent palette for highlights and interactive elements

### Typography
- **Headings**: Montserrat (sans-serif) - Modern, clean typography for all headings
- **Body Text**: Merriweather (serif) - Readable serif font for body content

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling with custom configuration
- React Router for navigation
- Responsive design with mobile-first approach
- Intersection Observer API for lazy loading
- Custom notification system

**Key Features:**
- Dark theme with custom color palette
- Lazy loading with intersection observer
- Sticky navigation with scroll detection
- Interactive quick actions with real-time feedback
- Multi-step forms with validation
- Accordion components for FAQs

## 🔧 Available Scripts

- `npm start` - Start development server (runs on http://localhost:3000)
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### 🖥️ Server Management

#### Starting the Server
```bash
# Navigate to the DEVELOPMENT directory
cd "C:\Users\HP\AFCF Project\DEVELOPMENT"

# Start the development server
npm start
```

#### Stopping the Server
- Press `Ctrl + C` in the terminal where the server is running
- Or close the terminal window

#### Checking Server Status
```bash
# Check if port 3000 is in use
netstat -an | findstr :3000  # Windows
lsof -i :3000                # Mac/Linux
```

#### Restarting the Server
```bash
# Stop the server (Ctrl + C) then restart
npm start
```

## 🏢 Portal Structure

### 12 Role-Based Portals

Each portal provides a comprehensive dashboard with role-specific features:

#### 1. **Fund Provider Portal**
- Fund Management
- Loan Applications
- Reports & Analytics
- Settings

#### 2. **Producer/Farmer Portal**
- Loan Applications
- Anchor Partners
- Input Suppliers
- Crop Insurance
- Extension Services
- Market Prices
- Cooperative
- Settings

#### 3. **PFI (Participating Bank) Portal**
- Loan Processing
- Applications
- Producer Network
- Anchor Partners
- Insurance Claims
- Risk Assessment
- Reports
- Settings

#### 4. **Coordinating Agency Portal**
- Programs
- Stakeholders
- Compliance
- Reports & Analytics
- Settings

#### 5. **Insurance Company Portal**
- Policies
- Claims
- Risk Assessment
- Reports & Analytics
- Settings

#### 6. **PMT (Project Management Team) Portal**
- Projects
- Stakeholders
- Monitoring
- Reports
- Settings

#### 7. **Anchor Portal**
- Producer Network
- Supply Contracts
- Loan Performance
- Reports
- Settings

#### 8. **Lead Firm Portal**
- Product Catalog
- Orders
- Producer Network
- Credit Sales
- Delivery
- Quality Control
- Reports
- Settings

#### 9. **Cooperative Group Portal**
- Members
- Group Loans
- Savings
- Training & Extension
- Extension Services
- Market Access
- Reports & Analytics
- Settings

#### 10. **De-risking Institution Portal**
- De-risking Funds
- Risk Assessment
- Guarantees
- Partners
- Monitoring
- Reports
- Settings

#### 11. **Extension Organization Portal**
- Farmers
- Training Programs
- Advisory Services
- Technology Transfer
- Field Monitoring
- Reports & Analytics
- Settings

#### 12. **Researcher/Student Portal**
- Research Projects
- Data Collection
- Publications
- Collaborations
- Funding
- Conferences
- Reports
- Settings

## 🎯 Key Features

### User Experience
- **Role-Based Access**: Each stakeholder has a dedicated portal with relevant features
- **Interconnected Data**: Real-time data sharing between all stakeholders
- **Dark Theme**: Professional dark interface with custom color scheme
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Lazy Loading**: Optimized performance with intersection observer
- **Sticky Navigation**: Navigation remains accessible during scroll

### Functionality
- **Multi-step Registration**: Role-specific registration with validation
- **Quick Actions**: Interactive buttons with real-time feedback
- **Custom Notifications**: Toast notification system for all actions
- **Comprehensive Reporting**: Detailed analytics for all roles
- **Settings Management**: Complete account and preference management
- **FAQ Accordion**: Interactive FAQ sections with smooth animations

### Data Management
- **Realistic Dummy Data**: Comprehensive interconnected data for demonstration
- **Role Interconnection**: Data flows between different stakeholder roles
- **Performance Optimization**: Lazy loading and efficient rendering
- **State Management**: Proper React state management throughout the application

## 🚀 Getting Started

### Demo Access
1. **Start the Development Server** (if not already running):
   ```bash
   cd "C:\Users\HP\AFCF Project\DEVELOPMENT"
   npm start
   ```

2. **Open the Application**:
   - The browser should automatically open to `http://localhost:3000`
   - If not, manually navigate to `http://localhost:3000`

3. **Access the Login Page**:
   - Click "Login" in the top navigation bar
   - Or directly navigate to `http://localhost:3000/login`

4. **Select a Role and Login**:
   - Choose any role from the dropdown menu
   - Click "Login" to access the role-specific portal
   - No password required for demo purposes

5. **Explore the Portal**:
   - Navigate through the sidebar to access different features
   - Click on quick action buttons to see notifications
   - Explore the interconnected data between different sections

### 🌐 Direct Portal Access
You can also access portals directly using these URLs:
- `http://localhost:3000/portal/fund-provider`
- `http://localhost:3000/portal/producer`
- `http://localhost:3000/portal/pfi`
- `http://localhost:3000/portal/coordinating-agency`
- `http://localhost:3000/portal/insurance`
- `http://localhost:3000/portal/pmt`
- `http://localhost:3000/portal/anchor`
- `http://localhost:3000/portal/lead-firm`
- `http://localhost:3000/portal/cooperative`
- `http://localhost:3000/portal/de-risking`
- `http://localhost:3000/portal/extension`
- `http://localhost:3000/portal/researcher`

### Available Roles for Demo
- Fund Provider
- Coordinating Agency
- Participating Bank (PFI)
- Insurance Company
- Project Management Team (PMT)
- Anchor
- Lead Firm
- Producer/Farmer
- Cooperative Group
- De-risking Institution
- Extension Organization
- Researcher/Student

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and inquiries:
- Email: info@afcf.gov.ng
- Phone: +234 XXX XXX XXXX
- Documentation: [AFCF Documentation](docs/)

## 🎯 Roadmap

- [x] Complete portal structure for all 12 stakeholder roles
- [x] Dark theme implementation with custom color palette
- [x] Responsive design with mobile-first approach
- [x] Lazy loading and performance optimization
- [x] Interactive quick actions with notifications
- [x] Multi-step registration forms
- [x] Comprehensive settings pages
- [ ] Backend API integration
- [ ] Database implementation
- [ ] User authentication system
- [ ] Real-time data synchronization
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Blockchain integration for transparency
