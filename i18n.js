// Lovely Homework! - Internationalization (i18n) Module
// Supported: English (en), Azerbaijani (az), Russian (ru), Turkish (tr)

const translations = {
  en: {
    appName: "Lovely Homework!",
    appSubtitle: "Learn, Practice, Excel together",
    areYou: "Are you . . . ?",
    teacher: "Teacher",
    student: "Student",
    teacherLogin: "Teacher Login & Portal",
    studentRegistration: "Student Registration",
    enterPassword: "Enter Master / Teacher Password",
    passwordPlaceholder: "Enter Teacher Password",
    passwordWrong: "Incorrect teacher password! Access denied.",
    nameLabel: "First Name",
    lastNameLabel: "Last Name",
    emailLabel: "Username or Email",
    selectLevel: "Select Your Current Level",
    selectTeacher: "Select Your Teacher",
    readyBtn: "Ready",
    pendingApprovalMsg: "Please wait until your teacher confirms your request.",
    pendingApprovalTitle: "Registration Pending",
    pendingSubtitle: "Your request has been submitted to your teacher. Once approved, you can log in immediately!",
    backToHome: "Back to Home",
    loginBtn: "Log In",
    registerBtn: "Register as Student",
    teacherRegisterHint: "New teacher? Register with the master password",
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
    tabStudents: "Students & Groups",
    
    // Group Graduation
    graduateGroup: "Graduate Group",
    graduateConfirm: "Are you sure you want to graduate this group to the next level?",
    graduatedSuccess: "The entire group has been successfully promoted to the next level!",
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
    studentRegisteredNotif: "New student registration pending:",
    approvedNotif: "Your student registration was approved! Welcome aboard.",

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
    pending: "Pending",
    active: "Active",
    completed: "Completed",
    download: "Download",
    close: "Close"
  },

  az: {
    appName: "Lovely Homework!",
    appSubtitle: "Dərslər, ev tapşırıqları və video dərslikləriniz bir arada",
    areYou: "Siz kimsiniz . . . ?",
    teacher: "Müəllim",
    student: "Tələbə",
    teacherLogin: "Müəllim Girişi",
    studentRegistration: "Tələbə Qeydiyyatı",
    enterPassword: "Müəllim Şifrəsini Daxil Edin",
    passwordPlaceholder: "Müəllim şifrəsini daxil edin",
    passwordWrong: "Şifrə yanlışdır! Giriş qadağandır.",
    nameLabel: "Adınız",
    lastNameLabel: "Soyadınız",
    emailLabel: "İstifadəçi adı və ya Email",
    selectLevel: "Cari Səviyyənizi Seçin",
    selectTeacher: "Müəlliminizi Seçin",
    readyBtn: "Ready (Hazıram)",
    pendingApprovalMsg: "Zəhmət olmasa müəlliminiz sorğunuzu təsdiqləyənə qədər gözləyin.",
    pendingApprovalTitle: "Təsdiq Gözlənilir",
    pendingSubtitle: "Sorğunuz müəlliminizə göndərildi. Təsdiqləndikdən sonra dərhal daxil ola bilərsiniz!",
    backToHome: "Ana Səhifəyə Qayıt",
    loginBtn: "Daxil Ol",
    registerBtn: "Tələbə Kimi Qeydiyyatdan Keç",
    teacherRegisterHint: "Yeni müəllimsiniz? Master şifrə ilə qeydiyyatdan keçin",
    welcomeBack: "Xoş gəldiniz",
    signOut: "Çıxış",

    levels: {
      "Beginner": "Beginner (Başlanğıc)",
      "Elementary": "Elementary",
      "Pre-intermediate": "Pre-intermediate",
      "Intermediate": "Intermediate",
      "IELTS Novice": "IELTS Novice",
      "IELTS Standard": "IELTS Standard",
      "Graduated": "Məzun Olunub"
    },

    tabHomework: "Ev Tapşırıqları",
    tabMaterials: "Materiallar / Video Dərslər",
    tabFunTime: "Fun Time (Əyləncə)",
    tabStudents: "Tələbələr və Qruplar",

    graduateGroup: "Qrupu Məzun Et (Növbəti Səviyyə)",
    graduateConfirm: "Bu qrupu növbəti səviyyəyə keçirmək istədiyinizdən əminsinizmi?",
    graduatedSuccess: "Bütün qrup uğurla növbəti səviyyəyə yüksəldildi!",
    currentLevelBadge: "Cari Səviyyə",
    allLevels: "Bütün Səviyyələr",

    addHomework: "Ev Tapşırığı Əlavə Et",
    homeworkTitle: "Tapşırığın Adı",
    homeworkTitlePlaceholder: "Məs: Future Simple testləri və ya Danışıq mövzusu",
    homeworkType: "Tapşırığın Növü",
    typePaper: "Vərəqdə Yazılı (Şəkilləri yükləmək tələb olunur)",
    typeOral: "Şifahi (Danışıq sualları / Yeni sözlər)",
    dueDate: "Son Tarix və Saat",
    instructions: "Qaydalar və Təlimatlar",
    attachPhotos: "Tapşırığın Şəkillərini Əlavə Et (İstəyə görə)",
    attachPhotosHint: "Tələbələrin görməsi üçün dərslik səhifələrinin şəklini yükləyin",
    publishHomework: "Tapşırığı Paylaş",
    noHomeworkYet: "Bu səviyyə üçün hələ ev tapşırığı verilməyib.",
    dueBy: "Son təhvil tarixi:",
    statusReady: "I am ready (Hazıram)",
    statusNotReady: "I am not ready (Hazır deyiləm)",
    uploadYourWork: "Yazılı Tapşırığın Şəklini Yükləyin",
    uploadBtn: "Şəkil Seç və ya Kamera ilə Çək",
    submitWork: "Tapşırığı Təhvil Ver",
    workSubmitted: "Ev tapşırığınız uğurla göndərildi!",
    reviewSubmissions: "Təhvillərə Bax",
    submittedPhotos: "Yüklənmiş Şəkillər",
    readinessOverview: "Şifahi Hazırlıq Vəziyyəti",
    noSubmissions: "Hələlik heç bir təhvil yoxdur.",
    oralStatusUpdated: "Statusunuz yeniləndi:",

    addMaterial: "Material / Video Əlavə Et",
    materialName: "Materialın Adı",
    materialNamePlaceholder: "Məs: Future Simple or Past Simple",
    materialType: "Material Növü",
    typePdf: "PDF Sənədi",
    typeWord: "Word Sənədi (.docx)",
    typeVideo: "Video Dərs (.mp4 / link)",
    typePhoto: "İnfoqrafika / Şəkil",
    typeAudio: "Dinləmə Səsi (Audio)",
    uploadFileOrLink: "Fayl Yüklə və ya Link Əlavə Et",
    noMaterialsYet: "Bu səviyyə üçün material tapılmadı.",
    viewMaterial: "Aç / İzlə",
    readOnlyNotice: "Tələbələr materiallara baxa bilər. Materialları yalnız müəllim redaktə edə və əlavə edə bilər.",

    funTimeTitle: "Fun Time (Əyləncə Zamanı) 🍿",
    funTimeSubtitle: "Altyazılı Filmlər, Cizgi Filmləri və Seriallar",
    choiceMovies: "Filmlər",
    choiceCartoons: "Cizgi Filmləri",
    choiceSeries: "Seriallar",
    addMediaBtn: "Film / Cizgi Filmi Əlavə Et",
    mediaTitle: "Başlıq",
    mediaCategory: "Bölmə",
    uploadVideo: "Video Faylı Yüklə və ya Video Linki",
    uploadSubtitle: "Altyazı Faylı Yüklə (.vtt və ya .srt)",
    subtitlesLabel: "Altyazılar",
    subtitlesOn: "Altyazı: AÇIQ",
    subtitlesOff: "Altyazı: BAĞLI",
    doubleTapRewind: "Sola iki toxunuş: -10 san",
    doubleTapForward: "Sağa iki toxunuş: +10 san",
    noFunMedia: "Bu bölmədə hələ video yoxdur.",
    playNow: "İndi İzlə",
    closePlayer: "Bağla",

    notifications: "Bildirişlər",
    markAllRead: "Hamısını oxunmuş et",
    noNotifications: "Yeni bildiriş yoxdur.",
    newHomeworkAdded: "Yeni ev tapşırığı əlavə edildi:",
    newMaterialAdded: "Yeni material əlavə edildi:",
    newFunTimeAdded: "Yeni film/cizgi filmi əlavə edildi:",
    studentSubmittedNotif: "tapşırığı təhvil verdi:",
    studentRegisteredNotif: "Yeni tələbə qeydiyyat sorğusu:",
    approvedNotif: "Müəlliminiz qeydiyyatınızı təsdiqlədi! Xoş gəldiniz.",

    nightMode: "Gecə Rejimi",
    lightMode: "Gündüz Rejimi",
    language: "Dil",
    backupData: "Məlumatları Yedəklə",
    restoreData: "Məlumatları Bərpa Et",

    cancel: "Ləğv et",
    save: "Yadda saxla",
    delete: "Sil",
    edit: "Düzəliş et",
    confirm: "Təsdiq et",
    accept: "Qəbul Et",
    reject: "İmtina Et",
    pending: "Gözləmədə",
    active: "Aktiv",
    completed: "Tamamlandı",
    download: "Yüklə",
    close: "Bağla"
  },

  ru: {
    appName: "Lovely Homework!",
    appSubtitle: "Удобная проверка домашних заданий и видеоуроки",
    areYou: "Вы . . . ?",
    teacher: "Учитель",
    student: "Студент",
    teacherLogin: "Вход для учителя",
    studentRegistration: "Регистрация студента",
    enterPassword: "Введитe пароль учителя",
    passwordPlaceholder: "Введите пароль учителя",
    passwordWrong: "Неверный пароль учителя! Доступ запрещен.",
    nameLabel: "Имя",
    lastNameLabel: "Фамилия",
    emailLabel: "Имя пользователя или Email",
    selectLevel: "Выберите ваш уровень",
    selectTeacher: "Выберите учителя",
    readyBtn: "Ready (Готово)",
    pendingApprovalMsg: "Пожалуйста, подождите, пока учитель подтвердит ваш запрос.",
    pendingApprovalTitle: "Ожидание подтверждения",
    pendingSubtitle: "Ваша заявка отправлена учителю. После подтверждения вы сможете сразу войти!",
    backToHome: "На главную",
    loginBtn: "Войти",
    registerBtn: "Зарегистрироваться как студент",
    teacherRegisterHint: "Новый учитель? Зарегистрируйтесь с мастер-паролем",
    welcomeBack: "С возвращением",
    signOut: "Выйти",

    levels: {
      "Beginner": "Beginner (Начальный)",
      "Elementary": "Elementary",
      "Pre-intermediate": "Pre-intermediate",
      "Intermediate": "Intermediate",
      "IELTS Novice": "IELTS Novice",
      "IELTS Standard": "IELTS Standard",
      "Graduated": "Выпускник"
    },

    tabHomework: "Домашние задания",
    tabMaterials: "Материалы / Видеоуроки",
    tabFunTime: "Fun Time (Развлечения)",
    tabStudents: "Студенты и группы",

    graduateGroup: "Выпустить группу (Следующий уровень)",
    graduateConfirm: "Вы уверены, что хотите перевести всю группу на следующий уровень?",
    graduatedSuccess: "Вся группа успешно переведена на следующий уровень!",
    currentLevelBadge: "Текущий уровень",
    allLevels: "Все уровни",

    addHomework: "Добавить домашнее задание",
    homeworkTitle: "Название задания",
    homeworkTitlePlaceholder: "Например: Past Simple упражнения 1-5",
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
    readOnlyNotice: "Студенты могут просматривать материалы. Редактирование и добавление доступно только учителю.",

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
    studentRegisteredNotif: "Новая заявка на регистрацию:",
    approvedNotif: "Учитель одобрил вашу регистрацию! Добро пожаловать.",

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
    pending: "Ожидает",
    active: "Активен",
    completed: "Выполнено",
    download: "Скачать",
    close: "Закрыть"
  },

  tr: {
    appName: "Lovely Homework!",
    appSubtitle: "Öğretmenler ve öğrenciler için akıllı ödev ve ders portalı",
    areYou: "Hangisisiniz . . . ?",
    teacher: "Öğretmen",
    student: "Öğrenci",
    teacherLogin: "Öğretmen Girişi",
    studentRegistration: "Öğrenci Kaydı",
    enterPassword: "Öğretmen Şifresini Girin",
    passwordPlaceholder: "Öğretmen şifresini girin",
    passwordWrong: "Hatalı öğretmen şifresi! Erişim reddedildi.",
    nameLabel: "Adınız",
    lastNameLabel: "Soyadınız",
    emailLabel: "Kullanıcı Adı veya E-posta",
    selectLevel: "Seviyenizi Seçin",
    selectTeacher: "Öğretmeninizi Seçin",
    readyBtn: "Ready (Hazırım)",
    pendingApprovalMsg: "Lütfen öğretmeniniz isteğinizi onaylayana kadar bekleyin.",
    pendingApprovalTitle: "Kayıt Onayı Bekleniyor",
    pendingSubtitle: "Talebiniz öğretmeninize iletildi. Onaylandıktan sonra doğrudan giriş yapabilirsiniz!",
    backToHome: "Ana Sayfaya Dön",
    loginBtn: "Giriş Yap",
    registerBtn: "Öğrenci Olarak Kaydol",
    teacherRegisterHint: "Yeni öğretmen misiniz? Master şifre ile kaydolun",
    welcomeBack: "Tekrar hoş geldiniz",
    signOut: "Çıkış Yap",

    levels: {
      "Beginner": "Beginner (Başlangıç)",
      "Elementary": "Elementary",
      "Pre-intermediate": "Pre-intermediate",
      "Intermediate": "Intermediate",
      "IELTS Novice": "IELTS Novice",
      "IELTS Standard": "IELTS Standard",
      "Graduated": "Mezun"
    },

    tabHomework: "Ödevler",
    tabMaterials: "Materyaller / Video Dersler",
    tabFunTime: "Fun Time (Eğlence)",
    tabStudents: "Öğrenciler ve Gruplar",

    graduateGroup: "Grubu Mezun Et (Sonraki Seviye)",
    graduateConfirm: "Bu grubu bir üst seviyeye taşımak istediğinize emin misiniz?",
    graduatedSuccess: "Tüm grup başarıyla bir üst seviyeye geçirildi!",
    currentLevelBadge: "Mevcut Seviye",
    allLevels: "Tüm Seviyeler",

    addHomework: "Ödev Ekle",
    homeworkTitle: "Ödev Başlığı",
    homeworkTitlePlaceholder: "Örn: Past Simple alıştırmaları",
    homeworkType: "Ödev Türü",
    typePaper: "Kağıt Üzerinde Yazılı (Fotoğraf Yükleme)",
    typeOral: "Sözlü (Konuşma Soruları / Yeni Kelimeler)",
    dueDate: "Son Teslim Tarihi ve Saati",
    instructions: "Yönergeler ve Açıklama",
    attachPhotos: "Ödev Fotoğrafları Ekle (İsteğe bağlı)",
    attachPhotosHint: "Öğrencilerin görmesi için ders kitabı fotoğraflarını yükleyin",
    publishHomework: "Ödevi Yayınla",
    noHomeworkYet: "Bu seviye için henüz ödev verilmedi.",
    dueBy: "Son teslim:",
    statusReady: "I am ready (Hazırım)",
    statusNotReady: "I am not ready (Hazır değilim)",
    uploadYourWork: "Ödevinizin Fotoğrafını Yükleyin",
    uploadBtn: "Fotoğraf Seç veya Fotoğraf Çek",
    submitWork: "Ödevi Teslim Et",
    workSubmitted: "Ödeviniz başarıyla gönderildi!",
    reviewSubmissions: "Teslimleri İncele",
    submittedPhotos: "Yüklenen Fotoğraflar",
    readinessOverview: "Sözlü Hazırlık Durumu",
    noSubmissions: "Henüz teslim yapılmadı.",
    oralStatusUpdated: "Durumunuz güncellendi:",

    addMaterial: "Materyal / Video Ekle",
    materialName: "Materyal Adı",
    materialNamePlaceholder: "Örn: Future Simple or Past Simple",
    materialType: "Materyal Türü",
    typePdf: "PDF Belgesi",
    typeWord: "Word Belgesi (.docx)",
    typeVideo: "Video Ders (.mp4 / link)",
    typePhoto: "İnfografik / Fotoğraf",
    typeAudio: "Dinleme Sesi",
    uploadFileOrLink: "Dosya Yükle veya Medya Linki",
    noMaterialsYet: "Bu seviye için henüz materyal bulunmamaktadır.",
    viewMaterial: "Aç / İzle",
    readOnlyNotice: "Öğrenciler materyalleri inceleyebilir. Düzenleme ve ekleme yalnızca öğretmen tarafından yapılır.",

    funTimeTitle: "Fun Time 🍿",
    funTimeSubtitle: "Altyazılı Filmler, Çizgi Filmler ve Diziler",
    choiceMovies: "Filmler",
    choiceCartoons: "Çizgi Filmler",
    choiceSeries: "Diziler",
    addMediaBtn: "Film / Çizgi Film Ekle",
    mediaTitle: "Başlık",
    mediaCategory: "Kategori",
    uploadVideo: "Video Dosyası veya Video Linki",
    uploadSubtitle: "Altyazı Dosyası (.vtt veya .srt)",
    subtitlesLabel: "Altyazılar",
    subtitlesOn: "Altyazı: AÇIK",
    subtitlesOff: "Altyazı: KAPALI",
    doubleTapRewind: "Sol çift dokunuş: -10 sn",
    doubleTapForward: "Sağ çift dokunuş: +10 sn",
    noFunMedia: "Bu kategoride henüz video yok.",
    playNow: "İzle",
    closePlayer: "Kapat",

    notifications: "Bildirimler",
    markAllRead: "Tümünü okundu işaretle",
    noNotifications: "Yeni bildirim bulunmuyor.",
    newHomeworkAdded: "Yeni ödev eklendi:",
    newMaterialAdded: "Yeni materyal eklendi:",
    newFunTimeAdded: "Yeni film/çizgi film eklendi:",
    studentSubmittedNotif: "ödevini teslim etti:",
    studentRegisteredNotif: "Yeni öğrenci kayıt onayı bekliyor:",
    approvedNotif: "Öğretmeniniz kaydınızı onayladı! Hoş geldiniz.",

    nightMode: "Gece Modu",
    lightMode: "Gündüz Modu",
    language: "Dil",
    backupData: "Verileri Yedekle",
    restoreData: "Verileri Geri Yükle",

    cancel: "İptal",
    save: "Kaydet",
    delete: "Sil",
    edit: "Düzenle",
    confirm: "Onayla",
    accept: "Kabul Et",
    reject: "Reddet",
    pending: "Bekliyor",
    active: "Aktif",
    completed: "Tamamlandı",
    download: "İndir",
    close: "Kapat"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('lovely_hw_lang') || 'en';
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

    // Update document title
    document.title = this.get('appName');

    // Trigger custom event so reactive components re-render
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
  }
}

window.i18n = new I18nManager();
