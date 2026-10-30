// Lovely Homework! - Authentication & Profile Management
// Handles Teacher Master Password ("Aliyev"), Student Registration, Approvals, Session Persistence

const TEACHER_MASTER_PASSWORD = 'Aliyev';

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
  }

  async init() {
    // Check saved session in local settings
    const savedUserId = await window.appDB.getSetting('currentUserSessionId');
    if (savedUserId) {
      const user = await window.appDB.get('users', savedUserId);
      if (user && user.status === 'active') {
        this.currentUser = user;
        this.notify();
        return;
      }
    }
    this.currentUser = null;
    this.notify();
  }

  onAuthChanged(callback) {
    this.listeners.push(callback);
    callback(this.currentUser);
  }

  notify() {
    for (const cb of this.listeners) {
      try { cb(this.currentUser); } catch (e) { console.error(e); }
    }
  }

  async verifyTeacherPassword(password) {
    // Trim and check
    return (password || '').trim() === TEACHER_MASTER_PASSWORD;
  }

  // Teacher login or creation
  async loginTeacher(emailOrName, password) {
    // If master password provided, look up teacher or authenticate
    const isMaster = await this.verifyTeacherPassword(password);
    if (!isMaster) {
      throw new Error(window.i18n.get('passwordWrong'));
    }

    const allUsers = await window.appDB.getAll('users');
    const teachers = allUsers.filter(u => u.role === 'teacher');

    let teacher = teachers.find(t => 
      t.email?.toLowerCase() === emailOrName?.toLowerCase() ||
      t.firstName?.toLowerCase() === emailOrName?.toLowerCase()
    );

    // If teacher doesn't exist yet but master password is correct, create new teacher profile
    if (!teacher) {
      const id = 'teacher_' + Date.now();
      teacher = {
        id,
        role: 'teacher',
        firstName: emailOrName || 'Teacher',
        lastName: '',
        email: emailOrName?.includes('@') ? emailOrName : `${emailOrName.toLowerCase().replace(/\s+/g, '')}@lovelyhomework.com`,
        password: TEACHER_MASTER_PASSWORD,
        status: 'active',
        avatar: '👨‍🏫',
        createdAt: new Date().toISOString()
      };
      await window.appDB.put('users', teacher);
    }

    this.currentUser = teacher;
    await window.appDB.setSetting('currentUserSessionId', teacher.id);
    this.notify();
    return teacher;
  }

  // Student registration with pending status
  async registerStudent({ firstName, lastName, email, level, teacherId, password }) {
    if (!firstName || !lastName || !level) {
      throw new Error('Please fill all required fields');
    }

    const id = 'student_' + Date.now();
    const cleanEmail = email ? email.trim().toLowerCase() : `${firstName.trim().toLowerCase()}_${Date.now().toString().slice(-4)}@student.com`;
    const studentUser = {
      id,
      role: 'student',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      password: password || '123456',
      level,
      teacherId: teacherId || 'teacher_aliyev',
      status: 'pending', // Pending teacher approval!
      avatar: '🧑‍🎓',
      createdAt: new Date().toISOString()
    };

    await window.appDB.put('users', studentUser);

    // Notify the teacher! (Both to specific teacher ID and generic 'teacher')
    const notif = {
      id: 'notif_reg_' + Date.now(),
      recipientId: studentUser.teacherId || 'teacher',
      title: 'New Student Registration Pending 🔔',
      message: `${studentUser.firstName} ${studentUser.lastName} (${studentUser.email}) requested to join ${studentUser.level} level.`,
      type: 'registration',
      targetLevel: studentUser.level,
      targetItemId: studentUser.id,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    await window.appDB.put('notifications', notif);

    // Broadcast change to other tabs & refresh notifications immediately
    if (window.notifManager) {
      window.notifManager.broadcastChange('student_registration', { student: studentUser, notif });
      window.notifManager.update();
    }

    return studentUser;
  }

  // Student login
  async loginStudent(studentIdOrName) {
    const allUsers = await window.appDB.getAll('users');
    const student = allUsers.find(u => 
      u.role === 'student' && 
      (u.id === studentIdOrName || 
       u.email?.toLowerCase() === studentIdOrName?.toLowerCase() ||
       `${u.firstName} ${u.lastName}`.toLowerCase() === studentIdOrName?.toLowerCase() ||
       u.firstName?.toLowerCase() === studentIdOrName?.toLowerCase())
    );

    if (!student) {
      throw new Error('Student not found. Please check your name or register.');
    }

    if (student.status === 'pending') {
      throw new Error(window.i18n.get('pendingApprovalMsg'));
    }

    if (student.status === 'rejected') {
      throw new Error('Your registration request was not approved. Please contact your teacher.');
    }

    this.currentUser = student;
    await window.appDB.setSetting('currentUserSessionId', student.id);
    this.notify();
    return student;
  }

  // Direct login as any user (helpful for quick switching)
  async switchUser(userId) {
    const user = await window.appDB.get('users', userId);
    if (user && user.status === 'active') {
      this.currentUser = user;
      await window.appDB.setSetting('currentUserSessionId', user.id);
      this.notify();
      return user;
    }
  }

  // Approve student request (Teacher action)
  async approveStudent(studentId) {
    const student = await window.appDB.get('users', studentId);
    if (!student) return;

    student.status = 'active';
    await window.appDB.put('users', student);

    // Send confirmation notification to the student
    const notif = {
      id: 'notif_approved_' + Date.now(),
      recipientId: student.id,
      title: 'Registration Approved! 🎉',
      message: `Your teacher ${this.currentUser?.firstName || 'Teacher'} has accepted your request for ${student.level} level. Welcome!`,
      type: 'registration',
      targetLevel: student.level,
      targetItemId: student.id,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    await window.appDB.put('notifications', notif);

    if (window.notifManager) {
      window.notifManager.broadcastChange('student_approved', { studentId });
      window.notifManager.update();
    }
  }

  // Reject student request (Teacher action)
  async rejectStudent(studentId) {
    const student = await window.appDB.get('users', studentId);
    if (!student) return;

    student.status = 'rejected';
    await window.appDB.put('users', student);

    if (window.notifManager) {
      window.notifManager.broadcastChange('student_rejected', { studentId });
      window.notifManager.update();
    }
  }

  // Promote / Graduate student group (Teacher action)
  async graduateGroup(level) {
    const LEVEL_ORDER = [
      'Beginner',
      'Elementary',
      'Pre-intermediate',
      'Intermediate',
      'IELTS Novice',
      'IELTS Standard',
      'Graduated'
    ];

    const currentIndex = LEVEL_ORDER.indexOf(level);
    if (currentIndex === -1 || currentIndex >= LEVEL_ORDER.length - 1) {
      return false;
    }

    const nextLevel = LEVEL_ORDER[currentIndex + 1];
    const allUsers = await window.appDB.getAll('users');
    const groupStudents = allUsers.filter(u => u.role === 'student' && u.level === level && u.status === 'active');

    for (const student of groupStudents) {
      student.level = nextLevel;
      await window.appDB.put('users', student);

      // Notification
      const notif = {
        id: 'notif_grad_' + Date.now() + '_' + student.id,
        recipientId: student.id,
        title: '🎉 Group Graduation!',
        message: `Congratulations! Your teacher has graduated your group from ${level} to ${nextLevel}!`,
        type: 'graduation',
        targetLevel: nextLevel,
        targetItemId: student.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      await window.appDB.put('notifications', notif);
    }

    return { nextLevel, count: groupStudents.length };
  }

  async logout() {
    this.currentUser = null;
    await window.appDB.setSetting('currentUserSessionId', null);
    this.notify();
  }
}

window.authManager = new AuthManager();
