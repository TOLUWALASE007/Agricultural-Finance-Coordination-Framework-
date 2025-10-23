# AFCF - Agricultural Finance Coordination Framework

A comprehensive digital platform designed to facilitate the efficient flow of funds and resources within Nigeria's agricultural ecosystem. The system provides role-based portals for all stakeholders in the agricultural value chain, enabling seamless coordination, financial management, and data-driven decision making.

## ✨ Key Features

- **12 Role-Based Portals** - Dedicated dashboards for each stakeholder type
- **Interconnected Ecosystem** - Real-time data sharing between all stakeholders
- **Dark Theme UI** - Modern, professional interface with custom color scheme
- **Fully Responsive Design** - Mobile-first approach optimized for all screen sizes
- **Real-time Notifications** - Custom notification system for all actions
- **Advanced Data Visualization** - Interactive charts (bar, pie, donut) with native SVG
- **Smart Search & Pagination** - Searchable data cards with carousel navigation
- **Multi-step Registration** - Role-specific registration with validation
- **Lazy Loading** - Optimized performance with intersection observer
- **Functional Quick Actions** - Interactive buttons with real feedback
- **Professional Branding** - Powered by Mc. George across all portals

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
- React Router (HashRouter) for navigation
- Responsive design with mobile-first approach
- Intersection Observer API for lazy loading
- Custom notification system
- Native SVG for data visualization (no external chart libraries)

**Key Features:**
- Dark theme with custom color palette
- Fully responsive design (mobile, tablet, desktop)
- Lazy loading with intersection observer
- Sticky navigation with scroll detection
- Interactive quick actions with real-time feedback
- Multi-step forms with validation
- Accordion components for FAQs
- Advanced search and pagination with carousel controls
- Dynamic data visualization with native charts
- Mobile-responsive search inputs with icon buttons

## 📱 Responsive Design Features

The AFCF platform is fully optimized for all screen sizes with the following breakpoints:

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md to lg)
- **Desktop**: > 1024px (lg+)

### Mobile Optimizations
- **Stacked Layouts**: Cards and forms stack vertically on mobile
- **Full-Width Inputs**: Search boxes expand to full width on small screens
- **Touch-Friendly**: Larger buttons and touch targets for mobile users
- **Responsive Tables**: Tables convert to card layouts on mobile
- **Dynamic Pagination**: Fewer items per page on mobile (3 vs 6 on desktop)
- **Flexible Grids**: Grid layouts adapt from 1 column (mobile) to 2-3 columns (desktop)

### Desktop Features
- **Side-by-Side Layouts**: Cards display in rows on larger screens
- **Fixed-Width Inputs**: Search boxes have optimal width (256px-288px)
- **Table Views**: Full table layouts with all columns visible
- **More Items Per Page**: 5-6 items per page for better data viewing
- **Multi-Column Grids**: Up to 4 columns for quick actions and stats

### Responsive Components
All data cards include:
- ✅ Mobile-responsive search inputs with icon buttons
- ✅ Adaptive pagination controls
- ✅ Carousel navigation (left/right arrows)
- ✅ Flexible layouts that adjust to screen size
- ✅ Optimized text sizes and spacing

## 🔧 Available Scripts

