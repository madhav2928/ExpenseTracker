# 💰 Expense Tracker - Full-Stack Application

## 📋 Project Overview

**Expense Tracker** is a comprehensive full-stack personal finance management application featuring a Spring Boot backend API and a modern Next.js progressive web application (PWA) frontend. The platform enables users to track, categorize, and analyze their financial transactions with intelligent AI-powered expense processing.

### 🎯 Core Purpose
- **Personal Finance Management**: Complete expense tracking and financial transaction management
- **Multi-Account Support**: Handle multiple financial accounts (Cash, Checking, Savings, Credit Cards)
- **Intelligent Processing**: AI-powered expense ingestion with proposal review system
- **Secure Authentication**: JWT-based authentication with token blacklisting for secure logout
- **Modern UI/UX**: Premium mobile-first Progressive Web App with dark mode and glassmorphism
- **Cross-Platform**: Web-based application installable on mobile devices

### 📊 Key Metrics
- **Backend**: Spring Boot 3.5.6, Java 17
- **Frontend**: Next.js 16.0.6, React 19.2.0, Tailwind CSS v4
- **Database**: PostgreSQL 15
- **Authentication**: JWT tokens with blacklist support  
- **Containerization**: Docker & Docker Compose
- **Build Tools**: Maven (Backend), npm (Frontend)

---

## 🏗️ Architecture & Project Structure

### Monorepo Structure
```
ExpenseTracker/
├── src/                          # Backend source code (Spring Boot)
│   ├── main/java/com/app/ExpenseTracker/
│   │   ├── controller/          # REST API controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access layer
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   ├── security/            # JWT & auth components
│   │   ├── exception/           # Error handling
│   │   └── config/              # Application configuration
│   └── resources/
│       ├── application.yml      # Spring configuration
│       └── db/migration/        # Flyway database migrations
├── frontend/                     # Next.js 16 application
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── login/          # Authentication pages
│   │   │   ├── register/
│   │   │   ├── accounts/       # Account management
│   │   │   ├── transactions/   # Transaction CRUD
│   │   │   ├── categories/     # Category management
│   │   │   ├── ingest/         # AI expense processing
│   │   │   ├── globals.css     # Global styles & design system
│   │   │   ├── layout.tsx      # Root layout with auth
│   │   │   └── page.tsx        # Dashboard
│   │   ├── components/         # Reusable React components
│   │   │   └── BottomNav.tsx   # Mobile bottom navigation
│   │   ├── context/            # React context providers
│   │   │   └── AuthContext.tsx # Authentication state management
│   │   └── lib/                # Utility functions
│   │       └── api.ts          # API client with JWT handling
│   ├── public/                  # Static assets
│   │   └── manifest.json       # PWA manifest
│   ├── next.config.ts          # Next.js configuration & API proxy
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   └── package.json            # Frontend dependencies
├── docker-compose.yml          # PostgreSQL & PgAdmin containers
├── pom.xml                     # Maven dependencies
├── .env                        # Environment variables
└── README.md                   # Project documentation
```

