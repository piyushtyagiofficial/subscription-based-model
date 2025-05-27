# Subscription Management Microservice

A RESTful microservice for managing user subscriptions in a SaaS platform.

## Features

- User authentication with JWT
- Subscription management (create, retrieve, update, cancel)
- Plan management
- Automatic subscription expiration
- RESTful API with proper validation and error handling

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Express Validator for input validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```
4. Start the server: `npm run dev`

## API Documentation

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "123456" }`
- **Response**: JWT token

#### Login User
- **POST** `/api/auth/login`
- **Body**: `{ "email": "john@example.com", "password": "123456" }`
- **Response**: JWT token

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Response**: User data

### Plans

#### Get All Plans
- **GET** `/api/plans`
- **Response**: List of subscription plans

#### Get Plan by ID
- **GET** `/api/plans/:id`
- **Response**: Plan details

#### Create Plan (Admin only)
- **POST** `/api/plans`
- **Headers**: `Authorization: Bearer ADMIN_JWT_TOKEN`
- **Body**: `{ "name": "Basic", "price": 9.99, "features": ["Feature 1", "Feature 2"], "duration": 30 }`
- **Response**: Created plan

#### Update Plan (Admin only)
- **PUT** `/api/plans/:id`
- **Headers**: `Authorization: Bearer ADMIN_JWT_TOKEN`
- **Body**: `{ "name": "Basic", "price": 9.99, "features": ["Feature 1", "Feature 2"], "duration": 30 }`
- **Response**: Updated plan

#### Delete Plan (Admin only)
- **DELETE** `/api/plans/:id`
- **Headers**: `Authorization: Bearer ADMIN_JWT_TOKEN`
- **Response**: Empty data with success message

### Subscriptions

#### Create Subscription
- **POST** `/api/subscriptions`
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Body**: `{ "planId": "plan_id_here" }`
- **Response**: Created subscription

#### Get User's Subscription
- **GET** `/api/subscriptions/:userId`
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Response**: Active subscription details

#### Update Subscription
- **PUT** `/api/subscriptions/:userId`
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Body**: `{ "planId": "new_plan_id_here" }`
- **Response**: Updated subscription

#### Cancel Subscription
- **DELETE** `/api/subscriptions/:userId`
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Response**: Empty data with success message

#### Check Expired Subscriptions (Admin only)
- **GET** `/api/subscriptions/check-expired`
- **Headers**: `Authorization: Bearer ADMIN_JWT_TOKEN`
- **Response**: List of subscriptions that were expired

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

## License

MIT