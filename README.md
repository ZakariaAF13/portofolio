# Admin Dashboard Documentation

## Features

1. **User Authentication**
   - Secure login with JWT
   - Protected routes
   - Session management

2. **Content Management**
   - Create, read, update, and delete posts
   - Media library with file uploads
   - Rich text editor for content creation

3. **SEO Management**
   - Custom meta tags
   - Open Graph and Twitter card support
   - Sitemap generation

4. **AI Integration**
   - Content suggestions
   - SEO optimization tips
   - Auto-tagging

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=your-openai-api-key
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure
```
src/
  admin/
    components/     # Reusable UI components
    context/       # React context providers
    hooks/         # Custom React hooks
    lib/           # Utility functions
    pages/         # Page components
    services/      # API services
    types/         # TypeScript type definitions
    utils/         # Helper functions
```

## Authentication Flow

1. User visits `/admin`
2. If not authenticated, redirect to `/login`
3. After successful login, store JWT in memory
4. Use JWT for subsequent API requests
5. On logout, clear JWT and redirect to login

## Screenshots

Berikut tampilan halaman aplikasi (public) dan dashboard admin. Simpan file gambar di folder `public/screenshots/` lalu sesuaikan nama file pada README ini jika berbeda.

### Public Portfolio

- Halaman Resume

  ![Resume Page](public/screenshots/resume.jpg)

- Halaman About

  ![About Page](public/screenshots/about.jpg)

- Halaman Contact

  ![Contact Page](public/screenshots/contact.jpg)

- Halaman Projects

  ![Projects Page](public/screenshots/projects.jpg)

### Admin Dashboard

- Dashboard Utama

  ![Admin Dashboard](public/screenshots/admin-dashboard.jpg)

- Manajemen Projects

  ![Admin Projects](public/screenshots/admin-projects.jpg)

- Manajemen Resume (Skills, Experience, Education, Knowledge)

  ![Admin Resume](public/screenshots/admin-resume.jpg)

- Halaman About (What I Do & Bio)

  ![Admin About](public/screenshots/admin-about.jpg)

Catatan:

- Jika folder `public/screenshots/` belum ada, buat folder tersebut dan tambahkan gambar. Nama file bebas, pastikan mengganti path pada README ini.
- Anda bisa mengambil screenshot langsung dari browser saat menjalankan `npm run dev` di:
  - Public: `http://localhost:5174`
  - Admin: `http://localhost:5174/admin`

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

MIT