### System Architecture
```
┌──────────────────────────────────────────────────────────┐
│                    Frontend Layer                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Next.js 16 App (React 19)                      │    │
│  │  - App Router                                    │    │
│  │  - Server/Client Components                     │    │
│  │  - PWA Support                                   │    │
│  │  - API Proxy (/api -> localhost:8081/api)      │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP/REST + JWT
┌───────────────────────▼──────────────────────────────────┐
│                    Backend Layer                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Controllers (REST API Endpoints)                 │   │
│  │  - AuthController (/api/auth)                     │   │
│  │  - AccountController (/api/accounts)              │   │
│  │  - TransactionController (/api/transactions)      │   │
│  │  - CategoryController (/api/categories)           │   │
│  │  - IngestController (/api/ingest)                 │   │
│  │  - ProposalController (/api/proposals)            │   │
│  └──────────────────────┬───────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │  Services (Business Logic)                        │   │
│  │  - AccountService, TransactionService             │   │
│  │  - CategoryService, TokenBlacklistService         │   │
│  └──────────────────────┬───────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │  Repositories (JPA Data Access)                   │   │
│  │  - UserRepository, AccountRepository              │   │
│  │  - TransactionRepository, CategoryRepository      │   │
│  │  - ProposalRepository, RevokedTokenRepository     │   │
│  └──────────────────────┬───────────────────────────┘   │
└────────────────────────▼────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  Database Layer - PostgreSQL 15                         │
│  - Users, Accounts, Transactions, Categories            │
│  - Proposals, RevokedTokens (Logout Support)            │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend Technologies
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Spring Boot | 3.5.6 | Main application framework |
| **Language** | Java | 17 | Programming language |
| **Database** | PostgreSQL | 15 | Primary data store |
| **ORM** | Hibernate/JPA | Latest | Object-relational mapping |
| **Migration** | Flyway | Latest | Database version control |
| **Security** | Spring Security | Latest | Authentication & Authorization |
| **JWT** | java-jwt (Auth0) | 4.5.0 | Token-based authentication |
| **Password** | BCrypt | - | Secure password hashing |
| **JSON** | Jackson | 2.20.0 | JSON processing |
| **Build Tool** | Maven | 3.6+ | Dependency management |
| **DevTools** | Spring Boot DevTools | - | Development productivity |

### Frontend Technologies
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Next.js | 16.0.6 | React framework with App Router |
| **UI Library** | React | 19.2.0 | Component-based UI |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS framework |
| **Icons** | Lucide React | 0.555.0 | Icon library |
| **Animations** | Framer Motion | 12.23.25 | Animation library |
| **Date Handling** | date-fns | 4.1.0 | Date formatting utilities |
| **Class Utils** | clsx, tailwind-merge | Latest | Conditional class handling |
| **Build Tool** | npm | Latest | Package management |
| **Language** | TypeScript | v5 | Type-safe JavaScript |

### DevOps & Deployment
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Containerization** | Docker | Latest | Application containerization |
| **Orchestration** | Docker Compose | Latest | Multi-container deployment |
| **Database Admin** | PgAdmin4 | Latest | Database administration |

---

## 📊 Database Schema

### Core Tables

#### 1. Users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: User account information and credentials

#### 2. Accounts
```sql
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    last4 VARCHAR(10),
    balance_estimate NUMERIC(18,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: User's financial accounts (Cash, Checking, Savings, Credit Cards)

#### 3. Transactions
```sql
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id BIGINT REFERENCES accounts(id),
    merchant VARCHAR(255),
    amount NUMERIC(18,2) NOT NULL,
    currency VARCHAR(10),
    txn_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(20),
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: Financial transactions with account and category associations

#### 4. Categories
```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(255) NOT NULL,
    parent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, user_id)
);
```
**Purpose**: Expense categorization (user-specific or global)

#### 5. Proposals
```sql
CREATE TABLE proposals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(18,2),
    currency VARCHAR(10),
    merchant VARCHAR(255),
    account_hint VARCHAR(255),
    parsed_json TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP
);
```
**Purpose**: AI-generated expense proposals awaiting user approval

#### 6. Revoked Tokens (NEW)
```sql
CREATE TABLE revoked_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(1024) NOT NULL UNIQUE,
    revoked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_revoked_tokens_token ON revoked_tokens(token);
CREATE INDEX idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);
```
**Purpose**: JWT token blacklist for secure logout functionality

---

## 🔗 API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
- **Purpose**: User registration
- **Request**: `{ email, password }`
- **Response**: Success message
- **Side Effect**: Creates user + default "Cash" account

#### POST `/api/auth/login`
- **Purpose**: User authentication
- **Request**: `{ email, password }`
- **Response**: `{ token: "jwt_token" }`

#### POST `/api/auth/logout` 🆕
- **Purpose**: Secure logout
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message
- **Side Effect**: Blacklists JWT token

### Account Management (`/api/accounts`)
**Auth Required**: ✅
- `POST /api/accounts` - Create account
- `GET /api/accounts` - List user accounts
- `GET /api/accounts/{id}` - Get account details
- `PUT /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Delete account

