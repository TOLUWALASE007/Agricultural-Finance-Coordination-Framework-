# AFCF PLATFORM FRONTEND DOCUMENTATION

## Overview
The Agricultural Finance Coordination Framework (AFCF) frontend is a modern, scalable React-based single-page application (SPA) built with TypeScript. It provides a comprehensive user interface for managing agricultural financing workflows across multiple stakeholder portals.

---

## Technology Stack

### Core Technologies
```json
{
  "Framework": "React 18.2.0",
  "Language": "TypeScript 4.9.0",
  "Routing": "React Router DOM 6.8.0",
  "Styling": "Tailwind CSS 3.2.0",
  "Build Tool": "Create React App (react-scripts 5.0.1)",
  "Package Manager": "npm"
}
```

### Key Dependencies

**Production Dependencies:**
- **react** (^18.2.0): Core React library
- **react-dom** (^18.2.0): React DOM rendering
- **react-router-dom** (^6.8.0): Client-side routing
- **typescript** (^4.9.0): Type-safe JavaScript
- **web-vitals** (^2.1.0): Performance metrics

**Development Dependencies:**
- **tailwindcss** (^3.2.0): Utility-first CSS framework
- **@tailwindcss/forms** (^0.5.0): Form styling plugin
- **@tailwindcss/typography** (^0.5.0): Typography plugin
- **autoprefixer** (^10.4.0): CSS vendor prefixing
- **postcss** (^8.4.0): CSS transformations
- **gh-pages** (^6.3.0): GitHub Pages deployment

---

## Project Structure

```
afcf/
├── public/                          # Static assets
│   ├── index.html                   # HTML template
│   ├── manifest.json                # PWA manifest
│   └── robots.txt                   # SEO robots file
│
├── src/                             # Source code
│   ├── components/                  # Reusable components
│   │   ├── CoordinatingAgencyNotifications.tsx
│   │   ├── CreateMEProjectModal.tsx
│   │   ├── Footer.tsx
│   │   ├── LazySection.tsx
│   │   ├── Navbar.tsx
│   │   └── PortalLayout.tsx        # Main portal layout wrapper
│   │
│   ├── constants/                   # Application constants
│   │   └── [constant files]
│   │
│   ├── context/                     # React Context providers
│   │   └── NotificationContext.tsx  # Global notification state
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── useIntersectionObserver.ts
│   │
│   ├── pages/                       # Page components (106 files)
│   │   ├── Home.tsx                 # Landing page
│   │   ├── About.tsx                # About page
│   │   ├── ELearning.tsx            # E-learning platform
│   │   ├── Contact.tsx              # Contact page
│   │   ├── Login.tsx                # Login page
│   │   ├── Register.tsx             # Registration page
│   │   │
│   │   └── portals/                 # Portal-specific pages
│   │       ├── FundProviderPortal/
│   │       ├── CoordinatingAgency/
│   │       ├── PFI/
│   │       ├── Insurance/
│   │       ├── Anchor/
│   │       ├── LeadFirm/
│   │       ├── Producer/
│   │       ├── Cooperative/
│   │       ├── Extension/
│   │       └── Researcher/
│   │
│   ├── utils/                       # Utility functions
│   │   ├── api.ts                   # API integration layer
│   │   ├── localDatabase.ts         # Local data management (92KB)
│   │   ├── quickActions.ts          # Quick action utilities
│   │   └── relationshipDatabase.ts  # Relationship management
│   │
│   ├── App.tsx                      # Main application component
│   ├── index.tsx                    # Application entry point
│   └── index.css                    # Global styles
│
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── README.md                        # Project documentation
```

---

