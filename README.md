# 🌸 E-Dairy: Inner Sanctuary

Welcome to **E-Dairy**, your private, secure, and aesthetically pleasing digital sanctuary. Designed for those who value reflection and privacy, E-Dairy allows you to record your most precious moments with ease, whether in English or Telugu.

---

## ✨ Key Features

- **🔒 End-to-End Privacy**: All your diary entries are encrypted using **AES-256-GCM** before being stored safely in the database.
- **🇮🇳 Native Language Support**: Built-in **Telugu-to-English transliteration** (using Google Transliterate API) lets you express yourself naturally.
- **🎭 Mood Tracking**: Assign moods to your entries (Joy, Peace, Love, Deep, Calm) to visualize your emotional journey.
- **📅 Visual Archive**: A beautiful, interactive calendar view to navigate through your personal history.
- **📱 Fully Responsive**: A premium, mobile-first design built with **Framer Motion** for smooth, buttery animations.
- **🖼️ Image Integration**: Capture memories with words and images (via Cloudinary integration).

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Encryption**: Standard AES-256-GCM

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Janipalli-Teja/Personal-Edairy.git

# Navigate to the directory
cd Personal-Edairy

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
ENCRYPTION_KEY=your_32byte_hex_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to enter the sanctuary.

---

## 📂 Project Structure

- `src/app`: Application routes and API endpoints.
- `src/components`: Reusable UI components and logic (TransliteratedTextArea, Modal, etc.).
- `src/lib`: Core logic including encryption, database connection, and auth config.
- `src/models`: Mongoose schemas for Users and Entries.
- `src/hooks`: Custom React hooks (transliterator, etc.).

---

## 📄 License
This project is for personal use as a secure diary application. 
Developed with ❤️ by Janipalli Teja.
