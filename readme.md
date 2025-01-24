
# ECOM - Product Management Application (MEAN Stack)

This is a product management application built using the MEAN stack (MongoDB, Express, Angular, Node.js). The application includes user authentication, product management, role-based access, and data pagination.

## Flow

1. **Login**: 
   - If you are not registered, sign up using the registration API.
   - After registration, log in with your credentials.
   
2. **Authorization**: 
   - Upon successful login, you will receive a **JWT token**.
   - Use the token in the Authorization header to access protected routes.

3. **Role Management**: 
   - By default, users are assigned a standard user role.
   - You can **toggle your role** to **admin** by sending a request to the `toggleRole` API.
   - Admins can access all product management features (add, edit, remove products).

4. **Product Management**:
   - **Add Product**: Admins can add new products.
   - **Edit Product**: Admins can edit existing products.
   - **Remove Product**: Admins can remove products from the list.
   - **List Products**: Both admins and regular users can list products, with paginated data fetching.

5. **User Profile**: 
   - Both admins and regular users can view their profile and information.

---

## Project Setup

### 1. Clone the Repository

Clone the repository to set up the project locally:

```bash
git clone <repository-url>
```

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
cd <project-directory>
npm install
```

### 3. Run the Application

Run the application using `nodemon` to automatically restart the server during development:

```bash
npx nodemon
```

The API will be available on `http://localhost:6001`.

---

## Features

- **JWT Authentication**: Secures routes with JSON Web Tokens for user authentication and role-based access.
- **Request Logger**: Logs incoming requests and responses for debugging and tracking.
- **File Upload**: Uses **Multer** for handling file uploads (e.g., product images).
- **MongoDB**: MongoDB is used as the database for storing product and user data.
- **Dockerized**: The application can be containerized using Docker.
- **Paginated Data Fetching**: Fetch data in paginated format for improved performance on large datasets.
- **Jest Testing**: Unit and integration tests are written with **Jest** to ensure the app’s reliability.

---

## API Documentation

### 1. **User Login**

**URL**: `POST /web/user/login`

- **Request Body**:

```json
{
  "emailId": "reshavbajaj786@gmail.com",
  "password": "resh1234"
}
```

- **Response**: Returns JWT token on success.

---

### 2. **User Registration**

**URL**: `POST /web/user/register`

- **Request Body**:

```json
{
  "name": "Reshav Gupta",
  "emailId": "reshavbajaj786@gmail.com",
  "contactNo": 7654101068,
  "password": "resh1234"
}
```

- **Response**: Success message upon successful registration.

---

### 3. **List Products**

**URL**: `GET /web/product/listAll`

- **Query Params**:
  - `limit`: Number of products per page.
  - `page`: The page number.

- **Authorization**: Bearer Token in headers.

---

### 4. **Add Product**

**URL**: `POST /web/product/add`

- **Authorization**: Bearer Token in headers.
- **Request Body**:

```json
{
  "brand": "Moto",
  "name": "Edge 40",
  "description": "World's slimmest IP68 rated smartphone",
  "price": 30000,
  "category": 1,
  "stock": 5000,
  "rating": 5,
  "status": 1
}
```

- **Response**: Success message with product details.

---

### 5. **Remove Product**

**URL**: `DELETE /web/product/remove/{productId}`

- **Authorization**: Bearer Token in headers.
- **Response**: Success or error message upon product removal.

---

### 6. **Edit Product**

**URL**: `PUT /web/product/edit/{productId}`

- **Authorization**: Bearer Token in headers.
- **Request Body**: Updated product details.

---

### 7. **Toggle User Role**

**URL**: `PUT /web/user/toggleRole`

- **Authorization**: Bearer Token in headers.
- **Request Body**:

```json
{
  "userId": "54434418025773",
  "password": "resh1234"
}
```

- **Response**: Success or error message.

---

### 8. **Show Profile**

**URL**: `GET /web/user/profile/{userId}`

- **Authorization**: Bearer Token in headers.
- **Response**: User profile details.

---

### 9. **List Users**

**URL**: `GET /web/user/list`

- **Authorization**: Bearer Token in headers.
- **Response**: List of all users.

---

## Common Issues

- **Origin Error**: If you encounter an origin error during requests from the frontend (e.g., `CORS`), add the following header to your API requests:

```http
Origin: http://localhost:4200
```

---

## Docker Setup

To run the application inside a Docker container:

1. **Build the Docker Image**:

```bash
docker build -t ecom-app .
```

2. **Run the Container**:

```bash
docker run -p 6001:6001 ecom-app
```

---

## Running Tests with Jest

To run tests with Jest:

```bash
npm run test
```

This will run all unit and integration tests to ensure everything is working properly.

---

## Contributing

Feel free to fork this repository and submit pull requests. Please follow the coding conventions and ensure that tests are added for new features.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
