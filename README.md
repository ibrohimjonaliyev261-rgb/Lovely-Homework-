# Lovely Homework! 📚❤️

**Lovely Homework!** is an educational web application and Progressive Web App (PWA) designed for teachers and students. It allows teachers to assign homework, inspect students' handwritten notebook photos, manage oral preparation ("I am ready" / "I am not ready"), share level-specific learning materials and video lessons, and host an entertaining **Fun Time** cinema with synchronized subtitles and gesture controls.

Concentrated on a clean **Red and White** aesthetic with full **Night Mode** and **4-Language Support** (English, Azerbaijani, Russian, Turkish).

---

## 🌟 Key Features

### 1. 👥 Two Roles: Teacher & Student
- **Role Selection on Welcome**: Asks *"Are you . . . ?"* with choices for **Teacher** and **Student**.
- **Teacher Master Access**: Protected by the master password: **`Aliyev`**. Multiple teachers can register and manage their own groups!
- **Student Registration & Confirmation Flow**:
  - Student enters First Name, Last Name, Level (*Beginner, Elementary, Pre-intermediate, Intermediate, IELTS Novice, IELTS Standard*), and selects their teacher.
  - Taps **'Ready'**.
  - Sees message: *"Please wait until your teacher confirms your request."*
  - The teacher receives a real-time notification with **Accept** and **Reject** buttons. Once accepted, the student is good to go!

### 2. 🎓 6 Levels & Automatic Group Graduation
- **Levels**:
  1. Beginner
  2. Elementary
  3. Pre-intermediate
  4. Intermediate
  5. IELTS Novice
  6. IELTS Standard
- Homework and Materials are separated per level.
- **Group Graduation**: Teachers can click **"Graduate the group"** at any level, automatically promoting all active students in that group to the next level!

### 3. 📝 Homework Management
- **Two Homework Types**:
  - 📄 **Written on Paper**: Students take photos of their handwritten notebooks/workbooks and upload them. Teachers can view high-resolution photos with zoom/lightbox and add feedback/grades.
  - 🗣️ **Oral**: For speaking topics and learning new vocabulary. Students have two clear interactive buttons: **"I am ready"** and **"I am not ready"**. Teachers can see live status breakdowns in their dashboard.
- **Teacher Photo Attachments**: Teachers can attach textbook page photos and exercises so students can see them when doing their homework.
- **Deadline Tracker**: Set due dates with warning tags for overdue tasks.

### 4. 📚 Materials / Video Lessons
- Organized per level.
- Supports **PDFs, Word documents (.docx), Video lessons (.mp4 / streaming links), Infographics, and Audio**.
- Teacher gives each material a name (e.g. *"Future Simple or Past simple"*).
- **Read-Only for Students**: Students can view, read, and stream materials without editing or modifying them.

### 5. 🍿 Fun Time (Movies, Cartoons, TV Series)
- Shared across all levels!
- 3 choices:
  - 🎬 **Movies**
  - 🦁 **Cartoons**
  - 📺 **TV Series**
- **Teacher Uploads**: Add video and upload a separate **Subtitle file (`.vtt` or `.srt`)**.
- **Custom Interactive Video Player**:
  - Subtitles track synchronized with video.
  - **Subtitles ON / OFF** toggle button.
  - **Double-tap gestures**:
    - Double-tap left side of the screen ➔ **Rewinds 10 seconds (-10s)** with visual ripple!
    - Double-tap right side of the screen ➔ **Fast-forwards 10 seconds (+10s)** with visual ripple!
  - Keyboard shortcuts: `Space` (Play/Pause), `Left/Right Arrow` (10s seek), `C` (Subtitles toggle), `F` (Fullscreen).

### 6. 🔔 Top-Right Notifications System
- Positioned in the top right corner of the header with an active unread badge.
- Alerts students when new homework, materials, or movies are uploaded.
- Alerts teachers when students submit homework or request registration.

