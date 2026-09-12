/* =====================================================
   TOURISM VIDEOS DATA — سایروس توریست
   داده‌ی مشترک گالری فیلم‌های گردشگری (گالری + صفحه‌ی جزئیات)
   این فایل مستقل است و تغییری در بخش «فیلم‌های روی سایت»
   داخل index.html ایجاد نمی‌کند.
   منبع: همان ۲۲ ویدیوی واقعی آپارات که در اپلیکیشن سایروس توریست
   استفاده شده‌اند (بازسازی‌شده از سورس اپ چون نسخه‌ی قبلی این فایل
   روی وب ناقص/خراب بود).
===================================================== */

const TOURISM_CATEGORIES = {
  heritage: {
    fa: "میراث تاریخی", en: "Historical Heritage", ar: "التراث التاريخي",
    icon: "🏛️"
  },
  cultureArt: {
    fa: "فرهنگ و هنر", en: "Culture and Art", ar: "الثقافة والفنون",
    icon: "🎭"
  },
  natureIran: {
    fa: "طبیعت ایران", en: "Nature of Iran", ar: "طبيعة إيران",
    icon: "🌿"
  },
  mountaineering: {
    fa: "کوهنوردی", en: "Mountaineering", ar: "تسلق الجبال",
    icon: "⛰️"
  },
  environment: {
    fa: "محیط زیست", en: "Environment", ar: "البيئة",
    icon: "🌳"
  },
  waterfall: {
    fa: "آبشار", en: "Waterfall", ar: "شلال",
    icon: "💧"
  },
  foodTourism: {
    fa: "گردشگری خوراک", en: "Food Tourism", ar: "سياحة الطعام",
    icon: "🍲"
  },
  cultureLiterature: {
    fa: "فرهنگ و ادب", en: "Culture and Literature", ar: "الثقافة والأدب",
    icon: "📜"
  },
  natureTourism: {
    fa: "طبیعت‌گردی", en: "Nature Tourism", ar: "السياحة الطبيعية",
    icon: "🏕️"
  },
  nowruz: {
    fa: "نوروز", en: "Nowruz", ar: "نوروز",
    icon: "🌸"
  },
  kermanAttractions: {
    fa: "دیدنی‌های کرمان", en: "Kerman Attractions", ar: "معالم كرمان",
    icon: "🏺"
  },
  cultureHistory: {
    fa: "فرهنگ و تاریخ", en: "Culture and History", ar: "الثقافة والتاريخ",
    icon: "🕌"
  },
  historicGarden: {
    fa: "باغ تاریخی", en: "Historic Garden", ar: "حديقة تاريخية",
    icon: "🌷"
  },
  museum: {
    fa: "موزه", en: "Museum", ar: "متحف",
    icon: "🖼️"
  },
  coastIslands: {
    fa: "سواحل و جزایر", en: "Coasts and Islands", ar: "السواحل والجزر",
    icon: "🏝️"
  },
  caveNature: {
    fa: "غار و طبیعت", en: "Cave and Nature", ar: "الكهوف والطبيعة",
    icon: "🕳️"
  },
  iranHeritage: {
    fa: "میراث ایران", en: "Iranian Heritage", ar: "التراث الإيراني",
    icon: "🏺"
  }
};