### Transaction Management (`/api/transactions`)
**Auth Required**: ✅
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - List with pagination/filters
- `GET /api/transactions/{id}` - Get transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

**Query Parameters**: `page`, `size`, `accountId`, `categoryId`, `startDate`, `endDate`, `merchant`

### Category Management (`/api/categories`)
**Auth Required**: ✅
- `POST /api/categories` - Create category
- `GET /api/categories` - List user categories
- `GET /api/categories/{id}` - Get category
- `GET /api/categories/{id}/transactions` - Get category transactions
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Expense Ingestion (`/api/ingest`)
**Auth Required**: ✅
- `POST /api/ingest` - Submit expense for AI processing
  - **Request**: `{ amount, currency, merchant, accountHint, rawText }`
  - **Response**: Proposal ID or processing result

### Proposal Management (`/api/proposals`)
**Auth Required**: ✅
- `GET /api/proposals` - List pending proposals
- `POST /api/proposals/{id}/accept` - Accept and convert to transaction

---

## 🎨 Frontend Application

### Design System
- **Theme**: Dark mode with "Cyber/Fintech" aesthetics
- **Colors**: Deep blues/blacks (`#020617`) with neon indigo accents (`#6366f1`)
- **Typography**: Inter font family (Google Fonts)
- **Effects**: Glassmorphism, blur effects, smooth gradients
- **Layout**: Mobile-first responsive design

### Key Features

#### 1. Authentication
- **Login Page** (`/login`): Email/password authentication with auto-redirect
- **Register Page** (`/register`): User registration with auto-login
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Logout**: Secure logout with backend token blacklisting

#### 2. Dashboard (`/`)
- **Total Balance**: Aggregated balance across all accounts
- **Recent Transactions**: Latest 5 transactions with infinite scroll
- **Quick Actions**: AI Ingest button, Logout button
- **Real-time Updates**: Fetches data on mount

#### 3. Transaction Management
- **List** (`/transactions`): Infinite scroll pagination, filtering support
- **Add** (`/transactions/add`): Manual transaction entry with account/category selection
- **Type Support**: DEBIT (expenses) and CREDIT (income)
- **Date Handling**: Transaction date selection

#### 4. AI Expense Ingestion (`/ingest`)
- **Natural Language Input**: "Lunch $15 at Subway"
- **Proposal Review**: Tab-based UI for pending proposals
- **Accept/Reject**: Review and approve AI suggestions

#### 5. Account Management (`/accounts`)
- **List Accounts**: View all accounts with balances
- **Add Account** (`/accounts/add`): Create new accounts (Cash, Checking, Savings, Credit Card)
- **Delete**: Remove accounts

#### 6. Category Management (`/categories`)
- **List Categories**: User-defined expense categories
- **Add Category** (`/categories/add`): Create custom categories
- **Delete**: Remove categories
- **Bottom Nav Tab**: Direct access from navigation

### Progressive Web App (PWA)
- **Manifest**: `/public/manifest.json` for installation
- **Mobile Install**: "Add to Home Screen" on iOS/Android
- **Standalone Mode**: Runs like a native app
- **Theme Color**: Deep blue (`#020617`)
- **Viewport**: Optimized for mobile devices

### Frontend Architecture Patterns
- **Server/Client Components**: Next.js App Router SSR + CSR
- **Context API**: `AuthContext` for global authentication state
- **API Client**: Centralized fetch wrapper with JWT injection
- **Protected Routes**: HOC pattern with `useAuth` hook
- **Bottom Navigation**: Mobile-first navigation pattern

---

## 🔐 Security Implementation

### Authentication & Authorization
1. **User Registration**: Password hashed with BCrypt
2. **Login**: JWT token generated (24h expiration)
3. **Token Storage**: localStorage on frontend
4. **Request Auth**: Bearer token in `Authorization` header
5. **Token Validation**: `JwtFilter` validates on every request
6. **Logout**: Token blacklisted in `revoked_tokens` table

