/*
 * Cyrus Tourist
 * Residences Data
 *
 * این فایل منبع داده بخش اقامتگاه‌هاست.
 *
 * نکته مهم:
 * - برای اضافه کردن اقامتگاه جدید، فقط یک رکورد جدید اضافه می‌شود.
 * - HTML اصلی نیاز به تغییر ندارد.
 * - دسته‌بندی‌ها از همین فایل خوانده می‌شوند.
 * - در آینده همین ساختار می‌تواند مستقیماً از API / Cloudflare D1 تغذیه شود.
 */

const RESIDENCE_TYPES = {

  hotelApartment: {
    id: "hotel-apartment",
    icon: "🏨",
    name: {
      fa: "هتل / آپارتمان",
      en: "Hotel / Apartment",
      ar: "فندق / شقة"
    },
    order: 1,
    featured: true
  },

  ecotourism: {
    id: "ecotourism",
    icon: "🌿",
    name: {
      fa: "بوم‌گردی",
      en: "Eco-lodge",
      ar: "نزل بيئي"
    },
    order: 2,
    featured: true
  },

  forestCabin: {
    id: "forest-cabin",
    icon: "🛖",
    name: {
      fa: "کلبه جنگلی",
      en: "Forest Cabin",
      ar: "كوخ غابي"
    },
    order: 3,
    featured: true
  },

  camping: {
    id: "camping",
    icon: "🏕️",
    name: {
      fa: "کمپ و طبیعت‌گردی",
      en: "Camping & Nature Stay",
      ar: "تخييم وإقامة طبيعية"
    },
    order: 4,
    featured: true
  },

  villaLocalHouse: {
    id: "villa-local-house",
    icon: "🏡",
    name: {
      fa: "ویلا / خانه محلی",
      en: "Villa / Local House",
      ar: "فيلا / منزل محلي"
    },
    order: 5,
    featured: true
  },

  beach: {
    id: "beach",
    icon: "🌊",
    name: {
      fa: "اقامتگاه ساحلی",
      en: "Beach Accommodation",
      ar: "إقامة ساحلية"
    },
    order: 6,
    featured: false
  },

  mountain: {
    id: "mountain",
    icon: "⛰️",
    name: {
      fa: "اقامتگاه کوهستانی",
      en: "Mountain Accommodation",
      ar: "إقامة جبلية"
    },
    order: 7,
    featured: false
  },

  guesthouse: {
    id: "guesthouse",
    icon: "🏠",
    name: {
      fa: "مهمان‌پذیر",
      en: "Guesthouse",
      ar: "دار ضيافة"
    },
    order: 8,
    featured: false
  },

  suite: {
    id: "suite",
    icon: "🏘️",
    name: {
      fa: "سوئیت",
      en: "Suite",
      ar: "جناح"
    },
    order: 9,
    featured: false
  },

  forest: {
    id: "forest",
    icon: "🌳",
    name: {
      fa: "اقامتگاه جنگلی",
      en: "Forest Accommodation",
      ar: "إقامة غابية"
    },
    order: 10,
    featured: false
  },

  desert: {
    id: "desert",
    icon: "🏜️",
    name: {
      fa: "اقامتگاه کویری",
      en: "Desert Accommodation",
      ar: "إقامة صحراوية"
    },
    order: 11,
    featured: false
  },

  other: {
    id: "other",
    icon: "➕",
    name: {
      fa: "سایر",
      en: "Other",
      ar: "أخرى"
    },
    order: 99,
    featured: false
  }
};


/*
 * اطلاعات نمونه اقامتگاه‌ها
 *
 * برای اضافه کردن اقامتگاه جدید:
 *
 * {
 *   id: "RES-0002",
 *   type: "ecotourism",
 *   ...
 * }
 *
 * هیچ محدودیت عددی در این آرایه تعریف نشده است.
 */

