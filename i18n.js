// Lovely Homework! - Internationalization (i18n) Module
// Supported Languages: English (en), Uzbek (uz), Russian (ru)

const translations = {
  en: {
    appName: "Lovely Homework!",
    appSubtitle: "Learn, Practice, Excel together",
    areYou: "Are you . . . ?",
    teacher: "Teacher",
    student: "Student",
    teacherLogin: "Teacher Login",
    studentLogin: "Student Login",
    enterPassword: "Enter Teacher Password",
    passwordPlaceholder: "••••••••",
    passwordWrong: "Incorrect teacher password! Access denied.",
    studentLoginFailed: "Incorrect username or password. Please ask your teacher.",
    studentLoginHint: "Log in with the username and password provided by your teacher.",
    nameLabel: "First Name",
    lastNameLabel: "Last Name",
    usernameLabel: "Username",
    passwordLabel: "Password",
    defaultPasswordHint: "Default password: 12345",
    selectLevel: "Select Level",
    selectGroup: "Select Group",
    loginBtn: "Log In",
    welcomeBack: "Welcome back",
    signOut: "Sign Out",
    
    // Levels
    levels: {
      "Beginner": "Beginner",
      "Elementary": "Elementary",
      "Pre-intermediate": "Pre-intermediate",
      "Intermediate": "Intermediate",
      "IELTS Novice": "IELTS Novice",
      "IELTS Standard": "IELTS Standard",
      "Graduated": "Graduated / Alumni"
    },

    // Tabs
    tabHomework: "Homework",
    tabMaterials: "Materials / Video Lessons",
    tabFunTime: "Fun Time",
    tabStudents: "Groups & Students",
    
    // Group & Student Management
    groupsTab: "Groups",
    studentsTab: "Student Roster",
    createGroupBtn: "➕ Create New Group",
    createStudentBtn: "➕ Add New Student",
    groupNameLabel: "Group Name",
    groupNamePlaceholder: "e.g. Morning Elementary-1 or IELTS Champions",
    editGroup: "Edit Group",
    deleteGroup: "Delete Group",
    graduateGroup: "🎓 Graduate / Promote Group",
    changeGroupLevel: "Change Group Level",
    graduateConfirm: "Graduate this group to the next level? All students in this group will be promoted automatically.",
    groupCreatedSuccess: "New group created successfully!",
    studentCreatedSuccess: "New student account created successfully!",
    groupGraduatedSuccess: "The entire group has been successfully promoted to the next level!",
    noGroupsYet: "No groups created yet. Click 'Create New Group' to start!",
    noStudentsInGroup: "No students in this group yet. Click 'Add Student' to enroll students.",
    noStudentsOverall: "No students added to the roster yet.",
    studentsCount: "Students",
    copyCredentials: "📋 Copy Login Info",
    credentialsCopied: "Login details copied to clipboard!",
    currentLevelBadge: "Current Level",
    allLevels: "All Levels",

    // Homework Section
    addHomework: "Add Homework",
    homeworkTitle: "Homework Title",
    homeworkTitlePlaceholder: "e.g. Unit 4 - Past Simple Exercises or Speaking Topic",
    homeworkType: "Type of Homework",
    typePaper: "Written on Paper (Upload Photos)",
    typeOral: "Oral (Speaking / Learning Words)",
    dueDate: "Due Date & Time",
    instructions: "Instructions / Notes",
    attachPhotos: "Attach Exercise Photos (Optional)",
    attachPhotosHint: "Take or select textbook page photos so students can see them",
    publishHomework: "Publish Homework",
    noHomeworkYet: "No homework given for this level yet.",
    dueBy: "Due by",
    statusReady: "I am ready",
    statusNotReady: "I am not ready",
    uploadYourWork: "Upload Photo of Your Homework",
    uploadBtn: "Choose Photos or Take Picture",
    submitWork: "Submit Homework",
    workSubmitted: "Your homework has been submitted!",
    reviewSubmissions: "Review Submissions",
    submittedPhotos: "Uploaded Photos",
    readinessOverview: "Oral Readiness",
    noSubmissions: "No submissions yet.",
    oralStatusUpdated: "Your status has been updated to",
    
    // Materials Section
    addMaterial: "Add Material / Video",
    materialName: "Material Name",
    materialNamePlaceholder: "e.g. Future Simple or Past Simple",
    materialType: "Material Type",
    typePdf: "PDF Document",
    typeWord: "Word Document (.docx)",
    typeVideo: "Video Lesson (.mp4 / link)",
    typePhoto: "Infographic / Photo",
    typeAudio: "Audio Listening",
    uploadFileOrLink: "Upload File or Media Link",
    noMaterialsYet: "No materials uploaded for this level yet.",
    viewMaterial: "Open / Watch",
    readOnlyNotice: "Students can view and study materials. Additions and edits are managed by the teacher.",

    // Fun Time
    funTimeTitle: "Fun Time 🍿",
    funTimeSubtitle: "Movies, Cartoons & TV Series with Subtitles",
    choiceMovies: "Movies",
    choiceCartoons: "Cartoons",
    choiceSeries: "TV Series",
    addMediaBtn: "Add Movie / Cartoon",
    mediaTitle: "Title",
    mediaCategory: "Category",
    uploadVideo: "Upload Video File or Paste Video URL",
    uploadSubtitle: "Upload Subtitle File (.vtt or .srt)",
    subtitlesLabel: "Subtitles",
    subtitlesOn: "Subtitles: ON",
    subtitlesOff: "Subtitles: OFF",
    doubleTapRewind: "Double-tap left: -10s",
    doubleTapForward: "Double-tap right: +10s",
    noFunMedia: "No items in this section yet.",
    playNow: "Play Now",
    closePlayer: "Close Player",

    // Notifications
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    noNotifications: "No new notifications.",
    newHomeworkAdded: "New homework assigned:",
    newMaterialAdded: "New material added:",
    newFunTimeAdded: "New movie/cartoon added:",
    studentSubmittedNotif: "submitted homework for",

    // Settings
    nightMode: "Night Mode",
    lightMode: "Light Mode",
    language: "Language",
    backupData: "Backup / Export Data",
    restoreData: "Restore Data",
    
    // Common
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    confirm: "Confirm",
    accept: "Accept",
    reject: "Reject",
    active: "Active",
    completed: "Completed",
    download: "Download",
    close: "Close"
  },

  uz: {
    appName: "Lovely Homework!",
    appSubtitle: "O'qituvchilar va o'quvchilar uchun qulay dars va vazifalar portali",
    areYou: "Siz kimsiz . . . ?",
    teacher: "O'qituvchi",
    student: "O'quvchi",
    teacherLogin: "O'qituvchi Kirishi",
    studentLogin: "O'quvchi Kirishi",
    enterPassword: "O'qituvchi parolini kiriting",
    passwordPlaceholder: "••••••••",
    passwordWrong: "O'qituvchi paroli noto'g'ri! Kirish rad etildi.",
    studentLoginFailed: "Login yoki parol noto'g'ri. Iltimos, o'qituvchingizdan so'rang.",
    studentLoginHint: "O'qituvchingiz bergan login va parol bilan tizimga kiring.",
    nameLabel: "Ism",
    lastNameLabel: "Familiya",
    usernameLabel: "Login (Username)",
    passwordLabel: "Parol",
    defaultPasswordHint: "Standart parol: 12345",
    selectLevel: "Darajani tanlang",
    selectGroup: "Guruhni tanlang",
    loginBtn: "Kirish",
    welcomeBack: "Xush kelibsiz",
    signOut: "Chiqish",

    levels: {
      "Beginner": "Beginner (Boshlang'ich)",
      "Elementary": "Elementary",
      "Pre-intermediate": "Pre-intermediate",
      "Intermediate": "Intermediate",
      "IELTS Novice": "IELTS Novice",
      "IELTS Standard": "IELTS Standard",
      "Graduated": "Bitirgan (Alumni)"
    },

    tabHomework: "Uy vazifalari",
    tabMaterials: "Materiallar / Video darslar",
    tabFunTime: "Fun Time (Kino & Multfilm)",
    tabStudents: "Guruhlar va O'quvchilar",

    groupsTab: "Guruhlar",
    studentsTab: "O'quvchilar ro'yxati",
    createGroupBtn: "➕ Yangi guruh yaratish",
    createStudentBtn: "➕ Yangi o'quvchi qo'shish",
    groupNameLabel: "Guruh nomi",
    groupNamePlaceholder: "Masalan: Ertalabki Elementary-1 yoki IELTS Chempionlari",
    editGroup: "Guruhni tahrirlash",
    deleteGroup: "Guruhni o'chirish",
    graduateGroup: "🎓 Guruh darajasini oshirish (Bitirtirish)",
    changeGroupLevel: "Guruh darajasini o'zgartirish",
    graduateConfirm: "Ushbu guruhni keyingi bosqichga ko'chirmoqchimisiz? Guruhdagi barcha o'quvchilar avtomatik yangi darajaga o'tadi.",
    groupCreatedSuccess: "Yangi guruh muvaffaqiyatli yaratildi!",
    studentCreatedSuccess: "Yangi o'quvchi muvaffaqiyatli qo'shildi!",
    groupGraduatedSuccess: "Barcha guruh a'zolari yangi darajaga ko'tarildi!",
    noGroupsYet: "Hali guruhlar yaratilmagan. 'Yangi guruh yaratish' tugmasini bosing!",
    noStudentsInGroup: "Bu guruhda hali o'quvchilar yo'q. 'Yangi o'quvchi qo'shish' tugmasini bosing.",
    noStudentsOverall: "Hali ro'yxatda o'quvchilar mavjud emas.",
    studentsCount: "O'quvchilar",
    copyCredentials: "📋 Login va parolni nusxalash",
    credentialsCopied: "Login va parol nusxalandi!",
    currentLevelBadge: "Joriy daraja",
    allLevels: "Barcha darajalar",

    addHomework: "Vazifa Qo'shish",
    homeworkTitle: "Vazifa nomi",
    homeworkTitlePlaceholder: "Masalan: 4-mavzu Past Simple mashqlari yoki Speaking",
    homeworkType: "Vazifa turi",
    typePaper: "Daftarda yozma (Rasm yuklash)",
    typeOral: "Og'zaki (Speaking / Yangi so'zlar)",
    dueDate: "Topshirish muddati",
    instructions: "Qo'shimcha ko'rsatmalar",
    attachPhotos: "Darslik varag'i rasmi (Ixtiyoriy)",
    attachPhotosHint: "O'quvchilar ko'rib bajarishi uchun kitob varag'i rasmini yuklang",
    publishHomework: "Vazifani e'lon qilish",
    noHomeworkYet: "Bu daraja uchun hali uy vazifasi berilmagan.",
    dueBy: "Muddati:",
    statusReady: "Tayyorman (I am ready)",
    statusNotReady: "Tayyor emasman (I am not ready)",
    uploadYourWork: "Yozgan vazifangiz rasmini yuklang",
    uploadBtn: "Rasm tanlash yoki kameradan olish",
    submitWork: "Vazifani topshirish",
    workSubmitted: "Uy vazifangiz muvaffaqiyatli topshirildi!",
    reviewSubmissions: "Topshirilgan ishlarni tekshirish",
    submittedPhotos: "Yuklangan rasmlar",
    readinessOverview: "Og'zaki tayyorgarlik holati",
    noSubmissions: "Hali hech kim topshirmagan.",
    oralStatusUpdated: "Holatingiz yangilandi:",

    addMaterial: "Material / Video qo'shish",
    materialName: "Material nomi",
    materialNamePlaceholder: "Masalan: Future Simple or Past Simple",
    materialType: "Material turi",
    typePdf: "PDF Hujjat",
    typeWord: "Word Hujjati (.docx)",
    typeVideo: "Video dars (.mp4 / havola)",
    typePhoto: "Infografika / Rasm",
    typeAudio: "Audio tinglash",
    uploadFileOrLink: "Fayl yuklash yoki video havolasi",
    noMaterialsYet: "Bu daraja uchun materiallar hali yuklanmagan.",
    viewMaterial: "Ochish / Ko'rish",
    readOnlyNotice: "O'quvchilar materiallarni ko'rishlari mumkin. Qo'shish va tahrirlash faqat o'qituvchi tomonidan amalga oshiriladi.",

    funTimeTitle: "Fun Time (Kino & Multfilm) 🍿",
    funTimeSubtitle: "Inglizcha subtitrli filmlar, multfilmlar va seriallar",
    choiceMovies: "Filmlar",
    choiceCartoons: "Multfilmlar",
    choiceSeries: "Seriallar",
    addMediaBtn: "Film / Multfilm qo'shish",
    mediaTitle: "Sarlavha",
    mediaCategory: "Kategoriya",
    uploadVideo: "Video fayli yoki havola",
    uploadSubtitle: "Subtitr fayli yuklash (.vtt yoki .srt)",
    subtitlesLabel: "Subtitrlar",
    subtitlesOn: "Subtitr: YONIQ",
    subtitlesOff: "Subtitr: O'CHIQ",
    doubleTapRewind: "Chapga ikki marta bosish: -10 soniya",
    doubleTapForward: "O'ngga ikki marta bosish: +10 soniya",
    noFunMedia: "Bu bo'limda hali videolar yo'q.",
    playNow: "Hozir ko'rish",
    closePlayer: "Pleyerni yopish",

    notifications: "Bildirishnomalar",
    markAllRead: "Hammasini o'qilgan qilish",
    noNotifications: "Yangi bildirishnomalar yo'q.",
    newHomeworkAdded: "Yangi uy vazifasi berildi:",
    newMaterialAdded: "Yangi darslik materiali qo'shildi:",
    newFunTimeAdded: "Yangi film/multfilm qo'shildi:",
    studentSubmittedNotif: "vazifani topshirdi:",

    nightMode: "Tungi rejim",
    lightMode: "Kunduzgi rejim",
    language: "Til",
    backupData: "Ma'lumotlarni nusxalash (Backup)",
    restoreData: "Ma'lumotlarni qayta tiklash",

    cancel: "Bekor qilish",
    save: "Saqlash",
    delete: "O'chirish",
    edit: "Tahrirlash",
    confirm: "Tasdiqlash",
    accept: "Qabul qilish",
    reject: "Rad etish",
    active: "Faol",
    completed: "Bajarildi",
    download: "Yuklab olish",
    close: "Yopish"
  },

  ru: {
    appName: "Lovely Homework!",
    appSubtitle: "Удобная проверка домашних заданий и видеоуроки",
    areYou: "Вы . . . ?",
    teacher: "Учитель",
    student: "Студент",
    teacherLogin: "Вход для учителя",
    studentLogin: "Вход для студента",
    enterPassword: "Введитe пароль учителя",
    passwordPlaceholder: "••••••••",
    passwordWrong: "Неверный пароль учителя! Доступ запрещен.",
    studentLoginFailed: "Неверный логин или пароль. Уточните у вашего учителя.",
    studentLoginHint: "Войдите, используя логин и пароль, выданные вашим учителем.",
    nameLabel: "Имя",
    lastNameLabel: "Фамилия",
    usernameLabel: "Логин (Username)",
    passwordLabel: "Пароль",
    defaultPasswordHint: "Пароль по умолчанию: 12345",
    selectLevel: "Выберите уровень",
    selectGroup: "Выберите группу",
    loginBtn: "Войти",
    welcomeBack: "С возвращением",
    signOut: "Выйти",

    levels: {
      "Beginner": "Beginner (Начальный)",
      "Elementary": "Elementary",
      "Pre-intermediate": "Pre-intermediate",
      "Intermediate": "Intermediate",
      "IELTS Novice": "IELTS Novice",
      "IELTS Standard": "IELTS Standard",
      "Graduated": "Выпускник (Alumni)"
    },

    tabHomework: "Домашние задания",
    tabMaterials: "Материалы / Видеоуроки",
    tabFunTime: "Fun Time (Кино)",
    tabStudents: "Группы и Студенты",

    groupsTab: "Группы",
    studentsTab: "Список студентов",
    createGroupBtn: "➕ Создать новую группу",
    createStudentBtn: "➕ Добавить студента",
    groupNameLabel: "Название группы",
    groupNamePlaceholder: "Например: Утренний Elementary-1 или IELTS Stars",
    editGroup: "Редактировать группу",
    deleteGroup: "Удалить группу",
    graduateGroup: "🎓 Повысить уровень / Выпустить",
    changeGroupLevel: "Изменить уровень группы",
    graduateConfirm: "Перевести эту группу на следующий уровень? Все студенты этой группы будут автоматически повышены.",
    groupCreatedSuccess: "Новая группа успешно создана!",
    studentCreatedSuccess: "Новый студент успешно добавлен!",
    groupGraduatedSuccess: "Вся группа успешно переведена на следующий уровень!",
    noGroupsYet: "Группы еще не созданы. Нажмите 'Создать новую группу'!",
    noStudentsInGroup: "В этой группе пока нет студентов. Нажмите 'Добавить студента'.",
    noStudentsOverall: "В списке пока нет добавленных студентов.",
    studentsCount: "Студенты",
    copyCredentials: "📋 Скопировать данные входа",
    credentialsCopied: "Данные для входа скопированы в буфер!",
    currentLevelBadge: "Текущий уровень",
    allLevels: "Все уровни",

    addHomework: "Добавить домашнее задание",
    homeworkTitle: "Название задания",
    homeworkTitlePlaceholder: "Например: Past Simple упражнения 1-5 или Спикинг",
    homeworkType: "Тип задания",
    typePaper: "Письменно на бумаге (Загрузить фото)",
    typeOral: "Устно (Вопросы для спикинга / Новые слова)",
    dueDate: "Срок сдачи (Дата и время)",
    instructions: "Инструкции и пояснения",
    attachPhotos: "Прикрепить фото задания (Необязательно)",
    attachPhotosHint: "Загрузите фото учебника или тетради для студентов",
    publishHomework: "Опубликовать задание",
    noHomeworkYet: "Для этого уровня пока нет заданий.",
    dueBy: "Сдать до:",
    statusReady: "I am ready (Я готов)",
    statusNotReady: "I am not ready (Я не готов)",
    uploadYourWork: "Загрузите фото домашнего задания",
    uploadBtn: "Выбрать фото или сделать снимок",
    submitWork: "Сдать задание",
    workSubmitted: "Ваше задание успешно отправлено!",
    reviewSubmissions: "Просмотр сданных работ",
    submittedPhotos: "Загруженные фотографии",
    readinessOverview: "Устная готовность",
    noSubmissions: "Пока никто не сдал.",
    oralStatusUpdated: "Ваш статус обновлен:",

    addMaterial: "Добавить материал / Видео",
    materialName: "Название материала",
    materialNamePlaceholder: "Например: Future Simple or Past Simple",
    materialType: "Тип материала",
    typePdf: "Документ PDF",
    typeWord: "Документ Word (.docx)",
    typeVideo: "Видеоурок (.mp4 / ссылка)",
    typePhoto: "Инфографика / Фото",
    typeAudio: "Аудиозапись",
    uploadFileOrLink: "Загрузить файл или ссылку",
    noMaterialsYet: "Материалов для этого уровня пока нет.",
    viewMaterial: "Открыть / Смотреть",
    readOnlyNotice: "Студенты могут просматривать материалы. Редактирование доступно только учителю.",

    funTimeTitle: "Fun Time 🍿",
    funTimeSubtitle: "Фильмы, Мультфильмы и Сериалы с субтитрами",
    choiceMovies: "Фильмы",
    choiceCartoons: "Мультфильмы",
    choiceSeries: "Сериалы",
    addMediaBtn: "Добавить фильм / мультфильм",
    mediaTitle: "Название",
    mediaCategory: "Категория",
    uploadVideo: "Видеофайл или ссылка",
    uploadSubtitle: "Файл субтитров (.vtt или .srt)",
    subtitlesLabel: "Субтитры",
    subtitlesOn: "Субтитры: ВКЛ",
    subtitlesOff: "Субтитры: ВЫКЛ",
    doubleTapRewind: "Двойной клик слева: -10 сек",
    doubleTapForward: "Двойной клик справа: +10 сек",
    noFunMedia: "В этом разделе пока ничего нет.",
    playNow: "Смотреть",
    closePlayer: "Закрыть плеер",

    notifications: "Уведомления",
    markAllRead: "Отметить все как прочитанные",
    noNotifications: "Новых уведомлений нет.",
    newHomeworkAdded: "Добавлено новое домашнее задание:",
    newMaterialAdded: "Добавлен новый учебный материал:",
    newFunTimeAdded: "Добавлен новый фильм/мультфильм:",
    studentSubmittedNotif: "сдал(а) домашнее задание:",

    nightMode: "Ночной режим",
    lightMode: "Дневной режим",
    language: "Язык",
    backupData: "Резервная копия данных",
    restoreData: "Восстановить данные",

    cancel: "Отмена",
    save: "Сохранить",
    delete: "Удалить",
    edit: "Редактировать",
    confirm: "Подтвердить",
    accept: "Принять",
    reject: "Отклонить",
    active: "Активен",
    completed: "Выполнено",
    download: "Скачать",
    close: "Закрыть"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('lovely_hw_lang') || 'en';
    // Validate supported language
    if (!['en', 'uz', 'ru'].includes(this.currentLang)) {
      this.currentLang = 'en';
    }
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('lovely_hw_lang', lang);
      this.applyTranslations();
    }
  }

  get(key, params = {}) {
    const keys = key.split('.');
    let val = translations[this.currentLang];
    for (const k of keys) {
      if (val && val[k] !== undefined) {
        val = val[k];
      } else {
        // fallback to English
        let fallback = translations.en;
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        val = fallback;
        break;
      }
    }

    if (typeof val === 'string' && params) {
      return val.replace(/\{(\w+)\}/g, (_, k) => params[k] !== undefined ? params[k] : `{${k}}`);
    }
    return val;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const text = this.get(key);
      if (text) el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = this.get(key);
      if (text) el.placeholder = text;
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const text = this.get(key);
      if (text) el.title = text;
    });

    document.title = this.get('appName');

    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
  }
}

window.i18n = new I18nManager();
