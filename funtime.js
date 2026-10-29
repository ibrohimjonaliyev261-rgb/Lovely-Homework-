// Lovely Homework! - Fun Time Module (Movies, Cartoons, TV Series)
// Features: Shared for all levels, separate Teacher upload with subtitle file support,
// Custom video player with Subtitles Toggle (ON/OFF), and Double-tap 10s rewind/forward on left & right sides.

class FunTimeModule {
  constructor() {
    this.selectedChoice = 'cartoons'; // 'movies' | 'cartoons' | 'series'
    this.container = null;
    this.activePlayer = null;
    this.lastTapTimeLeft = 0;
    this.lastTapTimeRight = 0;
  }

  init(containerEl) {
    this.container = containerEl;
    this.render();
  }

  setChoice(choice) {
    this.selectedChoice = choice;
    this.render();
  }

  async render() {
    if (!this.container) return;
    const user = window.authManager.currentUser;
    if (!user) return;

    const isTeacher = user.role === 'teacher';
    const allFunItems = await window.appDB.getAll('funtime');

    // Filter by category: movies, cartoons, series
    // Map choice to category: 'movies' -> 'movie', 'cartoons' -> 'cartoon', 'series' -> 'series'
    const cat = this.selectedChoice === 'movies' ? 'movie' : (this.selectedChoice === 'cartoons' ? 'cartoon' : 'series');
    const filteredItems = allFunItems.filter(item => item.category === cat);
    filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    this.container.innerHTML = `
      <div class="section-header">
        <div class="header-left">
          <h2 class="section-title">
            <span>🍿</span> ${window.i18n.get('funTimeTitle')}
          </h2>
          <p class="section-subtitle">${window.i18n.get('funTimeSubtitle')}</p>
        </div>

        ${isTeacher ? `
          <div class="header-actions">
            <button id="add-fun-media-btn" class="btn btn-primary">
              ➕ ${window.i18n.get('addMediaBtn')}
            </button>
          </div>
        ` : ''}
      </div>

      <!-- 3 Choices Tabs: Movies / Cartoons / TV Series -->
      <div class="funtime-tabs-container">
        <div class="funtime-tabs">
          <button class="fun-tab-btn ${this.selectedChoice === 'movies' ? 'active' : ''}" data-choice="movies">
            🎬 ${window.i18n.get('choiceMovies')}
            <span class="count-badge">${allFunItems.filter(i => i.category === 'movie').length}</span>
          </button>
          <button class="fun-tab-btn ${this.selectedChoice === 'cartoons' ? 'active' : ''}" data-choice="cartoons">
            🦁 ${window.i18n.get('choiceCartoons')}
            <span class="count-badge">${allFunItems.filter(i => i.category === 'cartoon').length}</span>
          </button>
          <button class="fun-tab-btn ${this.selectedChoice === 'series' ? 'active' : ''}" data-choice="series">
            📺 ${window.i18n.get('choiceSeries')}
            <span class="count-badge">${allFunItems.filter(i => i.category === 'series').length}</span>
          </button>
        </div>
      </div>

      <!-- Media Grid -->
      <div class="fun-grid">
        ${filteredItems.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">🍿</div>
            <h3>${window.i18n.get('noFunMedia')}</h3>
            <p>${isTeacher ? 'Click "Add Movie / Cartoon" to upload your first video and subtitles!' : 'Check back later for entertaining videos added by your teacher.'}</p>
          </div>
        ` : filteredItems.map(item => this.renderFunCard(item, isTeacher)).join('')}
      </div>
    `;

    this.bindEvents(isTeacher);
  }

  renderFunCard(item, isTeacher) {
    const defaultCover = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80';
    const cover = item.coverUrl || defaultCover;

    return `
      <div class="fun-card" data-id="${item.id}">
        <div class="fun-card-poster">
          <img src="${cover}" alt="${this.escape(item.title)}" loading="lazy"/>
          <button class="play-overlay-btn play-fun-btn" data-id="${item.id}">
            <span class="play-icon">▶</span>
          </button>
          ${item.duration ? `<span class="duration-badge">${item.duration}</span>` : ''}
          ${item.subtitles ? `<span class="subtitles-badge">CC Subtitles</span>` : ''}
        </div>

