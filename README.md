# Meeting Room Booking System for Co-working spaces 💻
This project is an Express backend application built with TypeScript and Mongoose for an agency that  offers co-working spaces for meetings
and discussions. It provides an efficient system for room reservation management along with robust validation and error handling mechanisms 
to enhance the application's reliability. Users receive informative messages in case of booking conflicts or validation errors, guiding them
towards successful interactions with the platform.

## Table of Contents 📝
- [**Necessary Links**](#necessary-links)
- [**Features**](#features)
- [**Getting Started**](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [**Usage**](#usage)
- [**API Endpoints**](#api-endpoints)
- [**Project Structure**](#project-structure)
- [**Technologies Used**](#technologies-used)
- [**Contact**](#contact)

## Necessary Links 🔗
[![Live Server Link](https://img.shields.io/badge/Live_Server_Link-blue)](https://vercel.com/sattarabdussattar23gmailcoms-projects)
[![Project Overview Video](https://img.shields.io/badge/Project_Overview_Video_Link-red)](https://vercel.com/sattarabdussattar23gmailcoms-projects)
[![Requirement Analysis Doc](https://img.shields.io/badge/Requirement_Analysis_Doc-green)](https://vercel.com/sattarabdussattar23gmailcoms-projects)
[![ER-Diagram](https://img.shields.io/badge/ER_Diagram-yellow)](https://vercel.com/sattarabdussattar23gmailcoms-projects)

## Features ✨
- Authentication & Authorization
- Administrative controls to create, update or delete rooms.
- Facilities for creating slots and allowing admins to effectively manage the co-working space inventory and slot availability.
- Users can create bookings by selecting from the available time slots for their desired meeting times.
- Users receive real-time feedback on the availability of rooms and slots.
- Robust validation and error handling mechanisms implemented in case of booking conflicts or validation errors.

## Getting Started 🚀
### Prerequisites 📋
Before you begin, please ensure you have the follwoing dependencies installed:
```bash
Node.js (v20.11.0 or later)
npm (v20.11.0 or later)
```
### Installation 🛠️
1. Clone the repository:
 ```bash
 git clone https://github.com/safia-nusrat-official/meeting-room-booking-system.git
 ```
2. Move to *meeting-room-booking-system* :
```bash
cd meeting-room-booking-system
```
3. Install the depecdencies:
```bash
 npm install
 ```

### Configuration ⚙️
1. In the root directory of your project, create a .env file and add the following configuration variables:
```env
PORT=5000
DB_URL=mongodb+srv://sattarabdussattar23:1RAiQp4Pr585Ryzm@learning-mongoose.3blupmm.mongodb.net/assignment-3?retryWrites=true&w=majority&appName=learning-mongoose
NODE_ENV=development
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=b60ba0d876aaab06b0ea11f589dd207c
```

## Usage 📖
1. To run the development server, hit:
```bash
npm run dev
```
Your server is running on [http://localhost:5000](http://localhost:5000) .

## API Endpoints 🌐
Here is a list of the API Endpoints:
### Auth Routes
  1. **Register new User:**
     - *Route:* **POST** `/api/auth/signup`
     - *Request Body:*
```json
  {
    "name": "Your name",
    "email": "your.name@email.com",
    "password": "yourPassword$123",
    "phone": "1234567890",
    "role": "admin",
    "address": "your street no., your city, your country"
  }
```
  _N.B. `role` can either be `admin` or `user`_

  2. **User Login:**
     - *Route:* **POST** `/api/auth/login`
     - *Request Body:*
  ```json
    {
      "email": "your.name@email.com",
      "password": "yourPassword$123"
    }
  ```

### Room Routes
  1. **Create a Room ( _Admin accessible only_ ):**
     - *Route:* **POST** `/api/rooms/`
     - *Request Headers:*
```bash
Authorization: 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmF
tZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
  _N.B. Don't forget to include the access token in request headers!_

  - *Request Body:*
```json
  {
    "name": "Conference Room",
    "roomNo": 201,
    "floorNo": 1,
    "capacity": 20,
    "pricePerSlot": 100,
    "amenities": ["Projector", "Whiteboard"]
  }
```
  2. Get a Room:
     - *Route:* **GET** `/api/rooms/:id`
  3. Get all Rooms:
     - *Route:* **GET** `/api/rooms/`
 
 _**N.B:** Did you know you can perform search, filter, sort operations on the result via query parameters?😋_
 
 _Try it out! `/api/rooms?capacity=20&searchTerm=Conference&sort=-pricePerSlot`_
 
  4. **Update Room ( _Admin accessible only_ ):**
       - *Route:* **PUT** `/api/rooms/:id`
       - *Request Headers:*
```bash
Authorization: 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmF
tZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
  - *Request Body:*
```json
  {
    "pricePerSlot": 300
  }
```
  5. **Delete a Room ( _Admin accessible only_ ):**
     - *Route:* **DELETE** `/api/rooms/:id`
     - *Request Headers:*
```bash
Authorization: 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmF
tZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Slot Routes
  1. **Create slots ( _Admin accessible only_ ):**
     - *Route:* **POST** `/api/slots/`
     - *Request Headers:*
```bash
Authorization: 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmF
tZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
  - *Request Body:*
```json
  {
    "room": "60d9c4e4f3b4b544b8b8d1c5",
    "date": "2024-06-15",
    "startTime": "09:00",
    "endTime": "14:00"
  }  
```
  2. Get all available slots:
     - *Route:* **GET** `/api/slots/availability`
     _N.B: You can use query params like `/api/slots/availability?date=2024-06-16` and othehrs to filter slots_

### Booking Routes
  1. **Create a Booking ( _Admin accessible only_ ):**
     - *Route:* **POST** `/api/bookings/`
     - *Request Headers:*
```bash
Authorization: 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmF
tZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
  - *Request Body:*
```json
  {
    "date": "2024-06-15",
    "slots": ["60d9c4e4f3b4b544b8b8d1c6", "60d9c4e4f3b4b544b8b8d1c7"],
    "room": "60d9c4e4f3b4b544b8b8d1c5",
    "user": "60d9c4e4f3b4b544b8b8d1c4"
  }
```
  2. **Get your Bookings ( _Admin accessible only_ ):**
     - *Route:* **GET** `/api/my-bookings`
  3. **Get all Bookings of all Users ( _Admin accessible only_ ):**
     - *Route:* **GET** `/api/rooms/`
     - *Request Headers:*
```bash
Authorization: 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmF
tZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
  4. **Update Booking Status ( _Admin accessible only_ ):**
       - *Route:* **PUT** `/api/bookings/:id`
       - *Request Headers:*
```bash
Authorization: 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmF
tZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
  - *Request Body:*
```json
  {
    "isConfirmed": "confirmed"
  }
```
  5. **Delete a Booking ( _Admin accessible only_ ):**
     - *Route:* **DELETE** `/api/bookings/:id`
     - *Request Headers:*
```bash
Authorization: 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmF
tZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

_**N.B:** Keep exploring many other routes 😺_

## Project Structure 📂
This project follows Modular structure to ensure scalability, flexibility and maintainability, allowing easier management of code and better
organization. Each module encapsulates a specific feature of the application, such as, room, booking and slot managmanagement. The main
components of the project structure are:
```
meeting-room-booking-system/
├── src/
│   ├── app/
│   |   ├── builder/
│   |   |   ├── QueryBuilder.ts
│   |   ├── config/
│   |   |   ├── index.ts
│   |   ├── errors/
│   |   |   ├── AppError.ts
│   |   |   ├── handleCastError.ts
│   |   |   ├── handleDuplicateKeyError.ts
│   |   |   ├── handleValidationError.ts
│   |   |   ├── handleZodError.ts
│   |   ├── interfaces/
│   |   |   ├── errors.interface.ts
│   |   |   ├── index.d.ts
│   |   ├── middlewares/
│   |   |   ├── auth.ts
│   |   |   ├── validateRequest.ts
│   |   |   ├── globalErrorHandler.ts
│   |   |   ├── notFoundErrorHandler.ts
│   |   ├── routes/
│   |   |   ├── index.ts
│   |   ├── utils/
│   |   |   ├── catchAsync.ts
│   |   |   ├── sendResponse.ts
│   |   ├── modules/
│   |   |   ├── auth/
│   |   |   |   ├── auth.interface.ts
│   |   |   |   ├── auth.model.ts
│   |   |   |   ├── auth.constants.ts
│   |   |   |   ├── auth.validations.ts
│   |   |   |   ├── auth.controllers.ts
│   |   |   |   ├── auth.services.ts
│   |   |   |   ├── auth.routes.ts
│   |   |   ├── booking/
│   |   |   |   ├── booking.interface.ts
│   |   |   |   ├── booking.model.ts
│   |   |   |   ├── booking.constants.ts
│   |   |   |   ├── booking.validations.ts
│   |   |   |   ├── booking.controllers.ts
│   |   |   |   ├── booking.services.ts
│   |   |   |   ├── booking.routes.ts
│   |   |   ├── room/
│   |   |   |   ├── room.interface.ts
│   |   |   |   ├── room.model.ts
│   |   |   |   ├── room.constants.ts
│   |   |   |   ├── room.validations.ts
│   |   |   |   ├── room.controllers.ts
│   |   |   |   ├── room.services.ts
│   |   |   |   ├── room.routes.ts
│   |   |   ├── slot/
│   |   |   |   ├── slot.interface.ts
│   |   |   |   ├── slot.model.ts
│   |   |   |   ├── slot.utility.ts
│   |   |   |   ├── slot.validations.ts
│   |   |   |   ├── slot.controllers.ts
│   |   |   |   ├── slot.services.ts
│   |   |   |   ├── slot.routes.ts
│   ├── app.ts
│   ├── server.ts
├── eslint.config.json
├── .prettierrc.json
├── .eslintignore
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Technologies Used 💻
- Web-framework: **[Express.Js](https://expressjs.com/)**
- Programming Language: **[Typescript](https://www.typescriptlang.org/)**
- Object Data Modeling: **[Mongoose](https://mongoosejs.com/)**
- Database: **[MongoDB](https://www.mongodb.com/)**
- Validation Library: **[Zod](https://zod.dev/)**
- Authentication: **[JWT](https://jwt.io/)**
- Formatters: **[ESLint](https://eslint.org/)**, **[Prettier](https://prettier.io/)**
  
## Contact 📞
For any enquires or issues related installation, please reach out to us at _safia.nusrat.official@gmail.com_
We welcome yor feedback and are here to guide you through your troubles and clean up any confusions. Thank you 😊!

_[Safia Nusrat](https://github.com/safia-nusrat-official)_