const TOURISM_VIDEOS = [
  {
    id: 1, hash: "t346o2k", category: "heritage",
    title: { fa: "قنات قصبه گناباد؛ شگفتی تاریخ تمدن بشر", en: "Qasabeh Gonabad Qanat; A Wonder of Human Civilization", ar: "قناة قصبة گناباد؛ أعجوبة من تاريخ الحضارة البشرية" },
    loc: { fa: "گناباد، خراسان رضوی", en: "Gonabad, Razavi Khorasan", ar: "غناباد، خراسان الرضوية" }
  },
  {
    id: 2, hash: "w17sz69", category: "cultureArt",
    title: { fa: "رقص محلی فاروق خراسانی با آهنگ لیلا", en: "Farouq Khorasani Folk Dance with the Song Leila", ar: "رقصة فاروق الخراسانية الشعبية على أنغام ليلى" },
    loc: { fa: "خراسان", en: "Khorasan", ar: "خراسان" }
  },
  {
    id: 3, hash: "xvo5q9c", category: "natureIran",
    title: { fa: "چشمه گراب؛ جادوی طبیعت ایران", en: "Gorab Spring; The Magic of Iranian Nature", ar: "نبع غراب؛ سحر الطبيعة الإيرانية" },
    loc: { fa: "خراسان رضوی", en: "Razavi Khorasan", ar: "خراسان الرضوية" }
  },
  {
    id: 4, hash: "hzlol4k", category: "mountaineering",
    title: { fa: "جنگل کوه‌پارک مشهد و قله زو", en: "Mashhad Kuh Park Forest and Zoo Peak", ar: "غابة كوه بارك في مشهد وقمة زو" },
    loc: { fa: "مشهد، خراسان رضوی", en: "Mashhad, Razavi Khorasan", ar: "مشهد، خراسان الرضوية" }
  },
  {
    id: 5, hash: "guqcsg5", category: "environment",
    title: { fa: "کاشت بلوط؛ راه نجات جنگل‌های هیرکانی", en: "Planting Oak Trees; A Way to Save the Hyrcanian Forests", ar: "زراعة أشجار البلوط؛ طريق لإنقاذ غابات هيركان" },
    loc: { fa: "جنگل‌های هیرکانی", en: "Hyrcanian Forests", ar: "غابات هيركان" }
  },
  {
    id: 6, hash: "w8lOg", category: "waterfall",
    title: { fa: "آبشار شیرآباد؛ یکی از دیدنی‌های گلستان", en: "Shirabad Waterfall; One of Golestan’s Natural Attractions", ar: "شلال شيرآباد؛ أحد المعالم الطبيعية في غلستان" },
    loc: { fa: "استان گلستان", en: "Golestan Province", ar: "محافظة غلستان" }
  },
  {
    id: 7, hash: "uK3y5", category: "foodTourism",
    title: { fa: "آبگوشت دیزی سنگی در طبیعت", en: "Traditional Dizi Stone-Pot Stew in Nature", ar: "أبغوشت ديزي التقليدي في الطبيعة" },
    loc: { fa: "ایران", en: "Iran", ar: "إيران" }
  },
  {
    id: 8, hash: "nuXAC", category: "cultureLiterature",
    title: { fa: "۲۵ اردیبهشت؛ روز بزرگداشت فردوسی", en: "May 15; Ferdowsi Commemoration Day", ar: "15 مايو؛ يوم تكريم الفردوسي" },
    loc: { fa: "مشهد، خراسان رضوی", en: "Mashhad, Razavi Khorasan", ar: "مشهد، خراسان الرضوية" }
  },
  {
    id: 9, hash: "x707h19", category: "natureIran",
    title: { fa: "چشمه سبز گلمکان؛ دریاچه زیبای مشهد", en: "Golmakan Green Spring; A Beautiful Lake near Mashhad", ar: "نبع سبز غلمكان؛ البحيرة الجميلة قرب مشهد" },
    loc: { fa: "گلمکان، خراسان رضوی", en: "Golmakan, Razavi Khorasan", ar: "غلمكان، خراسان الرضوية" }
  },
  {
    id: 10, hash: "4Z0hQ", category: "natureTourism",
    title: { fa: "آموزش پخت سیب‌زمینی آتشی در طبیعت", en: "How to Cook Campfire Potatoes in Nature", ar: "طريقة إعداد البطاطا المشوية على النار في الطبيعة" },
    loc: { fa: "طبیعت ایران", en: "Iranian Nature", ar: "الطبيعة الإيرانية" }
  },
  {
    id: 11, hash: "s78jcie", category: "nowruz",
    title: { fa: "جشن نوروز باستانی و سفره هفت‌سین", en: "Ancient Nowruz Celebration and Haft-Seen Table", ar: "احتفال نوروز القديم ومائدة هفت سين" },
    loc: { fa: "ایران", en: "Iran", ar: "إيران" }
  },
  {
    id: 12, hash: "R1p3U", category: "kermanAttractions",
    title: { fa: "چایخانه حمام وکیل کرمان", en: "Vakil Bathhouse Teahouse in Kerman", ar: "مقهى حمام وكيل في كرمان" },
    loc: { fa: "کرمان", en: "Kerman", ar: "كرمان" }
  },
  {
    id: 13, hash: "g40wppg", category: "heritage",
    title: { fa: "بجستان، آسبادهای نشتیفان و برج علی‌آباد کشمر", en: "Bajestan, Nashtifan Windmills and Aliabad Kashmar Tower", ar: "بجستان وطواحين نشتيـفان الهوائية وبرج علي آباد كاشمر" },
    loc: { fa: "خراسان رضوی", en: "Razavi Khorasan", ar: "خراسان الرضوية" }
  },
  {
    id: 14, hash: "xsBFX", category: "cultureHistory",
    title: { fa: "شاه نعمت‌الله ولی؛ ماهان کرمان", en: "Shah Nematollah Vali; Mahan, Kerman", ar: "شاه نعمة الله ولي؛ ماهان، كرمان" },
    loc: { fa: "ماهان، کرمان", en: "Mahan, Kerman", ar: "ماهان، كرمان" }
  },
  {
    id: 15, hash: "3ZCGs", category: "historicGarden",
    title: { fa: "باغ شاهزاده ماهان؛ شاهکار باغ ایرانی", en: "Shazdeh Garden in Mahan; A Masterpiece of Persian Gardens", ar: "حديقة شازده ماهان؛ تحفة الحدائق الفارسية" },
    loc: { fa: "ماهان، کرمان", en: "Mahan, Kerman", ar: "ماهان، كرمان" }
  },
  {
    id: 16, hash: "z72q215", category: "museum",
    title: { fa: "موزه بانو حیاتی؛ گنجینه‌ای در بازار کرمان", en: "Banoo Hayati Museum; A Treasure in Kerman Bazaar", ar: "متحف بانو حياتي؛ كنز في بازار كرمان" },
    loc: { fa: "کرمان", en: "Kerman", ar: "كرمان" }
  },
  {
    id: 17, hash: "c4744bv", category: "heritage",
    title: { fa: "قلعه سریزد؛ نخستین بانک جهان", en: "Saryazd Castle; The World’s First Bank", ar: "قلعة سريزد؛ أول بنك في العالم" },
    loc: { fa: "سریزد، یزد", en: "Saryazd, Yazd", ar: "سريزد، يزد" }
  },
  {
    id: 18, hash: "kGS8o", category: "coastIslands",
    title: { fa: "جنگل‌های حرا و بندر تاریخی لافت", en: "Mangrove Forests and the Historic Port of Laft", ar: "غابات القرم وميناء لافت التاريخي" },
    loc: { fa: "جزیره قشم", en: "Qeshm Island", ar: "جزيرة قشم" }
  },
  {
    id: 19, hash: "mPh2q", category: "historicGarden",
    title: { fa: "باغ فین کاشان با موسیقی سنتی", en: "Fin Garden in Kashan with Traditional Music", ar: "حديقة فين في كاشان مع الموسيقى التقليدية" },
    loc: { fa: "کاشان", en: "Kashan", ar: "كاشان" }
  },
  {
    id: 20, hash: "k2RDX", category: "caveNature",
    title: { fa: "غار علی‌صدر؛ غار تالابی شگفت‌انگیز ایران", en: "Ali Sadr Cave; Iran’s Amazing Water Cave", ar: "كهف علي صدر؛ الكهف المائي المذهل في إيران" },
    loc: { fa: "همدان", en: "Hamadan", ar: "همدان" }
  },
  {
    id: 21, hash: "f91418q", category: "waterfall",
    title: { fa: "آبشار اخلمد چناران؛ طبیعت زیبای خراسان", en: "Akhlamad Waterfall in Chenaran; The Beautiful Nature of Khorasan", ar: "شلال أخلمد في چناران؛ طبيعة خراسان الجميلة" },
    loc: { fa: "چناران، خراسان رضوی", en: "Chenaran, Razavi Khorasan", ar: "چناران، خراسان الرضوية" }
  },
  {
    id: 22, hash: "f5212r6", category: "iranHeritage",
    title: { fa: "جشن نوروز تخت جمشید؛ شهر پارس و پاسارگاد", en: "Nowruz Celebration at Persepolis; The Land of Pars and Pasargadae", ar: "احتفال نوروز في تخت جمشيد؛ أرض فارس وباسارغاد" },
    loc: { fa: "فارس", en: "Fars", ar: "فارس" }
  }
];