### Security Features
- **Password Encryption**: BCrypt hashing (Spring Security)
- **JWT Tokens**: Stateless authentication with HS256
- **Token Blacklisting**: Secure logout with database-backed revocation
- **User Isolation**: All queries filtered by authenticated user ID
- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Bean Validation on DTOs

### Token Blacklist System (NEW)
- **Service**: `TokenBlacklistService`
- **Repository**: `RevokedTokenRepository`
- **Entity**: `RevokedToken`
- **Flow**: 
  1. Logout endpoint receives token
  2. Token decoded to extract expiration
  3. Token saved to `revoked_tokens` with expiry
  4. `JwtFilter` checks blacklist on each request
  5. Revoked tokens rejected automatically

---

## ⚙️ Configuration & Setup

### Environment Variables (`.env`)
```bash
# Database
POSTGRES_DB=moneydb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=282901

# PgAdmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin

# JWT
JWT_SECRET=verySecretChangeMe123!
```

### Quick Start

#### Prerequisites
- **Java 17+** (for backend)
- **Node.js 18+** & npm (for frontend)
- **Docker & Docker Compose** (recommended)

#### 1. Start Database
```bash
cd ExpenseTracker
docker-compose up -d
```

#### 2. Start Backend
```bash
# From ExpenseTracker root
./mvnw spring-boot:run
# Backend runs on http://localhost:8081
```

#### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

#### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081
- **PgAdmin**: http://localhost:5050

### Mobile Access
To access on mobile device:
```bash
# Run frontend with network binding
cd frontend
npm run dev -- -H 0.0.0.0
# Access via http://<YOUR_IP>:3000
# Install as PWA: Safari/Chrome > Add to Home Screen
```

---

## 🔄 Database Migrations (Flyway)

### Migration History
1. **V1__init.sql**: Initial schema (users, accounts, transactions, proposals)
2. **V2__init.sql**: Schema extensions and indexes
3. **V3__add_category_relationship.sql**: Category system with foreign keys
4. **V4__create_revoked_tokens.sql**: Token blacklist table for logout 🆕

All migrations run automatically on application startup.

---

## ✅ Current Features

### Backend
- ✅ User registration & JWT authentication
- ✅ Multi-account financial management
- ✅ Complete transaction CRUD with pagination/filtering
- ✅ Category management with hierarchical support
- ✅ Expense proposal system
- ✅ Secure logout with token blacklisting
- ✅ Database migrations (Flyway)
- ✅ Docker containerization
- ✅ Global exception handling
- ✅ Input validation

### Frontend
- ✅ Premium dark mode UI with glassmorphism
- ✅ Mobile-first responsive design
- ✅ User authentication (login/register/logout)
- ✅ Dashboard with balance & recent transactions
- ✅ Transaction management (list, add, infinite scroll)
- ✅ AI expense ingestion with proposal review
- ✅ Account management (CRUD)
- ✅ Category management (CRUD)
- ✅ Bottom navigation for mobile
- ✅ Progressive Web App (PWA) support
- ✅ JWT authentication state management
- ✅ API proxy configuration

---

## 🚧 Future Enhancements

### Backend
- Advanced reporting & analytics
- Budget management with alerts
- Recurring transactions
- Multi-currency conversion
- API versioning
- Rate limiting
- Webhooks for notifications
- Token cleanup job (remove expired revoked tokens)

### Frontend
- Real-time notifications
- Data visualization (charts/graphs)
- Advanced filtering UI
- Search functionality
- Export to CSV/PDF
- Offline mode (Service Worker)
- Push notifications
- Settings page
- User profile management

---

## 📚 Additional Resources

- **Spring Boot**: https://spring.io/projects/spring-boot
- **Next.js**: https://nextjs.org/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/
- **JWT**: https://jwt.io/

---

**Last Updated**: December 2, 2025  
**Version**: 1.0.0  
**Status**: Production Ready
