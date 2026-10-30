// Lovely Homework! - Notifications System
// Positioned at top-right corner; tracks unread items, pending student requests,
// and synchronizes in real time across browser tabs and windows.

class NotificationManager {
  constructor() {
    this.badgeEl = null;
    this.dropdownEl = null;
    this.btnEl = null;
    this.isOpen = false;
    this.pollingTimer = null;
    this.lastNotifCount = 0;
    this.broadcastChannel = null;

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel('lovely_homework_sync');
        this.broadcastChannel.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment');
    }

    // Fallback cross-tab listener via localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'lovely_hw_sync_ping') {
        this.update();
        if (window.authManager?.currentUser?.role === 'teacher' && window.studentsModule) {
          window.studentsModule.render();
        }
      }
    });
  }

  init() {
    this.badgeEl = document.getElementById('notif-badge');
    this.dropdownEl = document.getElementById('notif-dropdown');
    this.btnEl = document.getElementById('notif-btn');

    if (this.btnEl) {
      this.btnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    document.addEventListener('click', (e) => {
      if (this.isOpen && this.dropdownEl && !this.dropdownEl.contains(e.target) && !this.btnEl.contains(e.target)) {
        this.closeDropdown();
      }
    });

    this.update();

    // Start background auto-poll every 2.5 seconds
    if (!this.pollingTimer) {
      this.pollingTimer = setInterval(() => {
        this.update();
      }, 2500);
    }
  }

  broadcastChange(action, payload = {}) {
    const data = { action, payload, timestamp: Date.now() };
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(data);
      } catch (e) {}
    }
    try {
      localStorage.setItem('lovely_hw_sync_ping', Date.now().toString());
    } catch (e) {}
  }

  handleBroadcastMessage(data) {
    if (!data) return;
    this.update();

    const user = window.authManager?.currentUser;
    if (user && user.role === 'teacher') {
      if (data.action === 'student_registration' && data.payload?.student) {
        const s = data.payload.student;
        window.showToast(`🔔 New Student Registration: ${s.firstName} ${s.lastName} (${s.level})`);
        if (window.app?.currentTab === 'students' && window.studentsModule) {
          window.studentsModule.render();
        }
      } else if (data.action === 'homework_submission') {
        window.showToast(`📤 Student submitted homework!`);
        if (window.app?.currentTab === 'homework' && window.homeworkModule) {
          window.homeworkModule.render();
        }
      }
    } else if (user && user.role === 'student') {
      if (data.action === 'student_approved' && data.payload?.studentId === user.id) {
        window.showToast(`🎉 Your teacher approved your registration!`);
      }
    }
  }

  async getNotificationsForUser() {
    const user = window.authManager?.currentUser;
    if (!user) return [];

    const allNotifs = await window.appDB.getAll('notifications');
    allNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return allNotifs.filter(n => {
      if (n.recipientId === 'all') return true;
      if (n.recipientId === user.id) return true;
      // Teachers receive all registration & submission notifications
      if (user.role === 'teacher') {
        if (n.recipientId === 'teacher' || n.type === 'registration' || n.type === 'submission') {
          return true;
        }
      }
      if (user.role === 'student' && n.targetLevel === user.level) return true;
      return false;
    });
  }

  async update() {
    const user = window.authManager?.currentUser;
    if (!user) {
      if (this.badgeEl) this.badgeEl.classList.add('hidden');
      return;
    }

    const notifs = await this.getNotificationsForUser();
    const unread = notifs.filter(n => !n.isRead);

    // If teacher, also check pending registration requests count directly
    let pendingCount = 0;
    if (user.role === 'teacher') {
      const allUsers = await window.appDB.getAll('users');
      const pendingStudents = allUsers.filter(u => u.role === 'student' && u.status === 'pending');
      pendingCount = pendingStudents.length;

      // Update badge directly on "Students & Groups" navigation tab
      const navPendingBadge = document.getElementById('nav-pending-badge');
      if (navPendingBadge) {
        if (pendingCount > 0) {
          navPendingBadge.textContent = `${pendingCount} new`;
          navPendingBadge.classList.remove('hidden');
        } else {
          navPendingBadge.classList.add('hidden');
        }
      }
    }

    const totalCount = Math.max(unread.length, pendingCount);

    if (this.badgeEl) {
      if (totalCount > 0) {
        this.badgeEl.textContent = totalCount > 99 ? '99+' : totalCount;
        this.badgeEl.classList.remove('hidden');
        this.btnEl?.classList.add('has-unread');

        // Play gentle visual pulse if new notification arrived
        if (totalCount > this.lastNotifCount) {
          this.btnEl?.classList.add('pulse-anim');
          setTimeout(() => this.btnEl?.classList.remove('pulse-anim'), 1200);
        }
      } else {
        this.badgeEl.classList.add('hidden');
        this.btnEl?.classList.remove('has-unread');
      }
    }

    this.lastNotifCount = totalCount;

    if (this.isOpen) {
      this.renderDropdown(notifs);
    }
  }

  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  async openDropdown() {
    this.isOpen = true;
    if (this.dropdownEl) {
      this.dropdownEl.classList.remove('hidden');
      const notifs = await this.getNotificationsForUser();
      this.renderDropdown(notifs);
    }
  }

  closeDropdown() {
    this.isOpen = false;
    if (this.dropdownEl) {
      this.dropdownEl.classList.add('hidden');
    }
  }

  async renderDropdown(notifs) {
    if (!this.dropdownEl) return;

    const user = window.authManager?.currentUser;

    // Check if there are pending students (for teacher)
    let pendingStudents = [];
    if (user && user.role === 'teacher') {
      const allUsers = await window.appDB.getAll('users');
      pendingStudents = allUsers.filter(u => u.role === 'student' && u.status === 'pending');
    }

    if ((!notifs || notifs.length === 0) && pendingStudents.length === 0) {
      this.dropdownEl.innerHTML = `
        <div class="notif-header">
          <span class="font-bold">${window.i18n.get('notifications')}</span>
        </div>
        <div class="notif-empty">
          <div class="empty-icon">🔔</div>
          <p>${window.i18n.get('noNotifications')}</p>
        </div>
      `;
      return;
    }

    const unreadCount = notifs.filter(n => !n.isRead).length;

    // Pending student approval items at the very top for teachers
    let pendingBannerHtml = '';
    if (pendingStudents.length > 0) {
      pendingBannerHtml = `
        <div class="notif-pending-banner">
          <div class="notif-banner-head">
            <strong>⏳ ${pendingStudents.length} Student Registration(s) Awaiting Approval</strong>
          </div>
          ${pendingStudents.map(s => `
            <div class="notif-quick-student">
              <span>🧑‍🎓 <strong>${this.escape(s.firstName)} ${this.escape(s.lastName)}</strong> (${s.level})</span>
              <button class="btn btn-sm btn-primary quick-review-btn" onclick="window.appRouter.navigate('students'); window.notifManager.closeDropdown();">
                Review & Confirm
              </button>
            </div>
          `).join('')}
        </div>
      `;
    }

    let itemsHtml = notifs.map(n => {
      let icon = '📌';
      if (n.type === 'homework') icon = '📝';
      if (n.type === 'material') icon = '📚';
      if (n.type === 'funtime') icon = '🍿';
      if (n.type === 'registration') icon = '👋';
      if (n.type === 'submission') icon = '📤';
      if (n.type === 'graduation') icon = '🎓';

      const timeAgo = this.formatTimeAgo(n.createdAt);

      return `
        <div class="notif-item ${n.isRead ? 'read' : 'unread'}" data-id="${n.id}" data-type="${n.type}" data-item-id="${n.targetItemId || ''}">
          <div class="notif-icon">${icon}</div>
          <div class="notif-content">
            <div class="notif-title">${this.escape(n.title)}</div>
            <div class="notif-message">${this.escape(n.message)}</div>
            <div class="notif-time">${timeAgo}</div>
          </div>
          ${!n.isRead ? '<span class="unread-dot"></span>' : ''}
        </div>
      `;
    }).join('');

    this.dropdownEl.innerHTML = `
      <div class="notif-header">
        <span class="font-bold">${window.i18n.get('notifications')}</span>
        ${unreadCount > 0 ? `
          <button id="mark-all-read-btn" class="text-xs text-red hover:underline" style="background:none; border:none; cursor:pointer;">
            ${window.i18n.get('markAllRead')}
          </button>
        ` : ''}
      </div>
      ${pendingBannerHtml}
      <div class="notif-list">
        ${itemsHtml}
      </div>
    `;

    // Bind item clicks
    this.dropdownEl.querySelectorAll('.notif-item').forEach(item => {
      item.addEventListener('click', async () => {
        const id = item.getAttribute('data-id');
        const type = item.getAttribute('data-type');
        const targetItemId = item.getAttribute('data-item-id');
        await this.markAsRead(id);
        this.closeDropdown();
        this.handleNotificationNavigation(type, targetItemId);
      });
    });

    const markAllBtn = this.dropdownEl.querySelector('#mark-all-read-btn');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.markAllAsRead();
      });
    }
  }

  async markAsRead(id) {
    const notif = await window.appDB.get('notifications', id);
    if (notif) {
      notif.isRead = true;
      await window.appDB.put('notifications', notif);
      this.update();
      this.broadcastChange('notification_read', { id });
    }
  }

  async markAllAsRead() {
    const notifs = await this.getNotificationsForUser();
    for (const n of notifs) {
      if (!n.isRead) {
        n.isRead = true;
        await window.appDB.put('notifications', n);
      }
    }
    this.update();
    this.broadcastChange('notifications_all_read');
  }

  async createNotification({ title, message, type, recipientId = 'all', targetLevel = null, targetItemId = null }) {
    const notif = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      recipientId,
      title,
      message,
      type,
      targetLevel,
      targetItemId,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    await window.appDB.put('notifications', notif);
    this.update();
    this.broadcastChange('new_notification', notif);
  }

  handleNotificationNavigation(type, targetItemId) {
    if (type === 'homework' || type === 'submission') {
      window.appRouter?.navigate('homework');
    } else if (type === 'material') {
      window.appRouter?.navigate('materials');
    } else if (type === 'funtime') {
      window.appRouter?.navigate('funtime');
    } else if (type === 'registration') {
      window.appRouter?.navigate('students');
    } else if (type === 'graduation') {
      window.appRouter?.navigate('homework');
    }
  }

  formatTimeAgo(isoString) {
    if (!isoString) return '';
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  escape(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.notifManager = new NotificationManager();
