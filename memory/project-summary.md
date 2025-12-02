# 💰 Expense Tracker Backend API - Comprehensive Project Summary

## 📋 Project Overview

**Expense Tracker** is a robust, production-ready backend API built with Spring Boot that provides comprehensive personal finance management capabilities. The application enables users to track, categorize, and analyze their financial transactions through a secure RESTful API.

### 🎯 Core Purpose
- **Personal Finance Management**: Complete expense tracking and financial transaction management
- **Multi-Account Support**: Handle multiple financial accounts (cash, bank accounts, credit cards)
- **Intelligent Processing**: Smart expense categorization and proposal system
- **Secure Authentication**: JWT-based user authentication and authorization
- **Scalable Architecture**: Clean, layered architecture ready for enterprise use

### 📊 Key Metrics
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17
- **Database**: PostgreSQL 15
- **Authentication**: JWT tokens
- **Containerization**: Docker & Docker Compose
- **Build Tool**: Maven

---

## 🏗️ Architecture & Design

### Layered Architecture Pattern
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │ -> │    Services     │ -> │  Repositories   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ AuthController  │    │ UserService     │    │ UserRepository  │
│ AccountCtrl     │    │ AccountService  │    │ AccountRepo     │
│ TransactionCtrl │    │ TransactionSvc  │    │ TransactionRepo │
│ CategoryCtrl    │    │ CategoryService │    │ CategoryRepo    │
│ IngestCtrl      │    │                 │    │ ProposalRepo    │
│ ProposalCtrl    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                  │
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │    Database     │
                       └─────────────────┘
```

### Design Patterns Implemented
- **MVC Pattern**: Clear separation of concerns with Controllers, Services, and Repositories
- **DTO Pattern**: Data Transfer Objects for API communication
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **Dependency Injection**: Spring's IoC container for loose coupling

---

## 🛠️ Technology Stack

### Core Framework & Runtime
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Spring Boot | 3.5.6 | Main application framework |
| **Language** | Java | 17 | Programming language |
| **Build Tool** | Maven | 3.6+ | Dependency management & build |
| **JDK** | OpenJDK | 17 | Java runtime environment |

### Security & Authentication
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Security** | Spring Security | Latest | Authentication & Authorization |
| **JWT** | java-jwt | 4.5.0 | Token-based authentication |
| **Password Encoding** | BCrypt | - | Secure password hashing |

### Database & Persistence
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Database** | PostgreSQL | 15 | Primary data store |
| **ORM** | Hibernate/JPA | - | Object-relational mapping |
| **Migration** | Flyway | Latest | Database version control |
| **Connection Pool** | HikariCP | - | Database connection pooling |

### Web & API
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Web Framework** | Spring Web | - | REST API development |
| **Validation** | Bean Validation | - | Input validation |
| **JSON Processing** | Jackson | 2.20.0 | JSON serialization/deserialization |
| **Date/Time** | java.time | - | Date and time handling |

### Development & Testing
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **DevTools** | Spring Boot DevTools | - | Development productivity |
| **Testing** | Spring Boot Test | - | Unit and integration testing |
| **Security Testing** | Spring Security Test | - | Security testing utilities |

### Containerization & Deployment
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Containerization** | Docker | Latest | Application containerization |
| **Orchestration** | Docker Compose | Latest | Multi-container deployment |
| **Database Admin** | PgAdmin4 | Latest | Database administration interface |

---

## 📊 Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: Stores user account information and credentials
**Relationships**: Referenced by accounts, transactions, proposals, categories
**Constraints**: Email must be unique

#### Accounts Table
```sql
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),  -- CASH, CHECKING, SAVINGS, CREDIT_CARD, etc.
    last4 VARCHAR(10), -- Last 4 digits of account/card number
    balance_estimate NUMERIC(18,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: Manages user's financial accounts
**Relationships**: Referenced by transactions
**Constraints**: user_id is required, CASCADE delete

#### Transactions Table
```sql
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id BIGINT REFERENCES accounts(id),
    merchant VARCHAR(255),
    amount NUMERIC(18,2) NOT NULL,
    currency VARCHAR(10),
    txn_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(20),  -- DEBIT, CREDIT
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    source VARCHAR(50), -- MANUAL, IMPORTED, API
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: Records all financial transactions
**Relationships**: Belongs to user, account, category
**Constraints**: user_id required, category_id optional

#### Categories Table
```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,  -- NULL for global categories
    name VARCHAR(255) NOT NULL,
    parent VARCHAR(255),  -- For hierarchical categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, user_id)  -- Prevent duplicate categories per user
);
```
**Purpose**: Expense categorization system
**Relationships**: Referenced by transactions
**Constraints**: Unique name per user, supports global categories

#### Proposals Table
```sql
CREATE TABLE proposals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(18,2),
    currency VARCHAR(10),
    merchant VARCHAR(255),
    account_hint VARCHAR(255),
    parsed_json TEXT,  -- Raw parsed data
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, ACCEPTED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP
);
```
**Purpose**: Intelligent expense processing proposals
**Relationships**: Belongs to user
**Constraints**: user_id required

### Database Relationships
```
users (1) ──── (N) accounts
   │
   ├── (N) transactions
   │
   ├── (N) proposals
   │
   └── (N) categories

