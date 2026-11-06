// Lovely Homework! - Authentication & Profile Management
// Handles Teacher Master Password ("Aliyev"), Pre-Created Student Accounts (Username/Password),
// Group Management, Group Graduation, and Session Persistence.

const TEACHER_MASTER_PASSWORD = 'Aliyev';

const LEVEL_ORDER = [
  'Beginner',
  'Elementary',
  'Pre-intermediate',
  'Intermediate',
  'IELTS Novice',
  'IELTS Standard',
  'Graduated'
];

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
    return (password || '').trim() === TEACHER_MASTER_PASSWORD;
  }

  // Teacher login
  async loginTeacher(emailOrName, password) {
    const isMaster = await this.verifyTeacherPassword(password);
    if (!isMaster) {
      throw new Error(window.i18n.get('passwordWrong'));
    }

    const allUsers = await window.appDB.getAll('users');
    const teachers = allUsers.filter(u => u.role === 'teacher');

    let teacher = teachers.find(t => 
      t.username?.toLowerCase() === emailOrName?.toLowerCase() ||
      t.email?.toLowerCase() === emailOrName?.toLowerCase() ||
      t.firstName?.toLowerCase() === emailOrName?.toLowerCase()
    );

    if (!teacher) {
      const id = 'teacher_' + Date.now();
      teacher = {
        id,
        role: 'teacher',
        firstName: emailOrName || 'Mr. Aliyev',
        lastName: 'Teacher',
        username: (emailOrName || 'aliyev').toLowerCase().replace(/\s+/g, ''),
        email: emailOrName?.includes('@') ? emailOrName : `${(emailOrName || 'teacher').toLowerCase().replace(/\s+/g, '')}@lovelyhomework.com`,
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

  // Student login directly by username and password (pre-created accounts)
  async loginStudent(username, password) {
    if (!username || !password) {
      throw new Error(window.i18n.get('studentLoginFailed'));
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const allUsers = await window.appDB.getAll('users');
    const student = allUsers.find(u => 
      u.role === 'student' && 
      (u.username?.toLowerCase() === cleanUser || 
       u.email?.toLowerCase() === cleanUser ||
       `${u.firstName} ${u.lastName}`.toLowerCase() === cleanUser ||
       u.firstName?.toLowerCase() === cleanUser)
    );

    if (!student) {
      throw new Error(window.i18n.get('studentLoginFailed'));
    }

    // Verify password
    if (student.password !== cleanPass) {
      throw new Error(window.i18n.get('studentLoginFailed'));
    }

    this.currentUser = student;
    await window.appDB.setSetting('currentUserSessionId', student.id);
    this.notify();
    return student;
  }

  // Switch to another active user
  async switchUser(userId) {
    const user = await window.appDB.get('users', userId);
    if (user && user.status === 'active') {
      this.currentUser = user;
      await window.appDB.setSetting('currentUserSessionId', user.id);
      this.notify();
      return user;
    }
  }

  // Teacher creates a pre-assigned student profile
  async createStudent({ firstName, lastName, username, password, groupId, level }) {
    if (!firstName || !lastName || !username) {
      throw new Error('Please fill First Name, Last Name, and Username');
    }

    const cleanUser = username.trim().toLowerCase();
    const allUsers = await window.appDB.getAll('users');
    const exists = allUsers.find(u => u.username?.toLowerCase() === cleanUser);
    if (exists) {
      throw new Error(`Username "${cleanUser}" is already taken. Please choose another username.`);
    }

    let resolvedLevel = level;
    if (groupId) {
      const grp = await window.appDB.get('groups', groupId);
      if (grp && grp.level) {
        resolvedLevel = grp.level;
      }
    }

    const newStudent = {
      id: 'student_' + Date.now(),
      role: 'student',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: cleanUser,
      password: (password || '12345').trim(),
      groupId: groupId || null,
      level: resolvedLevel || 'Beginner',
      teacherId: this.currentUser?.id || 'teacher_aliyev',
      status: 'active',
      avatar: '🧑‍🎓',
      createdAt: new Date().toISOString()
    };

    await window.appDB.put('users', newStudent);

    if (window.notifManager) {
      window.notifManager.broadcastChange('student_created', { student: newStudent });
      window.notifManager.update();
    }

    return newStudent;
  }

  // Teacher updates student profile
  async updateStudent(studentId, { firstName, lastName, username, password, groupId, level }) {
    const student = await window.appDB.get('users', studentId);
    if (!student) return;

    if (firstName) student.firstName = firstName.trim();
    if (lastName) student.lastName = lastName.trim();
    if (username) student.username = username.trim().toLowerCase();
    if (password) student.password = password.trim();
    if (groupId !== undefined) student.groupId = groupId;

    if (groupId) {
      const grp = await window.appDB.get('groups', groupId);
      if (grp && grp.level) {
        student.level = grp.level;
      }
    } else if (level) {
      student.level = level;
    }

    await window.appDB.put('users', student);

    if (window.notifManager) {
      window.notifManager.broadcastChange('student_updated', { student });
      window.notifManager.update();
    }
  }

  // Teacher changes a student's group (and optionally aligns level)
  async changeStudentGroup(studentId, newGroupId) {
    const student = await window.appDB.get('users', studentId);
    if (!student) throw new Error('Student not found');

    student.groupId = newGroupId || null;
    if (newGroupId) {
      const grp = await window.appDB.get('groups', newGroupId);
      if (grp && grp.level) {
        student.level = grp.level;
      }
    }

    await window.appDB.put('users', student);

    if (window.notifManager) {
      window.notifManager.broadcastChange('student_group_changed', { studentId, newGroupId });
      window.notifManager.update();
    }
    return student;
  }

  // Teacher removes student from a group (leaves account intact in roster)
  async removeStudentFromGroup(studentId) {
    const student = await window.appDB.get('users', studentId);
    if (!student) return;

    student.groupId = null;
    await window.appDB.put('users', student);

    if (window.notifManager) {
      window.notifManager.broadcastChange('student_updated', { student });
      window.notifManager.update();
    }
    return student;
  }

  // Teacher deletes a student entirely
  async deleteStudent(studentId) {
    await window.appDB.delete('users', studentId);
    if (window.notifManager) {
      window.notifManager.broadcastChange('student_deleted', { studentId });
      window.notifManager.update();
    }
  }

  // Teacher creates a new Group
  async createGroup({ name, level }) {
    if (!name || !level) {
      throw new Error('Please enter Group Name and Level');
    }

    const newGroup = {
      id: 'group_' + Date.now(),
      name: name.trim(),
      level: level,
      teacherId: this.currentUser?.id || 'teacher_aliyev',
      createdAt: new Date().toISOString()
    };

    await window.appDB.put('groups', newGroup);

    if (window.notifManager) {
      window.notifManager.broadcastChange('group_created', { group: newGroup });
      window.notifManager.update();
    }

    return newGroup;
  }

  // Teacher updates Group Name and/or Level
  async updateGroup(groupId, { name, level }) {
    const group = await window.appDB.get('groups', groupId);
    if (!group) return;

    const oldLevel = group.level;
    if (name) group.name = name.trim();
    if (level) group.level = level;

    await window.appDB.put('groups', group);

    // If level changed, update all students in this group!
    if (level && level !== oldLevel) {
      const allUsers = await window.appDB.getAll('users');
      const groupStudents = allUsers.filter(u => u.role === 'student' && u.groupId === groupId);
      for (const st of groupStudents) {
        st.level = level;
        await window.appDB.put('users', st);
      }
    }

    if (window.notifManager) {
      window.notifManager.broadcastChange('group_updated', { group });
      window.notifManager.update();
    }
  }

  // Graduate a group to the next level (or selected level)
  async graduateGroup(groupId, targetLevel = null) {
    const group = await window.appDB.get('groups', groupId);
    if (!group) return false;

    let nextLevel = targetLevel;
    if (!nextLevel) {
      const currentIndex = LEVEL_ORDER.indexOf(group.level);
      if (currentIndex === -1 || currentIndex >= LEVEL_ORDER.length - 1) {
        return false;
      }
      nextLevel = LEVEL_ORDER[currentIndex + 1];
    }

    const oldLevel = group.level;
    group.level = nextLevel;
    await window.appDB.put('groups', group);

    // Update all students in this group
    const allUsers = await window.appDB.getAll('users');
    const groupStudents = allUsers.filter(u => u.role === 'student' && u.groupId === groupId);

    for (const st of groupStudents) {
      st.level = nextLevel;
      await window.appDB.put('users', st);

      // Send graduation notification to the student
      const notif = {
        id: 'notif_grad_' + Date.now() + '_' + st.id,
        recipientId: st.id,
        title: '🎉 Group Promoted!',
        message: `Congratulations! Your group "${group.name}" has advanced from ${oldLevel} to ${nextLevel}!`,
        type: 'graduation',
        targetLevel: nextLevel,
        targetItemId: st.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      await window.appDB.put('notifications', notif);
    }

    if (window.notifManager) {
      window.notifManager.broadcastChange('group_graduated', { groupId, nextLevel, count: groupStudents.length });
      window.notifManager.update();
    }

    return { group, nextLevel, count: groupStudents.length };
  }

  // Delete a Group
  async deleteGroup(groupId) {
    await window.appDB.delete('groups', groupId);
    // Unassign students from this group
    const allUsers = await window.appDB.getAll('users');
    const groupStudents = allUsers.filter(u => u.role === 'student' && u.groupId === groupId);
    for (const st of groupStudents) {
      st.groupId = null;
      await window.appDB.put('users', st);
    }

    if (window.notifManager) {
      window.notifManager.broadcastChange('group_deleted', { groupId });
      window.notifManager.update();
    }
  }

  async logout() {
    this.currentUser = null;
    await window.appDB.setSetting('currentUserSessionId', null);
    this.notify();
  }
}

window.authManager = new AuthManager();
