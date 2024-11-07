# MultiDocLMS - Document Management System

## Overview
MultiDocLMS is a modern Learning Management System focused on streamlined academic documentation. It helps educational institutions generate, manage, and deliver various academic documents including transcripts, invoices, and confirmation letters.

## Features

### 🎓 Academic Document Generation
- **Transcripts**: Generate professional academic transcripts with detailed grade information
- **Invoices**: Create and manage student invoices with customizable templates
- **Confirmation Letters**: Automated generation of program completion letters

### 📊 Grade Management
- Comprehensive grading system (A+ to F)
- GPA calculation
- Detailed grade analytics and reporting

### 👥 User Management
- Role-based access control
- User invitation system
- Secure authentication via Clerk

### 🎨 Modern UI/UX
- Responsive design
- Interactive document previews
- Customizable layouts

## Tech Stack

### Frontend
- Vue 3 with TypeScript
- Tailwind CSS for styling
- PDF-lib for document generation
- Vue Chart.js for analytics
- Vue Router for navigation
- Pinia for state management

### Backend
- Express.js with TypeScript
- MySQL database
- CORS enabled
- Environment configuration

### Testing
- Vitest for unit testing
- Vue Test Utils for component testing

### Development Tools
- Vite for development and building
- ESLint and TypeScript for code quality
- PostCSS and Autoprefixer

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Required variables can be found in the example env files

4. Start development servers:
```bash
# Start client
cd client
npm run dev

# Start server
cd ../server
npm run dev
```

## Project Structure

```
├── client/               # Frontend Vue application
│   ├── src/
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Vue components
│   │   ├── composables/  # Vue composables
│   │   ├── constants/    # Constants
│   │   ├── layouts/      # Layout components
│   │   ├── lib/          # PDF generation and utilities
│   │   ├── router/       # Vue Router
│   │   ├── services/     # API services
│   │   ├── stores/       # Pinia store
│   │   ├── types/        # TypeScript type definitions
│   │   ├── utils/        # Helper functions
│   │   └── views/        # Page components
│   └── public/           # Static assets
└── server/               # Backend Express application
    ├── api/              # Entry point for API routes
    └── src/
        ├── config/       # Server configuration
        ├── controllers/  # Controller functions
        ├── models/       # Data models
        ├── routes/       # Route handlers
        ├── schema/       # Data schemas
        ├── services/     # Service functions
        └── utils/        # Utility functions
```

## Contributing
Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License
This project is licensed under the ISC License.

## Acknowledgments
- Built with Vue.js and Express.js
- PDF generation powered by PDF-lib
- Authentication provided by Clerk
- UI components inspired by shadcn/ui
