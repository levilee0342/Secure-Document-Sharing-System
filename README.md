# Secure-Document-Sharing-System

## Project Overview

**Project title:** Building a secure and controlled document sharing system using microservices architecture and GnuPG.

This project is a secure document sharing system that includes both **frontend** and **backend** components and is designed around a microservices architecture. The system aims to:

- Protect documents using asymmetric encryption.
- Verify document origin through digital signatures.
- Control access by user, group, and role.
- Record a complete activity history for monitoring and traceability.
- Reduce unauthorized plaintext redistribution through watermarking tied to each recipient.

## System Components

The root directory currently contains two main parts:

- `fe-system-share-documents`: the web frontend for end users.
- `system-microservice-share-documents`: the backend built with microservices.

## Theoretical Foundation

The system is based on the following technologies and concepts:

- **Microservices with Spring Boot:** separates the system into independent services that are easier to scale and maintain.
- **RESTful APIs:** standardizes communication between the frontend, API Gateway, and business services.
- **MySQL/PostgreSQL:** stores business data, access logs, and document metadata.
- **GnuPG / OpenPGP.js:** supports end-to-end encryption with public/private keys and digital signatures for sender verification.
- **Keycloak:** manages identity, authentication, and role-based/group-based access control.
- **Apache PDFBox / PyPDF2:** embeds watermarks into documents before plaintext distribution.
- **Kafka / Flink / audit log pipeline:** supports event collection, processing, and monitoring.
- **MinIO / S3-compatible storage:** stores document files and object data.
- **Vault:** manages secrets, tokens, and sensitive configuration.

## Practical Scope

### 1. Backend Microservices

The backend is intended to include the following services:

- **User Service**
  - User registration and login.
  - User profile management.
  - Document group management.
  - Public/private key pair generation and management for each user.

- **Document Service**
  - Document upload.
  - Digital signing using the sender's private key.
  - Watermark insertion into plaintext before encryption.
  - Encryption using each recipient's public key.
  - Metadata storage, recipient lists, and access permissions.
  - Secure download with signature verification before decryption.

- **Auth Access Control Service**
  - Integration with Keycloak for authentication.
  - Access control by roles and groups.
  - Support for anti-redistribution mechanisms.

- **Audit Log Service**
  - Records actions such as upload, download, authentication, decryption, and API access.
  - Supports querying logs to detect abnormal behavior or support investigations.

- **API Gateway**
  - Serves as the central entry point for the system.
  - Validates JWT tokens.
  - Routes requests to the correct services.
  - Attaches `traceId`, logs requests/responses, and supports centralized monitoring.

### 2. Web Frontend

The web interface is designed to support:

- Creating document groups.
- Managing users and access permissions.
- Uploading documents.
- Viewing and downloading authorized documents.
- Reviewing personal activity history or system logs.

## Core Security Features

### 1. End-to-End Encryption

- Documents are encrypted with the recipient's public key.
- Only the holder of the matching private key can decrypt them.

### 2. Digital Signature Verification

- The sender signs the document using their private key.
- The recipient verifies the signature using the sender's public key.

### 3. Watermark-Based Redistribution Prevention

- Before plaintext delivery, the system embeds a watermark into the document.
- The watermark may contain `userId`, download time, or other traceable information.

### 4. Audit and Traceability

- The system records who uploaded, viewed, downloaded, or verified a document.
- Each request can include a `traceId` for cross-service tracing.

## Current Backend Structure

According to [settings.gradle](C:\work\old%20data\_srv\Share%20doc\Secure-Document-Sharing-System\system-microservice-share-documents\settings.gradle), the backend is organized into these modules:

- `EurekaService`
- `APIGatewayService`
- `UserService`
- `DocumentService`
- `AuthAccessControlService`
- `AuditLogService`
- `CloudConfigServerService`
- `WatermarkWorkerService`
- `AppCommonService`
- `UpdateDocumentData`

At the moment, the backend source code visibly present in this repository is most clearly represented by the `APIGatewayService` module, while other modules appear to be planned or still under development.

## Technology Stack

- Frontend: Next.js, TypeScript
- Backend: Java 17, Spring Boot 3, Spring Cloud Gateway
- Security: Spring Security OAuth2 Resource Server, Keycloak, GnuPG/OpenPGP.js
- Infrastructure: MinIO, Vault, Kafka, Flink
- Databases: PostgreSQL / MySQL
- Build and orchestration: Gradle, Docker Compose

## Infrastructure Services

The file [docker-compose.yml](C:\work\old%20data\_srv\Share%20doc\Secure-Document-Sharing-System\system-microservice-share-documents\docker-compose.yml) currently defines the following infrastructure components:

- Keycloak
- MinIO
- Vault
- Zookeeper
- Kafka
- Kafka UI
- Flink JobManager
- Flink TaskManager

## Running the Project

### 1. Start backend infrastructure

Inside `system-microservice-share-documents`:

```bash
docker compose up -d
```

### 2. Run the backend

Inside `system-microservice-share-documents`:

```bash
gradlew.bat build
```

Or run the API Gateway separately inside `APIGatewayService`:

```bash
gradlew.bat bootRun
```

### 3. Run the frontend

Inside `fe-system-share-documents`:

```bash
npm install
npm run dev
```

## Future Development

- Complete the remaining microservices.
- Integrate real document encryption, signing, and decryption flows.
- Add watermark processing for PDF documents.
- Finish the frontend interfaces for groups, documents, and audit logs.
- Add integration tests for the main system flows.

## Conclusion

This project aims to deliver a secure and controlled document sharing system that combines a web frontend and a microservices backend to meet real-world requirements for security, access control, and traceability.