## Architecture Overview

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              App.tsx (Root Component)                 │  │
│  │  - HashRouter for client-side routing                │  │
│  │  - NotificationProvider wrapper                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         ▼                  ▼                  ▼             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Public Pages │  │Portal Pages  │  │  Components  │      │
│  │ - Home       │  │ - 10 Portals │  │ - Layout     │      │
│  │ - About      │  │ - 100+ Pages │  │ - Navbar     │      │
│  │ - Login      │  │              │  │ - Footer     │      │
│  │ - Register   │  │              │  │ - Modals     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         ▼                  ▼                  ▼             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Context    │  │    Utils     │  │    Hooks     │      │
│  │ - Notifs     │  │ - API        │  │ - Custom     │      │
│  │              │  │ - Database   │  │   Hooks      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Data Persistence Layer                      │
│  - LocalStorage (Development)                               │
│  - Future: Backend API Integration                          │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── NotificationProvider (Context)
│   └── HashRouter
│       ├── Public Routes
│       │   ├── Navbar
│       │   ├── Home | About | ELearning | Contact | Login | Register
│       │   └── Footer
│       │
│       └── Portal Routes (No Navbar/Footer)
│           └── PortalLayout
│               ├── Header (Role badge, notifications, user menu)
│               ├── Sidebar (Navigation)
│               └── Main Content (Page-specific)
```

---

## Routing System

### Router Configuration
**Type**: HashRouter (for GitHub Pages compatibility)

**Route Structure**:
```typescript
// Public Routes (with Navbar & Footer)
/                    → Home
/about               → About
/elearning           → E-Learning
/contact             → Contact
/login               → Login
/register            → Register

