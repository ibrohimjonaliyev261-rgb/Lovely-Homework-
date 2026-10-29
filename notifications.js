// Lovely Homework! - Notifications System
// Positioned at top-right corner; tracks unread items and alerts students/teachers

class NotificationManager {
  constructor() {
    this.badgeEl = null;
    this.dropdownEl = null;
    this.isOpen = false;
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
  }

  async getNotificationsForUser() {
    const user = window.authManager.currentUser;
    if (!user) return [];

    const allNotifs = await window.appDB.getAll('notifications');
    // Sort newest first
    allNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return allNotifs.filter(n => {
      if (n.recipientId === 'all') return true;
      if (n.recipientId === user.id) return true;
      if (user.role === 'teacher' && (n.recipientId === 'teacher' || n.type === 'registration' || n.type === 'submission')) return true;
      if (user.role === 'student' && n.targetLevel === user.level) return true;
      return false;
    });
  }

  async update() {
    const notifs = await this.getNotificationsForUser();
    const unread = notifs.filter(n => !n.isRead);

    if (this.badgeEl) {
      if (unread.length > 0) {
        this.badgeEl.textContent = unread.length > 99 ? '99+' : unread.length;
        this.badgeEl.classList.remove('hidden');
        this.btnEl?.classList.add('has-unread');
      } else {
        this.badgeEl.classList.add('hidden');
        this.btnEl?.classList.remove('has-unread');
      }
    }

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

    if (!notifs || notifs.length === 0) {
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
          <button id="mark-all-read-btn" class="text-xs text-red hover:underline">
            ${window.i18n.get('markAllRead')}
          </button>
        ` : ''}
      </div>
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
