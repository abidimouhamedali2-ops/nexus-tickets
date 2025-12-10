# The Nexus - Madaar Solutions Internal Ticketing System

A sophisticated, high-performance internal web application for corporate ticketing. Built with React, TypeScript, and modern UI/UX patterns including glassmorphism, skeleton loading, and smooth animations.

![The Nexus](https://img.shields.io/badge/Version-1.0.0-emerald)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## 🎯 Features

### Core Functionality
- **Authentication System** - Login/Register with role-based access (Admin/Employee)
- **Ticket Management** - Create, view, filter, and search tickets
- **Admin Controls** - Status updates with notes (Admin only)
- **File Attachments** - Drag-and-drop file uploads
- **Real-time Filtering** - Status, category, and search filters with pagination

### UI/UX Highlights
- **Glassmorphic Sidebar** - Collapsible navigation with blur effects
- **Dark/Light Mode** - System-aware theme with manual toggle
- **Skeleton Loading** - Content-mimicking loading states
- **Micro-interactions** - Hover effects, success animations, smooth transitions
- **Floating Labels** - Animated form inputs
- **Status Color Coding** - Visual status indicators (New=Blue, Review=Yellow, Resolved=Green)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- (Optional) Django backend for full API integration

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd the-nexus

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@madaar.com | any |
| Employee | employee@madaar.com | any |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Django API Base URL (when connecting to real backend)
VITE_API_URL=http://localhost:8000/api

# Tawk.to Widget ID (for live chat)
VITE_TAWK_ID=your_tawk_id_here
```

### Connecting to Django Backend

1. **Disable Demo Mode**: In `src/services/authService.ts` and `src/services/ticketService.ts`, set:
   ```typescript
   const DEMO_MODE = false;
   ```

2. **Configure API URL**: Update `VITE_API_URL` in your `.env` file

3. **Required Django Endpoints**:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/tickets` | List tickets (with filters) |
| POST | `/api/tickets` | Create ticket (multipart/form-data) |
| GET | `/api/tickets/:id` | Get ticket details |
| PATCH | `/api/tickets/:id/status` | Update ticket status (Admin) |
| GET | `/api/tickets/stats` | Get ticket statistics |

### Tawk.to Integration

1. Get your Tawk.to Property ID from [Tawk.to Dashboard](https://dashboard.tawk.to/)
2. Replace `YOUR_TAWK_ID` in `index.html`:
   ```javascript
   s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx      # Main app layout wrapper
│   │   └── Sidebar.tsx         # Glassmorphic sidebar navigation
│   ├── tickets/
│   │   ├── FileDropzone.tsx    # Drag-and-drop file upload
│   │   └── TicketQuickView.tsx # Slide-out ticket preview
│   └── ui/                     # Shadcn UI components
├── contexts/
│   ├── AuthContext.tsx         # Authentication state & RBAC
│   ├── TicketContext.tsx       # Ticket state management
│   └── ThemeContext.tsx        # Dark/Light mode
├── lib/
│   └── api.ts                  # Axios instance with interceptors
├── pages/
│   ├── Dashboard.tsx           # Main dashboard with stats
│   ├── Login.tsx               # Login page
│   ├── Register.tsx            # Registration page
│   ├── TicketList.tsx          # Ticket list with filters
│   ├── TicketDetails.tsx       # Ticket detail view
│   └── NewTicket.tsx           # Ticket creation form
└── services/
    ├── authService.ts          # Auth API calls
    └── ticketService.ts        # Ticket API calls
```

## 🔐 Role-Based Access Control (RBAC)

### Admin Capabilities
- View all tickets in the system
- Update ticket status with notes
- Access admin control panel on ticket details
- View system-wide statistics

### Employee Capabilities
- View only their own tickets
- Create new tickets
- View ticket details and status history

### Implementation
```typescript
// Check if user is admin
const { isAdmin } = useAuth();

// Check specific permission
const { checkPermission } = useAuth();
const canManage = checkPermission('admin');
```

## 🎨 Theming

### Color Palette
- **Primary**: Emerald (#10b981)
- **Background Light**: Slate-50 (#f8fafc)
- **Background Dark**: Slate-900 (#0f172a)
- **Status Colors**:
  - New: Blue-500
  - Under Review: Amber-500
  - Resolved: Emerald-500
  - Closed: Slate-500

### Customization
Edit `src/index.css` to modify CSS custom properties:
```css
:root {
  --primary: 160 84% 39%;
  --background: 210 20% 98%;
  /* ... */
}
```

## 📱 Responsive Design

- **Desktop**: Full sidebar, multi-column layouts
- **Tablet**: Collapsible sidebar, adjusted grids
- **Mobile**: Hidden sidebar, stacked layouts

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Login with admin credentials
   - [ ] Login with employee credentials
   - [ ] Register new account
   - [ ] Logout functionality
   - [ ] Protected route redirects

2. **Role-Based Access**
   - [ ] Admin sees all tickets
   - [ ] Employee sees only their tickets
   - [ ] Admin status control visible
   - [ ] Employee status control hidden

3. **Ticket Operations**
   - [ ] Create ticket with attachments
   - [ ] Filter by status/category
   - [ ] Search functionality
   - [ ] Pagination
   - [ ] Quick view panel
   - [ ] Status update (Admin)

4. **UI/UX**
   - [ ] Dark/Light mode toggle
   - [ ] Sidebar collapse/expand
   - [ ] Skeleton loading states
   - [ ] Form validation
   - [ ] Success animations

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 📄 License

Proprietary - Madaar Solutions © 2024

---

**Template Foundation**: Custom implementation inspired by modern SaaS dashboards (Linear, Notion, Jira)

For support, contact: support@madaar.com