// Portal Routes (without Navbar & Footer)
/portal/{role}       → Portal Dashboard
/portal/{role}/*     → Portal Sub-pages
```

### Portal Routes (10 Main Portals)

1. **Coordinating Agency** (`/portal/coordinating-agency`)
   - 40+ sub-routes including:
     - Activities, Fund Schemes, Reportings
     - Applicants (Fund Provider, PFI, Insurance)
     - Fund Beneficiaries (Lead Firms, Anchors, Cooperatives, Producers)
     - Stakeholder Departments (8 departments)
     - M&E Team Portal
     - Relationships Management
     - Publications, Blog, FAQs

2. **Fund Provider** (`/portal/fund-provider`)
   - Dashboard
   - Scheme Application
   - Settings

3. **PFI** (`/portal/pfi`)
   - Dashboard
   - Scheme Application
   - Settings

4. **Insurance Company** (`/portal/insurance`)
   - Dashboard
   - Scheme Application
   - Policies
   - Claims
   - Risk Assessment
   - Reports
   - Settings

5. **Anchor** (`/portal/anchor`)
   - Dashboard
   - Scheme Application
   - Producer Management (5 sub-pages)
   - Settings

6. **Lead Firm** (`/portal/lead-firm`)
   - Dashboard
   - Scheme Application
   - Settings

7. **Producer/Farmer** (`/portal/producer`)
   - Dashboard
   - Scheme Application
   - Anchor Relationships (5 sub-pages)
   - Settings

8. **Cooperative Group** (`/portal/cooperative`)
   - Dashboard
   - Members
   - Scheme Application
   - Group Loans
   - Savings
   - Extension Services
   - Market Access
   - Training
   - Reports
   - Settings

9. **Extension Organization** (`/portal/extension`)
   - Dashboard
   - Scheme Application
   - Farmers
   - Training Programs
   - Advisory Services
   - Technology Transfer
   - Field Monitoring
   - Reports
   - Settings

10. **Researcher/Student** (`/portal/researcher`)
    - Dashboard
    - Scheme Application
    - Research Projects
    - Data Collection
    - Publications
    - Collaborations
    - Funding
    - Conferences
    - Reports
    - Settings

### Total Route Count
- **Public Routes**: 6
- **Portal Routes**: 100+
- **Total**: 106+ routes

---

## State Management

### Context API Implementation

#### NotificationContext
**Purpose**: Global notification management across all portals

**Features**:
- Centralized notification storage
- LocalStorage persistence
- Role-based notification filtering
- Real-time notification updates
- Viewed/unviewed tracking
- Status management (pending, approved, rejected, read)

**API**:
```typescript
interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (notification) => string;
  updateNotificationStatus: (id, status) => void;
  getNotificationsByRole: (role) => NotificationItem[];
  getPendingCount: (role) => number;
  clearNotifications: () => void;
  hasAppliedToScheme: (schemeId, userRole) => boolean;
  getApplicationsForScheme: (schemeId) => NotificationItem[];
  getApprovedApplicationForScheme: (schemeId, role) => NotificationItem | null;
  setNotificationViewed: (id, viewed) => void;
}
```

**Notification Types**:
- Registration notifications
- Approval/rejection responses
- Scheme notifications
- IC/PFI submissions
- Beneficiary applications
- M&E assignments
- Relationship requests (creation, invitation, leave)

### Local State Management
- **Component State**: `useState` for local component state
- **Side Effects**: `useEffect` for data fetching and subscriptions
- **Memoization**: `useMemo` and `useCallback` for performance optimization

---

## Data Management

### LocalStorage Strategy
**Current Implementation**: All data stored in browser localStorage

**Storage Keys**:
```typescript
'afcf_notifications'           // Notifications
'fundSchemes'                  // Fund schemes
'fundProviders'                // Fund provider records
'insuranceCompanies'           // Insurance company records
'pfis'                         // PFI records
'anchors'                      // Anchor records
'leadFirms'                    // Lead firm records
'producers'                    // Producer/farmer records
'cooperativeGroups'            // Cooperative group records
'extensionOrganizations'       // Extension organization records
'researchers'                  // Researcher/student records
'meMembers'                    // M&E member records
'meProjects'                   // M&E projects
'producerRelationships'        // Producer-anchor relationships
'producerCreationRequests'     // Producer creation requests
'producerInvitations'          // Producer invitations
'leaveRequests'                // Leave requests
```

### Data Persistence Flow
```
Component Action
     │
     ▼
Update LocalStorage
     │
     ▼
Dispatch Storage Event
     │
     ▼
Other Components Listen & Update
```

### Database Utilities

**localDatabase.ts** (92KB):
- User registration and authentication
- Status management (unverified, verified, rejected)
- CRUD operations for all user types
- Session management
- M&E project management

**relationshipDatabase.ts** (14.6KB):
- Producer-anchor relationship management
- Creation request handling
- Invitation management
- Leave request processing

**api.ts** (3.3KB):
- API integration layer (future backend)
- Scheme API endpoints
- Placeholder for REST API calls

---

## Component Architecture

### Reusable Components

#### 1. PortalLayout (137KB)
**Purpose**: Main layout wrapper for all portal pages

**Features**:
- Fixed header with role badge
- Collapsible sidebar navigation
- Notification dropdown
- User menu
- Responsive design
- Auto-expanding dropdowns for active routes

**Props**:
```typescript
interface PortalLayoutProps {
  role: string;                    // Display role name
  roleIcon: string;                // Role emoji icon
  sidebarItems: SidebarItem[];     // Navigation items
  children: ReactNode;             // Page content
}
```

#### 2. Navbar
**Purpose**: Public pages navigation

**Features**:
- Logo and branding
- Navigation links
- Login/Register buttons
- Responsive mobile menu

#### 3. Footer
**Purpose**: Site footer with links and information

**Features**:
- Quick links
- Contact information
- Social media links
- Copyright notice

#### 4. CreateMEProjectModal
**Purpose**: Modal for creating M&E verification projects

**Features**:
- Project type selection
- M&E member assignment
- Priority setting
- Submission data display

#### 5. LazySection
**Purpose**: Lazy loading wrapper for performance

**Features**:
- Intersection Observer API
- Lazy rendering of sections
- Performance optimization

---

## Custom Hooks

### useIntersectionObserver
**Purpose**: Detect when elements enter viewport

**Usage**:
```typescript
const { ref, isIntersecting } = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: '0px'
});
```

**Applications**:
- Lazy loading images
- Triggering animations on scroll
- Loading data on demand

---

## TypeScript Configuration

### Compiler Options
```json
{
  "target": "es5",
  "lib": ["dom", "dom.iterable", "es6"],
  "allowJs": true,
  "skipLibCheck": true,
  "esModuleInterop": true,
  "allowSyntheticDefaultImports": true,
  "strict": true,
  "forceConsistentCasingInFileNames": true,
  "noFallthroughCasesInSwitch": true,
  "module": "esnext",
  "moduleResolution": "node",
  "resolveJsonModule": true,
  "isolatedModules": true,
  "noEmit": true,
  "jsx": "react-jsx"
}
```

### Type Safety Benefits
- **Compile-time Error Detection**: Catch errors before runtime
- **IntelliSense**: Better IDE autocomplete and suggestions
- **Refactoring**: Safer code refactoring
- **Documentation**: Self-documenting code with types
- **Maintainability**: Easier to understand and maintain

---

## Styling System

### Tailwind CSS Configuration

**Custom Theme**:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* Teal palette */ },
      dark: { /* Dark theme palette */ },
      accent: { /* Blue accent palette */ }
    },
    fontFamily: {
      sans: ['Montserrat', ...],
      serif: ['Merriweather', ...]
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.5s ease-out'
    }
  }
}
```

**Plugins**:
- `@tailwindcss/forms`: Enhanced form styling
- `@tailwindcss/typography`: Rich text formatting

**Utility Classes**:
```css
.btn-primary       /* Primary button styles */
.btn-secondary     /* Secondary button styles */
.card              /* Card container styles */
.input-field       /* Input field styles */
.section-padding   /* Section padding */
.container-custom  /* Container max-width */
.text-gradient     /* Gradient text effect */
.bg-gradient-primary /* Primary gradient background */
.bg-gradient-cool  /* Cool gradient background */
```

---

## Performance Optimization

### Strategies Implemented

1. **Code Splitting**:
   - Route-based code splitting via React Router
   - Lazy loading of portal pages
   - Reduced initial bundle size

2. **Memoization**:
   - `useMemo` for expensive computations
   - `useCallback` for function references
   - Prevents unnecessary re-renders

3. **Lazy Loading**:
   - LazySection component for viewport-based loading
   - Intersection Observer API
   - Images loaded on demand

4. **LocalStorage Caching**:
   - Persistent data storage
   - Reduced API calls (in development)
   - Faster page loads

5. **Optimized Re-renders**:
   - Proper key usage in lists
   - Controlled component updates
   - Context optimization

### Performance Metrics
- **Web Vitals**: Integrated for monitoring
- **Lighthouse Scores**: Target 90+ for all metrics
- **Bundle Size**: Optimized with tree-shaking

---

## Build & Deployment

### Build Scripts

```json
{
  "start": "react-scripts start",      // Development server
  "build": "react-scripts build",      // Production build
  "test": "react-scripts test",        // Run tests
  "eject": "react-scripts eject",      // Eject from CRA
  "predeploy": "npm run build",        // Pre-deployment build
  "deploy": "gh-pages -d build"        // Deploy to GitHub Pages
}
```

### Development Server
```bash
npm start
```
- Runs on `http://localhost:3000`
- Hot module replacement
- Fast refresh
- Error overlay

