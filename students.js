// Lovely Homework! - Groups & Students Roster Hub
// Handles: Groups creation, Group level updates/graduation, Pre-created Student accounts,
// Roster credentials viewing & sharing.

class StudentsModule {
  constructor() {
    this.currentView = 'groups'; // 'groups' | 'roster'
    this.container = null;
  }

  init(containerEl) {
    this.container = containerEl;
    this.render();
  }

  async render() {
    if (!this.container) return;
    const user = window.authManager?.currentUser;
    if (!user || user.role !== 'teacher') {
      this.container.innerHTML = `<div class="p-6 text-center text-muted">Teacher access required.</div>`;
      return;
    }

    const allGroups = await window.appDB.getAll('groups');
    const allUsers = await window.appDB.getAll('users');
    const allStudents = allUsers.filter(u => u.role === 'student');

    allGroups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    allStudents.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));

    this.container.innerHTML = `
      <div class="section-header">
        <div class="header-left">
          <h2 class="section-title">
            <span>👥</span> ${window.i18n.get('tabStudents')}
          </h2>
          <p class="section-subtitle">
            Manage your student groups, assign pre-created credentials, and graduate groups to next levels
          </p>
        </div>

        <div class="header-actions">
          <button id="create-group-btn" class="btn btn-outline-primary">
            ${window.i18n.get('createGroupBtn')}
          </button>
          <button id="add-student-btn" class="btn btn-primary">
            ${window.i18n.get('createStudentBtn')}
          </button>
        </div>
      </div>

      <!-- Sub Navigation Tabs: Groups vs Full Student Roster -->
      <div class="roster-tabs-container">
        <button type="button" class="roster-tab-btn ${this.currentView === 'groups' ? 'active' : ''}" id="view-groups-tab">
          👥 ${window.i18n.get('groupsTab')} (${allGroups.length})
        </button>
        <button type="button" class="roster-tab-btn ${this.currentView === 'roster' ? 'active' : ''}" id="view-roster-tab">
          📋 ${window.i18n.get('studentsTab')} (${allStudents.length})
        </button>
      </div>

      <!-- Main View Stage -->
      <div id="roster-stage" class="mt-3">
        ${this.currentView === 'groups' 
          ? this.renderGroupsView(allGroups, allStudents) 
          : this.renderStudentsRosterView(allStudents, allGroups)}
      </div>
    `;

    this.bindEvents(allGroups, allStudents);
  }

  renderGroupsView(allGroups, allStudents) {
    if (allGroups.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>${window.i18n.get('noGroupsYet')}</h3>
          <p>Create your first group (e.g. "Morning Elementary-1" or "IELTS Champions") to organize your students.</p>
          <button class="btn btn-primary mt-3" id="empty-create-group-btn">
            ${window.i18n.get('createGroupBtn')}
          </button>
        </div>
      `;
    }

    return `
      <div class="groups-grid">
        ${allGroups.map(grp => {
          const groupStudents = allStudents.filter(s => s.groupId === grp.id);
          return `
            <div class="group-card" data-group-id="${grp.id}">
              <div class="group-card-header">
                <div>
                  <h3 class="group-name-title">${this.escape(grp.name)}</h3>
                  <div class="group-level-badge">
                    <span class="badge badge-teacher">🎓 ${grp.level}</span>
                    <span class="badge badge-student">${groupStudents.length} ${window.i18n.get('studentsCount')}</span>
                  </div>
                </div>

                <div class="group-top-actions">
                  <button class="btn btn-sm btn-outline-danger delete-group-btn" data-id="${grp.id}" title="${window.i18n.get('deleteGroup')}">
                    🗑️
                  </button>
                </div>
              </div>

              <!-- Enrolled Students inside this group -->
              <div class="group-students-box">
                <div class="group-box-title">
                  <span>Enrolled Students (${groupStudents.length}):</span>
                  <button class="btn btn-sm btn-link quick-add-student-btn" data-group-id="${grp.id}">
                    ➕ Add Student
                  </button>
                </div>

                ${groupStudents.length === 0 ? `
                  <p class="text-xs text-gray italic p-2">${window.i18n.get('noStudentsInGroup')}</p>
                ` : `
                  <div class="group-students-list">
                    ${groupStudents.map(st => `
                      <div class="group-student-row">
                        <div class="st-info">
                          <strong>${this.escape(st.firstName)} ${this.escape(st.lastName)}</strong>
                          <div class="st-credentials-pill">
                            <span>👤 User: <code>${this.escape(st.username)}</code></span>
                            <span>🔑 Pass: <code>${this.escape(st.password || '12345')}</code></span>
                          </div>
                        </div>
                        <div class="st-row-actions">
                          <button class="btn btn-sm btn-link copy-one-btn" data-info="${this.escape(st.firstName)} ${this.escape(st.lastName)} | Username: ${st.username} | Password: ${st.password || '12345'}" title="Copy Login Info">
                            📋
                          </button>
                          <button class="btn btn-sm btn-link edit-student-btn" data-id="${st.id}" title="Edit Student">
                            ✏️
                          </button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>

              <!-- Group Action Footer: Graduate Group & Edit -->
              <div class="group-card-footer">
                <button class="btn btn-sm btn-primary graduate-group-btn" data-id="${grp.id}" data-level="${grp.level}">
                  🎓 ${window.i18n.get('graduateGroup')}
                </button>
                <button class="btn btn-sm btn-secondary edit-group-btn" data-id="${grp.id}">
                  ✏️ ${window.i18n.get('edit')}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderStudentsRosterView(allStudents, allGroups) {
    if (allStudents.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">🧑‍🎓</div>
          <h3>${window.i18n.get('noStudentsOverall')}</h3>
          <p>Add students to your roster so they can log in instantly with their pre-assigned credentials.</p>
          <button class="btn btn-primary mt-3" id="empty-add-student-btn">
            ${window.i18n.get('createStudentBtn')}
          </button>
        </div>
      `;
    }

    return `
      <div class="roster-table-container">
        <div class="roster-table-header mb-3">
          <button id="copy-all-roster-btn" class="btn btn-outline-primary btn-sm">
            📋 ${window.i18n.get('copyCredentials')} (All Students)
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Group</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${allStudents.map(st => {
              const grp = allGroups.find(g => g.id === st.groupId);
              return `
                <tr>
                  <td>
                    <strong>${this.escape(st.firstName)} ${this.escape(st.lastName)}</strong>
                  </td>
                  <td>
                    <code>${this.escape(st.username)}</code>
                  </td>
                  <td>
                    <span class="password-chip">🔑 ${this.escape(st.password || '12345')}</span>
                  </td>
                  <td>
                    ${grp ? `<span class="badge badge-info">${this.escape(grp.name)}</span>` : '<span class="text-xs text-gray">No Group</span>'}
                  </td>
                  <td>
                    <span class="badge badge-teacher">${st.level || 'Beginner'}</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary copy-one-btn" data-info="${this.escape(st.firstName)} ${this.escape(st.lastName)} | Username: ${st.username} | Password: ${st.password || '12345'}">
                      📋 Copy
                    </button>
                    <button class="btn btn-sm btn-secondary edit-student-btn" data-id="${st.id}">
                      ✏️ Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-student-btn" data-id="${st.id}">
                      🗑️
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  bindEvents(allGroups, allStudents) {
    // Sub-tab toggles
    const viewGroupsBtn = this.container.querySelector('#view-groups-tab');
    const viewRosterBtn = this.container.querySelector('#view-roster-tab');

    if (viewGroupsBtn) {
      viewGroupsBtn.addEventListener('click', () => {
        this.currentView = 'groups';
        this.render();
      });
    }

    if (viewRosterBtn) {
      viewRosterBtn.addEventListener('click', () => {
        this.currentView = 'roster';
        this.render();
      });
    }

    // Create Group modal buttons
    const createGroupBtn = this.container.querySelector('#create-group-btn');
    const emptyCreateGroupBtn = this.container.querySelector('#empty-create-group-btn');
    if (createGroupBtn) createGroupBtn.addEventListener('click', () => this.showCreateGroupModal());
    if (emptyCreateGroupBtn) emptyCreateGroupBtn.addEventListener('click', () => this.showCreateGroupModal());

    // Add Student modal buttons
    const addStudentBtn = this.container.querySelector('#add-student-btn');
    const emptyAddStudentBtn = this.container.querySelector('#empty-add-student-btn');
    if (addStudentBtn) addStudentBtn.addEventListener('click', () => this.showAddStudentModal(allGroups));
    if (emptyAddStudentBtn) emptyAddStudentBtn.addEventListener('click', () => this.showAddStudentModal(allGroups));

    // Quick add student to specific group
    this.container.querySelectorAll('.quick-add-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const groupId = btn.getAttribute('data-group-id');
        this.showAddStudentModal(allGroups, groupId);
      });
    });

    // Graduate Group button
    this.container.querySelectorAll('.graduate-group-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const groupId = btn.getAttribute('data-id');
        const currentLevel = btn.getAttribute('data-level');
        this.showGraduateGroupModal(groupId, currentLevel);
      });
    });

    // Edit Group button
    this.container.querySelectorAll('.edit-group-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const groupId = btn.getAttribute('data-id');
        this.showEditGroupModal(groupId);
      });
    });

    // Delete Group button
    this.container.querySelectorAll('.delete-group-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const groupId = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this group? (Students will not be deleted, but unassigned from this group).')) {
          await window.authManager.deleteGroup(groupId);
          window.showToast('Group deleted.');
          this.render();
        }
      });
    });

    // Edit Student button
    this.container.querySelectorAll('.edit-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = btn.getAttribute('data-id');
        this.showEditStudentModal(studentId, allGroups);
      });
    });

    // Delete Student button
    this.container.querySelectorAll('.delete-student-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const studentId = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this student account?')) {
          await window.authManager.deleteStudent(studentId);
          window.showToast('Student deleted.');
          this.render();
        }
      });
    });

    // Copy single student login info
    this.container.querySelectorAll('.copy-one-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const info = btn.getAttribute('data-info');
        if (info) {
          navigator.clipboard.writeText(info).then(() => {
            window.showToast(window.i18n.get('credentialsCopied'));
          });
        }
      });
    });

    // Copy all roster credentials
    const copyAllBtn = this.container.querySelector('#copy-all-roster-btn');
    if (copyAllBtn) {
      copyAllBtn.addEventListener('click', () => {
        const text = allStudents.map(s => {
          const g = allGroups.find(grp => grp.id === s.groupId);
          return `${s.firstName} ${s.lastName} | Username: ${s.username} | Password: ${s.password || '12345'} | Group: ${g?.name || 'None'} (${s.level})`;
        }).join('\n');
        navigator.clipboard.writeText(text).then(() => {
          window.showToast('All student credentials copied to clipboard!');
        });
      });
    }
  }

  // Create Group Modal
  showCreateGroupModal() {
    const modalId = 'create-group-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard'];

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>👥 ${window.i18n.get('createGroupBtn')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="create-group-form" class="modal-body">
            <div class="form-group">
              <label>${window.i18n.get('groupNameLabel')} *</label>
              <input type="text" id="grp-name-input" class="form-control" required placeholder="${window.i18n.get('groupNamePlaceholder')}"/>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('selectLevel')} *</label>
              <select id="grp-level-select" class="form-control" required>
                ${levels.map(lvl => `<option value="${lvl}">${lvl}</option>`).join('')}
              </select>
            </div>

            <div class="modal-footer mt-4">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              <button type="submit" class="btn btn-primary">${window.i18n.get('save')}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#create-group-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = modal.querySelector('#grp-name-input').value.trim();
      const level = modal.querySelector('#grp-level-select').value;

      try {
        await window.authManager.createGroup({ name, level });
        modal.remove();
        window.showToast(window.i18n.get('groupCreatedSuccess'));
        this.render();
      } catch (err) {
        alert(err.message || 'Error creating group');
      }
    });
  }

  // Edit Group Modal
  async showEditGroupModal(groupId) {
    const group = await window.appDB.get('groups', groupId);
    if (!group) return;

    const modalId = 'edit-group-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard', 'Graduated'];

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>✏️ ${window.i18n.get('editGroup')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="edit-group-form" class="modal-body">
            <div class="form-group">
              <label>${window.i18n.get('groupNameLabel')} *</label>
              <input type="text" id="edit-grp-name-input" class="form-control" required value="${this.escape(group.name)}"/>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('selectLevel')} *</label>
              <select id="edit-grp-level-select" class="form-control">
                ${levels.map(l => `<option value="${l}" ${l === group.level ? 'selected' : ''}>${l}</option>`).join('')}
              </select>
            </div>

            <div class="modal-footer mt-4">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              <button type="submit" class="btn btn-primary">${window.i18n.get('save')}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#edit-group-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = modal.querySelector('#edit-grp-name-input').value.trim();
      const level = modal.querySelector('#edit-grp-level-select').value;

      await window.authManager.updateGroup(groupId, { name, level });
      modal.remove();
      window.showToast('Group updated successfully!');
      this.render();
    });
  }

  // Graduate / Change Group Level Modal
  async showGraduateGroupModal(groupId, currentLevel) {
    const group = await window.appDB.get('groups', groupId);
    if (!group) return;

    const modalId = 'grad-group-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard', 'Graduated'];
    const currIdx = levels.indexOf(currentLevel);
    const suggestedNext = currIdx !== -1 && currIdx < levels.length - 1 ? levels[currIdx + 1] : currentLevel;

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>🎓 ${window.i18n.get('graduateGroup')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p class="mb-3">
              Promote group <strong>"${this.escape(group.name)}"</strong> to a new level. All enrolled students in this group will automatically graduate to this level!
            </p>

            <div class="form-group">
              <label>Current Level:</label>
              <div><span class="badge badge-teacher">🎓 ${currentLevel}</span></div>
            </div>

            <div class="form-group mt-3">
              <label>Select New Promoted Level *</label>
              <select id="grad-target-level-select" class="form-control">
                ${levels.map(l => `<option value="${l}" ${l === suggestedNext ? 'selected' : ''}>${l}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
            <button type="button" id="confirm-grad-btn" class="btn btn-primary">🎓 Confirm Promotion</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#confirm-grad-btn').addEventListener('click', async () => {
      const targetLevel = modal.querySelector('#grad-target-level-select').value;
      const res = await window.authManager.graduateGroup(groupId, targetLevel);
      modal.remove();
      if (res) {
        alert(`${window.i18n.get('groupGraduatedSuccess')}\nNew Level: ${res.nextLevel} (${res.count} students updated)`);
      }
      this.render();
    });
  }

  // Add Student Modal (Pre-created account)
  showAddStudentModal(allGroups, preselectedGroupId = null) {
    const modalId = 'add-student-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard'];

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>🧑‍🎓 ${window.i18n.get('createStudentBtn')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="add-student-form" class="modal-body">
            <div class="form-row">
              <div class="form-group col-half">
                <label>${window.i18n.get('nameLabel')} *</label>
                <input type="text" id="st-firstname-input" class="form-control" required placeholder="e.g. Jasur"/>
              </div>
              <div class="form-group col-half">
                <label>${window.i18n.get('lastNameLabel')} *</label>
                <input type="text" id="st-lastname-input" class="form-control" required placeholder="e.g. Karimov"/>
              </div>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('usernameLabel')} * (For Student Login)</label>
              <input type="text" id="st-username-input" class="form-control" required placeholder="e.g. jasur123"/>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('passwordLabel')} *</label>
              <input type="text" id="st-password-input" class="form-control" required value="12345"/>
              <span class="text-xs text-gray mt-1 block">${window.i18n.get('defaultPasswordHint')}</span>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label>${window.i18n.get('selectGroup')}</label>
                <select id="st-group-select" class="form-control">
                  <option value="">-- No Group Yet --</option>
                  ${allGroups.map(g => `<option value="${g.id}" ${g.id === preselectedGroupId ? 'selected' : ''}>${g.name} (${g.level})</option>`).join('')}
                </select>
              </div>

              <div class="form-group col-half">
                <label>${window.i18n.get('selectLevel')}</label>
                <select id="st-level-select" class="form-control">
                  ${levels.map(l => `<option value="${l}">${l}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="modal-footer mt-4">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              <button type="submit" class="btn btn-primary">${window.i18n.get('save')}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    // Auto update level dropdown when group selected
    const groupSelect = modal.querySelector('#st-group-select');
    const levelSelect = modal.querySelector('#st-level-select');
    groupSelect.addEventListener('change', () => {
      const grp = allGroups.find(g => g.id === groupSelect.value);
      if (grp) {
        levelSelect.value = grp.level;
      }
    });

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#add-student-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = modal.querySelector('#st-firstname-input').value.trim();
      const lastName = modal.querySelector('#st-lastname-input').value.trim();
      const username = modal.querySelector('#st-username-input').value.trim();
      const password = modal.querySelector('#st-password-input').value.trim();
      const groupId = modal.querySelector('#st-group-select').value || null;
      const level = modal.querySelector('#st-level-select').value;

      try {
        await window.authManager.createStudent({ firstName, lastName, username, password, groupId, level });
        modal.remove();
        window.showToast(window.i18n.get('studentCreatedSuccess'));
        this.render();
      } catch (err) {
        alert(err.message || 'Error creating student account');
      }
    });
  }

  // Edit Student Modal
  async showEditStudentModal(studentId, allGroups) {
    const student = await window.appDB.get('users', studentId);
    if (!student) return;

    const modalId = 'edit-student-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard', 'Graduated'];

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>✏️ Edit Student: ${this.escape(student.firstName)}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="edit-student-form" class="modal-body">
            <div class="form-row">
              <div class="form-group col-half">
                <label>${window.i18n.get('nameLabel')} *</label>
                <input type="text" id="edit-st-firstname" class="form-control" required value="${this.escape(student.firstName)}"/>
              </div>
              <div class="form-group col-half">
                <label>${window.i18n.get('lastNameLabel')} *</label>
                <input type="text" id="edit-st-lastname" class="form-control" required value="${this.escape(student.lastName)}"/>
              </div>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('usernameLabel')} *</label>
              <input type="text" id="edit-st-username" class="form-control" required value="${this.escape(student.username)}"/>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('passwordLabel')} *</label>
              <input type="text" id="edit-st-password" class="form-control" required value="${this.escape(student.password || '12345')}"/>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label>${window.i18n.get('selectGroup')}</label>
                <select id="edit-st-group" class="form-control">
                  <option value="">-- No Group --</option>
                  ${allGroups.map(g => `<option value="${g.id}" ${g.id === student.groupId ? 'selected' : ''}>${g.name} (${g.level})</option>`).join('')}
                </select>
              </div>

              <div class="form-group col-half">
                <label>${window.i18n.get('selectLevel')}</label>
                <select id="edit-st-level" class="form-control">
                  ${levels.map(l => `<option value="${l}" ${l === student.level ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="modal-footer mt-4">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              <button type="submit" class="btn btn-primary">${window.i18n.get('save')}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#edit-student-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = modal.querySelector('#edit-st-firstname').value.trim();
      const lastName = modal.querySelector('#edit-st-lastname').value.trim();
      const username = modal.querySelector('#edit-st-username').value.trim();
      const password = modal.querySelector('#edit-st-password').value.trim();
      const groupId = modal.querySelector('#edit-st-group').value || null;
      const level = modal.querySelector('#edit-st-level').value;

      await window.authManager.updateStudent(studentId, { firstName, lastName, username, password, groupId, level });
      modal.remove();
      window.showToast('Student updated successfully!');
      this.render();
    });
  }

  escape(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.studentsModule = new StudentsModule();
