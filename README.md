# 🩺 MediVault

> Unified Personal Health Record & Secure Medical Data Sharing Platform.



## 📌 Overview

Healthcare data is often fragmented across hospitals, labs, diagnostic centers, and personal files. This makes it difficult for patients to quickly access records, share accurate history, and make timely care decisions.

**MediVault** solves this by giving users one secure place to:
- Store and organize medical records
- Access history anytime
- Share selected data safely with doctors or caregivers

### Why it matters
- ⏱ Reduces time spent searching for reports during emergencies
- 🧾 Improves continuity of care with complete health history
- 🔐 Gives users control over who can access what data

---

## ✨ Features

- 🔒 **Secure Medical Record Storage**  
  Store prescriptions, lab reports, scans, and visit summaries in one place.

- 💾 **Local Storage Support**  
  Preserve records locally for fast access and offline-friendly workflows.

- 🔎 **Smart Search & Filtering**  
  Quickly find records by name, category, doctor, date, or tags.

- 📤 **Secure Sharing via Link/QR**  
  Share selected records using generated links or QR codes for quick clinical handoff.

- 📊 **Dashboard & Health Insights**  
  Visual summaries of medical history, recent activity, and key health trends.

- 🗂 **Structured Record Management**  
  Organize files with categories and metadata for clean, scalable record handling.

---

## 🧰 Tech Stack

| Layer | Technologies |
|------|------|
| **Frontend** | React, TypeScript, Vite |
| **UI / Styling** | Tailwind CSS, Shadcn UI |
| **State & Data** | TanStack React Query, React Hook Form, Zod |
| **Charts & Visuals** | Recharts, Framer Motion |
| **Tooling** | ESLint, Vitest |

> Note: This repository currently focuses on the frontend experience and local-first data handling.

---

## 🎥 Demo

- 🌐 **Live Demo:** [Coming Soon](https://example.com)
- 📹 **Walkthrough Video:** [Coming Soon](https://example.com)

### Screenshots

> Replace these placeholders with real screenshots from your app.

1. **Dashboard Overview**  
   `docs/screenshots/dashboard.png`

2. **Record Upload & Management**  
   `docs/screenshots/records.png`

3. **QR / Link Sharing Flow**  
   `docs/screenshots/share.png`

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+  
- npm 9+

### 1) Clone the repository

```bash
git clone https://github.com/your-username/medivault.git
cd medivault
```

### 2) Install dependencies

```bash
npm install
```

### 3) Start development server

```bash
npm run dev
```

App runs at: `http://localhost:8080`

### 4) Build for production

```bash
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

### 6) Run tests

```bash
npm run test
```

---

## 🗂 Project Structure

```text
MediVault/
├── public/                # Static assets
├── src/                   # Application source code
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-level screens
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and shared logic
│   ├── styles/            # Global and scoped styling
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles and design tokens
├── index.html             # Root HTML template
├── package.json           # Scripts and dependencies
└── vite.config.ts         # Build and dev server configuration
```

### Important directories
- `src/components` → UI building blocks
- `src/pages` → feature screens (dashboard, records, share flow)
- `src/lib` → shared helpers, constants, and utilities

---

## ⚙️ How It Works

1. **Upload** 📥  
   User uploads medical files and attaches metadata (type, date, physician, notes).

2. **Store** 🗃️  
   Records are stored and indexed for quick retrieval.

3. **View & Manage** 🧭  
   Users browse a unified timeline/dashboard with search and filters.

4. **Share Securely** 🔗  
   Selected records are shared via time-bound links or QR-based access.

---

## 🔐 Security & Privacy Approach

MediVault is built with a **privacy-first mindset**:

- Data access is controlled by the user
- Sharing is scoped to selected records only
- Security checks and validation are applied on input flows
- Designed to support encryption and expiring share links in production deployments

> For production use, add server-side authentication, encrypted at-rest storage, audit logs, and compliance controls.

---

## 🛣 Future Improvements

- 🤖 **AI Health Assistant** for report summarization and risk flagging
- ☁️ **Cloud Sync & Backup** with encrypted multi-device support
- ⛓ **Blockchain-backed Audit Trails** for tamper-evident access logs
- 📱 **Mobile App** (iOS/Android) for on-the-go record access
- 🧬 **Interoperability Integrations** (FHIR/HL7 compatible adapters)

---

## 👥 Team / Author

### Core Contributors
- **Rahul**   — Backend
- **Subha**   — Frontend
- **Mitali**  — UI/UX
- **Soumili** — Deployment


### Want to contribute?
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---


Feel free to use, modify, and distribute with attribution.
