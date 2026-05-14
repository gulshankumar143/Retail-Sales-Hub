# Frontend - Retail Sales Management System

## Overview

This frontend is a modern dashboard built with React, Vite, Tailwind CSS, Zustand/Context, Axios, and TanStack Table. It connects to the backend API and presents sales data with search, filtering, sorting, and pagination.

## Features

- Full-text search for customers and phone numbers
- Multi-select filters for region, gender, category, tags, and payment method
- Date range and age range filtering
- Sort options and sticky results table
- Responsive layout with sidebar and cards
- URL-synced state and debounced API calls

## Setup

1. Install dependencies: `npm install`
2. Copy `frontend/.env.example` to `.env`
3. If the backend is local, leave `VITE_API_BASE_URL` blank or set to `http://localhost:5000/api`
4. Start the app: `npm run dev`
5. Open `http://localhost:3000`

## Backend connection

- In development, Vite proxies `/api` to the backend at `http://localhost:5000`
- In production, set `VITE_API_BASE_URL` to your backend API endpoint, for example:
  `VITE_API_BASE_URL=https://api.myretailsales.com/api`
