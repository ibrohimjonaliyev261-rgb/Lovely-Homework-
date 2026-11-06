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
          <p class="question-subtitle">${window.i18n.get('selectRole') || 'Select your role to get started:'}</p>

          <div class="role-cards-grid">
            <!-- Option 1: Teacher -->
            <button class="role-choice-card" id="choose-teacher-btn">
              <div class="role-icon">👨‍🏫</div>
              <div class="role-details">
                <h3>${window.i18n.get('teacher')}</h3>
                <p>Manage groups, assign homework, check photo submissions</p>
              </div>
              <div class="role-arrow">➜</div>
            </button>

            <!-- Option 2: Student -->
            <button class="role-choice-card" id="choose-student-btn">
              <div class="role-icon">🧑‍🎓</div>
              <div class="role-details">
                <h3>${window.i18n.get('student')}</h3>
                <p>${window.i18n.get('studentLogin')}: Log in with your pre-assigned username</p>
              </div>
              <div class="role-arrow">➜</div>
            </button>
          </div>

          <div class="welcome-quick-login">
            <span class="text-xs text-gray">Fast login with pre-assigned profile?</span>
            <button id="quick-login-toggle-btn" class="btn btn-sm btn-link">⚡ Quick Profile Select</button>
          </div>
        </div>

        <!-- Language & Theme switcher on landing (Uzbek, Russian, English only) -->
        <div class="landing-footer-controls">
          <div class="landing-lang-picker">
            🌐
            <select id="landing-lang-select" class="form-control-sm">
              <option value="en" ${window.i18n.currentLang === 'en' ? 'selected' : ''}>English</option>
              <option value="uz" ${window.i18n.currentLang === 'uz' ? 'selected' : ''}>O'zbekcha</option>
              <option value="ru" ${window.i18n.currentLang === 'ru' ? 'selected' : ''}>Русский</option>
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
      this.showStudentLoginModal();
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

  // Teacher Password Modal: Must enter master password "Aliyev"
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
              Enter the teacher master password to access your teacher dashboard:
            </p>

            <div class="form-group">
              <label>${window.i18n.get('nameLabel')}</label>
              <input type="text" id="teacher-name-input" class="form-control" value="Mr. Aliyev" placeholder="Teacher name" required/>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('enterPassword')} *</label>
              <input type="password" id="teacher-pass-input" class="form-control" placeholder="••••••••" autofocus required/>
            </div>

            <div id="teacher-login-error" class="error-msg hidden" style="color:var(--primary-red); font-size:0.85rem; margin-top:0.5rem; font-weight:600;"></div>

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

  // Student Direct Login Modal (Pre-Created Accounts)
  // Students simply log in with their pre-assigned username and password
