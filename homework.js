// Lovely Homework! - Homework Management Module
// Handles: Levels, Paper/Oral types, Teacher assignment creation with photos,
// Student photo submissions, Oral "I am ready" / "I am not ready" buttons, and Teacher Review Gallery

class HomeworkModule {
  constructor() {
    this.selectedLevel = 'Elementary';
    this.container = null;
  }

  init(containerEl) {
    this.container = containerEl;
    // If student is logged in, their default level is fixed to their student level
    const user = window.authManager.currentUser;
    if (user && user.role === 'student' && user.level) {
      this.selectedLevel = user.level;
    }
    this.render();
  }

  setLevel(level) {
    this.selectedLevel = level;
    this.render();
  }

  async render() {
    if (!this.container) return;
    const user = window.authManager.currentUser;
    if (!user) return;

    const isTeacher = user.role === 'teacher';
    const allHomework = await window.appDB.getAll('homework');
    
    // Filter homework by selected level
    const levelHomework = allHomework.filter(h => h.level === this.selectedLevel);
    levelHomework.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get submissions for this level
    const allSubmissions = await window.appDB.getAll('submissions');
    const allUsers = await window.appDB.getAll('users');
    const studentsInLevel = allUsers.filter(u => u.role === 'student' && u.level === this.selectedLevel && u.status === 'active');

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard'];

    this.container.innerHTML = `
      <div class="section-header">
        <div class="header-left">
          <h2 class="section-title">
            <span>📝</span> ${window.i18n.get('tabHomework')}
          </h2>
          <p class="section-subtitle">
            ${isTeacher ? 'Assign exercises, set deadlines, and review student photo submissions or oral readiness' : 'Complete your assigned tasks and submit your photos before class starts'}
          </p>
        </div>

        ${isTeacher ? `
          <div class="header-actions">
            <button id="graduate-group-btn" class="btn btn-outline-danger" title="Promote entire group to the next level">
              🎓 ${window.i18n.get('graduateGroup')}
            </button>
            <button id="add-homework-btn" class="btn btn-primary">
              ➕ ${window.i18n.get('addHomework')}
            </button>
          </div>
        ` : `
          <div class="student-level-badge">
            <span>🎓 ${window.i18n.get('currentLevelBadge')}:</span>
            <strong>${this.selectedLevel}</strong>
          </div>
        `}
      </div>

      <!-- Level Selector Tabs (for Teacher; student level is locked to their assigned group) -->
      ${isTeacher ? `
        <div class="level-tabs-container">
          <div class="level-tabs">
            ${levels.map(lvl => `
              <button class="level-tab-btn ${lvl === this.selectedLevel ? 'active' : ''}" data-level="${lvl}">
                ${lvl}
                <span class="level-count">${allHomework.filter(h => h.level === lvl).length}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Homework List / Cards Grid -->
      <div class="homework-grid">
        ${levelHomework.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📂</div>
            <h3>${window.i18n.get('noHomeworkYet')}</h3>
            <p>${isTeacher ? 'Click "Add Homework" to give the first task to this group.' : 'Relax! You have no homework assigned for this level right now.'}</p>
          </div>
        ` : levelHomework.map(hw => this.renderHomeworkCard(hw, user, allSubmissions, studentsInLevel)).join('')}
      </div>
    `;

    this.bindEvents(isTeacher);
  }

  renderHomeworkCard(hw, user, allSubmissions, studentsInLevel) {
    const isTeacher = user.role === 'teacher';
    const isOral = hw.type === 'oral';
    const hwSubmissions = allSubmissions.filter(s => s.homeworkId === hw.id);
    
    // If student, get their own submission
    const studentSub = !isTeacher ? hwSubmissions.find(s => s.studentId === user.id) : null;
    const isSubmitted = studentSub && (isOral ? studentSub.readinessStatus !== null : (studentSub.photos && studentSub.photos.length > 0));

    // Due date formatting
    const dueObj = new Date(hw.dueDate);
    const isOverdue = !isNaN(dueObj.getTime()) && dueObj < new Date();
    const formattedDue = !isNaN(dueObj.getTime()) 
      ? dueObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
      : hw.dueDate;

    return `
      <div class="hw-card ${isOverdue ? 'overdue' : ''}" data-id="${hw.id}">
        <div class="hw-card-header">
          <div class="hw-type-badge ${isOral ? 'type-oral' : 'type-paper'}">
            ${isOral ? '🗣️ Oral (Speaking/Words)' : '📄 Written (Paper)'}
          </div>
          <div class="hw-due-tag ${isOverdue ? 'tag-overdue' : ''}">
            ⏳ ${window.i18n.get('dueBy')} ${formattedDue}
          </div>
        </div>

        <h3 class="hw-card-title">${this.escape(hw.title)}</h3>
        <p class="hw-card-desc">${this.escape(hw.description)}</p>

        <!-- Teacher's Attached Exercise Photos -->
        ${hw.photos && hw.photos.length > 0 ? `
          <div class="hw-attached-photos">
            <div class="attached-label">📷 Teacher's Reference / Textbook Pages:</div>
            <div class="photo-thumbnail-row">
              ${hw.photos.map((p, idx) => `
                <div class="photo-thumb" data-full="${p.dataUrl}" data-title="${this.escape(p.name || hw.title)}">
                  <img src="${p.dataUrl}" alt="${p.name || 'Textbook Page'}" loading="lazy"/>
                  <span class="zoom-hint">🔍 Tap to zoom</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Status / Action Section -->
        <div class="hw-card-footer">
          ${isTeacher ? `
            <div class="teacher-stats">
              <span class="stat-pill">👥 ${hwSubmissions.length} / ${studentsInLevel.length} submitted</span>
              ${isOral ? `
                <span class="stat-pill ready-pill">✅ Ready: ${hwSubmissions.filter(s => s.readinessStatus === 'ready').length}</span>
                <span class="stat-pill not-ready-pill">⚠️ Not Ready: ${hwSubmissions.filter(s => s.readinessStatus === 'not_ready').length}</span>
              ` : `
                <span class="stat-pill photos-pill">📸 ${hwSubmissions.reduce((acc, s) => acc + (s.photos ? s.photos.length : 0), 0)} photos</span>
              `}
            </div>
            <div class="card-btn-row">
              <button class="btn btn-sm btn-outline-primary view-submissions-btn" data-id="${hw.id}">
                👁️ ${window.i18n.get('reviewSubmissions')} (${hwSubmissions.length})
              </button>
              <button class="btn btn-sm btn-outline-danger delete-hw-btn" data-id="${hw.id}">
                🗑️
              </button>
            </div>
          ` : `
            <!-- STUDENT INTERFACE -->
            ${isOral ? `
              <!-- Oral Buttons: I am ready & I am not ready -->
              <div class="oral-status-container">
                <div class="oral-current-status">
                  ${studentSub?.readinessStatus === 'ready' 
                    ? '<span class="badge badge-success">✅ Marked: I am ready!</span>' 
                    : studentSub?.readinessStatus === 'not_ready'
                    ? '<span class="badge badge-warning">⚠️ Marked: I am not ready</span>'
                    : '<span class="badge badge-gray">⏳ Not marked yet</span>'}
                </div>
                <div class="oral-buttons-row">
                  <button class="btn btn-ready ${studentSub?.readinessStatus === 'ready' ? 'selected' : ''}" data-hw-id="${hw.id}" data-action="ready">
                    👍 ${window.i18n.get('statusReady')}
                  </button>
                  <button class="btn btn-not-ready ${studentSub?.readinessStatus === 'not_ready' ? 'selected' : ''}" data-hw-id="${hw.id}" data-action="not_ready">
                    👎 ${window.i18n.get('statusNotReady')}
                  </button>
                </div>
              </div>
            ` : `
              <!-- Written Paper: Upload Photo Interface -->
              <div class="paper-submission-container">
                ${studentSub && studentSub.photos && studentSub.photos.length > 0 ? `
                  <div class="submission-success">
                    <span class="badge badge-success">✅ Submitted (${studentSub.photos.length} photos)</span>
                    <button class="btn btn-sm btn-outline-primary upload-work-btn" data-hw-id="${hw.id}">
                      📷 View / Add More Photos
                    </button>
                  </div>
                  <div class="submitted-thumbs">
                    ${studentSub.photos.map(p => `
                      <img src="${p.dataUrl}" class="mini-thumb photo-thumb" data-full="${p.dataUrl}" title="Your uploaded homework photo"/>
                    `).join('')}
                  </div>
                ` : `
                  <button class="btn btn-primary btn-block upload-work-btn" data-hw-id="${hw.id}">
                    📸 ${window.i18n.get('uploadYourWork')}
                  </button>
                `}
              </div>
            `}
          `}
        </div>
      </div>
    `;
  }

  bindEvents(isTeacher) {
    // Level switch tabs
    this.container.querySelectorAll('.level-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lvl = btn.getAttribute('data-level');
        this.setLevel(lvl);
      });
    });

    // Add Homework Modal
    const addHwBtn = this.container.querySelector('#add-homework-btn');
    if (addHwBtn) {
      addHwBtn.addEventListener('click', () => this.showAddHomeworkModal());
    }

    // Graduate Group Button
    const gradBtn = this.container.querySelector('#graduate-group-btn');
    if (gradBtn) {
      gradBtn.addEventListener('click', () => this.handleGraduateGroup());
    }

    // Teacher: View Submissions
    this.container.querySelectorAll('.view-submissions-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hwId = btn.getAttribute('data-id');
        this.showSubmissionsModal(hwId);
      });
    });

    // Teacher: Delete Homework
    this.container.querySelectorAll('.delete-hw-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const hwId = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this homework? All student submissions will also be deleted.')) {
          await window.appDB.delete('homework', hwId);
          // Delete related submissions
          const subs = await window.appDB.getByIndex('submissions', 'homeworkId', hwId);
          for (const s of subs) {
            await window.appDB.delete('submissions', s.id);
          }
          this.render();
        }
      });
    });

    // Student: Oral Ready / Not Ready Buttons
    this.container.querySelectorAll('.btn-ready, .btn-not-ready').forEach(btn => {
      btn.addEventListener('click', async () => {
        const hwId = btn.getAttribute('data-hw-id');
        const action = btn.getAttribute('data-action'); // 'ready' or 'not_ready'
        await this.handleOralReadiness(hwId, action);
      });
    });

    // Student: Upload Work (Photo of Paper Homework)
    this.container.querySelectorAll('.upload-work-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hwId = btn.getAttribute('data-hw-id');
        this.showUploadPhotoModal(hwId);
      });
    });

    // Photo Lightbox Zoom click
    this.container.querySelectorAll('.photo-thumb').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        const fullUrl = thumb.getAttribute('data-full');
        const title = thumb.getAttribute('data-title') || 'Photo Preview';
        window.showImageLightbox(fullUrl, title);
      });
    });
  }

  // Student Oral Readiness Handler
  async handleOralReadiness(hwId, action) {
    const user = window.authManager.currentUser;
    if (!user || user.role !== 'student') return;

    const hw = await window.appDB.get('homework', hwId);
    if (!hw) return;

    const existingSubs = await window.appDB.getAll('submissions');
    let sub = existingSubs.find(s => s.homeworkId === hwId && s.studentId === user.id);

    if (!sub) {
      sub = {
        id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        homeworkId: hwId,
        studentId: user.id,
        studentName: `${user.firstName} ${user.lastName}`,
        level: user.level,
        type: 'oral',
        photos: [],
        readinessStatus: action,
        status: 'submitted',
        teacherComment: '',
        updatedAt: new Date().toISOString()
      };
    } else {
      sub.readinessStatus = action;
      sub.updatedAt = new Date().toISOString();
    }

    await window.appDB.put('submissions', sub);

    // Notify teacher
    const statusText = action === 'ready' ? 'READY 👍' : 'NOT READY ⚠️';
    await window.notifManager.createNotification({
      title: `Oral Status: ${user.firstName} ${user.lastName}`,
      message: `${user.firstName} ${user.lastName} marked as "${statusText}" for "${hw.title}".`,
      type: 'submission',
      recipientId: hw.teacherId,
      targetLevel: hw.level,
      targetItemId: hwId
    });

    window.showToast(`${window.i18n.get('oralStatusUpdated')} ${statusText}`);
    this.render();
  }

  // Graduate the group to the next level
  async handleGraduateGroup() {
    const msg = `${window.i18n.get('graduateConfirm')} (Current: ${this.selectedLevel})`;
    if (!confirm(msg)) return;

    const res = await window.authManager.graduateGroup(this.selectedLevel);
    if (res) {
      alert(`${window.i18n.get('graduatedSuccess')}\nNew Level: ${res.nextLevel} (${res.count} students promoted)`);
      this.selectedLevel = res.nextLevel !== 'Graduated' ? res.nextLevel : this.selectedLevel;
      this.render();
    } else {
      alert('This group is already at the highest level or has graduated!');
    }
  }

  // Add Homework Modal for Teacher
  showAddHomeworkModal() {
    const modalId = 'add-hw-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard'];
    // Default deadline: tomorrow at 18:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    const defaultDateStr = tomorrow.toISOString().slice(0, 16);

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3>📝 ${window.i18n.get('addHomework')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="add-hw-form" class="modal-body">
            <div class="form-group">
              <label>${window.i18n.get('homeworkTitle')} *</label>
              <input type="text" id="hw-title-input" class="form-control" required placeholder="${window.i18n.get('homeworkTitlePlaceholder')}"/>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label>Target Level *</label>
                <select id="hw-level-select" class="form-control">
                  ${levels.map(l => `<option value="${l}" ${l === this.selectedLevel ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
              </div>

              <div class="form-group col-half">
                <label>${window.i18n.get('homeworkType')} *</label>
                <select id="hw-type-select" class="form-control">
                  <option value="paper">📄 ${window.i18n.get('typePaper')}</option>
                  <option value="oral">🗣️ ${window.i18n.get('typeOral')}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('dueDate')} *</label>
              <input type="datetime-local" id="hw-due-input" class="form-control" value="${defaultDateStr}" required/>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('instructions')}</label>
              <textarea id="hw-desc-input" class="form-control" rows="3" placeholder="Enter exercises, page numbers, vocabulary instructions..."></textarea>
            </div>

            <!-- Teacher Reference Photo Uploads -->
            <div class="form-group">
              <label>${window.i18n.get('attachPhotos')}</label>
              <p class="form-hint">${window.i18n.get('attachPhotosHint')}</p>
              <div class="file-upload-box">
                <input type="file" id="hw-photos-input" accept="image/*" multiple style="display:none;"/>
                <button type="button" id="trigger-hw-photos-btn" class="btn btn-outline-primary">
                  📸 Select or Take Photos
                </button>
                <div id="hw-photo-previews" class="preview-strip"></div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              <button type="submit" class="btn btn-primary">${window.i18n.get('publishHomework')}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    const selectedPhotos = [];

    const fileInput = modal.querySelector('#hw-photos-input');
    const triggerBtn = modal.querySelector('#trigger-hw-photos-btn');
    const previewsDiv = modal.querySelector('#hw-photo-previews');

    triggerBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const file of files) {
        const dataUrl = await this.readFileAsDataURL(file);
        selectedPhotos.push({
          id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          dataUrl,
          createdAt: new Date().toISOString()
        });
      }
      this.renderSelectedPhotos(previewsDiv, selectedPhotos);
    });

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#add-hw-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = modal.querySelector('#hw-title-input').value.trim();
      const level = modal.querySelector('#hw-level-select').value;
      const type = modal.querySelector('#hw-type-select').value;
      const dueDate = modal.querySelector('#hw-due-input').value;
      const description = modal.querySelector('#hw-desc-input').value.trim();

      const newHw = {
        id: 'hw_' + Date.now(),
        teacherId: window.authManager.currentUser.id,
        title,
        level,
        type,
        dueDate,
        description,
        photos: selectedPhotos,
        createdAt: new Date().toISOString()
      };

      await window.appDB.put('homework', newHw);

      // Create notification for all students of this level
      await window.notifManager.createNotification({
        title: `New Homework: ${title}`,
        message: `Teacher ${window.authManager.currentUser.firstName} assigned: ${title}. Due: ${new Date(dueDate).toLocaleString()}`,
        type: 'homework',
        targetLevel: level,
        targetItemId: newHw.id
      });

      modal.remove();
      window.showToast('Homework published successfully! 🚀');
      this.selectedLevel = level;
      this.render();
    });
  }

  renderSelectedPhotos(container, photos) {
    container.innerHTML = photos.map((p, idx) => `
      <div class="thumb-wrapper">
        <img src="${p.dataUrl}" alt="${p.name}"/>
        <button type="button" class="thumb-remove" data-idx="${idx}">&times;</button>
      </div>
    `).join('');

    container.querySelectorAll('.thumb-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        photos.splice(idx, 1);
        this.renderSelectedPhotos(container, photos);
      });
    });
  }

  // Student Upload Homework Photos Modal
  async showUploadPhotoModal(hwId) {
    const hw = await window.appDB.get('homework', hwId);
    if (!hw) return;
    const user = window.authManager.currentUser;

    const existingSubs = await window.appDB.getAll('submissions');
    let sub = existingSubs.find(s => s.homeworkId === hwId && s.studentId === user.id);
    const currentPhotos = sub ? [...(sub.photos || [])] : [];

    const modalId = 'upload-hw-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3>📷 Upload Homework: ${this.escape(hw.title)}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p class="text-sm text-gray mb-3">
              Please take clear, well-lit photos of your written notebook pages. You can upload multiple photos.
            </p>

            <div class="upload-dropzone" id="student-dropzone">
              <input type="file" id="student-file-input" accept="image/*" capture="environment" multiple style="display:none;"/>
              <div class="dropzone-content">
                <div class="upload-icon">📸</div>
                <h4>Take a Photo or Select from Gallery</h4>
                <p>Supports JPG, PNG, HEIC. High resolution supported.</p>
                <button type="button" id="trigger-student-upload" class="btn btn-primary mt-2">
                  Choose / Take Photos
                </button>
              </div>
            </div>

            <div class="mt-4">
              <h4 class="font-bold mb-2">Attached Photos (${currentPhotos.length}):</h4>
              <div id="student-photos-preview" class="student-gallery-preview"></div>
            </div>

            ${sub?.teacherComment ? `
              <div class="teacher-feedback-box mt-3">
                <strong>👨‍🏫 Teacher Feedback:</strong>
                <p>${this.escape(sub.teacherComment)}</p>
              </div>
            ` : ''}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('close')}</button>
            <button type="button" id="save-student-submission" class="btn btn-primary">${window.i18n.get('submitWork')}</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    const fileInput = modal.querySelector('#student-file-input');
    const triggerBtn = modal.querySelector('#trigger-student-upload');
    const previewsDiv = modal.querySelector('#student-photos-preview');
    const saveBtn = modal.querySelector('#save-student-submission');

    triggerBtn.addEventListener('click', () => fileInput.click());

    const updatePreview = () => {
      if (currentPhotos.length === 0) {
        previewsDiv.innerHTML = '<p class="text-sm text-gray italic">No photos added yet.</p>';
        return;
      }
      previewsDiv.innerHTML = currentPhotos.map((p, idx) => `
        <div class="student-preview-card">
          <img src="${p.dataUrl}" alt="Photo ${idx + 1}" class="photo-thumb" data-full="${p.dataUrl}"/>
          <div class="preview-overlay">
            <button type="button" class="remove-photo-btn" data-idx="${idx}">🗑️ Delete</button>
          </div>
        </div>
      `).join('');

      previewsDiv.querySelectorAll('.remove-photo-btn').forEach(b => {
        b.addEventListener('click', () => {
          const idx = parseInt(b.getAttribute('data-idx'));
          currentPhotos.splice(idx, 1);
          updatePreview();
        });
      });

      previewsDiv.querySelectorAll('.photo-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          window.showImageLightbox(thumb.getAttribute('data-full'), 'Homework Page');
        });
      });
    };

    updatePreview();

    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const f of files) {
        const dataUrl = await this.readFileAsDataURL(f);
        currentPhotos.push({
          id: 'sub_p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: f.name,
          dataUrl,
          uploadedAt: new Date().toISOString()
        });
      }
      updatePreview();
    });

    saveBtn.addEventListener('click', async () => {
      if (currentPhotos.length === 0) {
        alert('Please attach at least one photo of your homework before submitting!');
        return;
      }

      if (!sub) {
        sub = {
          id: 'sub_' + Date.now(),
          homeworkId: hw.id,
          studentId: user.id,
          studentName: `${user.firstName} ${user.lastName}`,
          level: user.level,
          type: 'paper',
          photos: currentPhotos,
          readinessStatus: null,
          status: 'submitted',
          teacherComment: '',
          updatedAt: new Date().toISOString()
        };
      } else {
        sub.photos = currentPhotos;
        sub.status = 'submitted';
        sub.updatedAt = new Date().toISOString();
      }

      await window.appDB.put('submissions', sub);

      // Notify teacher
      await window.notifManager.createNotification({
        title: `Homework Submitted: ${user.firstName} ${user.lastName}`,
        message: `${user.firstName} ${user.lastName} submitted ${currentPhotos.length} photo(s) for "${hw.title}".`,
        type: 'submission',
        recipientId: hw.teacherId,
        targetLevel: hw.level,
        targetItemId: hw.id
      });

      modal.remove();
      window.showToast(window.i18n.get('workSubmitted'));
      this.render();
    });

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));
  }

  // Teacher Review Submissions Modal (All students in level + submitted photos & oral status)
  async showSubmissionsModal(hwId) {
    const hw = await window.appDB.get('homework', hwId);
    if (!hw) return;

    const allSubmissions = await window.appDB.getAll('submissions');
    const hwSubs = allSubmissions.filter(s => s.homeworkId === hwId);

    const allUsers = await window.appDB.getAll('users');
    const studentsInLevel = allUsers.filter(u => u.role === 'student' && u.level === hw.level && u.status === 'active');

    const modalId = 'review-subs-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const isOral = hw.type === 'oral';

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-xl">
          <div class="modal-header">
            <div>
              <h3>📋 ${window.i18n.get('reviewSubmissions')}: ${this.escape(hw.title)}</h3>
              <p class="text-sm text-gray">Level: <strong>${hw.level}</strong> &bull; Total Students: <strong>${studentsInLevel.length}</strong> &bull; Type: <strong>${isOral ? 'Oral' : 'Written Paper'}</strong></p>
            </div>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="submissions-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Status</th>
                    ${isOral ? '<th>Readiness</th>' : '<th>Uploaded Photos</th>'}
                    <th>Submitted At</th>
                    <th>Teacher Feedback / Comment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${studentsInLevel.map(student => {
                    const sub = hwSubs.find(s => s.studentId === student.id);
                    const hasSubmitted = !!sub;

                    return `
                      <tr class="${hasSubmitted ? 'row-submitted' : 'row-pending'}">
                        <td>
                          <strong>${this.escape(student.firstName)} ${this.escape(student.lastName)}</strong>
                          <div class="text-xs text-gray">${student.email || ''}</div>
                        </td>
                        <td>
                          ${hasSubmitted 
                            ? `<span class="badge badge-success">Submitted</span>` 
                            : `<span class="badge badge-gray">Not yet submitted</span>`}
                        </td>
                        ${isOral ? `
                          <td>
                            ${sub?.readinessStatus === 'ready' 
                              ? '<span class="badge badge-success">👍 Ready</span>' 
                              : sub?.readinessStatus === 'not_ready'
                              ? '<span class="badge badge-warning">👎 Not Ready</span>'
                              : '<span class="text-xs text-gray">Pending response</span>'}
                          </td>
                        ` : `
                          <td>
                            ${sub && sub.photos && sub.photos.length > 0 ? `
                              <div class="table-photos-strip">
                                ${sub.photos.map(p => `
                                  <img src="${p.dataUrl}" class="table-thumb photo-thumb" data-full="${p.dataUrl}" data-title="${this.escape(student.firstName)}'s homework photo" title="Click to view full photo"/>
                                `).join('')}
                              </div>
                            ` : '<span class="text-xs text-gray">No photos</span>'}
                          </td>
                        `}
                        <td class="text-xs text-gray">
                          ${sub ? new Date(sub.updatedAt).toLocaleString() : '—'}
                        </td>
                        <td>
                          <input type="text" class="form-control form-control-sm teacher-comment-input" 
                                 data-sub-id="${sub?.id || ''}" 
                                 data-student-id="${student.id}"
                                 value="${this.escape(sub?.teacherComment || '')}" 
                                 placeholder="Add grade or note..."/>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-primary save-feedback-btn" 
                                  data-sub-id="${sub?.id || ''}" 
                                  data-student-id="${student.id}">
                            💾 Save
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
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

    // Save comments
    modal.querySelectorAll('.save-feedback-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const studentId = btn.getAttribute('data-student-id');
        let subId = btn.getAttribute('data-sub-id');
        const input = modal.querySelector(`.teacher-comment-input[data-student-id="${studentId}"]`);
        const comment = input ? input.value.trim() : '';

        let sub = subId ? await window.appDB.get('submissions', subId) : null;
        if (!sub) {
          const st = studentsInLevel.find(s => s.id === studentId);
          sub = {
            id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            homeworkId: hw.id,
            studentId: studentId,
            studentName: `${st?.firstName} ${st?.lastName}`,
            level: hw.level,
            type: hw.type,
            photos: [],
            readinessStatus: null,
            status: 'reviewed',
            teacherComment: comment,
            updatedAt: new Date().toISOString()
          };
        } else {
          sub.teacherComment = comment;
          sub.status = 'reviewed';
        }

        await window.appDB.put('submissions', sub);
        window.showToast('Feedback saved! 💾');
      });
    });

    // Lightbox for photos in table
    modal.querySelectorAll('.photo-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        window.showImageLightbox(thumb.getAttribute('data-full'), thumb.getAttribute('data-title'));
      });
    });

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));
  }

  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  escape(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.homeworkModule = new HomeworkModule();
