# E-Dairy Project Structure

Since this is a **Next.js** application, there is no single `app.ts` file. Instead, the entry point and routing are handled by the file system inside the `src/app` directory.

## 🚀 How the App Starts
1. **Entry Point**: The server starts with `npm run dev`.
2. **The Shell**: `src/app/layout.tsx` is the global container that wraps every page. It handles fonts, global styles, and the authentication provider.
3. **The Landing Page**: `src/app/page.tsx` is what you see first at `http://localhost:3000`.

---

## 📂 Key Directories

### 1. `src/app/` (The Router)
Every folder here represents a URL path:
- `/` → `page.tsx` (Landing Page)
- `/login` → `login/page.tsx`
- `/dashboard` → `dashboard/page.tsx` (Your Memories list)
- `/dashboard/new` → `dashboard/new/page.tsx` (Editor for new memories)
- `/dashboard/view/[id]` → `dashboard/view/[id]/page.tsx` (Reader for a specific memory)

### 2. `src/app/api/` (The Backend)
These are your server routes. They handle database operations:
- `api/entries/route.ts`: Create and list diary entries.
- `api/entries/[id]/route.ts`: View, Edit, or Delete a specific entry.

### 3. `src/lib/` (The Brain)
- `db.ts`: Connection to MongoDB.
- `encryption.ts`: The AES-256-GCM logic that keeps your diary secret.
- `models/Entry.ts`: The database schema for a diary entry.

### 4. `src/components/` (UI Parts)
- `TransliteratedTextArea.tsx`: The heart of the editor that handles English-to-Telugu typing.

---

## 🛠️ Data Flow
1. **User types** into `TransliteratedTextArea`.
2. **Client-side** logic in `NewEntry` page encrypts the text (optional/backend handled).
3. **API Route** receives the request, **encrypts** the content using `encryption.ts`, and saves it to **MongoDB**.
4. When **Viewing**, the API fetches the scrambled data, **decrypts** it using your `ENCRYPTION_KEY`, and sends the readable text back to the dashboard.

---

## �️ The Mental Model: Two Houses vs. One Mansion

### Traditional MERN (Two Houses)
Imagine you have two separate houses on different streets:
- **House A (Frontend)**: Where the beautiful UI lives.
- **House B (Backend)**: Where the secret safe and database live.
- To share anything, you must build an expensive **Phone Line (API)** between them. You need two sets of keys, two different bills, and you have to translate messages constantly.

### Next.js (One Mansion)
E-Dairy is a single large mansion:
- **Upstairs**: The beautiful rooms where you write (Pages/Components).
- **Downstairs**: The basement where the "Pipes" and "Vaults" live (API Routes/DB).
- They share the same walls, the same security, and the same power. If the writer upstairs needs a secret from the vault, they just walk down the internal staircase.

---

## �🆚 Next.js vs. Traditional MERN Stack

If you are used to the MERN stack (MongoDB, Express, React, Node), here is how E-Dairy is different:

| Feature | Traditional MERN | E-Dairy (Next.js) |
| :--- | :--- | :--- |
| **Project Setup** | Two separate apps (Client + Server) with two `package.json` files. | **Unified Codebase**: Frontend and Backend live in one project. |
| **Routing** | Handled by `react-router-dom` on frontend and `Express` on backend. | **File-System Routing**: Folders in `src/app` automatically create URLs. |
| **API Calls** | You usually call `http://localhost:5000/api`. | **Internal API**: You call `/api/entries` without needing a port number. |
| **Server** | You run a separate Node/Express server on a different port. | **Serverless/Runtime**: Next.js handles server logic automatically during `npm run dev`. |
| **Performance** | CSR (Client-Side Rendering) only. Starts with a blank white screen. | **SSR (Server Rendering)**: Initial page loads are faster and better for SEO. |

**In short**: E-Dairy is much simpler to manage because Next.js bridges the gap between the "React frontend" and "Node backend" into a single, cohesive system.
