// Lovely Homework! - Materials / Video Lessons Module
// Organized per level. Holds PDFs, Word Docs, Video Lessons, Infographics.
// Teacher has full managerial controls (Add/Edit/Delete).
// Students have clean read-only viewing and streaming access.

class MaterialsModule {
  constructor() {
    this.selectedLevel = 'Elementary';
    this.container = null;
  }

  init(containerEl) {
    this.container = containerEl;
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
    const allMaterials = await window.appDB.getAll('materials');

    // Filter by level
    const levelMaterials = allMaterials.filter(m => m.level === this.selectedLevel);
    levelMaterials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard'];

    this.container.innerHTML = `
      <div class="section-header">
        <div class="header-left">
          <h2 class="section-title">
            <span>📚</span> ${window.i18n.get('tabMaterials')}
          </h2>
          <p class="section-subtitle">
            ${isTeacher 
              ? 'Upload grammar guides, PDF exercises, video lessons, and vocabulary charts' 
              : window.i18n.get('readOnlyNotice')}
          </p>
        </div>

        ${isTeacher ? `
          <div class="header-actions">
            <button id="add-material-btn" class="btn btn-primary">
              ➕ ${window.i18n.get('addMaterial')}
            </button>
          </div>
        ` : `
          <div class="student-level-badge">
            <span>🎓 ${window.i18n.get('currentLevelBadge')}:</span>
            <strong>${this.selectedLevel}</strong>
          </div>
        `}
      </div>

      <!-- Level Selector (Teacher only) -->
      ${isTeacher ? `
        <div class="level-tabs-container">
          <div class="level-tabs">
            ${levels.map(lvl => `
              <button class="level-tab-btn ${lvl === this.selectedLevel ? 'active' : ''}" data-level="${lvl}">
                ${lvl}
                <span class="level-count">${allMaterials.filter(m => m.level === lvl).length}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Materials Grid -->
      <div class="materials-grid">
        ${levelMaterials.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📁</div>
            <h3>${window.i18n.get('noMaterialsYet')}</h3>
            <p>${isTeacher ? 'Click "Add Material / Video" to upload files or lessons for this level.' : 'No materials have been published for this level yet.'}</p>
          </div>
        ` : levelMaterials.map(mat => this.renderMaterialCard(mat, isTeacher)).join('')}
      </div>
    `;

    this.bindEvents(isTeacher);
  }

  renderMaterialCard(mat, isTeacher) {
    let icon = '📄';
    let badgeClass = 'cat-pdf';
    let catLabel = 'PDF';

    if (mat.category === 'video') {
      icon = '🎬';
      badgeClass = 'cat-video';
      catLabel = 'Video Lesson';
    } else if (mat.category === 'document') {
      icon = '📝';
      badgeClass = 'cat-doc';
      catLabel = 'Word Doc';
    } else if (mat.category === 'photo') {
      icon = '🖼️';
      badgeClass = 'cat-photo';
      catLabel = 'Infographic';
    } else if (mat.category === 'audio') {
      icon = '🎧';
      badgeClass = 'cat-audio';
      catLabel = 'Audio';
    }

    return `
      <div class="material-card" data-id="${mat.id}">
        <div class="material-card-top">
          <div class="material-type-pill ${badgeClass}">
            <span>${icon}</span> ${catLabel}
          </div>
          <span class="material-date text-xs text-gray">
            ${new Date(mat.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div class="material-card-body">
          <h3 class="material-title">${this.escape(mat.title)}</h3>
          <p class="material-desc">${this.escape(mat.description || 'No description provided.')}</p>
          ${mat.fileName ? `<div class="material-file-info">📎 ${this.escape(mat.fileName)} ${mat.fileSize ? `(${mat.fileSize})` : ''}</div>` : ''}
        </div>

        <div class="material-card-footer">
          <button class="btn btn-primary btn-sm open-material-btn" data-id="${mat.id}">
            👁️ ${window.i18n.get('viewMaterial')}
          </button>

          ${isTeacher ? `
            <div class="teacher-action-btns">
              <button class="btn btn-sm btn-outline-danger delete-material-btn" data-id="${mat.id}" title="Delete material">
                🗑️
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  bindEvents(isTeacher) {
    // Level tabs
    this.container.querySelectorAll('.level-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lvl = btn.getAttribute('data-level');
        this.setLevel(lvl);
      });
    });

    // Add Material Modal
    const addBtn = this.container.querySelector('#add-material-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddMaterialModal());
    }

    // Open Material Viewer
    this.container.querySelectorAll('.open-material-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openMaterialViewer(id);
      });
    });

    // Delete Material (Teacher only)
    this.container.querySelectorAll('.delete-material-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this material?')) {
          await window.appDB.delete('materials', id);
          this.render();
        }
      });
    });
  }

  // Add Material Modal for Teacher
  showAddMaterialModal() {
    const modalId = 'add-mat-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const levels = ['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'IELTS Novice', 'IELTS Standard'];

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3>📚 ${window.i18n.get('addMaterial')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="add-mat-form" class="modal-body">
            <div class="form-group">
              <label>${window.i18n.get('materialName')} *</label>
              <input type="text" id="mat-title-input" class="form-control" required placeholder="${window.i18n.get('materialNamePlaceholder')}"/>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label>Target Level *</label>
                <select id="mat-level-select" class="form-control">
                  ${levels.map(l => `<option value="${l}" ${l === this.selectedLevel ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
              </div>

              <div class="form-group col-half">
                <label>${window.i18n.get('materialType')} *</label>
                <select id="mat-category-select" class="form-control">
                  <option value="video">🎬 ${window.i18n.get('typeVideo')}</option>
                  <option value="pdf">📄 ${window.i18n.get('typePdf')}</option>
                  <option value="document">📝 ${window.i18n.get('typeWord')}</option>
                  <option value="photo">🖼️ ${window.i18n.get('typePhoto')}</option>
                  <option value="audio">🎧 ${window.i18n.get('typeAudio')}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('instructions')}</label>
              <textarea id="mat-desc-input" class="form-control" rows="2" placeholder="Brief explanation of this material..."></textarea>
            </div>

            <div class="form-group">
              <label>${window.i18n.get('uploadFileOrLink')} *</label>
              <div class="input-tabs">
                <label><input type="radio" name="mat-source-type" value="file" checked/> Upload File (PDF, DOCX, MP4, IMG)</label>
                <label><input type="radio" name="mat-source-type" value="url"/> Video or Web Link URL</label>
              </div>

              <div id="mat-file-upload-section" class="mt-2">
                <input type="file" id="mat-file-input" class="form-control"/>
              </div>

              <div id="mat-url-section" class="mt-2 hidden">
                <input type="url" id="mat-url-input" class="form-control" placeholder="https://example.com/video.mp4 or YouTube / Vimeo link"/>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('cancel')}</button>
              <button type="submit" class="btn btn-primary">${window.i18n.get('save')}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    const sourceRadios = modal.querySelectorAll('input[name="mat-source-type"]');
    const fileSec = modal.querySelector('#mat-file-upload-section');
    const urlSec = modal.querySelector('#mat-url-section');

    sourceRadios.forEach(r => {
      r.addEventListener('change', () => {
        if (r.value === 'file') {
          fileSec.classList.remove('hidden');
          urlSec.classList.add('hidden');
        } else {
          fileSec.classList.add('hidden');
          urlSec.classList.remove('hidden');
        }
      });
    });

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#add-mat-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = modal.querySelector('#mat-title-input').value.trim();
      const level = modal.querySelector('#mat-level-select').value;
      const category = modal.querySelector('#mat-category-select').value;
      const description = modal.querySelector('#mat-desc-input').value.trim();
      const sourceType = modal.querySelector('input[name="mat-source-type"]:checked').value;

      let fileData = '';
      let fileName = '';
      let fileSize = '';

      if (sourceType === 'file') {
        const file = modal.querySelector('#mat-file-input').files[0];
        if (!file) {
          alert('Please select a file to upload!');
          return;
        }
        fileData = await this.readFileAsDataURL(file);
        fileName = file.name;
        fileSize = this.formatFileSize(file.size);
      } else {
        fileData = modal.querySelector('#mat-url-input').value.trim();
        if (!fileData) {
          alert('Please enter a valid link or URL!');
          return;
        }
        fileName = 'Web Link';
        fileSize = 'Streaming';
      }

      const newMat = {
        id: 'mat_' + Date.now(),
        teacherId: window.authManager.currentUser.id,
        title,
        level,
        category,
        description,
        fileData,
        fileName,
        fileSize,
        createdAt: new Date().toISOString()
      };

      await window.appDB.put('materials', newMat);

      // Notify students of this level
      await window.notifManager.createNotification({
        title: `New Material: ${title}`,
        message: `Teacher added new material "${title}" for ${level}.`,
        type: 'material',
        targetLevel: level,
        targetItemId: newMat.id
      });

      modal.remove();
      window.showToast('Material added successfully! 📚');
      this.selectedLevel = level;
      this.render();
    });
  }

  // Open viewer modal for Video or Documents
  async openMaterialViewer(id) {
    const mat = await window.appDB.get('materials', id);
    if (!mat) return;

    const modalId = 'view-mat-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    let contentHtml = '';

    if (mat.category === 'video') {
      contentHtml = `
        <div class="video-container">
          <video controls autoplay class="w-full rounded" style="max-height: 520px; background: #000;">
            <source src="${mat.fileData}" type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    } else if (mat.category === 'photo' || mat.fileData.startsWith('data:image/')) {
      contentHtml = `
        <div class="text-center">
          <img src="${mat.fileData}" alt="${mat.title}" class="max-w-full rounded shadow" style="max-height: 70vh; object-fit: contain;"/>
        </div>
      `;
    } else if (mat.category === 'pdf') {
      contentHtml = `
        <div class="doc-viewer-box">
          <iframe src="${mat.fileData}" width="100%" height="550px" style="border:none; border-radius: 8px;"></iframe>
        </div>
      `;
    } else {
      contentHtml = `
        <div class="doc-download-card">
          <div class="doc-icon">📄</div>
          <h3>${this.escape(mat.title)}</h3>
          <p>${this.escape(mat.description)}</p>
          <a href="${mat.fileData}" download="${mat.fileName || 'Material.docx'}" class="btn btn-primary mt-3">
            📥 Download Document (${mat.fileName || 'File'})
          </a>
        </div>
      `;
    }

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <div>
              <h3>${this.escape(mat.title)}</h3>
              <span class="text-xs text-gray">Level: ${mat.level} &bull; ${mat.category.toUpperCase()}</span>
            </div>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            ${contentHtml}
            ${mat.description ? `
              <div class="material-notes-box mt-3">
                <strong>📝 Notes:</strong>
                <p>${this.escape(mat.description)}</p>
              </div>
            ` : ''}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">${window.i18n.get('close')}</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);
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

  formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  escape(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.materialsModule = new MaterialsModule();
