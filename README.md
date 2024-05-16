# Travel Easily Server

## Overview

This repository contains the backend code for the Travel Easily application, a platform designed to help travelers plan and share multi-day trips. The server handles all the functionalities described in the client-side application, including user authentication, trip sharing, and real-time interactions.

## Technologies

- Node.js: The server is built with Node.js, providing a scalable and efficient backend.
- Express: Used for handling HTTP requests and routing.
- TypeScript: Enhances code reliability and maintainability with static typing.
- MongoDB: Used for data storage, utilizing Mongoose for schema-based solution to model the application data.
- Authentication: Implements token-based authentication using JWT (JSON Web Tokens) and refresh tokens for maintaining user sessions securely.
- Jest: Used for writing and running tests to ensure code reliability.
- Swagger: API documentation is available and maintained with Swagger, accessible [here](https://enigmatic-island-56921-258869278475.herokuapp.com/api-docs/).

## Features

- User registration and login with secure token-based authentication.
- Profile management including profile picture updates.
- Real-time updates for comments and likes on shared trips.
- Ability to search and filter trips based on various criteria like trip type and duration.

## Getting Started

-- Clone the repository:

```bash
git clone https://github.com/DavidErenfeld/Travel-Easily-Server.git
```

-- Install dependencies:

cd Travel-Easily-Server
npm install

-- Set environment variables:

Create a .env file in the root directory and set the necessary environment variables (e.g., database URI, JWT secret).

-- Run the server:

npm start

-- Testing

Run tests using Jest by executing:
npm test

## Issues

For issues and feature requests, please create an issue in the GitHub repository.
