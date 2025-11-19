# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Project Details :-

📌 Pixisphere – Frontend Assignment

A modern, responsive React-based web application that helps users discover and explore professional photographers.
This project was built as part of a frontend developer assignment using React, Vite, and JSON Server for mock APIs.

Pixisphere provides a seamless browsing experience with intuitive search, filtering, sorting, pagination, detailed profile pages, and a smooth inquiry workflow.

🚀 Live Features Overview
✔ Search Photographers (A)

Real-time search with debounce

URL-synced search query (?q=...) for shareable results

Highlighting of matched text (name, tags, styles, bio)

Smart fuzzy matching algorithm

✔ Filters – Location, Price, Styles, Ratings (B)

Multi-select filters with instant updates

Combined filtering logic

Clear “Reset Filters” button

Responsive sidebar design

✔ Sorting & Pagination (C)

Sort by relevance, price, rating, or recent

Smooth client-side pagination with “Load More”

Maintains filters + search across pages

✔ Photographer Profile Page (D)

Large profile header card

Photographer details: ratings, pricing, location, bio

Portfolio grid gallery

Reviews section

Fully responsive layout

✔ Inquiry Modal (E)

Polished, centered modal rendered via React Portals

Form validation (name, email, message)

Smooth “sending…” animation

Success toast notification

🛠️ Tech Stack
Frontend :- 
React 18
React Router DOM
Vite

Modern CSS utility classes

Custom utility classes for layout (container, card, btn, etc.)

Backend (Mock API)

JSON Server

db.json containing photographers, portfolio images, reviews

Others

React Portal for modal + toast

Debounced search

Semantic & accessible HTML structure

📂 Folder Structure
pixisphere/
│── src/
│   ├── api/
│   │   └── api.js
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── CategoryPage.jsx
│   │   └── ProfilePage.jsx
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
│── public/
│── db.json
│── package.json
│── vite.config.js
│── README.md

⚙️ Installation & Setup
1. Clone the repo
git clone https://github.com/username/pixisphere.git
cd pixisphere

2. Install dependencies
npm install

3. Start mock backend (JSON Server)
npm run dev-server


If your script name is different:

json-server --watch db.json --port 4000

4. Start frontend
npm run dev

5. Open your browser
http://localhost:5173

🌐 API Endpoints
GET All Photographers
GET /photographers

GET Photographer by ID
GET /photographers/:id

Search / Filter / Sort

All handled client-side using the full dataset from:

GET /photographers

🎨 UI/UX Highlights

Clean layouts using cards, grids, consistent spacing

Fully responsive on mobile, tablet, desktop

Smooth animations + clean hover states

Modal and toast system built using React portals

Professional, minimalistic color palette

🧠 Key Concepts Demonstrated

Advanced React component architecture

URL-based search state management

Custom filtering + sorting algorithms

Complex state management without Redux

Controlled forms with validation

React Portals & high-level UI behavior

Clean code structure & reusable UI utilities

📝 Future Improvements (Optional)

Authentication (Login/Signup)

Photographer booking calendar

User reviews submission

Backend integration with real APIs

Image optimization & lazy loading

🙋 Author

Ashraf Hussain Siddiqui
Frontend Developer – React / JavaScript
Email: ashrafhussain2265@gmail.com

GitHub: https://github.com/ashraf-git-projects

🎉 Thank You!

Feel free to explore the project, review the code, and test all features. This assignment focuses on clarity, responsiveness, clean UX, and maintainable React code.

If you have any questions or suggestions, I’d be happy to discuss them!