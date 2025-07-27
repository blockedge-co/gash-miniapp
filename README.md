# GASH Swap MiniApp

A Worldcoin-integrated MiniApp for swapping WLD tokens to GASH (synthetic gold-backed tokens).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gash-miniapp-2
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── swap/          # Swap functionality
│   │   └── rate/          # Rate fetching
│   ├── onboarding/        # Onboarding page
│   ├── dashboard/         # Main dashboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # React Query provider
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
│   ├── use-swap.ts        # Swap functionality
│   └── use-rate.ts        # Rate fetching
├── stores/                # Zustand state management
│   └── app-store.ts       # Main app store
├── types/                 # TypeScript type definitions
│   └── index.ts           # Core types
└── utils/                 # Utility functions
    └── index.ts           # Helper functions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Database**: Supabase (planned)
- **Authentication**: Worldcoin MiniApp SDK (planned)

## 📱 Features

### Current (MVP)

- ✅ Project setup and configuration
- ✅ Mock API endpoints for swap and rate
- ✅ Basic UI components and pages
- ✅ State management with Zustand
- ✅ Rate fetching with caching
- ✅ Responsive mobile-first design

### Planned

- 🔄 Worldcoin MiniApp SDK integration
- 🔄 World ID authentication
- 🔄 Real-time swap functionality
- 🔄 Transaction history
- 🔄 Vault management
- 🔄 Rate limiting and security
- 🔄 Testing suite
- 🔄 Deployment configuration

## 🎨 Design System

### Colors

- **Primary**: WLD Blue (#0ea5e9)
- **Gold**: GASH Gold (#f59e0b)
- **Dark**: Background (#1e293b, #0f172a)

### Typography

- **Font**: Inter (system fallback)
- **Headings**: Bold, gradient text
- **Body**: Regular, high contrast

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run format` - Format code with Prettier

### Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Worldcoin MiniApp Configuration
NEXT_PUBLIC_WORLDCOIN_APP_ID=your_worldcoin_app_id
NEXT_PUBLIC_WORLDCOIN_ACTION=your_worldcoin_action_id

# Mock Configuration
NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_WLD_TO_GASH_RATE=10
NEXT_PUBLIC_FIRST_SWAP_BONUS=5
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔐 Security

- Input validation on client and server
- Rate limiting for API endpoints
- CORS configuration for MiniApp
- Environment variable protection

## 📚 Documentation

- [Architecture Documentation](./ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Component Documentation](./docs/COMPONENTS.md)
- [Type Definitions](./docs/TYPES.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation in `/docs`
- Review the architectural decisions in `ARCHITECTURE.md`

---

Built with ❤️ for the Worldcoin ecosystem
