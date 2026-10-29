// Lovely Homework! - Initial Seed Data
// Pre-populates the database on first load with realistic teachers, students, homework, materials, and videos

const SAMPLE_VTT_SUBTITLES = `WEBVTT

00:00:01.000 --> 00:00:04.000
Welcome to Lovely Homework! Fun Time English!

00:00:04.500 --> 00:00:08.500
Watching movies and cartoons is the best way to improve your listening.

00:00:09.000 --> 00:00:13.500
Remember: you can double-tap the left side of the screen to go back 10 seconds.

00:00:14.000 --> 00:00:18.500
Or double-tap the right side of the screen to skip forward 10 seconds.

00:00:19.000 --> 00:00:24.000
Turn subtitles on or off anytime using the Subtitles button below!

00:00:25.000 --> 00:00:30.000
Enjoy your lesson and have a wonderful study session!
`;

// Sample SVG placeholder as a data URL for textbook photos
function createSampleBookPageSvg(title, subtitle) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <rect width="600" height="800" fill="#FFFDF8" stroke="#E53935" stroke-width="8"/>
    <rect x="20" y="20" width="560" height="80" rx="8" fill="#FFEBEE"/>
    <text x="40" y="65" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#D32F2F">${title}</text>
    <text x="40" y="130" font-family="Arial, sans-serif" font-size="18" fill="#333">${subtitle}</text>
    
    <!-- Exercise 1 -->
    <rect x="40" y="160" width="520" height="150" rx="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
    <text x="60" y="195" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1E293B">Exercise 1: Fill in the correct tense</text>
    <text x="60" y="230" font-family="Arial, sans-serif" font-size="16" fill="#475569">1. Yesterday, Sarah ________ (go) to the supermarket.</text>
    <text x="60" y="260" font-family="Arial, sans-serif" font-size="16" fill="#475569">2. They ________ (live) in Baku since 2018.</text>
    <text x="60" y="290" font-family="Arial, sans-serif" font-size="16" fill="#475569">3. Look! The children ________ (play) in the garden right now.</text>

    <!-- Exercise 2 -->
    <rect x="40" y="340" width="520" height="180" rx="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
    <text x="60" y="375" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1E293B">Exercise 2: Write 3 questions</text>
    <text x="60" y="410" font-family="Arial, sans-serif" font-size="16" fill="#475569">Write complete questions for these answers:</text>
    <line x1="60" y1="440" x2="520" y2="440" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="60" y1="475" x2="520" y2="475" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="60" y1="510" x2="520" y2="510" stroke="#94A3B8" stroke-dasharray="4 4"/>

    <!-- Speaking prompt box -->
    <rect x="40" y="550" width="520" height="180" rx="8" fill="#FFF3E0" stroke="#FF9800" stroke-width="2"/>
    <text x="60" y="590" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#E65100">Vocabulary & Speaking Task</text>
    <text x="60" y="630" font-family="Arial, sans-serif" font-size="16" fill="#5D4037">• Memorize 10 words: diligent, fluent, accurate, acquire, ambitious...</text>
    <text x="60" y="665" font-family="Arial, sans-serif" font-size="16" fill="#5D4037">• Prepare a 2-minute answer about your favorite hobby.</text>
    <text x="60" y="700" font-family="Arial, sans-serif" font-size="15" font-style="italic" fill="#795548">Tap 'I am ready' in the Lovely Homework app when prepared!</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Sample student written homework photo
