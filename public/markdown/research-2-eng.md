# OSPass - Secure Sign-In Service via Smart Card

## Introduction

OSPass is an online authentication service for lab members that complies with OAuth 2.0 standards, allowing secure login without traditional username and password credentials. It is designed for use across various internal and external projects and incorporates additional security features through smart card integration.

## Key Features

- **OAuth 2.0 Compatible**: Uses industry-standard authentication protocol
- **Smart Card Integration**: Physical token-based two-factor authentication
- **Session Management**: Secure session creation and maintenance
- **Authorization Management**: Granular access control system
- **API Integration**: Easy integration with various services

## Technology Stack

OSPass is developed using the following modern technologies:

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens), OAuth 2.0
- **Encryption**: AES-256, RSA
- **Smart Card Interface**: PC/SC API

## Implementation Architecture

The architecture of OSPass consists of the following components:

1. **Authentication Server**: Handles OAuth flow and token issuance
2. **User Management System**: Manages user data and permissions
3. **Card Interface Module**: Processes smart card communication
4. **Client SDK**: Libraries for service integration

## Authentication Flow

The authentication flow in OSPass is as follows:

1. User attempts to log in to a service
2. Service redirects to OSPass authentication server
3. User authenticates with smart card
4. Authentication server issues an authorization code and redirects to service
5. Service exchanges the authorization code for an access token
6. User session is created and login is completed

## Security Features

- **Token-Based Authentication**: No server-side session storage
- **Principle of Least Privilege**: Only necessary permissions are granted
- **Token Expiration**: Automatic expiration after a certain time
- **Physical Possession Verification**: Two-factor authentication via smart card
- **TLS/SSL**: All communications encrypted

## Integration Cases

Currently, OSPass is integrated with the following services:

- Lab intranet
- Attendance management system
- Document management system
- Lab equipment management system

## Future Plans

- Authentication support via mobile app
- Biometric integration
- FIDO2 standard implementation
- SSO (Single Sign-On) system expansion

For detailed information, please visit our [GitHub repository](https://github.com/OS-LAB-DaejinUniv/OSPass).