### 7. 🎨 Theming & Internationalization
- **Red & White Palette**: Vibrant crimson red (`#D32F2F`), warm rose backgrounds, and crisp white cards.
- **Night Mode Toggle**: Dark charcoal/slate theme with red accents.
- **Languages**: English 🇬🇧, Azərbaycan dili 🇦🇿, Русский 🇷🇺, Türkçe 🇹🇷.

---

## 🚀 How to Host on GitHub & GitHub Pages (Free 2-Minute Setup)

You can publish this app on GitHub and host it live for free with **GitHub Pages**:

### Option A: Using GitHub Website (No Command Line Needed)
1. Go to [github.com](https://github.com) and log into your account.
2. Click the green **"New"** repository button.
3. Repository name: `lovely-homework` (or any name you like).
4. Set visibility to **Public**, and click **Create repository**.
5. Click **"uploading an existing file"**.
6. Drag and drop all the files and folders from this project (`index.html`, `manifest.json`, `sw.js`, `css/`, `js/`, `assets/`, `README.md`) into GitHub.
7. Click **Commit changes**.
8. In your GitHub repository, click on **Settings** (top menu) ➔ **Pages** (left sidebar).
9. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** (or `master`), Folder: **/ (root)**
   - Click **Save**.
10. In about 30 seconds, your site will be live at:
    `https://<your-username>.github.io/lovely-homework/`

### Option B: Using Git CLI
```bash
git init
git add .
git commit -m "Initial commit of Lovely Homework! PWA"
git branch -M main
git remote add origin https://github.com/<your-username>/lovely-homework.git
git push -u origin main
```
Then enable GitHub Pages under **Settings ➔ Pages ➔ Source: main branch**.

---

## 📱 How to Use & Install as an App (PWA)

### On iPhone / iPad (iOS):
1. Open your website link in **Safari**.
2. Tap the **Share** button (box with an arrow pointing up at the bottom).
3. Scroll down and tap **"Add to Home Screen"**.
4. The **Lovely Homework!** red app icon will appear on your home screen and open full-screen just like a native App Store app!

### On Android:
1. Open the website link in **Google Chrome**.
2. Tap the three dots menu at the top right, or wait for the bottom prompt **"Install Lovely Homework!"**.
3. Tap **Install** or **"Add to Home screen"**.
4. Opens full screen with offline support!

### On Windows / Mac / Desktop:
1. Open the website in Chrome or Edge.
2. Click the **Install** icon in the address bar (computer monitor with a down arrow).

---

## 🔑 Login Credentials & Pre-loaded Demo Accounts

The app comes pre-seeded with realistic data so you can test it immediately:

| Role | Name | Identifier | Password / Code | Notes |
|---|---|---|---|---|
| **Teacher** | Mr. Aliyev | `Mr. Aliyev` | `Aliyev` | Master Teacher Account |
| **Teacher** | Sarah Johnson | `Sarah` | `Aliyev` | Secondary Teacher |
| **Student** | Leyla Huseynova | `Leyla` | `123` | Elementary (Has submitted photo homework & ready oral) |
| **Student** | Rashad Aliyev | `Rashad` | `123` | Elementary (Marked "I am not ready") |
| **Student** | Kamran Taghiyev | `Kamran` | `123` | **Pending Approval** (Test accepting a student request!) |

---

## 💾 Local Storage & Unlimited Photos (IndexedDB)

Browser `localStorage` is restricted to ~5MB. To ensure that **hundreds of student homework photos and videos** can be uploaded without crashing or running out of space, this app uses **IndexedDB**:
- Unlimited local photo and document storage.
- High-resolution image lightbox viewer with download capabilities.
- **Backup & Restore**: Click the 💾 icon in the top header anytime to download a full JSON backup of all your students, homework, and materials.

---

## 📄 License
Created with ❤️ for teachers and students worldwide.
