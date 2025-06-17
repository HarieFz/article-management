# Article Management Web App – Frontend Home Test

A responsive article management application with role-based access (User & Admin), developed using Next.js (App Router), integrated with REST API, and styled using Tailwind CSS and Shadcn/UI.

## 🚀 Features

### 🔐 Authentication

- Login, Register, Logout (User & Admin)
- Redirect & validation

### 👤 User Role

- List & detail artikel
- Filter by category
- Search with debounce (300–500ms)
- Pagination (if >9 items)
- "Other articles" (max 3) from same category

### 🛠️ Admin Role

- Manage articles: list, create, edit
- Manage categories: list, create, edit
- Pagination (if >10 items)
- Search with debounce (300–500ms)

### 💎 UI & UX

- User-side is fully responsive (mobile, tablet, desktop)
- Loading states, success & error messages

## 🧰 Tech Stack

- Framework: [Next.js 15 – App Router]
- Styling: [Tailwind CSS], [Shadcn/UI]
- API Request: [Axios]
- Form & Validation: [React Hook Form], [TipTap], [Zod]
- Icons: [Lucide]
- State: [React Query / useState / Context API]

## 🧑‍💻 Getting Started

````bash
git clone https://github.com/username/project-name.git
cd project-name
npm install
npm run dev


---

#### 6. **Demo**
```md
## 🔗 Live Demo & Repository

- Live URL: [https://your-vercel-link.vercel.app](https://article-management-amber.vercel.app/)
- Repository: [https://github.com/username/project-name](https://github.com/HarieFz/article-management)

## 📝 Notes

- Logic tambahan diterapkan untuk menghandle data yang tidak tersedia dari API.
- UI/UX sudah dioptimalkan untuk berbagai ukuran layar untuk sisi User.

````