const RESIDENCES_DATA = [

  {
    id: "RES-0001",

    name: {
      fa: "نمونه اقامتگاه سایروس توریست",
      en: "Cyrus Tourist Sample Residence",
      ar: "نموذج إقامة سايروس توريست"
    },

    type: "ecotourism",

    province: {
      fa: "خراسان رضوی",
      en: "Razavi Khorasan",
      ar: "خراسان الرضوية"
    },

    city: {
      fa: "مشهد",
      en: "Mashhad",
      ar: "مشهد"
    },

    region: {
      fa: "حومه مشهد",
      en: "Mashhad Area",
      ar: "منطقة مشهد"
    },

    address: {
      fa: "آدرس نمونه؛ بعداً اطلاعات واقعی اقامتگاه وارد می‌شود.",
      en: "Sample address; real accommodation information can be added later.",
      ar: "عنوان تجريبي؛ يمكن إضافة معلومات الإقامة الحقيقية لاحقاً."
    },

    phone: "09150000000",

    latitude: 36.2972,
    longitude: 59.6067,

    description: {
      fa: "این رکورد نمونه برای آزمایش سیستم اقامتگاه سایروس توریست ایجاد شده است.",
      en: "This sample record is used to test the Cyrus Tourist accommodation system.",
      ar: "تم إنشاء هذا السجل التجريبي لاختبار نظام أماكن الإقامة في سايروس توريست."
    },

    imageUrl: "",

    videoUrl: "",
    videoSource: "",

    instagram: "",
    website: "",

    rating: 4.8,
    ratingCount: 0,

    status: "active",

    membership: {
      type: "annual",
      startDate: "",
      endDate: ""
    },

    display: {
      featured: true,
      showVideo: true,
      showPhone: true,
      showInstagram: true,
      showWebsite: true,
      showRating: true
    },

    createdAt: "",
    updatedAt: ""
  }

];


/*
 * وضعیت‌های رسمی اقامتگاه
 */

const RESIDENCE_STATUS = {

  active: {
    id: "active",
    icon: "🟢",
    name: {
      fa: "فعال",
      en: "Active",
      ar: "نشط"
    }
  },

  pending: {
    id: "pending",
    icon: "🟡",
    name: {
      fa: "در انتظار بررسی",
      en: "Under Review",
      ar: "قيد المراجعة"
    }
  },

  inactive: {
    id: "inactive",
    icon: "🔵",
    name: {
      fa: "غیرفعال موقت",
      en: "Temporarily Inactive",
      ar: "غير نشط مؤقتاً"
    }
  },

  expired: {
    id: "expired",
    icon: "🔴",
    name: {
      fa: "اعتبار پایان یافته",
      en: "Expired",
      ar: "انتهت الصلاحية"
    }
  },

  suspended: {
    id: "suspended",
    icon: "⚫",
    name: {
      fa: "تعلیق مدیریتی",
      en: "Administratively Suspended",
      ar: "موقوف إدارياً"
    }
  },

  archived: {
    id: "archived",
    icon: "🗃️",
    name: {
      fa: "آرشیو",
      en: "Archived",
      ar: "مؤرشف"
    }
  }

};


/*
 * انواع منابع ویدئو
 *
 * فایل ویدئو روی هاست سایروس توریست ذخیره نمی‌شود.
 * فقط آدرس و منبع ویدئو نگهداری می‌شود.
 */

const RESIDENCE_VIDEO_SOURCES = {

  aparat: {
    id: "aparat",
    name: {
      fa: "آپارات",
      en: "Aparat",
      ar: "أبارات"
    }
  },

  youtube: {
    id: "youtube",
    name: {
      fa: "یوتیوب",
      en: "YouTube",
      ar: "يوتيوب"
    }
  },

  vimeo: {
    id: "vimeo",
    name: {
      fa: "Vimeo",
      en: "Vimeo",
      ar: "Vimeo"
    }
  },

  instagram: {
    id: "instagram",
    name: {
      fa: "اینستاگرام",
      en: "Instagram",
      ar: "إنستغرام"
    }
  },

  tiktok: {
    id: "tiktok",
    name: {
      fa: "تیک‌تاک",
      en: "TikTok",
      ar: "تيك توك"
    }
  },

  other: {
    id: "other",
    name: {
      fa: "سایر",
      en: "Other",
      ar: "أخرى"
    }
  }

};


/*
 * فیلدهای قابل جستجو
 *
 * فایل جستجو در مرحله بعد از این ساختار استفاده خواهد کرد.
 */

const RESIDENCE_SEARCH_FIELDS = [
  "name",
  "province",
  "city",
  "region",
  "address",
  "type"
];


