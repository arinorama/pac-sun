# PacSun MVP

E-commerce platform inspired by PacSun, built with Next.js 14, Contentful CMS, and Algolia search.

## Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components)
- **Styling**: TailwindCSS + Shadcn/ui + CVA
- **CMS**: Contentful (with native localization: en-US / tr-TR)
- **Search**: Algolia (separate EN/TR indexes)
- **Auth**: NextAuth.js (Email/Password + Google/Facebook)
- **State**: Zustand (Cart, Currency, User, UI)
- **Forms**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Currency**: Exchange Rate API (USD/TRY)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Contentful account
- Algolia account

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.local.example` to `.env.local` and fill in your credentials:
```bash
cp .env.local.example .env.local
```

4. Set up Contentful:
   - Create a space in Contentful
   - Import content types from `contentful/content-types/`
   - Add sample content
   - Get your Space ID and Access Tokens

5. Set up Algolia:
   - Create an Algolia application
   - Create indexes: `pacsun_products_en` and `pacsun_products_tr`
   - Get your App ID and API Keys
   - Run sync script: `npm run algolia:sync`

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pac-sun/
├── .cursor/
│   ├── phases/          # Phase tracking
│   ├── standards/       # Coding standards
│   └── templates/       # Code templates
├── contentful/
│   └── content-types/   # Content type schemas
├── src/
│   ├── app/            # Next.js app router
│   ├── components/     # Atomic Design components
│   ├── lib/            # Utilities and integrations
│   ├── store/          # Zustand stores
│   ├── contexts/       # React contexts
│   └── types/          # TypeScript types
└── scripts/            # Build scripts
```

## Features

- ✅ Multi-language support (EN/TR)
- ✅ Multi-currency support (USD/TRY)
- ✅ Product catalog from Contentful
- ✅ Algolia search with filters
- ✅ Shopping cart
- ✅ User authentication
- ✅ Order management
- ✅ Wishlist
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Accessibility compliant

## Coding Standards

See `.cursor/standards/CODING_STANDARDS.md` for detailed coding guidelines.

Key standards:
- All components must have `data-component` attribute
- Use `function` declaration, NOT `React.FC`
- All colors from Tailwind theme (no arbitrary values)
- Mobile-first responsive design
- TypeScript strict mode

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run algolia:sync` - Sync products to Algolia

## Deployment

The project is ready to deploy on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

MIT

