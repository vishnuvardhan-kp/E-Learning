# E-Learning Management System

A comprehensive, responsive E-Learning platform frontend. This project is structured around three distinct, role-based portals configured to deliver a rich user experience utilizing fundamental React features. 

The core philosophy of this project is **Simplicity & Functionality**. All interfaces use standard React hooks (`useState`, `useEffect`) and pure CSS to ensure that the code remains approachable, cleanly readable, and highly maintainable without relying on needlessly complex architectures or heavy third-party state managers.

## 🏗 System Architecture

The frontend is divided into independent monolithic parts managed by Vite:

- **Landing Page** (`frontend/index.html`): The central entry point uniting the systems. Allows users to choose their persona before logging in.
- **Admin Portal** (`frontend/admin`): Complete oversight dashboard to moderate content, manage all registered users, visualize analytics, and broadcast global notifications.
- **Instructor Portal** (`frontend/instructor`): A specialized workspace for educators. Features tools to dynamically manage their specific list of classes, publish multi-media content, create assignments, broadcast alerts to enrolled students, and grade submissions via an interactive feedback sandbox.
- **Student Portal** (`frontend/student`): The core learner hub. Students can browse and dynamically enroll in courses, view interactive learning materials (tracking 'Read' statuses), upload assignments natively, share peer notes, and track their mathematical progress dynamically.

## 🚀 Key Features Built Without Complex Dependencies
- **Dynamic State Sharing**: Course data, enrollments, and status updates are managed safely by propagating simple state updates across local components.
- **Role-Based Authentication Mocks**: Each portal securely mocks an isolated login and authentication guard.
- **Local File Handing Methods**: Integrated file uploads (like submitting PDFs or mock presentations) bypass standard server requirements using native browser URL data object logic.

## 💻 Running the Project Locally

Because the platform uses a decoupled micro-frontend approach, each portal runs on its own local development server:

### 1. Instructor Portal
```bash
cd frontend/instructor
npm install
npm run dev
```

### 2. Student Portal
```bash
cd frontend/student
npm install
npm run dev
```

### 3. Admin Portal
```bash
cd frontend/admin
npm install
npm run dev
```

### 4. Application Entry
Finally, to seamlessly navigate between these portals, simply open `frontend/index.html` in your web browser. This acts as the centralized gateway linking to the respective localhost ports assigned by Vite.

---

*End of Documentation*