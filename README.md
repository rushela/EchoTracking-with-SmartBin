# Echo Tracking with SmartBin

A full-stack recycling-center management platform with real-time SmartBin tracking, educational modules, and community features.

---

## 📋 Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Getting Started](#getting-started)  
   1. [Prerequisites](#prerequisites)  
   2. [Environment Variables](#environment-variables)  
   3. [Installation](#installation)  
   4. [Running Locally](#running-locally)  
5. [API Endpoints](#api-endpoints)  
6. [Folder Structure](#folder-structure)  
7. [License](#license)  

---

## 🧐 Overview

**Echo Tracking with SmartBin** is a MERN-style application designed to help recycling centers monitor and manage collection logistics.  
- **SmartBin** IoT integration lets you track fill-levels in real time via Socket.IO.  
- **Admin portal** to register drivers, trucks, and bins.  
- **User portal** with authentication (JWT), educational content, community forum, and quizzes to engage stakeholders.  

---

## ✨ Features

- **Real-time bin updates** via WebSockets  
- **Driver & truck management** (register, edit, remove)  
- **SmartBin registration** and status monitoring  
- **User auth & roles** (signup, login, protected routes)  
- **Education module** (view courses, materials)  
- **Forum** (post, comment, discuss)  
- **Quiz engine** (create & take quizzes)  

---

## 🛠 Tech Stack

| Layer          | Technology                |
| -------------- | ------------------------- |
| **Backend**    | Node.js · Express · MongoDB · Mongoose · Socket.IO · Multer · JWT · dotenv |
| **Frontend**   | React · Vite · Chakra UI · Framer Motion · React Router · Axios · jsPDF · XLSX |
| **Realtime**   | Socket.IO                 |
| **Deployment** | Vercel / Heroku / DigitalOcean  |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (≥16.x) & **npm**  
- **MongoDB** (local or hosted URI)  

### Environment Variables

Create a `.env` in the **backend** directory:

```dotenv
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
