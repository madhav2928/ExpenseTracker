# 💰 Expense Tracker - Backend API

> **Track your expenses intelligently with a robust Spring Boot backend**

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Development Setup](#development-setup)
- [Contributing](#contributing)

## 🎯 Overview

**Expense Tracker** is a comprehensive backend API built with Spring Boot that enables users to track, manage, and analyze their financial transactions. The application provides a secure, scalable foundation for personal finance management with features like user authentication, account management, and intelligent expense processing.

### Key Highlights
- **JWT-based Authentication**: Secure user registration and login
- **Multi-Account Support**: Manage multiple financial accounts
- **Intelligent Proposals**: Process and approve expense entries
- **Database Migrations**: Flyway-managed schema evolution
- **Containerized Deployment**: Docker and Docker Compose ready

## ✨ Features

### Current Implementation
- ✅ **User Management**: Registration and authentication with JWT tokens
- ✅ **Account System**: Multi-account support with balance tracking
- ✅ **Transaction Recording**: Debit/Credit transaction management
- ✅ **Expense Proposals**: Intelligent expense suggestion system
- ✅ **Security**: Spring Security with JWT authentication
- ✅ **Database Management**: PostgreSQL with Flyway migrations
- ✅ **Containerization**: Docker and Docker Compose setup

### 🚀 Upcoming Features (Roadmap)
- 🔄 **Transaction Management API**: Full CRUD operations for transactions
- 🔄 **Advanced Reporting**: Analytics and expense insights
- 🔄 **Budget Management**: Set and monitor spending limits
- 🔄 **Data Export**: CSV and PDF export capabilities
- 🔄 **Categories System**: Predefined and custom expense categories
- 🔄 **Search & Filtering**: Advanced transaction querying
- 🔄 **Audit Trails**: Complete transaction history tracking

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │ -> │    Services     │ -> │  Repositories   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ AuthController  │    │ UserService     │    │ UserRepository  │
│ IngestController│    │ AccountService  │    │ AccountRepo     │
│ ProposalControl │    │ TransactionSvc  │    │ TransactionRepo │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                  |
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │    Database     │
                       └─────────────────┘
```

## 🛠️ Technologies Used

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Spring Boot | 3.5.6 | Main application framework |
| **Security** | Spring Security | - | Authentication & Authorization |
| **Database** | PostgreSQL | 15 | Primary database |
| **Migration** | Flyway | - | Database version control |
| **Build Tool** | Maven | - | Dependency management |
| **Containerization** | Docker | - | Application containerization |
| **Authentication** | JWT | 4.5.0 | Token-based authentication |
| **Language** | Java | 17 | Programming language |

## 🚀 Quick Start

### Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **Docker & Docker Compose**
- **PostgreSQL 15** (if running locally)

### 1. Clone the Repository

```bash
git clone https://github.com/madhav2928/ExpenseTracker.git
cd ExpenseTracker
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Database Configuration
POSTGRES_DB=expense_tracker
POSTGRES_USER=expense_user
POSTGRES_PASSWORD=your_secure_password

# PgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin_password
```

### 3. Start with Docker Compose (Recommended)

```bash
# Start PostgreSQL and PgAdmin
docker-compose up -d

# The application will be available at:
# - PostgreSQL: localhost:5432
# - PgAdmin: http://localhost:5050
```

### 4. Run the Application

#### Option A: Using Maven
```bash
mvn clean install
mvn spring-boot:run
```

#### Option B: Using Java
```bash
mvn clean package
java -jar target/ExpenseTracker-0.0.1-SNAPSHOT.jar
```

The API will be available at: **http://localhost:8080**

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "securepassword"
}
```

### Expense Management

#### Submit Expense Proposal
```http
POST /api/ingest
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 25.50,
  "currency": "USD",
  "merchant": "Starbucks",
  "accountHint": "1234",
  "rawText": "Coffee purchase"
}
```

#### Get Pending Proposals
```http
GET /api/proposals
Authorization: Bearer <jwt_token>
```

#### Accept Expense Proposal
```http
POST /api/proposals/{id}/accept
Authorization: Bearer <jwt_token>
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    last4 VARCHAR(10),
    balance_estimate NUMERIC(18,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    account_id BIGINT REFERENCES accounts(id),
    merchant VARCHAR(255),
    amount NUMERIC(18,2) NOT NULL,
    currency VARCHAR(10),
    txn_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(20),
    category VARCHAR(255),
    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Proposals Table
```sql
CREATE TABLE proposals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
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

## ⚙️ Configuration

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
      ddl-auto: none
    show-sql: true
    properties:
      hibernate:
        format_sql: true

flyway:
  enabled: true

server:
  port: 8080

jwt:
  secret: ${JWT_SECRET:verySecretChangeMe123!}
  expiration-ms: 86400000 # 1 day
```

## 🔧 Development Setup

### Local Development Environment

1. **Install Dependencies**
   ```bash
   mvn clean install
   ```

2. **Start PostgreSQL locally** or use Docker:
   ```bash
   docker-compose up db -d
   ```

3. **Run in Development Mode**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

4. **Access PgAdmin** (optional):
    - URL: http://localhost:5050
    - Email: admin@example.com
    - Password: admin_password

### Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn clean test jacoco:report
```

### Building for Production

```bash
# Create production build
mvn clean package -Pprod

# Run production build
java -jar target/ExpenseTracker-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## 🔒 Security Considerations

### Current Security Features
- ✅ JWT-based authentication
- ✅ Password encoding with BCrypt
- ✅ Database connection security
- ✅ CSRF protection disabled for API

### Security Recommendations
- 🔧 Use environment variables for JWT secrets
- 🔧 Implement rate limiting
- 🔧 Add CORS configuration
- 🔧 Enable HTTPS in production
- 🔧 Add input validation
- 🔧 Implement API versioning


---

**Made with ❤️ by [madhav2928](https://github.com/madhav2928)**

*Star ⭐ this repository if you find it helpful!*