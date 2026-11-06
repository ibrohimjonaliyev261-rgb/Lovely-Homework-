# Lovely Homework! 📚❤️

**Lovely Homework!** is an educational web application and Progressive Web App (PWA) designed for teachers and students. It allows teachers to create and manage student groups, assign pre-created student accounts with simple passwords, assign homework with photos, review students' handwritten notebook photos, manage oral preparation ("I am ready" / "I am not ready"), share level-specific learning materials and video lessons, and host an entertaining **Fun Time** cinema with synchronized subtitles and gesture controls.

Featuring a bold **Dominantly RED with clean WHITE accents** aesthetic, full **Night Mode**, and **3-Language Support** (English 🇬🇧, O'zbekcha 🇺🇿, Русский 🇷🇺).

---

## 🌟 Key Updates & Features

### 1. 📋 Pre-Created Accounts (Teacher-Managed Roster)
- **Zero Registration Hassle**: Students do not need to self-register or wait for approval queues!
- **Teacher Dashboard Roster**:
  - The teacher creates student profiles directly from the **"Students & Groups"** tab.
  - The teacher specifies: First Name, Last Name, Username, Default Password (e.g., `12345`), Level, and Group.
  - A convenient **"📋 Copy Credentials"** button lets the teacher instantly copy logins to send to students or parents via Telegram, WhatsApp, or SMS.
- **Direct Student Login**:
  - Students open the app, tap **Student**, enter their pre-assigned Username and Password, and get instant access.
  - Alternatively, students can tap their name from the quick student chip list on shared devices.

### 2. 👥 Group Management, Student Transfers & Removals
- **Create Named Groups**: Organize students into classes (e.g. *"118 Pre-Intermediate"*, *"Morning Elementary-1"*, *"IELTS Champions"*).
- **Assigned Levels**: Each group has a designated level (*Beginner, Elementary, Pre-intermediate, Intermediate, IELTS Novice, IELTS Standard*).
- **🔄 Change Student's Group**:
  - If a student transfers to a new group, click the **`🔄` (Change Group)** button next to the student's name.
  - Or click **"🔄 Move Student Here"** inside the target group card to quickly bring in an existing student.
  - When transferred, the student's level automatically updates to match the new group!
- **🗑️ Remove / Delete Student**:
  - If a student changes groups or leaves the school, click the **`🗑️` (Remove)** icon next to their name.
  - Choose between:
    - **"Remove from this group only"**: Keeps their login and past work intact in the student roster, but removes them from this group.
    - **"Delete student permanently"**: Use when a student leaves the course/school completely.
- **Group Level Change & Graduation**:
  - When students master a level, click **"Graduate / Promote Group"** on the group card.
  - Selecting the new level automatically promotes and updates **all enrolled students** in that group at once!

### 3. 👨‍🏫 Teacher Secret Master Access
- **Confidential Password**: Protected by the master password **`Aliyev`**.
- Kept strictly secret with **zero password hints** shown anywhere in the interface.

### 4. 📝 Homework Management
- **Two Homework Types**:
  - 📄 **Written on Paper**: Students take photos of their handwritten notebooks/workbooks and upload them. Teachers can view high-resolution photos with zoom/lightbox and add feedback/grades.
  - 🗣️ **Oral**: For speaking topics and learning new vocabulary. Students have two clear interactive buttons: **"I am ready"** and **"I am not ready"**. Teachers see live status breakdowns in their review dashboard.
- **Teacher Photo Attachments**: Teachers can attach textbook exercises or photos so students see them when completing tasks.
- **Deadlines**: Automatic due date tracking with tags for upcoming and past-due tasks.

### 5. 📚 Materials / Video Lessons
- Organized per level.
- Supports **PDFs, Word documents (.docx), Video lessons (.mp4 / streaming links), Infographics, and Audio**.
- Teacher names each material (e.g. *"Future Simple or Past simple"*).
- **Read-Only for Students**: Students can view, read, and stream materials without editing or modifying them.

### 6. 🍿 Fun Time (Movies, Cartoons, TV Series)
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

### 7. 🔔 Notifications System
- Positioned in the top right corner with an unread badge.
- Alerts students when new homework, materials, or movies are added.
- Alerts teachers when students submit homework photos or mark oral readiness.

### 8. 🎨 Dominantly RED & White Design
- **Primary Color**: Bold Crimson & Ruby Red (`#DC2626`, `#B91C1C`, `#881337`).
- **Clean Accents**: Crisp white cards, badges, and high-contrast text.
- **Red Night Mode**: Deep maroon/wine canvas with bright ruby accents.
- **Supported Languages**:
  - 🇬🇧 **English** (`en`)
  - 🇺🇿 **O'zbekcha** (`uz`)
  - 🇷🇺 **Русский** (`ru`)

---

## 📁 Repository Structure (Flat Root Layout)

All files sit directly in the root directory for flawless deployment on GitHub Pages without subfolder 404 errors:

```
index.html         # Main app shell & router
main.css           # Dominantly RED & white theme, header, nav
components.css     # Buttons, modals, cards, badges, roster styles
player.css         # Custom cinema player & -10s/+10s gesture animations
responsive.css     # Mobile & tablet responsiveness
app.js             # Bootstrap, routing, secret teacher & student login
auth.js            # Teacher master password, student & group roster logic
db.js              # IndexedDB high-capacity local database (v2 with groups)
homework.js        # Written photo uploads, oral ready/not ready status
materials.js       # Video lessons & study documents per level
funtime.js         # Movies, cartoons, TV series with subtitles
students.js        # Groups & Students Roster Hub (Create groups, add students, graduate)
notifications.js   # Notification system & multi-tab sync
i18n.js            # English, Uzbek, and Russian translations
seed-data.js       # Pre-loaded default groups, student accounts & homework
manifest.json      # Progressive Web App manifest
sw.js              # Service Worker offline caching
icon.svg           # Vector icon
icon-192.png       # App icon (192x192)
icon-512.png       # App icon (512x512)
README.md          # Documentation & step-by-step instructions
.gitignore         # Git ignore rules
```

---

## 🚀 Step-by-Step Instructions: What to Do Next

Follow these exact steps to update your site on GitHub:

### Step 1: Open Your GitHub Repository in Your Browser
1. Go to your repository on [github.com](https://github.com) (e.g. `https://github.com/ibrohimjonaliyev261-rgb/Lovely-Homework`).

### Step 2: Upload the Updated Files
1. In your repository on GitHub, click the **"Add file"** button at the top-right of the file list and select **"Upload files"**.
2. Open your local project folder: `d:\CODES\Lovely Homework\`.
3. Select and drag all the files from `d:\CODES\Lovely Homework\` into the upload area:
   - `index.html`
   - `main.css`, `components.css`, `player.css`, `responsive.css`
   - `app.js`, `auth.js`, `db.js`, `students.js`, `homework.js`, `materials.js`, `funtime.js`, `notifications.js`, `i18n.js`, `seed-data.js`
   - `manifest.json`, `sw.js`
   - `icon.svg`, `icon-192.png`, `icon-512.png`
   - `README.md`
4. In the "Commit changes" box at the bottom, type:
   `Red theme, pre-created student accounts, group management, and UZ/RU/EN languages`
5. Click the green **"Commit changes"** button.

### Step 3: Wait ~30 Seconds for GitHub Pages to Build
1. GitHub Pages builds your updated website automatically within 30 to 60 seconds.
2. Open your GitHub Pages link on your computer or phone!

---

## 🔑 Default Login Credentials

### Teacher Account
- Click **Teacher** on the welcome screen.
- Password: **`Aliyev`** (secret master password).

### Default Pre-Created Student Accounts
Each default student is pre-assigned to a group with password **`123`**:

| Student Name | Username | Password | Group | Level |
|---|---|---|---|---|
| **Farid Mammadov** | `farid` | `123` | Elementary Group A | Elementary |
| **Leyla Huseynova** | `leyla` | `123` | Elementary Group A | Elementary |
| **Rashad Aliyev** | `rashad` | `123` | Elementary Group A | Elementary |
| **Aysel Karimova** | `aysel` | `123` | Beginner Morning | Beginner |
| **Elvin Guliyev** | `elvin` | `123` | Intermediate Fast-Track | Intermediate |
| **Nigar Babayeva** | `nigar` | `123` | IELTS Champions | IELTS Standard |

---

## 💡 How to Use the New Teacher Roster & Groups

1. **Log in as Teacher** using password `Aliyev`.
2. Go to the **"Students & Groups"** tab:
   - Click **"Create Group"** to add a new group (e.g. *"Evening Elementary B"*, Level: *Elementary*).
   - Click **"Add Student"** to add a new student with their name, username (e.g. `anvar`), password (e.g. `12345`), and assign them to the group.
   - Click **"📋 Copy Credentials"** to quickly send login details to students.
   - When the class finishes a level, click **"🎓 Graduate / Change Level"** on their group card to advance the entire group to the next level in one click!
3. **For Students**:
   - They open the link on their phone or PC, tap **Student**, enter their username and password, and instantly see their assignments!