### Production Build
```bash
npm run build
```
- Minified and optimized
- Tree-shaking for smaller bundle
- Source maps for debugging
- Output to `build/` directory

### Deployment
```bash
npm run deploy
```
- Deploys to GitHub Pages
- Hosted at: `https://TOLUWALASE007.github.io/Agricultural-Finance-Coordination-Framework-`
- Automatic deployment from `build/` directory

---

## Browser Support

### Target Browsers

**Production**:
- \>0.2% market share
- Not dead browsers
- Not Opera Mini

**Development**:
- Last 1 Chrome version
- Last 1 Firefox version
- Last 1 Safari version

### Polyfills
- Included via Create React App
- ES6+ features supported
- Modern JavaScript APIs

---

## Security Considerations

### Current Implementation
⚠️ **Development Mode**: Data stored in localStorage (plain text)

### Security Measures
1. **Input Validation**: Client-side validation for all forms
2. **XSS Prevention**: React's built-in XSS protection
3. **CSRF Protection**: To be implemented with backend
4. **Authentication**: Session-based (localStorage)

### Production Recommendations
1. **Backend Integration**: Move to secure backend API
2. **Password Hashing**: Implement bcrypt or similar
3. **JWT Tokens**: For secure authentication
4. **HTTPS**: Enforce HTTPS in production
5. **Content Security Policy**: Implement CSP headers
6. **Rate Limiting**: Prevent brute force attacks