accounts (1) ──── (N) transactions
categories (1) ──── (N) transactions
```

### Indexes & Performance
- Primary keys on all tables
- Foreign key indexes automatically created
- Additional index on `transactions.category_id` for performance
- Unique constraint on `categories(name, user_id)`

---

## 🔗 API Endpoints

### Authentication Endpoints (`/api/auth`)

#### POST `/api/auth/register`
**Purpose**: User registration
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
**Response**: Success message or error
**Side Effects**: Creates user and default "Cash" account

#### POST `/api/auth/login`
**Purpose**: User authentication
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
**Response**:
```json
{
  "token": "jwt_token_here"
}
```

### Account Management (`/api/accounts`)
**Authentication**: Required (JWT token)

#### POST `/api/accounts`
**Purpose**: Create new account
**Request Body**:
```json
{
  "name": "Checking Account",
  "type": "CHECKING",
  "last4": "1234",
  "balanceEstimate": 1500.00
}
```

#### GET `/api/accounts`
**Purpose**: List user's accounts
**Response**: Array of account objects

#### GET `/api/accounts/{id}`
**Purpose**: Get specific account details

#### PUT `/api/accounts/{id}`
**Purpose**: Update account information

#### DELETE `/api/accounts/{id}`
**Purpose**: Delete account (cascade deletes transactions)

### Transaction Management (`/api/transactions`)
**Authentication**: Required

#### POST `/api/transactions`
**Purpose**: Create new transaction
**Request Body**:
```json
{
  "accountId": 1,
  "merchant": "Starbucks",
  "amount": -5.50,
  "currency": "USD",
  "txnDate": "2025-01-15T10:30:00Z",
  "type": "DEBIT",
  "categoryId": 2
}
```

#### GET `/api/transactions`
**Purpose**: List transactions with pagination
**Query Parameters**:
- `page`, `size` - Pagination
- `accountId` - Filter by account
- `categoryId` - Filter by category
- `startDate`, `endDate` - Date range
- `merchant` - Merchant filter

#### GET `/api/transactions/{id}`
**Purpose**: Get transaction details

#### PUT `/api/transactions/{id}`
**Purpose**: Update transaction

#### DELETE `/api/transactions/{id}`
**Purpose**: Delete transaction

### Category Management (`/api/categories`)
**Authentication**: Required

#### POST `/api/categories`
**Purpose**: Create expense category

#### GET `/api/categories`
**Purpose**: List user's categories

#### GET `/api/categories/{id}`
**Purpose**: Get category details

#### GET `/api/categories/{id}/transactions`
**Purpose**: Get transactions for category

#### PUT `/api/categories/{id}`
**Purpose**: Update category

#### DELETE `/api/categories/{id}`
**Purpose**: Delete category

### Expense Ingestion (`/api/ingest`)
**Authentication**: Required

#### POST `/api/ingest`
**Purpose**: Submit expense for intelligent processing
**Request Body**:
```json
{
  "amount": 25.50,
  "currency": "USD",
  "merchant": "Starbucks",
  "accountHint": "1234",
  "rawText": "Coffee purchase at Starbucks"
}
```
**Response**: Processing result or proposal ID

### Proposal Management (`/api/proposals`)
**Authentication**: Required

#### GET `/api/proposals`
**Purpose**: List pending proposals

#### POST `/api/proposals/{id}/accept`
**Purpose**: Accept and convert proposal to transaction

---

## ⚙️ Configuration & Environment

### Application Configuration (`application.yml`)
```yaml
spring:
  config:
    import: optional:file:.env[.properties]
  datasource:
    url: jdbc:postgresql://localhost:5432/${POSTGRES_DB}
    username: ${POSTGRES_USER}
    password: ${POSTGRES_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: none  # Flyway manages schema
    show-sql: true
    properties:
      hibernate:
        format_sql: true

flyway:
  enabled: true

server:
  port: 8081

jwt:
  secret: ${JWT_SECRET}
  expiration-ms: 86400000  # 24 hours
```

### Environment Variables (`.env`)
```bash
# Database Configuration
POSTGRES_DB=moneydb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=282901

# PgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin

# JWT Configuration
JWT_SECRET=verySecretChangeMe123!
```

### Docker Compose Setup (`docker-compose.yml`)
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - ./pgdata:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_DEFAULT_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_DEFAULT_PASSWORD}
    ports:
      - "5050:80"
    depends_on:
      - db
```

---

## 📁 Code Structure Analysis

### Package Organization
```
src/main/java/com/app/ExpenseTracker/
├── ExpenseTrackerApplication.java          # Main application class
├── config/                                 # Configuration classes
│   ├── CorsConfig.java                    # CORS configuration
│   └── SecurityConfig.java                # Security configuration
├── controller/                            # REST controllers
│   ├── AuthController.java                # Authentication endpoints
│   ├── AccountController.java             # Account management
│   ├── TransactionController.java         # Transaction CRUD
│   ├── CategoryController.java            # Category management
│   ├── IngestController.java              # Expense ingestion
│   └── ProposalController.java            # Proposal management
├── dto/                                   # Data Transfer Objects
│   ├── AuthRequest.java                   # Login/registration
│   ├── AuthResponse.java                  # Authentication response
│   ├── AccountDTO.java                    # Account data
│   ├── TransactionRequestDTO.java         # Transaction input
│   ├── TransactionResponseDTO.java        # Transaction output
│   ├── CategoryDTO.java                   # Category data
│   └── IngestRequest.java                 # Expense ingestion
├── entity/                                # JPA entities
│   ├── User.java                          # User entity
│   ├── Account.java                       # Account entity
│   ├── TransactionEntity.java             # Transaction entity
│   ├── Category.java                      # Category entity
│   └── Proposal.java                      # Proposal entity
├── repository/                            # Data access layer
│   ├── UserRepository.java                # User data access
│   ├── AccountRepository.java             # Account data access
│   ├── TransactionRepository.java         # Transaction data access
│   ├── CategoryRepository.java            # Category data access
│   └── ProposalRepository.java            # Proposal data access
├── service/                               # Business logic layer
│   ├── AccountService.java                # Account business logic
│   ├── CategoryService.java               # Category business logic
│   ├── TransactionService.java            # Transaction business logic
│   └── impl/                              # Service implementations
│       ├── AccountServiceImpl.java
│       ├── CategoryServiceImpl.java
│       └── TransactionServiceImpl.java
├── security/                              # Security components
│   ├── JwtUtil.java                       # JWT token utilities
│   ├── JwtFilter.java                     # JWT authentication filter
│   └── UserDetailsServiceImpl.java        # User details service
├── exception/                             # Exception handling
│   ├── GlobalExceptionHandler.java        # Global exception handling
│   ├── ApiError.java                      # Error response format
│   └── NotFoundException.java             # Custom not found exception
└── resources/                             # Application resources
    ├── application.yml                    # Main configuration
    ├── application.properties             # Additional properties
    └── db/migration/                      # Database migrations
        ├── V1__init.sql                   # Initial schema
        ├── V2__init.sql                   # Additional schema
        └── V3__add_category_relationship.sql  # Category relationships
```

### Key Classes Analysis

#### Controllers
- **AuthController**: Handles user registration and login
- **AccountController**: Full CRUD operations for financial accounts
- **TransactionController**: Transaction management with filtering and pagination
- **CategoryController**: Category management and transaction grouping
- **IngestController**: Intelligent expense processing
- **ProposalController**: Proposal approval workflow

#### Entities
- **User**: Core user information with email/password
- **Account**: Financial account details with balance tracking
- **TransactionEntity**: Complete transaction record with all metadata
- **Category**: Hierarchical expense categorization
- **Proposal**: Intelligent expense processing proposals

#### Services
- **AccountService**: Account business logic and validation
- **TransactionService**: Transaction processing and categorization
- **CategoryService**: Category management and hierarchy

#### Security
- **JwtUtil**: JWT token generation and validation
- **JwtFilter**: Request authentication filter
- **UserDetailsServiceImpl**: User authentication integration

---

## 🚀 Setup & Deployment

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Docker & Docker Compose (recommended)
- PostgreSQL 15 (if running locally)

### Quick Start with Docker
```bash
# 1. Clone repository
git clone https://github.com/madhav2928/ExpenseTracker.git
cd ExpenseTracker

# 2. Start database and admin interface
docker-compose up -d

# 3. Configure environment
cp .env.example .env  # Edit with your values

# 4. Run application
mvn spring-boot:run

# API available at: http://localhost:8081
# PgAdmin at: http://localhost:5050
```

### Manual Setup
```bash
# 1. Install PostgreSQL locally
# 2. Create database and user
createdb moneydb
createuser postgres
# 3. Run with Maven
mvn clean install
mvn spring-boot:run
```

### Production Deployment
```bash
# Build for production
mvn clean package -Pprod

# Run production build
java -jar target/ExpenseTracker-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

---

## 🔄 Database Migrations

### Migration History

#### V1__init.sql - Initial Schema
- Created core tables: users, accounts, transactions, proposals
- Established basic relationships and constraints
- Set up initial data structure

#### V2__init.sql - Schema Extensions
- Additional table modifications and indexes
- Enhanced data relationships

#### V3__add_category_relationship.sql - Category System
- Added categories table
- Migrated transaction.category string to category_id foreign key
- Created global "Uncategorized" category
- Added proper foreign key constraints and indexes

### Migration Strategy
- **Versioned Migrations**: Sequential numbering (V1, V2, V3...)
- **Idempotent Operations**: Safe to run multiple times
- **Transactional**: All operations wrapped in transactions
- **Backward Compatible**: Preserves existing data during migrations

---

## 🔐 Security Implementation

### Authentication Flow
1. User registers with email/password
2. Password hashed with BCrypt
3. User logs in with credentials
4. JWT token generated and returned
5. Subsequent requests include Bearer token
6. JwtFilter validates token on each request

### Security Features
- **Password Encryption**: BCrypt hashing
- **JWT Tokens**: Stateless authentication
- **Request Validation**: Input sanitization and validation
- **CORS Configuration**: Cross-origin request handling
- **Security Headers**: Spring Security defaults

### Authorization
- **User Isolation**: Users can only access their own data
- **Account Ownership**: Transactions tied to user accounts
- **Proposal Privacy**: Proposals isolated per user

---

## 📈 Current Features & Roadmap

### ✅ Implemented Features
- User registration and JWT authentication
- Multi-account financial management
- Complete transaction CRUD operations
- Intelligent expense categorization
- Expense proposal system
- Database migrations with Flyway
- Docker containerization
- RESTful API design
- Input validation and error handling
- Pagination and filtering

### 🚧 Roadmap (Future Enhancements)
- **Advanced Reporting**: Analytics and expense insights
- **Budget Management**: Spending limits and alerts
- **Data Export**: CSV/PDF export capabilities
- **Search & Filtering**: Advanced transaction querying
- **Audit Trails**: Complete transaction history
- **Recurring Transactions**: Scheduled expense tracking
- **Multi-Currency Support**: Enhanced currency handling
- **API Versioning**: Versioned API endpoints
- **Rate Limiting**: API request throttling
- **Webhooks**: Real-time notifications
- **Mobile API**: Optimized mobile endpoints

---

## 🧪 Testing Strategy

### Test Structure
```
src/test/java/com/app/ExpenseTracker/
└── ExpenseTrackerApplicationTests.java  # Basic integration test
```

### Testing Framework
- **Spring Boot Test**: Integration testing
- **JUnit 5**: Unit testing framework
- **Spring Security Test**: Security testing utilities
- **MockMvc**: API endpoint testing

### Test Categories
- **Unit Tests**: Individual component testing
- **Integration Tests**: End-to-end API testing
- **Security Tests**: Authentication and authorization
- **Database Tests**: Repository layer testing

---

## 🔧 Development Guidelines

### Code Style
- **Java Naming Conventions**: Standard Java naming
- **Spring Boot Best Practices**: Controller, Service, Repository patterns
- **REST API Standards**: Proper HTTP methods and status codes
- **Error Handling**: Consistent error response format

### Development Workflow
1. **Branch Strategy**: Feature branches from main
2. **Code Reviews**: Pull request reviews required
3. **Testing**: Unit tests for new features
4. **Documentation**: Update API docs for changes

### Commit Conventions
- **Descriptive Messages**: Clear, concise commit messages
- **Atomic Commits**: Single responsibility per commit
- **Issue References**: Link commits to issues/tickets

---

## 📊 Performance Considerations

### Database Optimization
- **Indexes**: Proper indexing on foreign keys and search fields
- **Connection Pooling**: HikariCP for efficient connection management
- **Query Optimization**: Efficient JPA queries and fetching strategies

### API Performance
- **Pagination**: Large dataset handling
- **Caching**: Potential for Redis caching layer
- **Async Processing**: Background job processing for heavy operations

### Scalability
- **Stateless Design**: Horizontal scaling capability
- **Database Sharding**: Future multi-tenant support
- **Microservices Ready**: Modular architecture for service extraction

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Quality
- **SonarQube**: Code quality analysis
- **Checkstyle**: Code style enforcement
- **JaCoCo**: Code coverage reporting

---

## 📝 API Documentation

### OpenAPI/Swagger
- **SpringDoc OpenAPI**: Automatic API documentation
- **Interactive UI**: Swagger UI for testing endpoints
- **Schema Generation**: JSON schema from DTOs

### Documentation Updates
- **README.md**: Project overview and setup
- **API Docs**: Endpoint documentation
- **Code Comments**: Comprehensive JavaDoc

---

## 🐛 Error Handling

### Global Exception Handler
- **GlobalExceptionHandler**: Centralized error handling
- **Custom Exceptions**: Domain-specific error types
- **Consistent Responses**: Standardized error format

### Error Response Format
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/transactions"
}
```

---

## 🔍 Monitoring & Logging

### Application Logging
- **Spring Boot Logging**: Structured logging
- **Log Levels**: Configurable logging levels
- **Request Tracing**: Request ID tracking

### Health Checks
- **Spring Boot Actuator**: Application health endpoints
- **Database Connectivity**: Database health checks
- **Custom Metrics**: Business metric collection

---

## 🌐 Internationalization

### Multi-Language Support
- **Spring i18n**: Message source configuration
- **Locale Resolution**: Accept-Language header support
- **Error Messages**: Localized error responses

### Currency Support
- **ISO Currency Codes**: Standard currency representation
- **Exchange Rates**: Future currency conversion
- **Locale Formatting**: Localized number formatting

---

## 📚 Additional Resources

### Related Documentation
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [Docker Documentation](https://docs.docker.com/)

### Useful Tools
- **Postman**: API testing and documentation
- **PgAdmin**: Database administration
- **IntelliJ IDEA**: IDE with Spring Boot support
- **Maven**: Dependency management

---

## 📞 Support & Contact

**Author**: Madhav Anchal
**GitHub**: [madhav2928](https://github.com/madhav2928)
**Repository**: [ExpenseTracker](https://github.com/madhav2928/ExpenseTracker)

---

*This comprehensive summary serves as complete reference documentation for the Expense Tracker backend API project. Last updated: December 2025*
