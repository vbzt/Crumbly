<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo"/></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
# 🥐 Crumbly - A NestJS Backery API

## What is Crumbly?

Crumbly is a backend API for a Bakery management system, built with NestJS, PrismaORM, and MySQL. It handles user authentication, stock management, sales, and order tracking for bakery businesses.

## Technologies Used

- **NestJS**: Framework for building efficient, scalable Node.js applications.
- **PrismaORM**: ORM for interacting with the database (MySQL).
- **MySQL**: Database used to store the application data.
- **Resend API**: For sending email notifications.


## How to Run the Project Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/vbzt/Crumbly.git
   cd Crumbly
   ``` 

2. Set up your `.env` file:
   ```env
   DATABASE_URL="mysql://<username>:<password>@localhost:3306/bakery"
   RESEND_API_KEY="YOUR_RESEND_API_KEY"
   JWT_SECRET="your_jwt_secret"
   ``` 

3. Install all dependencies:
   ```bash
   npm i
   ```

4. Run the Prisma migration:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available on `http://localhost:3000` by default.

## Endpoints

### AUTH

- **POST** `/login`
  - **Body:**
    ```json
    {
      "email": "manager@crumbly.com",
      "password": "manager123"
    }
    ```
  - **Response:**
    ```json
    {
      "accessToken": "your-jwt-token",
      "message": "Login successful"
    }
    ```

- **POST** `/register`
  - **Body:**
    ```json
    {
      "name": "employee",
      "email": "employee@email.com",
      "phone": "1199999999",
      "password": "A123456@",
      "confirmPassword": "A123456@",
      "role": "STOCKER"
    }
    ```
  - **Response:**
    ```json
    {
      "accessToken": "your-jwt-token",
      "message": "Employee registered successfully"
    }
    ```

- **POST** `/forgot`
  - **Body:**
    ```json
    {
      "email": "employee@email.com"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "A confirmation email was sent to your manager. Wait until their approval."
    }
    ```

- **POST** `/reset/:token`
  - **Body:**
    ```json
    {
      "email": "employee@email.com",
      "password": "A123456@",
      "confirmPassword": "A123456@"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "Employee1",
      "phone": "11974535821",
      "email": "employee1@email.com",
      "role": "CASHIER",
      "password": "hashed-password"
    }
    ```

### Employees

- **POST** `/`
  - **Body:**
    ```json
    {
      "name": "employee",
      "email": "employee@email.com",
      "phone": "1199999999",
      "password": "A123456@",
      "role": "STOCKER"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "employee",
      "phone": "119999999",
      "email": "employee@email.com",
      "role": "STOCKER"
    }
    ```

- **DELETE** `/:id`
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "employee",
      "phone": "119999999",
      "email": "employee@email.com",
      "role": "STOCKER"
    }
    ```

- **PATCH** `/:id`
  - **Body:**
    ```json
    {
      "name": "Employee1",
      "email": "employeeEdit@email.com"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "Employee1",
      "email": "employeeEdit@email.com",
      "phone": "11999999999",
      "role": "STOCKER"
    }
    ```

- **GET** `/`
  - **Optional Query:** `role`
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "name": "manager",
        "email": "manager@crumbly.com",
        "phone": "1199999999",
        "role": "MANAGER"
      },
      {
        "id": 2,
        "name": "employee",
        "email": "employee@email.com",
        "phone": "11999999997",
        "role": "STOCKER"
      }
    ]
    ```

