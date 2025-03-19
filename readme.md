# HandsOn Backend

## 📌 Project Overview
HandsOn is a social volunteering platform where users can:
- Create an account and manage their profile.
- Create, edit, and delete posts and comments.
- Organize and manage events.
- Show interest or withdraw interest in events.
- Authenticate securely using JWT.

The backend is built using **Node.js** and **MongoDB**, following the REST API architecture.

---

## 📌 Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Token)
- **Security:** Helmet, CORS, Express Rate Limit, XSS Clean, Express-Mongo-Sanitize
- **Environment Management:** dotenv

---

## 📌 Setup Instructions

### 1️⃣ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB](https://www.mongodb.com/)

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/handsOn-backend.git
cd handsOn-backend
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES=your_time
```

### 5️⃣ Start the Server
For production:
```sh
npm start
```
For development (hot-reloading enabled):
```sh
npm run dev
```

---

## 📌 API Documentation
📖 **Check Full API Documentation:** [Postman Collection](https://documenter.getpostman.com/view/39944898/2sAYkEqztp)

## 📌  Database Schema

### 🏷️ User Collection
| Field     | Type     | Description |
|-----------|---------|-------------|
| `_id`     | ObjectId | Unique identifier |
| `name`    | String   | User's full name |
| `email`   | String   | Unique email address |
| `password`| String   | Hashed password |
| `skills`  | Array of Strings | User skills |
| `causes`  | Array of Strings | Causes the user supports |
| `createdAt` | Date  | Timestamp |

### 📝 Post Collection
| Field      | Type     | Description |
|------------|---------|-------------|
| `_id`      | ObjectId | Unique identifier |
| `title`    | String   | Post title |
| `description` | String | Post content |
| `level`    | String   | Difficulty level |
| `postedBy` | ObjectId (ref: User) | User who created the post |
| `comments` | Array of ObjectId (ref: Comment) | Comments on the post |
| `createdAt` | Date  | Timestamp |

### 💬 Comment Collection
| Field      | Type     | Description |
|------------|---------|-------------|
| `_id`      | ObjectId | Unique identifier |
| `text`     | String   | Comment text |
| `postedBy` | ObjectId (ref: User) | User who made the comment |
| `post`     | ObjectId (ref: Post) | Post the comment belongs to |
| `createdAt` | Date  | Timestamp |

### 📅 Event Collection
| Field        | Type     | Description |
|-------------|---------|-------------|
| `_id`       | ObjectId | Unique identifier |
| `title`     | String   | Event title |
| `description` | String | Event details |
| `date`      | Date     | Event date |
| `time`      | String   | Event time |
| `location`  | String   | Event venue |
| `category`  | String   | Event category |
| `createdBy` | ObjectId (ref: User) | User who created the event |
| `interestedUsers` | Array of ObjectId (ref: User) | Users interested in the event |
| `createdAt` | Date  | Timestamp |


## 📌 Running in Production

###  Start the Server
For production:
```sh
npm start
```
For development (hot-reloading enabled):
```sh
npm run dev
```
---



Feel free to contribute or raise an issue! 🚀
