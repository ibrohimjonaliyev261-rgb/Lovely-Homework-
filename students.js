// Lovely Homework! - Students & Group Management Module
// Handles: Student Lists per level, Pending Registration Approvals, Level Changes

class StudentsModule {
  constructor() {
    this.selectedLevel = 'Elementary';
    this.container = null;
  }

  init(containerEl) {
    this.container = containerEl;
    this.render();
  }

  setLevel(level) {
    this.selectedLevel = level;
    this.render();
  }

  async render() {
    if (!this.container) return;
    const user = window.authManager.currentUser;
    if (!user || user.role !== 'teacher') {
      this.container.innerHTML = `<div class="p-6 text-center">Teacher access required.</div>`;
      return;
    }

    const allUsers = await window.appDB.getAll('users');
    const pendingStudents = allUsers.filter(u => u.role === 'student' && u.status === 'pending');
    const activeStudents = allUsers.filter(u => u.role === 'student' && u.status === 'active' && u.level === this.selectedLevel);

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard', 'Graduated'];

    this.container.innerHTML = `
      <div class="section-header">
        <div class="header-left">
          <h2 class="section-title">
            <span>👥</span> ${window.i18n.get('tabStudents')}
          </h2>
          <p class="section-subtitle">
            Manage student registrations, level assignments, and group graduation
          </p>
        </div>

        <div class="header-actions">
          <button id="students-graduate-btn" class="btn btn-outline-danger">
            🎓 ${window.i18n.get('graduateGroup')} (${this.selectedLevel})
          </button>
        </div>
      </div>

      <!-- Pending Approval Banner (Alerts Teacher) -->
      ${pendingStudents.length > 0 ? `
        <div class="pending-approval-banner">
          <div class="banner-title">
            <span>🔔</span> <strong>Pending Student Requests (${pendingStudents.length})</strong>
          </div>
          <p class="text-sm">These students registered and are waiting for your approval to enter the app:</p>
          
          <div class="pending-cards-grid mt-3">
            ${pendingStudents.map(s => `
              <div class="pending-card" data-student-id="${s.id}">
                <div class="pending-info">
                  <div class="pending-avatar">${s.avatar || '🧑‍🎓'}</div>
                  <div>
                    <h4>${this.escape(s.firstName)} ${this.escape(s.lastName)}</h4>
                    <span class="badge badge-info">Requested Level: ${s.level}</span>
                    <span class="text-xs text-gray block mt-1">Requested: ${new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div class="pending-btn-row">
                  <button class="btn btn-sm btn-success approve-btn" data-id="${s.id}">
                    ✅ ${window.i18n.get('accept')}
                  </button>
                  <button class="btn btn-sm btn-outline-danger reject-btn" data-id="${s.id}">
                    ❌ ${window.i18n.get('reject')}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Level Selector Tabs -->
      <div class="level-tabs-container">
        <div class="level-tabs">
          ${levels.map(lvl => `
            <button class="level-tab-btn ${lvl === this.selectedLevel ? 'active' : ''}" data-level="${lvl}">
              ${lvl}
              <span class="level-count">${allUsers.filter(u => u.role === 'student' && u.status === 'active' && u.level === lvl).length}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Active Students in Level -->
      <div class="students-list-container">
        <h3 class="font-bold mb-3">Enrolled in ${this.selectedLevel} (${activeStudents.length} students)</h3>

        ${activeStudents.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>No active students in ${this.selectedLevel}</h3>
            <p>Students who select this level during registration will appear here once approved.</p>
          </div>
        ` : `
          <div class="students-grid">
            ${activeStudents.map(s => `
              <div class="student-card">
                <div class="student-card-header">
                  <span class="student-avatar-big">${s.avatar || '🧑‍🎓'}</span>
                  <div>
                    <h4>${this.escape(s.firstName)} ${this.escape(s.lastName)}</h4>
                    <span class="badge badge-success">Active Student</span>
                  </div>
                </div>
                <div class="student-card-details">
                  <div class="detail-row">
                    <span>Level:</span>
                    <strong>${s.level}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Enrolled:</span>
                    <span>${new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div class="student-card-footer">
                  <button class="btn btn-sm btn-outline-primary change-level-btn" data-id="${s.id}">
                    🔄 Move Level
                  </button>
                  <button class="btn btn-sm btn-outline-danger remove-student-btn" data-id="${s.id}">
                    🗑️ Remove
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Level tabs
    this.container.querySelectorAll('.level-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lvl = btn.getAttribute('data-level');
        this.setLevel(lvl);
      });
    });

    // Approve Student
    this.container.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await window.authManager.approveStudent(id);
        window.showToast('Student approved! They can now log in. 🎉');
        this.render();
      });
    });

    // Reject Student
    this.container.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to decline this registration request?')) {
          await window.authManager.rejectStudent(id);
          this.render();
        }
      });
    });

    // Graduate Group button
    const gradBtn = this.container.querySelector('#students-graduate-btn');
    if (gradBtn) {
      gradBtn.addEventListener('click', async () => {
        const res = await window.authManager.graduateGroup(this.selectedLevel);
        if (res) {
          alert(`${window.i18n.get('graduatedSuccess')}\nNew Level: ${res.nextLevel} (${res.count} students promoted)`);
          this.selectedLevel = res.nextLevel !== 'Graduated' ? res.nextLevel : this.selectedLevel;
          this.render();
        } else {
          alert('This group is already at the highest level or has graduated!');
        }
      });
    });

    // Move student to different level
    this.container.querySelectorAll('.change-level-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const student = await window.appDB.get('users', id);
        if (!student) return;

        const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard', 'Graduated'];
        const newLvl = prompt(`Change level for ${student.firstName} ${student.lastName}:\nChoose one: ${levels.join(', ')}`, student.level);
        if (newLvl && levels.includes(newLvl.trim())) {
          student.level = newLvl.trim();
          await window.appDB.put('users', student);
          window.showToast(`Level changed to ${student.level}`);
          this.render();
        }
      });
    });

    // Remove student
    this.container.querySelectorAll('.remove-student-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to remove this student account?')) {
          await window.appDB.delete('users', id);
          this.render();
        }
      });
    });
  }

  escape(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.studentsModule = new StudentsModule();