- **GET** `/:id`
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "manager",
      "email": "manager@crumbly.com",
      "phone": "1199999999",
      "role": "MANAGER"
    }
    ```

### Stock

- **POST** `/`
  - **Body:**
    ```json
    {
      "name": "Orange Juice",
      "price": 11.99,
      "category": "Beverages",
      "amount": 150,
      "unitOfMeasurement": "l"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 2,
      "name": "Orange Juice",
      "price": 11.99,
      "category": "Beverages",
      "amount": 150,
      "unitOfMeasurement": "l",
      "createdAt": "2025-04-28T01:12:44.000Z",
      "updatedAt": "2025-04-28T01:12:44.000Z"
    }
    ```

- **PATCH** `/:id`
  - **Body:**
    ```json
    {
      "name": "Strawberry Juice"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "Strawberry Juice",
      "price": 11.99,
      "category": "Beverages",
      "amount": 150,
      "unitOfMeasurement": "l",
      "createdAt": "2025-04-28T01:10:09.000Z",
      "updatedAt": "2025-04-28T01:10:09.000Z"
    }
    ```

- **DELETE** `/:id`
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "Strawberry Juice",
      "price": 11.99,
      "category": "Beverages",
      "amount": 150,
      "unitOfMeasurement": "l",
      "createdAt": "2025-04-28T01:10:09.000Z",
      "updatedAt": "2025-04-28T01:10:09.000Z"
    }
    ```

- **GET** `/`
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "name": "Strawberry Juice",
        "price": 11.99,
        "category": "Beverages",
        "amount": 150,
        "unitOfMeasurement": "l",
        "createdAt": "2025-04-28T01:10:09.000Z",
        "updatedAt": "2025-04-28T01:10:09.000Z"
      }
    ]
    ```

- **GET** `/:id`
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "Strawberry Juice",
      "price": 11.99,
      "category": "Beverages",
      "amount": 150,
      "unitOfMeasurement": "l",
      "createdAt": "2025-04-28T01:10:09.000Z",
      "updatedAt": "2025-04-28T01:10:09.000Z"
    }
    ```

### Tabs

- **POST** `/`
  - **Body:**
    ```json
    {
      "employeeId": 3,
      "status": "OPEN"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 2,
      "employeeId": 3,
      "status": "OPEN",
      "createdAt": "2025-04-28T01:16:30.000Z",
      "updatedAt": "2025-04-28T01:16:30.000Z"
    }
    ```

- **POST** `/:id/items`
  - **Body:**
    ```json
    {
      "productId": 1,
      "quantity": 1
    }
    ```
  - **Response:**
    ```json
    {
      "newItem": {
        "id": 1,
        "tabId": 2,
        "productId": 1,
        "quantity": "1"
      },
      "tab": {
        "id": 2,
        "employeeId": 3,
        "status": "OPEN",
        "createdAt": "2025-04-28T01:16:30.000Z"
      }
    }
    ```

- **PATCH** `/close/:id`
  - **Response:**
    ```json
    {
      "tab": {
        "id": 2,
        "status": "CLOSED"
      },
      "tabItems": [
        {
          "productId": 3,
          "quantity": "1"
        }
      ]
    }
    ```

- **PATCH** `/cancel/:id`
  - **Response:**
    ```json
    {
      "id": 3,
      "status": "CANCELLED",
      "closedAt": "2025-04-28T01:22:05.000Z"
    }
    ```

- **GET** `/`
  - **Response:**
    ```json
    [
      {
        "id": 2,
        "status": "CLOSED"
      }
    ]
    ```

- **GET** `/:id`
  - **Response:**
    ```json
    {
      "id": 2,
      "status": "CLOSED"
    }
    ```

### Sales

- **POST** `/`
  - **Body:**
    ```json
    {
      "tabId": 2
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Sale registered successfully.",
      "sale": {
        "id": 1,
        "employeeId": 3,
        "totalPrice": "11.99",
        "totalItems": 1,
        "tabId": 2
      }
    }
    ```

- **PATCH** `/:tabId/items/:itemId`
  - **Body:**
    ```json
    {
      "quantity": 2
    }
    ```
  - **Response:**
    ```json
    {
      "updatedSaleItem": {
        "id": 1,
        "saleId": 1,
        "productId": 3,
        "quantity": 2
      },
      "updatedSale": {
        "id": 1,
        "totalPrice": "23.98"
      }
    }
    ```

- **DELETE** `/:saleId/items/:productId`
  - **Response:**
    ```json
    {
      "deletedSaleItem": {
        "id": 1,
        "productId": 3
      }
    }
    ```

- **DELETE** `/:saleId`
  - **Response:**
    ```json
    {
      "deletedSale": {
        "id": 1,
        "totalPrice": "0"
      }
    }
   