function createSampleStudentSubmissionSvg(studentName) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700">
    <rect width="600" height="700" fill="#FFFFF0" stroke="#94A3B8" stroke-width="4"/>
    <!-- Notebook lines -->
    <line x1="80" y1="0" x2="80" y2="700" stroke="#EF5350" stroke-width="2"/>
    <line x1="0" y1="90" x2="600" y2="90" stroke="#90CAF9" stroke-width="1.5"/>
    <line x1="0" y1="130" x2="600" y2="130" stroke="#90CAF9" stroke-width="1.5"/>
    <line x1="0" y1="170" x2="600" y2="170" stroke="#90CAF9" stroke-width="1.5"/>
    <line x1="0" y1="210" x2="600" y2="210" stroke="#90CAF9" stroke-width="1.5"/>
    <line x1="0" y1="250" x2="600" y2="250" stroke="#90CAF9" stroke-width="1.5"/>
    <line x1="0" y1="290" x2="600" y2="290" stroke="#90CAF9" stroke-width="1.5"/>
    <line x1="0" y1="330" x2="600" y2="330" stroke="#90CAF9" stroke-width="1.5"/>
    <line x1="0" y1="370" x2="600" y2="370" stroke="#90CAF9" stroke-width="1.5"/>
    <line x1="0" y1="410" x2="600" y2="410" stroke="#90CAF9" stroke-width="1.5"/>
    
    <text x="100" y="80" font-family="'Comic Sans MS', cursive, sans-serif" font-size="20" fill="#1E3A8A">Homework by: ${studentName}</text>
    <text x="100" y="125" font-family="'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1E3A8A">1. Sarah went to the supermarket yesterday.</text>
    <text x="100" y="165" font-family="'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1E3A8A">2. They have lived in Baku since 2018.</text>
    <text x="100" y="205" font-family="'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1E3A8A">3. Look! The children are playing right now.</text>
    <text x="100" y="245" font-family="'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1E3A8A">4. Where did you buy that lovely book?</text>
    <text x="100" y="285" font-family="'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1E3A8A">5. I really enjoyed this homework!</text>
    
    <!-- Teacher stamp -->
    <circle cx="480" cy="550" r="60" fill="none" stroke="#D32F2F" stroke-width="4" stroke-dasharray="6 3"/>
    <text x="480" y="545" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#D32F2F">CHECKED</text>
    <text x="480" y="570" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#D32F2F">EXCELLENT! 10/10</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

