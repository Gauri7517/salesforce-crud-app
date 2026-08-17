# Salesforce CRUD Web Application

A full-stack Salesforce CRUD web application built using **Java, Spring Boot, React, and Salesforce OAuth 2.0**.

The application authenticates users with Salesforce and performs CRUD operations on Salesforce Account records through the Salesforce REST API.

---

## 🚀 Features

- 🔐 Salesforce OAuth 2.0 Authentication
- 🔑 Secure OAuth login using Spring Security
- 📋 Retrieve Salesforce Accounts
- ➕ Create a new Account
- 🔍 Get Account by ID
- ✏️ Update Account
- 🗑️ Delete Account
- 🔗 Salesforce REST API Integration
- 🌐 RESTful APIs using Spring Boot
- ⚡ React frontend integration
- 🛡️ Protected API endpoints

---

## 🛠️ Technologies Used

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring OAuth2 Client
- REST API
- Maven

### Frontend

- React
- JavaScript
- HTML
- CSS

### Integration

- Salesforce REST API
- Salesforce OAuth 2.0

### Tools

- Git
- GitHub
- IntelliJ IDEA / Eclipse
- Google Chrome
- Postman / Browser Console

---

## 🏗️ Project Architecture

```text
React Frontend
       |
       | HTTP Requests
       ↓
Spring Boot Backend
       |
       | Spring Security OAuth 2.0
       ↓
Salesforce Authentication
       |
       | Access Token
       ↓
Salesforce REST API
       |
       ↓
Salesforce Account Data
