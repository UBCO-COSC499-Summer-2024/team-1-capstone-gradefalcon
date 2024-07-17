# GradeFalcon Documentation

## Overview
GradeFalcon is a web-based Optical Mark Recognition (OMR) system designed to streamline the grading of exams. The system utilizes AWS for file storage, Docker for containerization, and Drone CI for continuous integration and deployment. This documentation provides an in-depth guide for developers and users, detailing every aspect of the application from setup to deployment, and explains how each component interacts within the system.

## Table of Contents
1. [Project Setup and Configuration](#project-setup-and-configuration)
   - [AWS Configuration](#aws-configuration)
   - [Drone CI Configuration](#drone-ci-configuration)
   - [Environment Setup](#environment-setup)
2. [Backend Implementation](#backend-implementation)
   - [Database Schema](#database-schema)
   - [API Endpoints](#api-endpoints)
   - [File Upload Process](#file-upload-process)
3. [Frontend Implementation](#frontend-implementation)
   - [Components](#components)
   - [File Upload Functionality](#file-upload-functionality)
4. [Testing](#testing)
   - [Unit Tests](#unit-tests)
   - [Integration Tests](#integration-tests)
5. [Pros and Cons](#pros-and-cons)
   - [Strengths](#strengths)
   - [Potential Issues](#potential-issues)

## Project Setup and Configuration

### AWS Configuration
GradeFalcon leverages AWS for hosting and file storage. Key services used include EC2 for running the application and S3 for storing exam files and answer keys.

#### EC2 Instance
The AWS EC2 instance hosts both the backend services and the Drone CI server.
- **Preconfigured EC2 Instance**: The EC2 instance has Docker and Docker Compose preinstalled, along with the necessary security groups configured to allow SSH (port 22), HTTP (port 80), and HTTPS (port 443) traffic.
- **IAM Roles and Policies**: The EC2 instance is attached to an IAM role with S3 access permissions, enabling it to interact with S3 for file uploads and retrievals.

#### S3 Bucket
AWS S3 is used for storing exam files and answer keys.
1. **Bucket Creation**: An S3 bucket named `gradefalcon-storage` is created and configured for storing exam-related files.
2. **Permissions**: Bucket policies and IAM roles ensure that only authorized users and services can upload and retrieve files.

### Drone CI Configuration
Drone CI automates the build, test, and deployment processes, ensuring that the application is always in a deployable state.

#### Drone CI Server
The Drone CI server is preconfigured and running on the EC2 instance.
- **OAuth Application**: A GitHub OAuth application is set up with the Drone server URL as the callback URL.
- **Secrets and Configuration**: The necessary secrets and configurations are stored in environment variables on the EC2 instance.

#### CI/CD Pipeline
The `.drone.yml` file defines the CI/CD pipeline, specifying steps for linting, testing, building, and deploying the application.

### Environment Setup
For local development and testing, ensure that the following dependencies are installed:
- **Node.js**: Required for running the backend and frontend services.
- **Docker**: Used for containerization and managing services.
- **Docker Compose**: Used for defining and running multi-container Docker applications.

#### Environment Variables
Create a `.env` file in the root directory with the following variables:
```bash
S3_BUCKET_NAME=gradefalcon-storage
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## Backend Implementation

### Database Schema
The database schema is designed to store all relevant data for the grading system, including instructors, classes, students, exams, solutions, enrollments, student results, and scanned exams.

**Key Tables**:
- **instructor**: Stores instructor details.
- **classes**: Stores class details, including a foreign key reference to the instructor.
- **student**: Stores student details.
- **exam**: Stores exam details, including a foreign key reference to the class.
- **solution**: Stores exam solutions, including a foreign key reference to the exam.
- **scannedExam**: Stores scanned exam files.
- **enrollment**: Stores class enrollments, linking students to classes.

### API Endpoints
#### Upload Exam Key
- **Endpoint**: `/api/upload/uploadExamKey`
- **Method**: POST
- **Description**: Uploads an exam key PDF file to S3 and saves the file URL in the database.
- **Request Body**: Includes the file, folder path, filename, and exam ID.
- **Workflow**:
  1. The frontend sends a file and related data to the endpoint.
  2. The backend uploads the file to S3 using the `uploadFile` function.
  3. The file URL is saved in the database using the `saveFileUrlToDatabase` function.

#### Upload Exam
- **Endpoint**: `/api/upload/uploadExam`
- **Method**: POST
- **Description**: Uploads an exam PDF file with student submissions to S3 and saves the file URL in the database.
- **Request Body**: Includes the file, folder path, filename, and exam ID.
- **Workflow**:
  1. The frontend sends a file and related data to the endpoint.
  2. The backend uploads the file to S3 using the `uploadFile` function.
  3. The file URL is saved in the database using the `saveFileUrlToDatabase` function.

### File Upload Process
#### s3Controller.js
This file handles S3 file uploads and database operations. Key functions include:

- **uploadFile**: Uploads files to S3 and returns the file URL.
  - **Parameters**:
    - `folder`: The folder path in S3 where the file will be uploaded.
    - `fileName`: The name of the file.
    - `fileContent`: The content of the file to be uploaded.
  - **Returns**: The result of the S3 upload operation, including the file URL.

- **saveFileUrlToDatabase**: Saves the file URL to the specified database table.
  - **Parameters**:
    - `fileUrl`: The URL of the uploaded file.
    - `examID`: The ID of the exam to which the file belongs.
    - `tableName`: The database table where the file URL will be saved.
  - **Workflow**: Executes an SQL insert query to save the file URL in the specified table.

## Frontend Implementation

### Components
#### UploadExamKey Component
This component allows instructors to upload the answer key for an exam.
- **State Management**: Manages the state for the selected file and its URL.
- **Event Handling**: Handles file selection and triggers the backend API call to upload the file.
- **UI Elements**: Provides an interface for file selection, preview, and submission.

#### UploadExams Component
This component allows instructors to upload the exam file with all student submissions.
- **State Management**: Manages the state for the selected file and its URL.
- **Event Handling**: Handles file selection and triggers the backend API call to upload the file.
- **UI Elements**: Provides an interface for file selection, preview, and submission.

### File Upload Functionality
The file upload functionality is implemented using the Fetch API to send files to the backend endpoints. Key steps include:
1. **File Selection**: The user selects a file, which is then stored in the component state.
2. **FormData Preparation**: The file and related metadata (folder path, filename, exam ID) are appended to a FormData object.
3. **API Call**: The FormData object is sent to the backend using the Fetch API.
4. **Response Handling**: The response from the backend is processed, and success or error messages are displayed to the user.

## Testing

### Unit Tests
Unit tests are written using Jest and React Testing Library to ensure individual components and functions work as expected.

#### Key Tests
- **UploadExamKey Component**:
  - Tests for rendering the component.
  - Tests for file upload and preview functionality.
  - Tests for form submission with the selected file.

- **UploadExams Component**:
  - Tests for rendering the component.
  - Tests for file upload and preview functionality.
  - Tests for form submission with the selected file.

### Integration Tests
Integration tests ensure that different parts of the application work together as expected.

#### Key Tests
- **API Endpoints**: Tests for the upload exam key and upload exam endpoints to ensure files are correctly uploaded to S3 and URLs are saved in the database.
- **Database Operations**: Tests for database insert and retrieval operations to ensure data integrity.

## Pros and Cons

### Strengths
1. **Scalability**: The use of AWS services (EC2, S3) ensures that the system can handle large volumes of data and traffic.
2. **Automation**: Drone CI automates the build, test, and deployment processes, reducing manual intervention and ensuring consistent deployment.
3. **Modularity**: The application is modular, with well-defined components and APIs, making it easy to maintain and extend.

## Potential Issues and Solutions

### Dependency on AWS
The system relies heavily on AWS services, which could be a limitation if there are changes in service availability or pricing.

**Solutions:**
1. **Multi-Cloud Strategy**: Implement a multi-cloud strategy by integrating other cloud service providers such as Google Cloud Platform (GCP) or Microsoft Azure. This approach ensures that if one provider has an outage or price increase, the system can switch to another provider with minimal disruption.
2. **On-Premises Infrastructure**: Develop an on-premises version of the application that can be deployed in local data centers. This approach reduces dependency on cloud providers and provides more control over infrastructure and costs.
3. **Hybrid Cloud Approach**: Combine on-premises infrastructure with cloud services to create a hybrid cloud environment. This approach allows for critical workloads to run locally while leveraging cloud services for scalability and flexibility.
4. **Cost Management Tools**: Utilize cost management tools and services to monitor and optimize AWS usage. Implement budget alerts and automated scaling policies to control costs and avoid unexpected price increases. If you are (planning to upgrade the account).

### Complexity
The setup and configuration of the system can be complex, requiring familiarity with AWS, Docker, and CI/CD pipelines.

**Solutions:**
1. **Comprehensive Documentation**: Provide detailed and comprehensive documentation for setup, configuration, and maintenance of the system. Include step-by-step guides, screenshots, and video tutorials to assist users with varying levels of expertise.
2. **Automated Deployment Scripts**: Develop automated deployment scripts using tools like Terraform, Ansible, or CloudFormation. These scripts can automate the provisioning and configuration of infrastructure, reducing manual effort and potential errors.
3. **Training and Support**: Offer training sessions and support services to users and developers. Providing hands-on training and access to support can help users become more comfortable with the system and reduce the learning curve.

### Testing
Ensuring comprehensive test coverage and managing test data can be challenging, especially for integration tests involving external services.

**Solutions:**
1. **Mocking and Stubbing**: Use mocking and stubbing techniques to simulate external services during testing. Tools like Mockito, WireMock, and localstack can create mock versions of AWS services, enabling testing without real service dependencies.
2. **Test Data Management**: Implement a test data management strategy to create, manage, and tear down test data. Use tools like Faker to generate synthetic test data and ensure consistent test environments.
3. **Sandbox Environments**: Create isolated sandbox environments for testing. These environments can mirror production settings and allow for safe testing of new features and integrations without affecting live data or services.
4. **Code Coverage Tools**: Utilize code coverage tools such as Istanbul or JaCoCo to measure and report on test coverage. Aim for high coverage metrics to ensure that most code paths are tested and potential issues are identified.