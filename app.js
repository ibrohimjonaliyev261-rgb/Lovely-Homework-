// Lovely Homework! - Main Application Bootstrap & Router
// Concentrated on Red & White design, Night mode, Multi-language, PWA & offline support

class App {
  constructor() {
    this.currentTab = 'homework'; // 'homework' | 'materials' | 'funtime' | 'students'
    this.theme = localStorage.getItem('lovely_hw_theme') || 'light';
  }

  async start() {
    // 1. Apply theme
    this.applyTheme(this.theme);

    // 2. Initialize i18n
    window.i18n.applyTranslations();

    // 3. Register Service Worker for PWA
    this.registerServiceWorker();

    // 4. Initialize DB & check seed data
    await window.checkAndSeedData(window.appDB);

    // 5. Initialize Auth
    await window.authManager.init();

    // 6. Listen for auth changes
    window.authManager.onAuthChanged((user) => {
      this.handleAuthState(user);
    });

    // 7. Initialize Notifications
    window.notifManager.init();

    // 8. Bind global UI controls
    this.bindGlobalControls();
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.log('SW registration skipped or error:', err));
    }
  }

  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem('lovely_hw_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'night' ? '☀️' : '🌙';
      toggleBtn.title = theme === 'night' ? window.i18n.get('lightMode') : window.i18n.get('nightMode');
    }
  }

  toggleTheme() {
    this.applyTheme(this.theme === 'night' ? 'light' : 'night');
  }

  handleAuthState(user) {
    const landingView = document.getElementById('landing-view');
    const appShell = document.getElementById('app-shell');

    if (!user) {
      // Show Welcome / Role Selection screen ("Are you . . . ?")
      landingView?.classList.remove('hidden');
      appShell?.classList.add('hidden');
      this.renderLandingScreen();
    } else {
      // User is logged in
      landingView?.classList.add('hidden');
      appShell?.classList.remove('hidden');
      this.renderAppShell(user);
      this.navigate(this.currentTab);
    }
  }

  // Welcome Screen: "Are you . . . ?"
  renderLandingScreen() {
    const container = document.getElementById('landing-container');
    if (!container) return;

    container.innerHTML = `
      <div class="welcome-box">
        <div class="welcome-brand">
          <div class="brand-icon-big">📚❤️</div>
          <h1 class="brand-title">Lovely Homework!</h1>
          <p class="brand-tagline">${window.i18n.get('appSubtitle')}</p>
        </div>

        <div class="welcome-question-card">
          <h2 class="question-title">${window.i18n.get('areYou')}</h2>
          <p class="question-subtitle">Select your role to get started:</p>

          <div class="role-cards-grid">
            <!-- Option 1: Teacher -->
            <button class="role-choice-card" id="choose-teacher-btn">
              <div class="role-icon">👨‍🏫</div>
              <div class="role-details">
                <h3>${window.i18n.get('teacher')}</h3>
                <p>Manage homework, upload video lessons, check student photos</p>
              </div>
              <div class="role-arrow">➜</div>
            </button>

            <!-- Option 2: Student -->
            <button class="role-choice-card" id="choose-student-btn">
              <div class="role-icon">🧑‍🎓</div>
              <div class="role-details">
                <h3>${window.i18n.get('student')}</h3>
                <p>Submit homework photos, mark oral readiness, watch cartoons</p>
              </div>
              <div class="role-arrow">➜</div>
            </button>
          </div>

          <div class="welcome-quick-login">
            <span class="text-xs text-gray">Already have an active account?</span>
            <button id="quick-login-toggle-btn" class="btn btn-sm btn-link">Log In with Existing Profile</button>
          </div>
        </div>

        <!-- Language & Theme switcher on landing -->
        <div class="landing-footer-controls">
          <div class="landing-lang-picker">
            🌐
            <select id="landing-lang-select" class="form-control-sm">
              <option value="en" ${window.i18n.currentLang === 'en' ? 'selected' : ''}>English</option>
              <option value="az" ${window.i18n.currentLang === 'az' ? 'selected' : ''}>Azərbaycan</option>
              <option value="ru" ${window.i18n.currentLang === 'ru' ? 'selected' : ''}>Русский</option>
              <option value="tr" ${window.i18n.currentLang === 'tr' ? 'selected' : ''}>Türkçe</option>
            </select>
          </div>

          <button id="landing-theme-btn" class="btn btn-circle btn-sm">
            ${this.theme === 'night' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    `;

    // Event listeners
    container.querySelector('#choose-teacher-btn').addEventListener('click', () => {
      this.showTeacherPasswordModal();
    });

    container.querySelector('#choose-student-btn').addEventListener('click', () => {
      this.showStudentRegistrationModal();
    });

    container.querySelector('#quick-login-toggle-btn').addEventListener('click', () => {
      this.showQuickLoginModal();
    });

    container.querySelector('#landing-lang-select').addEventListener('change', (e) => {
      window.i18n.setLanguage(e.target.value);
      this.renderLandingScreen();
    });

    container.querySelector('#landing-theme-btn').addEventListener('click', () => {
      this.toggleTheme();
      this.renderLandingScreen();
    });
  }

  // Teacher Password Modal: Must enter password "Aliyev"
  showTeacherPasswordModal() {
    const modalId = 'teacher-password-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-sm">
          <div class="modal-header">
            <h3>👨‍🏫 ${window.i18n.get('teacherLogin')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="teacher-password-form" class="modal-body">
            <p class="text-sm text-gray mb-3">
              Please enter the teacher master password to access the teacher dashboard.
            </p>

            <div class="form-group">
              <label>${window.i18n.get('emailLabel')}</label>
              <input type="text" id="teacher-name-input" class="form-control" value="Mr. Aliyev" placeholder="e.g. Mr. Aliyev or email" required/>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('enterPassword')} *</label>
              <input type="password" id="teacher-pass-input" class="form-control" placeholder="Aliyev" autofocus required/>
              <span class="text-xs text-gray mt-1 block">Teacher Code: <strong>Aliyev</strong></span>
            </div>

            <div id="teacher-login-error" class="error-msg hidden"></div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              <button type="submit" class="btn btn-primary">${window.i18n.get('loginBtn')}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#teacher-password-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = modal.querySelector('#teacher-name-input').value.trim();
      const pass = modal.querySelector('#teacher-pass-input').value.trim();
      const errorDiv = modal.querySelector('#teacher-login-error');

      try {
        await window.authManager.loginTeacher(name, pass);
        modal.remove();
        window.showToast(`${window.i18n.get('welcomeBack')}, ${name}! 👨‍🏫`);
      } catch (err) {
        errorDiv.textContent = err.message || window.i18n.get('passwordWrong');
        errorDiv.classList.remove('hidden');
      }
    });
  }

  // Student Registration Modal:
  // "Write their names, last names, their level (with options: Beginner, elementary, Pre-intermediate; Intermediate; IELTS Novice, IELTS Standard),
  // they fill the questions; and tap the button 'Ready'; then see a message, please wait until your teacher confirms your request. then i will see the request, and accept it - good to go"
  async showStudentRegistrationModal() {
    const modalId = 'student-register-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const allUsers = await window.appDB.getAll('users');
    const teachers = allUsers.filter(u => u.role === 'teacher');

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard'];

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>🧑‍🎓 ${window.i18n.get('studentRegistration')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="student-register-form" class="modal-body">
            <div class="form-row">
              <div class="form-group col-half">
                <label>${window.i18n.get('nameLabel')} *</label>
                <input type="text" id="reg-firstname-input" class="form-control" required placeholder="e.g. Leyla"/>
              </div>
              <div class="form-group col-half">
                <label>${window.i18n.get('lastNameLabel')} *</label>
                <input type="text" id="reg-lastname-input" class="form-control" required placeholder="e.g. Huseynova"/>
              </div>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('selectLevel')} *</label>
              <select id="reg-level-select" class="form-control" required>
                ${levels.map(lvl => `<option value="${lvl}">${lvl}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('selectTeacher')} *</label>
              <select id="reg-teacher-select" class="form-control">
                ${teachers.map(t => `<option value="${t.id}">${t.firstName} ${t.lastName} (${t.email})</option>`).join('')}
              </select>
            </div>

            <div class="modal-footer mt-4">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              <button type="submit" id="ready-submit-btn" class="btn btn-primary btn-ready-primary">
                ${window.i18n.get('readyBtn')} (Ready) ✨
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#student-register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = modal.querySelector('#reg-firstname-input').value.trim();
      const lastName = modal.querySelector('#reg-lastname-input').value.trim();
      const level = modal.querySelector('#reg-level-select').value;
      const teacherId = modal.querySelector('#reg-teacher-select').value;

      try {
        const student = await window.authManager.registerStudent({
          firstName,
          lastName,
          level,
          teacherId
        });

        modal.remove();
        // Show the exact pending confirmation screen
        this.showPendingApprovalScreen(student);
      } catch (err) {
        alert(err.message || 'Error submitting registration.');
      }
    });
  }

  // Pending Confirmation Screen:
  // "then see a message, please wait until your teacher confirms your request. then i will see the request, and accept it - good to go"
  showPendingApprovalScreen(student) {
    const modalId = 'pending-confirmation-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md text-center">
          <div class="pending-icon-anim">⏳</div>
          <h2 class="text-xl font-bold mt-2">${window.i18n.get('pendingApprovalTitle')}</h2>
          
          <div class="pending-notice-box mt-3">
            <p class="font-bold text-red text-base">
              ${window.i18n.get('pendingApprovalMsg')}
            </p>
            <p class="text-sm text-gray mt-2">
              "${window.i18n.get('pendingSubtitle')}"
            </p>
          </div>

          <div class="pending-details-box mt-3 text-left">
            <div><strong>Student:</strong> ${student.firstName} ${student.lastName}</div>
            <div><strong>Requested Level:</strong> ${student.level}</div>
            <div><strong>Status:</strong> <span class="badge badge-warning">Awaiting Teacher Confirmation</span></div>
          </div>

          <div class="modal-footer justify-center mt-4">
            <button type="button" id="pending-back-home-btn" class="btn btn-primary">
              ${window.i18n.get('backToHome')}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelector('#pending-back-home-btn').addEventListener('click', () => {
      modal.remove();
      this.renderLandingScreen();
    });
  }

  // Quick Login modal for existing users
  async showQuickLoginModal() {
    const modalId = 'quick-login-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const allUsers = await window.appDB.getAll('users');
    const teachers = allUsers.filter(u => u.role === 'teacher');
    const students = allUsers.filter(u => u.role === 'student');

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>🔑 Log In With Existing Account</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="quick-user-section">
              <h4 class="font-bold text-red mb-2">👨‍🏫 Teachers:</h4>
              <div class="quick-user-grid">
                ${teachers.map(t => `
                  <button class="quick-user-btn" data-id="${t.id}">
                    <span class="user-avatar">${t.avatar || '👨‍🏫'}</span>
                    <span class="user-name">${t.firstName} ${t.lastName}</span>
                    <span class="text-xs text-gray">Teacher</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="quick-user-section mt-4">
              <h4 class="font-bold text-red mb-2">🧑‍🎓 Registered Students:</h4>
              <div class="quick-user-grid">
                ${students.map(s => `
                  <button class="quick-user-btn ${s.status === 'pending' ? 'btn-disabled' : ''}" data-id="${s.id}" data-status="${s.status}">
                    <span class="user-avatar">${s.avatar || '🧑‍🎓'}</span>
                    <span class="user-name">${s.firstName} ${s.lastName}</span>
                    <span class="text-xs ${s.status === 'pending' ? 'text-warning' : 'text-gray'}">
                      ${s.status === 'pending' ? '⏳ Pending Approval' : s.level}
                    </span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('close')}</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelectorAll('.quick-user-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const status = btn.getAttribute('data-status');
        if (status === 'pending') {
          alert(window.i18n.get('pendingApprovalMsg'));
          return;
        }
        await window.authManager.switchUser(id);
        modal.remove();
      });
    });

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));
  }

  // App Shell Navigation & Top Bar Rendering
  renderAppShell(user) {
    const isTeacher = user.role === 'teacher';

    // Update Header
    const userRoleEl = document.getElementById('user-role-badge');
    const userNameEl = document.getElementById('user-name-display');
    const userAvatarEl = document.getElementById('user-avatar-display');
    const tabStudentsNav = document.getElementById('nav-tab-students');

    if (userRoleEl) {
      userRoleEl.textContent = isTeacher ? '👨‍🏫 Teacher' : `🎓 ${user.level}`;
      userRoleEl.className = isTeacher ? 'badge badge-teacher' : 'badge badge-student';
    }
    if (userNameEl) {
      userNameEl.textContent = `${user.firstName} ${user.lastName}`;
    }
    if (userAvatarEl) {
      userAvatarEl.textContent = user.avatar || (isTeacher ? '👨‍🏫' : '🧑‍🎓');
    }

    // Students & Groups tab is only for teachers
    if (tabStudentsNav) {
      if (isTeacher) {
        tabStudentsNav.classList.remove('hidden');
      } else {
        tabStudentsNav.classList.add('hidden');
      }
    }

    // Update language select
    const langSelect = document.getElementById('header-lang-select');
    if (langSelect) {
      langSelect.value = window.i18n.currentLang;
    }

    // Refresh notifications count
    window.notifManager.update();
  }

  navigate(tabName) {
    this.currentTab = tabName;
    const contentContainer = document.getElementById('main-content-view');
    if (!contentContainer) return;

    // Highlight active nav item
    document.querySelectorAll('.app-nav-item').forEach(item => {
      if (item.getAttribute('data-tab') === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (tabName === 'homework') {
      window.homeworkModule.init(contentContainer);
    } else if (tabName === 'materials') {
      window.materialsModule.init(contentContainer);
    } else if (tabName === 'funtime') {
      window.funTimeModule.init(contentContainer);
    } else if (tabName === 'students') {
      window.studentsModule.init(contentContainer);
    }
  }

  bindGlobalControls() {
    // Nav Tab clicks
    document.querySelectorAll('.app-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        if (tab) this.navigate(tab);
      });
    });

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Language selector in header
    const langSelect = document.getElementById('header-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        window.i18n.setLanguage(e.target.value);
      });
    }

    // Sign out button
    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to sign out?')) {
          await window.authManager.logout();
        }
      });
    }

    // Backup & Restore button
    const backupBtn = document.getElementById('backup-data-btn');
    if (backupBtn) {
      backupBtn.addEventListener('click', () => this.showBackupModal());
    }

    // Re-render when language changes
    window.addEventListener('languageChanged', () => {
      if (window.authManager.currentUser) {
        this.renderAppShell(window.authManager.currentUser);
        this.navigate(this.currentTab);
      } else {
        this.renderLandingScreen();
      }
    });
  }

  // Backup / Export & Restore Modal
  showBackupModal() {
    const modalId = 'backup-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>💾 ${window.i18n.get('backupData')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p class="text-sm text-gray mb-3">
              Export all homework, student submissions, photos, and materials to a backup file, or restore previously exported data.
            </p>

            <div class="backup-action-box">
              <button id="export-json-btn" class="btn btn-primary btn-block mb-3">
                📥 Download Full Backup (.json)
              </button>

              <hr class="my-3"/>

              <label class="font-bold block mb-1">Restore from Backup File:</label>
              <input type="file" id="import-json-file" accept=".json" class="form-control mb-2"/>
              <button id="import-json-btn" class="btn btn-outline-danger btn-block">
                📤 ${window.i18n.get('restoreData')}
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('close')}</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelector('#export-json-btn').addEventListener('click', async () => {
      const json = await window.appDB.exportAllData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LovelyHomework_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    modal.querySelector('#import-json-btn').addEventListener('click', async () => {
      const fileInput = modal.querySelector('#import-json-file');
      const file = fileInput.files[0];
      if (!file) {
        alert('Please select a .json backup file.');
        return;
      }
      if (confirm('Restoring will replace all current data with the backup file. Proceed?')) {
        const text = await file.text();
        await window.appDB.importAllData(text);
        alert('Data restored successfully! The page will now reload.');
        window.location.reload();
      }
    });

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));
  }
}

// Global Image Lightbox Modal
window.showImageLightbox = function(imageUrl, title = 'Photo Preview') {
  const modalId = 'global-lightbox-modal';
  let modal = document.getElementById(modalId);
  if (modal) modal.remove();

  const html = `
    <div id="${modalId}" class="lightbox-overlay">
      <div class="lightbox-container">
        <div class="lightbox-top-bar">
          <span class="lightbox-title">${title}</span>
          <div class="lightbox-btn-row">
            <a href="${imageUrl}" download="Homework_Photo.jpg" class="btn btn-sm btn-outline-light" title="Download original photo">
              💾 Download
            </a>
            <button class="lightbox-close-btn" title="Close">&times;</button>
          </div>
        </div>
        <div class="lightbox-image-stage">
          <img src="${imageUrl}" alt="${title}" class="lightbox-main-img"/>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
  modal = document.getElementById(modalId);

  modal.querySelector('.lightbox-close-btn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-image-stage')) {
      modal.remove();
    }
  });
};

// Global Toast Notifications
window.showToast = function(msg) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<span>❤️</span> ${msg}`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
};

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.appRouter = window.app;
  window.app.start();
});
