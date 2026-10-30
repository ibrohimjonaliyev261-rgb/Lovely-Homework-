# Lovely Homework! 📚❤️

**Lovely Homework!** is an educational web application and Progressive Web App (PWA) designed for teachers and students. It allows teachers to assign homework, inspect students' handwritten notebook photos, manage oral preparation ("I am ready" / "I am not ready"), share level-specific learning materials and video lessons, and host an entertaining **Fun Time** cinema with synchronized subtitles and gesture controls.

Concentrated on a clean **Red and White** aesthetic with full **Night Mode** and **4-Language Support** (English, Azerbaijani, Russian, Turkish).

---

## 🌟 Key Features

### 1. 👥 Two Roles: Teacher & Student
- **Role Selection on Welcome**: Asks *"Are you . . . ?"* with choices for **Teacher** and **Student**.
- **Teacher Master Access**: Protected by the secret master password: **`Aliyev`** (kept confidential with zero hints in the student registration UI). Multiple teachers can register and manage their own groups!
- **Student Registration & Real-Time Confirmation Flow**:
  - Student enters First Name, Last Name, **Email Address**, Level (*Beginner, Elementary, Pre-intermediate, Intermediate, IELTS Novice, IELTS Standard*), and selects their teacher.
  - Taps **'Ready'**.
  - Sees message: *"Please wait until your teacher confirms your request."*
  - The teacher receives an immediate notification alert (via top bell icon and **Students & Groups** tab badge) with **Accept** and **Reject** buttons. Once accepted, the student is good to go!

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

### 6. 🔔 Real-Time Notifications & Multi-Tab Synchronization
- Positioned in the top right corner of the header with an active unread badge.
- Automatically notifies students when new homework, materials, or movies are uploaded.
- Automatically notifies teachers via live sound/visual alert when students register or submit work.
- Includes inter-tab **`BroadcastChannel`** and automated 2.5-second background polling so open teacher tabs update immediately without requiring manual page refresh!

### 7. 🎨 Theming & Internationalization
- **Red & White Palette**: Vibrant crimson red (`#D32F2F`), warm rose backgrounds, and crisp white cards.
- **Night Mode Toggle**: Dark charcoal/slate theme with red accents.
- **Languages**: English 🇬🇧, Azərbaycan dili 🇦🇿, Русский 🇷🇺, Türkçe 🇹🇷.

---

## 📁 Repository Structure (Flat Root Layout)

All files are organized directly in the root directory so they deploy seamlessly to GitHub Pages with zero folder mapping issues:

```
index.html         # Main app shell & router
main.css           # Core theme (Red & White, Night mode, header)
components.css     # Buttons, modals, cards, badges, lightboxes
player.css         # Custom cinema player & -10s/+10s gesture animations
responsive.css     # Mobile & tablet responsiveness
app.js             # Main bootstrap, navigation & routing
auth.js            # Roles, secret password verification, student approvals
db.js              # IndexedDB high-capacity local database
homework.js        # Written photo uploads, oral ready/not ready status
materials.js       # Video lessons & study documents per level
funtime.js         # Movies, cartoons, TV series with subtitles
students.js        # Student list, pending request approvals, graduation
notifications.js   # Real-time notification & multi-tab sync system
seed-data.js       # Pre-loaded demo accounts & exercises
manifest.json      # Progressive Web App manifest
sw.js              # Service Worker offline caching
icon.svg           # High-resolution vector icon
icon-192.png       # App icon (192x192)
icon-512.png       # App icon (512x512)
README.md          # Complete documentation & guide
.gitignore         # Git ignore rules
```

---

## 🚀 How to Update Your GitHub Repository (Step-by-Step)

Because all files are now located directly in the root folder, updating your GitHub repository is super simple:

### Step 1: Open Your GitHub Repository
1. Go to your repository on [github.com](https://github.com) (e.g. `https://github.com/<your-username>/lovely-homework`).

### Step 2: Upload the Updated Files
1. Click the **"Add file"** dropdown button near the top right of the file list.
2. Select **"Upload files"**.
3. Select or drag all the files from your local folder (`d:\CODES\Lovely Homework`):
   - `index.html`
   - `app.js`, `auth.js`, `db.js`, `homework.js`, `materials.js`, `funtime.js`, `students.js`, `notifications.js`, `i18n.js`, `seed-data.js`
   - `main.css`, `components.css`, `player.css`, `responsive.css`
   - `manifest.json`, `sw.js`
   - `icon.svg`, `icon-192.png`, `icon-512.png`
   - `README.md`
4. Type a commit message (e.g. *"Fix root paths, secret teacher password, and real-time student notification"*).
5. Click **"Commit changes"**.

### Step 3: Verify GitHub Pages
1. In your repository, click **Settings** ➔ **Pages** (left sidebar).
2. Ensure **Branch** is set to `main` (or `master`) and folder is `/(root)`.
3. GitHub Pages will rebuild automatically within ~30 seconds.
4. Refresh your live URL!

---

## 📱 How to Install as an App (PWA)

- **On iPhone / iPad**: Open your site link in **Safari**, tap the **Share** button ➔ tap **"Add to Home Screen"**.
- **On Android**: Open in **Google Chrome**, tap the three dots or prompt ➔ tap **"Install App"** / **"Add to Home screen"**.
- **On Windows / Mac**: Open in Chrome/Edge and click the **Install** button in the address bar.

---

## 🔑 Login Credentials

| Role | Username / Identifier | Password | Details |
|---|---|---|---|
| **Teacher** | `Mr. Aliyev` (or any teacher name) | **`Aliyev`** | Secret master password |
| **Student (Demo 1)** | `Leyla` | `123` | Elementary (Photo submitted + Ready oral) |
| **Student (Demo 2)** | `Rashad` | `123` | Elementary (Not ready oral) |
| **Student (Demo 3)** | `Kamran` | `123` | Pending approval (Ready for teacher confirmation) |
