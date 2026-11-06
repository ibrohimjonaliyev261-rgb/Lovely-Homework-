// Lovely Homework! - Groups & Students Roster Hub
// Handles: Groups creation, Group level updates/graduation, Pre-created Student accounts,
// Changing student's group, Removing/deleting students, Roster credentials viewing & sharing.

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
            Manage your student groups, assign pre-created credentials, change groups, and graduate classes
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
          <p>Create your first group (e.g. "Morning Elementary-1" or "118 Pre-Intermediate") to organize your students.</p>
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
                  <div class="group-box-actions">
                    <button class="btn btn-sm btn-link quick-add-student-btn" data-group-id="${grp.id}">
                      ➕ Add Student
                    </button>
                    <button class="btn btn-sm btn-link quick-transfer-student-btn" data-group-id="${grp.id}" title="Move an existing student into this group">
                      ${window.i18n.get('moveStudentHere')}
                    </button>
                  </div>
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
                          <button class="btn btn-sm btn-link change-group-btn" data-id="${st.id}" data-current-group="${grp.id}" title="${window.i18n.get('changeGroupBtn')}">
                            🔄
                          </button>
                          <button class="btn btn-sm btn-link edit-student-btn" data-id="${st.id}" title="Edit Student">
                            ✏️
                          </button>
                          <button class="btn btn-sm btn-link remove-student-btn text-red" data-id="${st.id}" data-current-group="${grp.id}" title="${window.i18n.get('removeStudentBtn')}">
                            🗑️
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
        <div class="roster-table-header p-3" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color);">
          <span class="font-bold text-sm">Total Students: ${allStudents.length}</span>
          <button id="copy-all-roster-btn" class="btn btn-outline-primary btn-sm">
            📋 ${window.i18n.get('copyCredentials')} (All Students)
          </button>
        </div>

        <table class="roster-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Group</th>
              <th>Level</th>
              <th style="text-align:right;">Actions</th>
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
                    ${grp 
                      ? `<span class="badge badge-info">${this.escape(grp.name)}</span>` 
                      : '<span class="text-xs text-gray italic">No Group</span>'}
                  </td>
                  <td>
                    <span class="badge badge-teacher">${st.level || 'Beginner'}</span>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:inline-flex; gap:0.35rem; align-items:center;">
                      <button class="btn btn-sm btn-outline-primary copy-one-btn" data-info="${this.escape(st.firstName)} ${this.escape(st.lastName)} | Username: ${st.username} | Password: ${st.password || '12345'}" title="Copy">
                        📋
                      </button>
                      <button class="btn btn-sm btn-secondary change-group-btn" data-id="${st.id}" data-current-group="${st.groupId || ''}" title="${window.i18n.get('changeGroupBtn')}">
                        🔄 ${window.i18n.get('changeGroupBtn')}
                      </button>
                      <button class="btn btn-sm btn-secondary edit-student-btn" data-id="${st.id}" title="Edit">
                        ✏️
                      </button>
                      <button class="btn btn-sm btn-outline-danger remove-student-btn" data-id="${st.id}" data-current-group="${st.groupId || ''}" title="${window.i18n.get('removeStudentBtn')}">
                        🗑️
                      </button>
                    </div>
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

    // Quick transfer / enroll student into this group
    this.container.querySelectorAll('.quick-transfer-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const groupId = btn.getAttribute('data-group-id');
        this.showMoveStudentHereModal(groupId, allGroups, allStudents);
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

    // Change Group for a student
    this.container.querySelectorAll('.change-group-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = btn.getAttribute('data-id');
        this.showChangeGroupModal(studentId, allGroups);
      });
    });

    // Edit Student button
    this.container.querySelectorAll('.edit-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = btn.getAttribute('data-id');
        this.showEditStudentModal(studentId, allGroups);
      });
    });

    // Remove / Delete Student button
    this.container.querySelectorAll('.remove-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = btn.getAttribute('data-id');
        const currentGroupId = btn.getAttribute('data-current-group');
        this.showRemoveStudentModal(studentId, currentGroupId);
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

  // Change Student's Group Modal
  async showChangeGroupModal(studentId, allGroups) {
    const student = await window.appDB.get('users', studentId);
    if (!student) return;

    const modalId = 'change-group-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const currentGroup = allGroups.find(g => g.id === student.groupId);

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>🔄 ${window.i18n.get('changeGroupTitle')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="change-group-form" class="modal-body">
            <div class="student-profile-summary-box mb-3 p-3" style="background:var(--primary-red-subtle); border-radius:var(--radius-md); border:1px solid var(--primary-red-border);">
              <div style="font-size:1.05rem;">🧑‍🎓 <strong>${this.escape(student.firstName)} ${this.escape(student.lastName)}</strong> (<code>${this.escape(student.username)}</code>)</div>
              <div class="text-xs text-gray mt-1">
                ${window.i18n.get('currentGroup')}: <strong>${currentGroup ? this.escape(currentGroup.name) : 'No Group'}</strong> &bull; Level: <strong>${student.level}</strong>
              </div>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('targetGroup')} *</label>
              <select id="transfer-target-group-select" class="form-control">
                <option value="">-- No Group (Unassigned) --</option>
                ${allGroups.map(g => `
                  <option value="${g.id}" ${g.id === student.groupId ? 'selected' : ''}>
                    ${this.escape(g.name)} (Level: ${g.level})
                  </option>
                `).join('')}
              </select>
            </div>

            <div id="transfer-level-preview" class="notice-box mt-3 p-2 text-xs" style="background:var(--bg-subtle); border-radius:var(--radius-sm); border:1px solid var(--border-color);">
              💡 <em>Student's level will automatically update to match the selected group.</em>
            </div>

            <div class="modal-footer mt-4">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              <button type="submit" class="btn btn-primary">
                ${window.i18n.get('confirmTransfer')} 🚀
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    const selectEl = modal.querySelector('#transfer-target-group-select');
    const previewEl = modal.querySelector('#transfer-level-preview');

    const updatePreview = () => {
      const selectedId = selectEl.value;
      const grp = allGroups.find(g => g.id === selectedId);
      if (grp) {
        previewEl.innerHTML = `✅ <strong>New Group:</strong> ${this.escape(grp.name)} &bull; <strong>New Level:</strong> <span class="badge badge-teacher">${grp.level}</span>`;
      } else {
        previewEl.innerHTML = `⚠️ <em>Student will be unassigned from all groups, keeping their current level (${student.level}).</em>`;
      }
    };

    selectEl.addEventListener('change', updatePreview);
    updatePreview();

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#change-group-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const targetGroupId = selectEl.value || null;
      await window.authManager.changeStudentGroup(studentId, targetGroupId);
      modal.remove();
      window.showToast(window.i18n.get('studentMovedSuccess'));
      this.render();
    });
  }

  // Remove Student Modal: Choose between "Remove from this group only" or "Delete permanently"
  async showRemoveStudentModal(studentId, currentGroupId = null) {
    const student = await window.appDB.get('users', studentId);
    if (!student) return;

    let currentGroup = null;
    const targetGid = currentGroupId || student.groupId;
    if (targetGid) {
      currentGroup = await window.appDB.get('groups', targetGid);
    }

    const modalId = 'remove-student-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>🗑️ ${window.i18n.get('removeStudentTitle')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p class="mb-3">
              What action would you like to take for <strong>${this.escape(student.firstName)} ${this.escape(student.lastName)}</strong> (<code>${this.escape(student.username)}</code>)?
            </p>

            <div class="remove-options-grid" style="display:flex; flex-direction:column; gap:0.85rem;">
              ${currentGroup ? `
                <button type="button" id="btn-remove-from-group-only" class="btn btn-secondary text-left p-3" style="display:flex; align-items:flex-start; gap:0.75rem; border:1px solid var(--border-color); text-align:left; cursor:pointer;">
                  <span style="font-size:1.6rem;">🚪</span>
                  <div>
                    <strong style="color:var(--text-main); font-size:0.95rem;">${window.i18n.get('removeFromGroup')} ("${this.escape(currentGroup.name)}")</strong>
                    <p class="text-xs text-gray mt-1">Keeps student's login and past submissions intact, but removes them from this group.</p>
                  </div>
                </button>
              ` : ''}

              <button type="button" id="btn-delete-student-completely" class="btn btn-outline-danger text-left p-3" style="display:flex; align-items:flex-start; gap:0.75rem; text-align:left; cursor:pointer;">
                <span style="font-size:1.6rem;">🗑️</span>
                <div>
                  <strong style="font-size:0.95rem;">${window.i18n.get('deleteStudentPermanently')}</strong>
                  <p class="text-xs text-gray mt-1">Use this if the student has left the course or school completely. Deletes their login profile.</p>
                </div>
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    const removeFromGroupBtn = modal.querySelector('#btn-remove-from-group-only');
    if (removeFromGroupBtn) {
      removeFromGroupBtn.addEventListener('click', async () => {
        await window.authManager.removeStudentFromGroup(studentId);
        modal.remove();
        window.showToast(`${student.firstName} was removed from ${currentGroup?.name || 'the group'}.`);
        this.render();
      });
    }

    const deleteCompletelyBtn = modal.querySelector('#btn-delete-student-completely');
    if (deleteCompletelyBtn) {
      deleteCompletelyBtn.addEventListener('click', async () => {
        if (confirm(`Are you completely sure you want to delete ${student.firstName} ${student.lastName}? This cannot be undone.`)) {
          await window.authManager.deleteStudent(studentId);
          modal.remove();
          window.showToast(window.i18n.get('studentRemovedSuccess'));
          this.render();
        }
      });
    }
  }

  // Move Student Here Modal: Allows moving any existing student into this target group
  async showMoveStudentHereModal(targetGroupId, allGroups, allStudents) {
    const targetGroup = allGroups.find(g => g.id === targetGroupId);
    if (!targetGroup) return;

    const candidateStudents = allStudents.filter(s => s.groupId !== targetGroupId);

    const modalId = 'move-student-here-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-md">
          <div class="modal-header">
            <h3>🔄 ${window.i18n.get('moveStudentHere')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="move-student-here-form" class="modal-body">
            <div class="mb-3 p-3" style="background:var(--primary-red-subtle); border-radius:var(--radius-md); border:1px solid var(--primary-red-border);">
              <strong>Target Group:</strong> ${this.escape(targetGroup.name)}
              <span class="badge badge-teacher ml-2">🎓 ${targetGroup.level}</span>
            </div>

            ${candidateStudents.length === 0 ? `
              <p class="text-sm text-gray italic">All registered students are already enrolled in this group, or there are no other students created yet.</p>
            ` : `
              <div class="form-group">
                <label>Select Student to Transfer to "${this.escape(targetGroup.name)}" *</label>
                <select id="candidate-student-select" class="form-control" required>
                  ${candidateStudents.map(s => {
                    const currGrp = allGroups.find(g => g.id === s.groupId);
                    const grpName = currGrp ? currGrp.name : 'No Group';
                    return `<option value="${s.id}">${this.escape(s.firstName)} ${this.escape(s.lastName)} (Current: ${grpName} - ${s.level})</option>`;
                  }).join('')}
                </select>
                <p class="text-xs text-gray mt-1">Their group and level will automatically change to ${this.escape(targetGroup.name)} (${targetGroup.level}).</p>
              </div>
            `}

            <div class="modal-footer mt-4">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              ${candidateStudents.length > 0 ? `
                <button type="submit" class="btn btn-primary">
                  ${window.i18n.get('confirmTransfer')} 🚀
                </button>
              ` : ''}
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#move-student-here-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const stSelect = modal.querySelector('#candidate-student-select');
      if (!stSelect) return;
      const studentId = stSelect.value;
      await window.authManager.changeStudentGroup(studentId, targetGroupId);
      modal.remove();
      window.showToast(window.i18n.get('studentMovedSuccess'));
      this.render();
    });
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
    const preselectedGroup = allGroups.find(g => g.id === preselectedGroupId);
    const initialLevel = preselectedGroup ? preselectedGroup.level : 'Elementary';

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
                  ${allGroups.map(g => `<option value="${g.id}" ${g.id === preselectedGroupId ? 'selected' : ''}>${this.escape(g.name)} (${g.level})</option>`).join('')}
                </select>
              </div>

              <div class="form-group col-half">
                <label>${window.i18n.get('selectLevel')}</label>
                <select id="st-level-select" class="form-control">
                  ${levels.map(l => `<option value="${l}" ${l === initialLevel ? 'selected' : ''}>${l}</option>`).join('')}
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
                  ${allGroups.map(g => `<option value="${g.id}" ${g.id === student.groupId ? 'selected' : ''}>${this.escape(g.name)} (${g.level})</option>`).join('')}
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

    const groupSelect = modal.querySelector('#edit-st-group');
    const levelSelect = modal.querySelector('#edit-st-level');
    groupSelect.addEventListener('change', () => {
      const grp = allGroups.find(g => g.id === groupSelect.value);
      if (grp) {
        levelSelect.value = grp.level;
      }
    });

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