async showStudentLoginModal(prefilledUsername = '') {
  const modalId = 'student-login-modal';
  let modal = document.getElementById(modalId);
  if (modal) modal.remove();

  const allUsers = await window.appDB.getAll('users');
  const students = allUsers.filter(u => u.role === 'student');

  const html = `
    <div id="${modalId}" class="modal-overlay">
      <div class="modal-content modal-md">
        <div class="modal-header">
          <h3>🧑‍🎓 ${window.i18n.get('studentLogin') || 'Student Login'}</h3>
          <button class="modal-close-btn">×</button>
        </div>
        <form id="student-login-form" class="modal-body">
          <p class="text-sm text-gray mb-3">
            ${window.i18n.get('studentLoginDesc') || 'Please enter the username and password provided by your teacher.'}
          </p>

          <div class="form-group">
            <label>${window.i18n.get('usernameLabel') || 'Username'} *</label>
            <input type="text" id="student-username-input" class="form-control" placeholder="e.g. aliyev" value="${prefilledUsername}" autocomplete="username" required autofocus/>
          </div>

          <div class="form-group">
            <label>Student Password *</label>
            <input type="password" id="student-pass-input" class="form-control" placeholder="••••••••" autocomplete="current-password" required/>
          </div>

          <div id="student-login-error" class="error-msg" style="display:none; color:var(--primary-red); font-size:0.85rem; margin-top:0.5rem; font-weight:600;">
            Incorrect username or password. Please ask your teacher.
          </div>

          ${students.length > 0 ? `
            <div style="margin-top:1rem; border-top:1px dashed var(--border-color); padding-top:0.75rem;">
              <p class="text-xs text-gray mb-2">👇 Or tap your name from your group:</p>
              <div style="display:flex; flex-wrap:wrap; gap:0.35rem; max-height:120px; overflow-y:auto;">
                ${students.map(s => `
                  <button type="button" class="btn btn-sm btn-outline-secondary quick-chip-btn" data-username="${this.escape(s.username)}">
                    👤 ${this.escape(s.firstName)} ${this.escape(s.lastName)}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="modal-footer mt-4">
            <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel') || 'Cancel'}</button>
            <button type="submit" class="btn btn-primary">Log In 🚀</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
  modal = document.getElementById(modalId);

  // Quick chip auto-fill helper
  modal.querySelectorAll('.quick-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelector('#student-username-input').value = btn.getAttribute('data-username');
      modal.querySelector('#student-pass-input').focus();
    });
  });

  modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

  // Handle form submission and validate against window.appDB
  modal.querySelector('#student-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const enteredUsername = modal.querySelector('#student-username-input').value.trim().toLowerCase();
    const enteredPassword = modal.querySelector('#student-pass-input').value.trim();
    const errorEl = modal.querySelector('#student-login-error');

    try {
      const users = await window.appDB.getAll('users');
      const student = users.find(u => 
        u.role === 'student' && 
        u.username.toLowerCase() === enteredUsername
      );

      const expectedPassword = student?.password || '12345';

      if (student && enteredPassword === expectedPassword) {
        if (window.authManager) {
          window.authManager.currentUser = student;
          sessionStorage.setItem('lh_user', JSON.stringify(student));
        }
        modal.remove();
        window.location.reload();
      } else {
        if (errorEl) errorEl.style.display = 'block';
      }
    } catch (err) {
      console.error('Student login error:', err);
      if (errorEl) errorEl.style.display = 'block';
    }
  });
}

    // Tap on student chip
    modal.querySelectorAll('.chip-student-pick-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const u = chip.getAttribute('data-username');
        const userInput = modal.querySelector('#student-username-input');
        const passInput = modal.querySelector('#student-pass-input');
        if (userInput) userInput.value = u;
        if (passInput) passInput.focus();
      });
    });

    modal.querySelector('#student-login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = modal.querySelector('#student-username-input').value.trim();
      const pass = modal.querySelector('#student-pass-input').value.trim();
      const errorDiv = modal.querySelector('#student-login-error');

      try {
        const student = await window.authManager.loginStudent(username, pass);
        modal.remove();
        window.showToast(`${window.i18n.get('welcomeBack')}, ${student.firstName}! 🧑‍🎓`);
      } catch (err) {
        errorDiv.textContent = err.message || window.i18n.get('studentLoginFailed');
        errorDiv.classList.remove('hidden');
      }
    });
  }

  // Quick Login modal for existing users
  async showQuickLoginModal() {
    const modalId = 'quick-login-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const allUsers = await window.appDB.getAll('users');
    const allGroups = await window.appDB.getAll('groups');
    const teachers = allUsers.filter(u => u.role === 'teacher');
    const students = allUsers.filter(u => u.role === 'student');

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>⚡ Quick Account Selector</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="quick-user-section">
              <h4 class="font-bold text-red mb-2">👨‍🏫 Teachers:</h4>
              <div class="quick-user-grid">
                ${teachers.map(t => `
                  <button class="quick-user-btn" data-id="${t.id}" data-role="teacher">
                    <span class="user-avatar">${t.avatar || '👨‍🏫'}</span>
                    <span class="user-name">${t.firstName} ${t.lastName}</span>
                    <span class="text-xs text-gray">Teacher</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="quick-user-section mt-4">
              <h4 class="font-bold text-red mb-2">🧑‍🎓 Pre-Created Students:</h4>
              <div class="quick-user-grid">
                ${students.map(s => {
                  const grp = allGroups.find(g => g.id === s.groupId);
                  const grpLabel = grp ? `${grp.name} (${grp.level})` : s.level;
                  return `
                    <button class="quick-user-btn" data-id="${s.id}" data-role="student" data-username="${s.username}">
                      <span class="user-avatar">${s.avatar || '🧑‍🎓'}</span>
                      <span class="user-name">${s.firstName} ${s.lastName}</span>
                      <span class="text-xs text-gray">${grpLabel}</span>
                    </button>
                  `;
                }).join('')}
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
        const role = btn.getAttribute('data-role');
        const username = btn.getAttribute('data-username');
        modal.remove();

        if (role === 'teacher') {
          this.showTeacherPasswordModal();
        } else {
          this.showStudentLoginModal(username);
        }
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

    // Clean container before mounting module to prevent overlapping views
    contentContainer.innerHTML = '';

    try {
      if (tabName === 'homework') {
        if (window.homeworkModule) {
          window.homeworkModule.init(contentContainer);
        }
      } else if (tabName === 'materials') {
        if (window.materialsModule) {
          window.materialsModule.init(contentContainer);
        }
      } else if (tabName === 'funtime') {
        if (window.funTimeModule) {
          window.funTimeModule.init(contentContainer);
        }
      } else if (tabName === 'students') {
        if (window.studentsModule) {
          window.studentsModule.init(contentContainer);
        } else {
          console.warn('studentsModule not yet ready, retrying...');
          setTimeout(() => {
            if (window.studentsModule) window.studentsModule.init(contentContainer);
          }, 100);
        }
      }
    } catch (err) {
      console.error(`Error navigating to ${tabName}:`, err);
      contentContainer.innerHTML = `<div class="empty-state"><h3>⚠️ Section error</h3><p>${err.message}</p></div>`;
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

    // Logo brand click
    const brandBtn = document.getElementById('brand-home-btn');
    if (brandBtn) {
      brandBtn.addEventListener('click', () => this.navigate('homework'));
    }

    // Cloud Sync button
    const cloudBtn = document.getElementById('cloud-sync-btn');
    if (cloudBtn) {
      cloudBtn.addEventListener('click', () => this.showCloudSyncModal());
    }

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

  // Cloud Sync & Real-time Sharing Modal
  showCloudSyncModal() {
    const modalId = 'cloud-sync-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const isTeacher = window.authManager?.currentUser?.role === 'teacher';

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>☁️ Real-time Cloud Sync & Multi-Device Setup</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="sync-status-card" style="background:var(--primary-red-light); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--primary-red-border); margin-bottom:1.25rem;">
              <h4 class="font-bold text-red" style="margin-bottom:0.35rem;">📡 Live Multi-Tab & Device Sync Active</h4>
              <p class="text-sm">
                Open another tab or window on this computer to test student registration in real-time — notifications and pending requests pop up automatically without refreshing!
              </p>
            </div>

            <h4 class="font-bold mb-2">🌐 How Cross-Device Cloud Sync Works on GitHub Pages:</h4>
            <p class="text-sm text-gray mb-3">
              Because GitHub Pages is a static host, when students register on their own phones or computers, their data connects via free Google Firebase Firestore so teachers and students worldwide share the same live classroom.
            </p>

            ${isTeacher ? `
              <div class="test-sync-box" style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:1rem;">
                <label class="font-bold block mb-1">🧪 Test Instant Notification Alert:</label>
                <p class="text-xs text-gray mb-2">Click below to simulate an instant incoming student registration request right now:</p>
                <button type="button" id="trigger-test-notif-btn" class="btn btn-sm btn-primary">
                  🔔 Simulate Student Registration Notification
                </button>
              </div>
            ` : ''}

            <div class="pwa-share-box">
              <label class="font-bold block mb-1">📲 Share App Link with Students & Teachers:</label>
              <div style="display:flex; gap:0.5rem;">
                <input type="text" id="share-link-input" class="form-control" readonly value="${window.location.href}"/>
                <button type="button" id="copy-share-link-btn" class="btn btn-outline-primary">
                  📋 Copy
                </button>
              </div>
              <p class="text-xs text-gray mt-1">Students can open this link on iPhone or Android and tap "Add to Home Screen" to install it as an app!</p>
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

    const copyBtn = modal.querySelector('#copy-share-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const input = modal.querySelector('#share-link-input');
        input.select();
        navigator.clipboard.writeText(input.value);
        window.showToast('App link copied to clipboard! 📋');
      });
    }

    const testBtn = modal.querySelector('#trigger-test-notif-btn');
    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const studentName = 'Test Student ' + Math.floor(Math.random() * 100);
        const testUser = {
          id: 'test_student_' + Date.now(),
          role: 'student',
          firstName: studentName,
          lastName: '(Online)',
          email: 'test@student.com',
          password: '123',
          level: 'Elementary',
          teacherId: window.authManager.currentUser.id,
          status: 'pending',
          avatar: '🧑‍🎓',
          createdAt: new Date().toISOString()
        };
        await window.appDB.put('users', testUser);

        const notif = {
          id: 'notif_test_' + Date.now(),
          recipientId: window.authManager.currentUser.id,
          title: 'New Student Registration Pending 🔔',
          message: `${studentName} requested to join Elementary level.`,
          type: 'registration',
          targetLevel: 'Elementary',
          targetItemId: testUser.id,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        await window.appDB.put('notifications', notif);

        window.notifManager.broadcastChange('student_registration', { student: testUser, notif });
        window.notifManager.update();
        window.showToast(`🔔 Received real-time registration request from ${studentName}!`);
        if (window.studentsModule && window.app.currentTab === 'students') {
          window.studentsModule.render();
        }
      });
    }

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));
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