---

## Testing Strategy

### Testing Framework
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Test Script**: `npm test`

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Main user journeys

### Testing Best Practices
- Test user behavior, not implementation
- Mock external dependencies
- Test accessibility
- Test error states

---

## Accessibility (a11y)

### WCAG Compliance
- **Target**: WCAG 2.1 Level AA
- **Color Contrast**: 4.5:1 minimum
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and semantic HTML

### Accessibility Features
1. **Semantic HTML**: Proper heading hierarchy
2. **ARIA Labels**: Descriptive labels for interactive elements
3. **Focus Management**: Visible focus indicators
4. **Alt Text**: Images have descriptive alt text
5. **Form Labels**: All inputs properly labeled
6. **Keyboard Shortcuts**: Common actions accessible via keyboard

---

## Future Enhancements

### Planned Features
1. **Backend Integration**:
   - REST API integration
   - Real-time updates via WebSockets
   - Secure authentication

2. **Progressive Web App (PWA)**:
   - Offline support
   - Push notifications
   - Install to home screen

3. **Advanced Features**:
   - Dark mode toggle
   - Multi-language support (i18n)
   - Advanced search and filtering
   - Data export (PDF, Excel, CSV)
   - Bulk operations
   - Drag-and-drop file uploads

4. **Performance**:
   - Service workers for caching
   - Image optimization
   - CDN integration
   - Bundle size reduction

5. **Analytics**:
   - User behavior tracking
   - Performance monitoring
   - Error tracking (Sentry)
   - A/B testing

---

## Development Workflow

### Getting Started
```bash
# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Code Organization
- **Feature-based**: Group by feature/portal
- **Component Reusability**: Shared components in `/components`
- **Type Safety**: TypeScript for all new code
- **Consistent Naming**: PascalCase for components, camelCase for functions

### Git Workflow
- **Main Branch**: Production-ready code
- **Feature Branches**: New features and fixes
- **Pull Requests**: Code review before merge
- **Commit Messages**: Descriptive and conventional

---

## Troubleshooting

### Common Issues

**1. Build Errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. LocalStorage Issues**:
```javascript
// Clear all localStorage
localStorage.clear();
// Or specific keys
localStorage.removeItem('fundSchemes');
```

**3. Routing Issues**:
- Ensure HashRouter is used (not BrowserRouter)
- Check route paths match exactly
- Verify component imports

**4. TypeScript Errors**:
- Check type definitions
- Ensure strict mode compliance
- Update `@types` packages

---

## Summary

The AFCF frontend is a **robust, scalable, and user-friendly** React application that provides:

✅ **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS  
✅ **Comprehensive Routing**: 106+ routes across 10 portals  
✅ **Type Safety**: Full TypeScript implementation  
✅ **Responsive Design**: Mobile-first approach  
✅ **Performance Optimized**: Code splitting, lazy loading, memoization  
✅ **Accessible**: WCAG 2.1 AA compliance  
✅ **Maintainable**: Clean architecture, reusable components  
✅ **Scalable**: Easy to add new portals and features  

The frontend architecture supports the complex workflows of agricultural financing while maintaining excellent user experience and code quality.
