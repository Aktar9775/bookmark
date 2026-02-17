## 🔖 Smart Bookmark App

A full-stack Smart Bookmark Manager built with Next.js App Router, Supabase, and Google OAuth, allowing users to securely manage their bookmarks with real-time synchronization across tabs and devices.

🚀 Live Demo

👉 Deployed on Vercel
https://bookmark-lilac-six.vercel.app/login

# 🧠 Problems Faced & How I Solved Them
## 1. Setting up Supabase and Google OAuth for the first time

Problem:
While integrating Google OAuth with Supabase for the first time, I faced issues like the login popup not opening and errors such as “Unsupported provider: provider is not enabled”. Understanding how Supabase, Google Cloud Console, and redirect URLs work together was initially confusing.

Solution:
I enabled the Google provider in the Supabase Authentication settings and created OAuth credentials in the Google Cloud Console. I carefully configured the authorized redirect URI to point to Supabase’s callback URL and added both local and Vercel URLs in Supabase’s redirect configuration. Testing in incognito mode helped avoid cached OAuth sessions.

## 2. Enabling real-time updates in Supabase and fixing SQL configuration

Problem:
Although bookmarks were being added and deleted correctly, the list was not updating in real time across multiple tabs. Initially, I assumed real-time worked by default, but no events were being triggered.

Solution:
I enabled Realtime replication explicitly for the bookmarks table from the Supabase dashboard. I also verified the table was part of the supabase_realtime publication using SQL. On the frontend, I fixed the realtime subscription logic and ensured proper cleanup of channels to avoid duplicate subscriptions.

## 3. Collecting and managing user details from Supabase Auth

Problem:
I needed to securely associate bookmarks with the logged-in user and ensure that users could only see their own data. Initially, handling user sessions and extracting the user ID reliably was challenging.

Solution:
I used Supabase Auth sessions to retrieve the authenticated user on the client side and stored the user_id with each bookmark. I enforced data privacy by implementing Row Level Security (RLS) policies so that all database operations were automatically restricted to the logged-in user.

## 4. Issues while deploying the application on Vercel

Problem:
After deployment, authentication redirects were pointing to localhost, and environment variables were not being picked up correctly. This caused login failures in the production environment.

Solution:
I added the correct environment variables in the Vercel dashboard and updated the OAuth redirect URLs in Supabase to include the live Vercel domain. After redeploying the project and clearing the browser cache, authentication worked correctly in production.

## 5. Designing a clean UI for better user experience

Problem:
Balancing simplicity and usability was challenging, especially while keeping the UI minimal as required. Over-designing could distract from functionality, while under-designing could affect usability.

Solution:
I used Tailwind CSS to build a clean, minimal interface focused on clarity and ease of use. The layout emphasizes quick actions (add, view, delete bookmarks) with responsive spacing and readable typography, ensuring a smooth experience without unnecessary visual complexity.

## ✅ Key Learnings

Practical understanding of OAuth authentication flow

Hands-on experience with Supabase Realtime and RLS

Debugging real production deployment issues

Building secure, user-centric full-stack applications
## 📌 Features

🔐 Google OAuth Authentication (no email/password)

👤 User-specific bookmarks (data isolation via RLS)

🔄 Real-time updates using Supabase Realtime

➕ Add bookmarks (title + URL)

🗑️ Delete bookmarks

🎨 Clean & minimal UI with Tailwind CSS

☁️ Fully deployed on Vercel

### 🧱 Tech Stack

Frontend: Next.js 14 (App Router)

Styling: Tailwind CSS

Backend & Auth: Supabase

Database: PostgreSQL

Realtime: Supabase Realtime (Postgres replication)

Deployment: Vercel


### 🧠 Application Flow

User logs in using Google OAuth

Supabase creates a secure authenticated session

User is redirected to /bookmarks

Bookmarks are:

Stored with user_id

Protected using Row Level Security (RLS)

Realtime subscriptions listen for database changes

UI updates instantly across tabs

### 🗃️ Database Schema
bookmarks table
Column	Type
id	uuid (PK)
title	text
url	text
user_id	uuid (FK → auth.users)
created_at	timestamp
### 🔐 Security (Row Level Security)

Row Level Security ensures each user can only access their own bookmarks.

Users can read only their data

Users can insert only their data

Users can delete only their data

This guarantees privacy and prevents unauthorized access at the database level.



⚙️ Environment Variables

Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

### 🧪 How to Run Locally
npm install
npm run dev


Open 👉 http://localhost:3000

### 🎯 Key Learnings

OAuth authentication flow (Google + Supabase)

Real-time systems using Postgres replication

Secure data handling with Row Level Security

Debugging real-world deployment issues

Building production-ready full-stack apps

### 📌 Future Improvements

Edit bookmarks

Bookmark tagging

Search & filtering

Optimistic UI updates

Pagination for large lists <br>

👨‍💻 Author <br>

Sohel Aktar <br>
MCA , CUH-2025 <br>
Full Stack Developer | React | Next.js | Supabase