        <div class="fun-card-info">
          <h3 class="fun-card-title">${this.escape(item.title)}</h3>
          <p class="fun-card-desc">${this.escape(item.description || '')}</p>
          
          <div class="fun-card-actions">
            <button class="btn btn-primary btn-sm play-fun-btn" data-id="${item.id}">
              ▶ ${window.i18n.get('playNow')}
            </button>
            ${isTeacher ? `
              <button class="btn btn-outline-danger btn-sm delete-fun-btn" data-id="${item.id}" title="Delete video">
                🗑️
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(isTeacher) {
    // 3 choices tab buttons
    this.container.querySelectorAll('.fun-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice');
        this.setChoice(choice);
      });
    });

    // Add Media Button (Teacher only)
    const addBtn = this.container.querySelector('#add-fun-media-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddFunMediaModal());
    }

    // Play button
    this.container.querySelectorAll('.play-fun-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.launchVideoPlayer(id);
      });
    });

    // Delete button (Teacher only)
    this.container.querySelectorAll('.delete-fun-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this media item?')) {
          await window.appDB.delete('funtime', id);
          this.render();
        }
      });
    });
  }

  // Teacher Add Movie / Cartoon Modal with Subtitle attachment
  showAddFunMediaModal() {
    const modalId = 'add-fun-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const html = `
      <div id="${modalId}" class="modal-overlay">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3>🍿 ${window.i18n.get('addMediaBtn')}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <form id="add-fun-form" class="modal-body">
            <div class="form-group">
              <label>${window.i18n.get('mediaTitle')} *</label>
              <input type="text" id="fun-title-input" class="form-control" required placeholder="e.g. The Lion King / English Episode 1"/>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label>${window.i18n.get('mediaCategory')} *</label>
                <select id="fun-category-select" class="form-control">
                  <option value="cartoon" ${this.selectedChoice === 'cartoons' ? 'selected' : ''}>🦁 Cartoon</option>
                  <option value="movie" ${this.selectedChoice === 'movies' ? 'selected' : ''}>🎬 Movie</option>
                  <option value="series" ${this.selectedChoice === 'series' ? 'selected' : ''}>📺 TV Series</option>
                </select>
              </div>

              <div class="form-group col-half">
                <label>Estimated Duration (e.g. 15:30)</label>
                <input type="text" id="fun-duration-input" class="form-control" placeholder="12:00"/>
              </div>
            </div>

            <div class="form-group">
              <label>Description / Learning Focus</label>
              <textarea id="fun-desc-input" class="form-control" rows="2" placeholder="Tell students what to look out for (e.g. American accent, slang, humor)..."></textarea>
            </div>

            <!-- Video Source Selection -->
            <div class="form-group">
              <label>${window.i18n.get('uploadVideo')} *</label>
              <div class="input-tabs">
                <label><input type="radio" name="fun-video-source" value="url" checked/> Video URL / Web MP4</label>
                <label><input type="radio" name="fun-video-source" value="file"/> Upload Video File</label>
              </div>
              
              <div id="fun-url-section" class="mt-2">
                <input type="url" id="fun-video-url-input" class="form-control" placeholder="https://commondatastorage.googleapis.com/.../sample.mp4"/>
              </div>

              <div id="fun-file-section" class="mt-2 hidden">
                <input type="file" id="fun-video-file-input" accept="video/mp4,video/webm" class="form-control"/>
              </div>
            </div>

            <!-- Subtitle File Section -->
            <div class="form-group subtitle-upload-box">
              <label class="font-bold">💬 ${window.i18n.get('uploadSubtitle')}</label>
              <p class="text-sm text-gray mb-2">Upload a subtitle file (.vtt or .srt) to attach synchronized subtitles to this video.</p>
              
              <div class="file-upload-box">
                <input type="file" id="fun-subtitle-file-input" accept=".vtt,.srt,text/vtt,text/plain" style="display:none;"/>
                <button type="button" id="trigger-subtitle-btn" class="btn btn-outline-primary">
                  📑 Add Subtitle File (.vtt / .srt)
                </button>
                <span id="sub-filename-display" class="ml-2 text-sm text-gray">No subtitle file selected yet</span>
              </div>
            </div>

            <!-- Cover Poster URL or File -->
            <div class="form-group">
              <label>Cover / Poster Image (Optional)</label>
              <input type="url" id="fun-cover-input" class="form-control" placeholder="Poster image URL (e.g. Unsplash or Google image link)"/>
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

    const videoSourceRadios = modal.querySelectorAll('input[name="fun-video-source"]');
    const urlSec = modal.querySelector('#fun-url-section');
    const fileSec = modal.querySelector('#fun-file-section');

    videoSourceRadios.forEach(r => {
      r.addEventListener('change', () => {
        if (r.value === 'url') {
          urlSec.classList.remove('hidden');
          fileSec.classList.add('hidden');
        } else {
          urlSec.classList.add('hidden');
          fileSec.classList.remove('hidden');
        }
      });
    });

    // Subtitle file trigger
    const subInput = modal.querySelector('#fun-subtitle-file-input');
    const triggerSubBtn = modal.querySelector('#trigger-subtitle-btn');
    const subFilenameDisplay = modal.querySelector('#sub-filename-display');
    let loadedSubtitleContent = null;

    triggerSubBtn.addEventListener('click', () => subInput.click());

    subInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        subFilenameDisplay.textContent = `Attached: ${file.name}`;
        const rawText = await file.text();
        loadedSubtitleContent = this.ensureVttFormat(rawText);
      }
    });

    modal.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', () => modal.remove()));

    modal.querySelector('#add-fun-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = modal.querySelector('#fun-title-input').value.trim();
      const category = modal.querySelector('#fun-category-select').value;
      const duration = modal.querySelector('#fun-duration-input').value.trim() || '10:00';
      const description = modal.querySelector('#fun-desc-input').value.trim();
      const coverUrl = modal.querySelector('#fun-cover-input').value.trim();
      const videoSource = modal.querySelector('input[name="fun-video-source"]:checked').value;

      let videoUrl = '';
      if (videoSource === 'url') {
        videoUrl = modal.querySelector('#fun-video-url-input').value.trim();
        if (!videoUrl) {
          alert('Please enter a video URL!');
          return;
        }
      } else {
        const file = modal.querySelector('#fun-video-file-input').files[0];
        if (!file) {
          alert('Please select a video file!');
          return;
        }
        videoUrl = await this.readFileAsDataURL(file);
      }

      const newMedia = {
        id: 'fun_' + Date.now(),
        title,
        category,
        description,
        coverUrl: coverUrl || '',
        videoUrl,
        subtitles: loadedSubtitleContent || '',
        subtitleLanguage: 'English',
        duration,
        createdAt: new Date().toISOString()
      };

      await window.appDB.put('funtime', newMedia);

      // Notification
      await window.notifManager.createNotification({
        title: `New Fun Time: ${title} 🍿`,
        message: `Teacher added a new ${category}: "${title}" with subtitles!`,
        type: 'funtime',
        recipientId: 'all',
        targetItemId: newMedia.id
      });

      modal.remove();
      window.showToast('Media added to Fun Time! 🍿');
      this.selectedChoice = category === 'movie' ? 'movies' : (category === 'cartoon' ? 'cartoons' : 'series');
      this.render();
    });
  }

  // Converts standard .srt subtitle text to WebVTT format
  ensureVttFormat(subtitleText) {
    if (!subtitleText) return '';
    let text = subtitleText.trim();
    if (text.startsWith('WEBVTT')) {
      return text;
    }
    // Convert SRT format to WebVTT:
    // Replace comma in timestamps "00:01:20,500" -> "00:01:20.500"
    text = text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
    return 'WEBVTT\n\n' + text;
  }

  // Interactive Custom Video Player with Subtitles Toggle & Double-tap 10s skip
  async launchVideoPlayer(id) {
    const item = await window.appDB.get('funtime', id);
    if (!item) return;

    const modalId = 'custom-video-player-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    let trackBlobUrl = null;
    if (item.subtitles) {
      const vtt = this.ensureVttFormat(item.subtitles);
      const blob = new Blob([vtt], { type: 'text/vtt' });
      trackBlobUrl = URL.createObjectURL(blob);
    }

    const html = `
      <div id="${modalId}" class="player-overlay">
        <div class="player-wrapper">
          <!-- Top Bar -->
          <div class="player-top-bar">
            <div class="player-meta">
              <h3>${this.escape(item.title)}</h3>
              <span class="player-category-pill">${item.category.toUpperCase()}</span>
            </div>
            <button class="player-close-btn" title="${window.i18n.get('closePlayer')}">&times;</button>
          </div>

          <!-- Video Stage -->
          <div class="video-stage" id="video-stage">
            <video id="main-video" playsinline preload="metadata" crossorigin="anonymous">
              <source src="${item.videoUrl}" type="video/mp4"/>
              ${trackBlobUrl ? `
                <track id="main-track" label="English" kind="subtitles" srclang="en" src="${trackBlobUrl}" default/>
              ` : ''}
              Your browser does not support the video tag.
            </video>

            <!-- Double Tap Interactive Touch / Click Zones -->
            <div class="tap-zone tap-left" id="tap-left" title="Double tap to rewind 10s">
              <div class="tap-ripple" id="ripple-left">
                <span class="ripple-icon">⏪</span>
                <span class="ripple-text">-10s</span>
              </div>
            </div>

            <div class="tap-zone tap-right" id="tap-right" title="Double tap to forward 10s">
              <div class="tap-ripple" id="ripple-right">
                <span class="ripple-icon">⏩</span>
                <span class="ripple-text">+10s</span>
              </div>
            </div>

            <!-- Central Big Play/Pause indicator -->
            <div class="center-play-feedback" id="center-feedback"></div>
          </div>

          <!-- Bottom Control Bar -->
          <div class="player-controls">
            <!-- Progress Bar -->
            <div class="progress-bar-container" id="progress-container">
              <div class="progress-filled" id="progress-filled"></div>
              <div class="progress-scrubber" id="progress-scrubber"></div>
            </div>

            <div class="controls-row">
              <div class="controls-left">
                <button class="ctrl-btn" id="ctrl-play-btn" title="Play / Pause">▶</button>
                <button class="ctrl-btn" id="ctrl-skip-back-btn" title="Back 10s">↺ 10s</button>
                <button class="ctrl-btn" id="ctrl-skip-fwd-btn" title="Forward 10s">↻ 10s</button>
                <div class="time-display" id="time-display">00:00 / 00:00</div>
              </div>

              <div class="controls-right">
                <!-- Subtitles Toggle Button -->
                <button class="ctrl-btn subtitle-toggle-btn ${item.subtitles ? 'active' : 'disabled'}" id="ctrl-subs-btn" title="Toggle Subtitles ON/OFF">
                  💬 <span id="subs-label-text">${item.subtitles ? 'Subtitles: ON' : 'No Subtitles'}</span>
                </button>

                <!-- Fullscreen Button -->
                <button class="ctrl-btn" id="ctrl-fullscreen-btn" title="Fullscreen">⛶</button>
              </div>
            </div>

            <!-- Double-tap Hint Bar -->
            <div class="player-hint-bar">
              <span>💡 Double-tap Left: <strong>-10s</strong></span>
              <span>•</span>
              <span>Double-tap Right: <strong>+10s</strong></span>
              <span>•</span>
              <span>Space: <strong>Play/Pause</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById(modalId);

    const video = modal.querySelector('#main-video');
    const stage = modal.querySelector('#video-stage');
    const playBtn = modal.querySelector('#ctrl-play-btn');
    const backBtn = modal.querySelector('#ctrl-skip-back-btn');
    const fwdBtn = modal.querySelector('#ctrl-skip-fwd-btn');
    const subsBtn = modal.querySelector('#ctrl-subs-btn');
    const subsLabel = modal.querySelector('#subs-label-text');
    const fullBtn = modal.querySelector('#ctrl-fullscreen-btn');
    const timeDisplay = modal.querySelector('#time-display');
    const progressContainer = modal.querySelector('#progress-container');
    const progressFilled = modal.querySelector('#progress-filled');
    const tapLeft = modal.querySelector('#tap-left');
    const tapRight = modal.querySelector('#tap-right');
    const rippleLeft = modal.querySelector('#ripple-left');
    const rippleRight = modal.querySelector('#ripple-right');
    const closeBtn = modal.querySelector('.player-close-btn');

    // Subtitles state
    let subtitlesEnabled = !!item.subtitles;
    const updateSubtitlesTrack = () => {
      if (video.textTracks && video.textTracks.length > 0) {
        for (let i = 0; i < video.textTracks.length; i++) {
          video.textTracks[i].mode = subtitlesEnabled ? 'showing' : 'hidden';
        }
      }
      if (subsBtn) {
        if (subtitlesEnabled) {
          subsBtn.classList.add('active');
          subsLabel.textContent = window.i18n.get('subtitlesOn');
        } else {
          subsBtn.classList.remove('active');
          subsLabel.textContent = window.i18n.get('subtitlesOff');
        }
      }
    };

    video.addEventListener('loadedmetadata', () => {
      updateSubtitlesTrack();
    });

    subsBtn.addEventListener('click', () => {
      if (!item.subtitles) {
        window.showToast('No subtitles attached to this video.');
        return;
      }
      subtitlesEnabled = !subtitlesEnabled;
      updateSubtitlesTrack();
      window.showToast(subtitlesEnabled ? window.i18n.get('subtitlesOn') : window.i18n.get('subtitlesOff'));
    });

    // Play / Pause toggle
    const togglePlay = () => {
      if (video.paused) {
        video.play();
        playBtn.textContent = '⏸';
      } else {
        video.pause();
        playBtn.textContent = '▶';
      }
    };

    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('play', () => playBtn.textContent = '⏸');
    video.addEventListener('pause', () => playBtn.textContent = '▶');

    // Rewind / Forward 10s helper
    const skip = (seconds, side) => {
      video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
      if (side === 'left') {
        rippleLeft.classList.remove('animate');
        void rippleLeft.offsetWidth; // trigger reflow
        rippleLeft.classList.add('animate');
      } else if (side === 'right') {
        rippleRight.classList.remove('animate');
        void rippleRight.offsetWidth;
        rippleRight.classList.add('animate');
      }
    };

    backBtn.addEventListener('click', () => skip(-10, 'left'));
    fwdBtn.addEventListener('click', () => skip(10, 'right'));

    // Double-tap on Left zone: -10s
    let leftTapTimer = null;
    tapLeft.addEventListener('pointerdown', (e) => {
      const now = Date.now();
      if (now - this.lastTapTimeLeft < 350) {
        // Double tap confirmed!
        clearTimeout(leftTapTimer);
        skip(-10, 'left');
        this.lastTapTimeLeft = 0;
      } else {
        this.lastTapTimeLeft = now;
        leftTapTimer = setTimeout(() => {
          // Single tap on left zone toggles play/pause
          togglePlay();
        }, 350);
      }
    });

    // Double-tap on Right zone: +10s
    let rightTapTimer = null;
    tapRight.addEventListener('pointerdown', (e) => {
      const now = Date.now();
      if (now - this.lastTapTimeRight < 350) {
        // Double tap confirmed!
        clearTimeout(rightTapTimer);
        skip(10, 'right');
        this.lastTapTimeRight = 0;
      } else {
        this.lastTapTimeRight = now;
        rightTapTimer = setTimeout(() => {
          // Single tap on right zone toggles play/pause
          togglePlay();
        }, 350);
      }
    });

    // Progress updates
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      progressFilled.style.width = `${pct}%`;
      timeDisplay.textContent = `${this.formatTime(video.currentTime)} / ${this.formatTime(video.duration)}`;
    });

    // Scrubbing on progress bar
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (video.duration) {
        video.currentTime = pos * video.duration;
      }
    });

    // Fullscreen toggle
    fullBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        stage.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Keyboard shortcuts
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        skip(-10, 'left');
      } else if (e.code === 'ArrowRight') {
        skip(10, 'right');
      } else if (e.code === 'KeyC' || e.code === 'KeyS') {
        subsBtn.click();
      } else if (e.code === 'KeyF') {
        fullBtn.click();
      } else if (e.code === 'Escape') {
        closePlayer();
      }
    };
    window.addEventListener('keydown', handleKey);

    // Close Player
    const closePlayer = () => {
      video.pause();
      if (trackBlobUrl) URL.revokeObjectURL(trackBlobUrl);
      window.removeEventListener('keydown', handleKey);
      modal.remove();
    };

    closeBtn.addEventListener('click', closePlayer);

    // Auto-play
    video.play().catch(() => {
      // Browsers may block autoplay without user interaction
    });
  }

  formatTime(secs) {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

window.funTimeModule = new FunTimeModule();