async function checkAndSeedData(db) {
  const users = await db.getAll('users');
  if (users && users.length > 0) {
    return; // Already initialized
  }

  console.log('Seeding initial Lovely Homework! data...');

  // 1. Teachers
  const teacherAliyev = {
    id: 'teacher_aliyev',
    role: 'teacher',
    firstName: 'Mr. Aliyev',
    lastName: 'Teacher',
    email: 'aliyev@lovelyhomework.com',
    password: 'Aliyev',
    status: 'active',
    avatar: '👨‍🏫',
    createdAt: new Date().toISOString()
  };

  const teacherSarah = {
    id: 'teacher_sarah',
    role: 'teacher',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@lovelyhomework.com',
    password: 'Aliyev',
    status: 'active',
    avatar: '👩‍🏫',
    createdAt: new Date().toISOString()
  };

  await db.put('users', teacherAliyev);
  await db.put('users', teacherSarah);

  // 2. Students across levels
  const students = [
    {
      id: 'student_1',
      role: 'student',
      firstName: 'Farid',
      lastName: 'Mammadov',
      email: 'farid',
      password: '123',
      level: 'Beginner',
      teacherId: 'teacher_aliyev',
      status: 'active',
      avatar: '👦',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'student_2',
      role: 'student',
      firstName: 'Leyla',
      lastName: 'Huseynova',
      email: 'leyla',
      password: '123',
      level: 'Elementary',
      teacherId: 'teacher_aliyev',
      status: 'active',
      avatar: '👧',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'student_3',
      role: 'student',
      firstName: 'Rashad',
      lastName: 'Aliyev',
      email: 'rashad',
      password: '123',
      level: 'Elementary',
      teacherId: 'teacher_aliyev',
      status: 'active',
      avatar: '🧑',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: 'student_4',
      role: 'student',
      firstName: 'Aysel',
      lastName: 'Karimova',
      email: 'aysel',
      password: '123',
      level: 'Pre-intermediate',
      teacherId: 'teacher_aliyev',
      status: 'active',
      avatar: '👩',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'student_5',
      role: 'student',
      firstName: 'Elvin',
      lastName: 'Guliyev',
      email: 'elvin',
      password: '123',
      level: 'Intermediate',
      teacherId: 'teacher_aliyev',
      status: 'active',
      avatar: '👨',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    {
      id: 'student_6',
      role: 'student',
      firstName: 'Nigar',
      lastName: 'Safarova',
      email: 'nigar',
      password: '123',
      level: 'IELTS Standard',
      teacherId: 'teacher_aliyev',
      status: 'active',
      avatar: '👩‍🎓',
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
    },
    // Pending student (for testing teacher confirmation!)
    {
      id: 'student_pending_1',
      role: 'student',
      firstName: 'Kamran',
      lastName: 'Taghiyev',
      email: 'kamran',
      password: '123',
      level: 'Intermediate',
      teacherId: 'teacher_aliyev',
      status: 'pending',
      avatar: '🧑‍🎓',
      createdAt: new Date().toISOString()
    }
  ];

  for (const s of students) {
    await db.put('users', s);
  }

  // 3. Homework Samples
  const dueTomorrow = new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16);
  const dueNextWeek = new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 16);

  const hwElementaryPaper = {
    id: 'hw_elem_1',
    teacherId: 'teacher_aliyev',
    title: 'Unit 4: Present Continuous & Past Simple Written Exercises',
    level: 'Elementary',
    type: 'paper',
    dueDate: dueTomorrow,
    description: 'Complete all exercises on page 34 in your workbook. Write clearly in your notebook, take a clear photo of your handwritten page, and upload it here before our lesson starts.',
    photos: [
      {
        id: 'p_1',
        name: 'Workbook_Page_34.jpg',
        dataUrl: createSampleBookPageSvg('Unit 4: Workbook Page 34', 'Grammar in Practice: Past vs Continuous'),
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  };

  const hwElementaryOral = {
    id: 'hw_elem_2',
    teacherId: 'teacher_aliyev',
    title: 'Speaking Task: Describe Your Typical Weekend & Learn 10 Words',
    level: 'Elementary',
    type: 'oral',
    dueDate: dueNextWeek,
    description: '1. Learn the 10 daily routine words from the Vocabulary sheet.\n2. Be ready to speak for 2 minutes about what you do on Saturdays and Sundays.\nWhen you have practiced, tap "I am ready" below!',
    photos: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  };

  const hwIntermediateOral = {
    id: 'hw_inter_1',
    teacherId: 'teacher_aliyev',
    title: 'Oral Speaking: Travel Dilemmas & 15 Advanced Collocations',
    level: 'Intermediate',
    type: 'oral',
    dueDate: dueTomorrow,
    description: 'Be prepared for our oral debate: "Is it better to travel alone or in a group?". Make sure you have memorized the 15 collocations from our video lesson.',
    photos: [],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  };

  const hwBeginnerPaper = {
    id: 'hw_beg_1',
    teacherId: 'teacher_aliyev',
    title: 'Alphabet & Basic Sentence Formation (Page 12)',
    level: 'Beginner',
    type: 'paper',
    dueDate: dueTomorrow,
    description: 'Write 10 sentences using the verb "to be" (am, is, are). Take a photo of your notebook and upload it here.',
    photos: [
      {
        id: 'p_2',
        name: 'Beginner_Grammar_p12.jpg',
        dataUrl: createSampleBookPageSvg('Beginner English: Unit 1', 'Verb To Be & Subject Pronouns'),
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  };

  await db.put('homework', hwElementaryPaper);
  await db.put('homework', hwElementaryOral);
  await db.put('homework', hwIntermediateOral);
  await db.put('homework', hwBeginnerPaper);

  // 4. Sample Submissions
  // Leyla submitted written photos
  const subLeyla = {
    id: 'sub_1',
    homeworkId: 'hw_elem_1',
    studentId: 'student_2',
    studentName: 'Leyla Huseynova',
    level: 'Elementary',
    type: 'paper',
    photos: [
      {
        id: 'sub_p_1',
        name: 'Leyla_Homework_Page1.jpg',
        dataUrl: createSampleStudentSubmissionSvg('Leyla Huseynova'),
        uploadedAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ],
    readinessStatus: null,
    status: 'submitted',
    teacherComment: 'Very neat handwriting! Good job on Exercise 1.',
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  };

  // Leyla marked oral as ready
  const subLeylaOral = {
    id: 'sub_2',
    homeworkId: 'hw_elem_2',
    studentId: 'student_2',
    studentName: 'Leyla Huseynova',
    level: 'Elementary',
    type: 'oral',
    photos: [],
    readinessStatus: 'ready',
    status: 'submitted',
    teacherComment: '',
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  };

  // Rashad marked oral as not ready
  const subRashadOral = {
    id: 'sub_3',
    homeworkId: 'hw_elem_2',
    studentId: 'student_3',
    studentName: 'Rashad Aliyev',
    level: 'Elementary',
    type: 'oral',
    photos: [],
    readinessStatus: 'not_ready',
    status: 'submitted',
    teacherComment: 'Need more practice on Saturday vocabulary.',
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  };

  await db.put('submissions', subLeyla);
  await db.put('submissions', subLeylaOral);
  await db.put('submissions', subRashadOral);

  // 5. Materials / Video Lessons
  const mat1 = {
    id: 'mat_1',
    teacherId: 'teacher_aliyev',
    title: 'Future Simple or Past simple',
    level: 'Elementary',
    category: 'video',
    description: 'Detailed explanation of when to use Future Simple (will + verb) vs Past Simple (-ed / irregular verbs). Watch this video before completing your homework!',
    fileData: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fileName: 'Future_Simple_vs_Past_Simple.mp4',
    fileSize: '14.2 MB',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  };

  const mat2 = {
    id: 'mat_2',
    teacherId: 'teacher_aliyev',
    title: 'Future Simple vs Past Simple Grammar Sheet & Rules',
    level: 'Elementary',
    category: 'pdf',
    description: 'Summary table with signal words (yesterday, ago, last week vs tomorrow, next year, soon). Download and keep in your study folder.',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoyIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gPj4KZW5kb2JqCnRyYWlsZXIKPDwgL1Jvb3QgMSAwIFIgPj4KJSVFT0YK',
    fileName: 'Grammar_Rules_Future_Past.pdf',
    fileSize: '450 KB',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  };

  const mat3 = {
    id: 'mat_3',
    teacherId: 'teacher_aliyev',
    title: 'Intermediate Phrasal Verbs & Speaking Expressions',
    level: 'Intermediate',
    category: 'document',
    description: '30 essential phrasal verbs for everyday conversation and natural speaking fluency.',
    fileData: 'data:text/plain;charset=utf-8,30%20Essential%20Phrasal%20Verbs%20for%20Intermediate%20Students%0A%0A1.%20Bring%20up%20-%20to%20mention%20a%20topic%0A2.%20Call%20off%20-%20to%20cancel%0A3.%20Carry%20on%20-%20to%20continue%0A4.%20Come%20across%20-%20to%20find%20by%20chance%0A5.%20Figure%20out%20-%20to%20solve%20or%20understand%0A6.%20Get%20along%20-%20to%20have%20a%20good%20relationship%0A7.%20Give%20up%20-%20to%20stop%20trying%0A8.%20Look%20forward%20to%20-%20to%20anticipate%20with%20pleasure%0A9.%20Put%20off%20-%20to%20postpone%0A10.%20Turn%20down%20-%20to%20refuse%20or%20lower%20volume',
    fileName: 'Phrasal_Verbs_Summary.docx',
    fileSize: '1.2 MB',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  };

  await db.put('materials', mat1);
  await db.put('materials', mat2);
  await db.put('materials', mat3);

  // 6. Fun Time: Movies / Cartoons / TV Series
  const funCartoon = {
    id: 'fun_cartoon_1',
    title: 'Big Buck Bunny (Cartoon with English Subtitles)',
    category: 'cartoon',
    description: 'A charming animated short cartoon about a kind giant rabbit and funny forest creatures. Perfect for speaking practice and learning descriptive words!',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    subtitles: SAMPLE_VTT_SUBTITLES,
    subtitleLanguage: 'English',
    duration: '09:56',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  };

  const funMovie = {
    id: 'fun_movie_1',
    title: 'Sintel: The Dragon Quest (Movie)',
    category: 'movie',
    description: 'An epic adventure fantasy about friendship, perseverance, and dedication. With clear English dialogue and rich vocabulary.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    subtitles: SAMPLE_VTT_SUBTITLES,
    subtitleLanguage: 'English',
    duration: '14:48',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  };

  const funSeries = {
    id: 'fun_series_1',
    title: 'Tears of Steel: Episode 1 (Sci-Fi TV Series)',
    category: 'series',
    description: 'Sci-Fi series set in futuristic Amsterdam. Great for learning technology vocabulary and modern conversational expressions.',
    coverUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    subtitles: SAMPLE_VTT_SUBTITLES,
    subtitleLanguage: 'English',
    duration: '12:14',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  };

  await db.put('funtime', funCartoon);
  await db.put('funtime', funMovie);
  await db.put('funtime', funSeries);

  // 7. Initial Notifications
  const notifs = [
    {
      id: 'notif_1',
      recipientId: 'all',
      title: 'Welcome to Lovely Homework! 🎉',
      message: 'New assignments, video lessons, and cartoons are now available in your portal.',
      type: 'homework',
      targetLevel: 'Elementary',
      targetItemId: 'hw_elem_1',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'notif_2',
      recipientId: 'teacher_aliyev',
      title: 'New Student Registration Pending 🔔',
      message: 'Kamran Taghiyev requested to join the Intermediate level. Click to review and approve!',
      type: 'registration',
      targetLevel: 'Intermediate',
      targetItemId: 'student_pending_1',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];

  for (const n of notifs) {
    await db.put('notifications', n);
  }

  console.log('Seed data successfully loaded.');
}

window.checkAndSeedData = checkAndSeedData;