/*
 * گرفتن نام نوع اقامتگاه
 */

function getResidenceType(typeId, language = "fa") {

  const type = Object.values(RESIDENCE_TYPES)
    .find(item => item.id === typeId);

  if (!type) {
    return "";
  }

  return (
    type.name[language] ||
    type.name.fa ||
    ""
  );
}


/*
 * گرفتن وضعیت اقامتگاه
 */

function getResidenceStatus(statusId, language = "fa") {

  const status = RESIDENCE_STATUS[statusId];

  if (!status) {
    return "";
  }

  return (
    status.name[language] ||
    status.name.fa ||
    ""
  );
}


/*
 * دریافت فقط اقامتگاه‌های فعال
 */

function getActiveResidences() {

  return RESIDENCES_DATA.filter(
    residence => residence.status === "active"
  );

}


/*
 * دریافت دسته‌بندی‌ها بر اساس ترتیب
 */

function getResidenceTypes() {

  return Object.values(RESIDENCE_TYPES)
    .sort((a, b) => a.order - b.order);

}


/*
 * دریافت دسته‌بندی‌های اصلی
 */

function getFeaturedResidenceTypes() {

  return getResidenceTypes()
    .filter(type => type.featured);

}


/*
 * استخراج استان‌های موجود
 *
 * استان‌ها از اطلاعات واقعی اقامتگاه‌ها استخراج می‌شوند
 * و در HTML به‌صورت دستی نوشته نمی‌شوند.
 */

function getResidenceProvinces(language = "fa") {

  const values = RESIDENCES_DATA
    .map(residence => residence.province?.[language])
    .filter(Boolean);

  return [...new Set(values)].sort((a, b) =>
    a.localeCompare(b, language)
  );

}


/*
 * استخراج شهرهای موجود
 */

function getResidenceCities(language = "fa") {

  const values = RESIDENCES_DATA
    .map(residence => residence.city?.[language])
    .filter(Boolean);

  return [...new Set(values)].sort((a, b) =>
    a.localeCompare(b, language)
  );

}


/*
 * استخراج مناطق موجود
 */

function getResidenceRegions(language = "fa") {

  const values = RESIDENCES_DATA
    .map(residence => residence.region?.[language])
    .filter(Boolean);

  return [...new Set(values)].sort((a, b) =>
    a.localeCompare(b, language)
  );

}


/*
 * ساخت شناسه جدید برای آینده
 *
 * فعلاً برای حالت دستی.
 * در نسخه API / D1 شناسه اصلی از سرور دریافت خواهد شد.
 */

function createResidenceId() {

  const number =
    RESIDENCES_DATA.length + 1;

  return (
    "RES-" +
    String(number).padStart(4, "0")
  );

}


/*
 * بررسی صحت حداقل اطلاعات اقامتگاه
 */

function validateResidence(residence) {

  if (!residence) {
    return false;
  }

  if (!residence.id) {
    return false;
  }

  if (!residence.name) {
    return false;
  }

  if (!residence.type) {
    return false;
  }

  if (!residence.province) {
    return false;
  }

  if (!residence.city) {
    return false;
  }

  if (
    typeof residence.latitude !== "number" ||
    typeof residence.longitude !== "number"
  ) {
    return false;
  }

  if (!residence.status) {
    return false;
  }

  return true;

}


/*
 * بررسی تمام رکوردهای موجود
 */

function validateAllResidences() {

  return RESIDENCES_DATA.every(
    residence => validateResidence(residence)
  );

}


/*
 * آمار اولیه داده‌ها
 */

function getResidenceStatistics() {

  const total = RESIDENCES_DATA.length;

  const active = RESIDENCES_DATA.filter(
    item => item.status === "active"
  ).length;

  const withVideo = RESIDENCES_DATA.filter(
    item => item.videoUrl
  ).length;

  return {
    total,
    active,
    withVideo
  };

}


/*
 * اطلاعات قابل استفاده برای اتصال آینده به API
 */

const RESIDENCE_DATA_CONFIG = {

  version: "1.0.0",

  dataSource: "local",

  futureDataSource: "api",

  apiReady: true,

  databaseReady: true,

  databaseName: "cyrus-tourist-db",

  apiName: "cyrus-tourist-api"

};