- `npm start` - Start development server (runs on http://localhost:3000)
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

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

#### 1. **Fund Provider Portal** ⭐ (Fully Enhanced)
- **Dashboard**: Real-time stats with active schemes tracking and search functionality
- **Fund Management**: Track active funds, deployed schemes, and recovery rates
  - Active Applications with search and pagination
  - Recent Deployments tracking
  - Scheme Performance Overview with detailed metrics
- **Schemes**: Comprehensive scheme management system
  - Recent Applications with advanced filtering
  - Regional distribution analysis
  - Stakeholder type breakdown
  - Responsive pagination (6 items on desktop, 3 on mobile)
- **Reports & Analytics**: Advanced data visualization
  - Fund Recovery Rate metrics
  - Fund Performance Analysis (horizontal bar chart)
  - Regional Analysis (vertical bar chart)
  - Stakeholder Impact Analysis (pie/donut chart)
  - All charts are mobile-responsive
- **Settings**: Complete profile and preference management
  - Company profile information
  - Security settings
  - Notification preferences
  - System preferences

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
- **Dark Theme**: Professional dark interface with custom color scheme (#036572 primary)
- **Fully Responsive Design**: Optimized for mobile (< 640px), tablet (640px-1024px), and desktop (> 1024px)
- **Lazy Loading**: Optimized performance with intersection observer
- **Sticky Navigation**: Navigation remains accessible during scroll
- **Nigerian Naira (₦) Currency**: Consistent currency display throughout the application

### Functionality
- **Multi-step Registration**: Role-specific registration with validation
- **Quick Actions**: Interactive buttons with real-time feedback and notifications
- **Custom Notifications**: Toast notification system for all actions
- **Advanced Search**: Real-time search across all data cards with instant filtering
- **Smart Pagination**: Carousel-based pagination with responsive items per page
- **Data Visualization**: Native SVG charts (horizontal bar, vertical bar, pie/donut)
- **Settings Management**: Complete account and preference management
- **FAQ Accordion**: Interactive FAQ sections with smooth animations

### Data Management
- **Realistic Dummy Data**: Comprehensive interconnected data for demonstration
- **Role Interconnection**: Data flows between different stakeholder roles
- **Performance Optimization**: Lazy loading, efficient rendering, and memoized computations
- **State Management**: Proper React state management with hooks (useState, useMemo, useEffect)
- **Responsive Pagination**: Dynamic items per page based on screen size
- **Search Optimization**: Filtered data with case-insensitive search

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

## 🌐 Deployment

### GitHub Pages
The application is deployed on GitHub Pages and can be accessed at:
- **Live URL**: [https://TOLUWALASE007.github.io/Agricultural-Finance-Coordination-Framework-/](https://TOLUWALASE007.github.io/Agricultural-Finance-Coordination-Framework-/)

### Deployment Process
To deploy updates to GitHub Pages:

```bash
# Navigate to the DEVELOPMENT directory
cd "C:\Users\HP\AFCF Project\DEVELOPMENT"

# Build and deploy
npm run deploy
```

This will:
1. Build the production version of the app
2. Push the build to the `gh-pages` branch
3. Automatically update the live site

### Configuration
- **Router**: Uses HashRouter for GitHub Pages compatibility
- **Base URL**: Configured with `process.env.PUBLIC_URL`
- **Assets**: All images and static files use absolute paths
- **404 Handling**: Custom 404.html redirects to index.html for client-side routing

## 📞 Support

For support and inquiries:
- Email: info@afcf.gov.ng
- Phone: +234 XXX XXX XXXX
- Documentation: [AFCF Documentation](docs/)
- GitHub: [AFCF Repository](https://github.com/TOLUWALASE007/Agricultural-Finance-Coordination-Framework-)
- Live Demo: [AFCF Platform](https://TOLUWALASE007.github.io/Agricultural-Finance-Coordination-Framework-/)

## 🎯 Roadmap

### ✅ Completed Features
- [x] Complete portal structure for all 12 stakeholder roles
- [x] Dark theme implementation with custom color palette (#036572)
- [x] Fully responsive design (mobile, tablet, desktop)
- [x] Lazy loading and performance optimization
- [x] Interactive quick actions with notifications
- [x] Multi-step registration forms
- [x] Comprehensive settings pages
- [x] Advanced search functionality across all data cards
- [x] Smart pagination with carousel navigation
- [x] Data visualization with native SVG charts
- [x] Mobile-responsive search inputs with icon buttons
- [x] Nigerian Naira (₦) currency integration
- [x] Fund Provider portal fully enhanced with:
  - Active Schemes tracking
  - Fund Management with recovery metrics
  - Schemes management system
  - Reports & Analytics with interactive charts
  - Mobile-responsive layouts
- [x] Professional branding (Powered by Mc. George)
- [x] GitHub Pages deployment

### 🚧 In Progress
- [ ] Backend API integration
- [ ] Database implementation
- [ ] User authentication system

### 📋 Planned Features
- [ ] Real-time data synchronization
- [ ] Advanced analytics dashboard for all portals
- [ ] Mobile app development (React Native)
- [ ] Multi-language support (English, Hausa, Yoruba, Igbo)
- [ ] Blockchain integration for transparency
- [ ] SMS/Email notification system
- [ ] Document management system
- [ ] Payment gateway integration
- [ ] Geolocation tracking for field monitoring
- [ ] AI-powered risk assessment
