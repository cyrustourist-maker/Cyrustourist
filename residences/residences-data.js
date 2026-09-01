/* =========================================================
   Cyrus Tourist — Residence Data
   اقامتگاه‌های سایروس توریست
   Version: 1.1.0
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     TYPES
     ========================================================= */

  const RESIDENCE_TYPES = [
    {
      id: "hotel-apartment",
      icon: "🏨",
      order: 1,
      featured: true,
      name: {
        fa: "هتل / آپارتمان",
        en: "Hotel / Apartment",
        ar: "فندق / شقة"
      }
    },

    {
      id: "ecotourism",
      icon: "🌿",
      order: 2,
      featured: true,
      name: {
        fa: "بوم‌گردی",
        en: "Eco Tourism",
        ar: "السياحة البيئية"
      }
    },

    {
      id: "forest-cabin",
      icon: "🛖",
      order: 3,
      featured: true,
      name: {
        fa: "کلبه جنگلی",
        en: "Forest Cabin",
        ar: "كوخ غابي"
      }
    },

    {
      id: "camping",
      icon: "🏕️",
      order: 4,
      featured: true,
      name: {
        fa: "کمپ و طبیعت‌گردی",
        en: "Camping & Nature",
        ar: "التخييم والطبيعة"
      }
    },

    {
      id: "villa-local-house",
      icon: "🏡",
      order: 5,
      featured: true,
      name: {
        fa: "ویلا / خانه محلی",
        en: "Villa / Local House",
        ar: "فيلا / منزل محلي"
      }
    },

    {
      id: "beach",
      icon: "🌊",
      order: 6,
      featured: false,
      name: {
        fa: "اقامتگاه ساحلی",
        en: "Beach Residence",
        ar: "إقامة ساحلية"
      }
    },

    {
      id: "mountain",
      icon: "⛰️",
      order: 7,
      featured: false,
      name: {
        fa: "اقامتگاه کوهستانی",
        en: "Mountain Residence",
        ar: "إقامة جبلية"
      }
    },

    {
      id: "guesthouse",
      icon: "🏠",
      order: 8,
      featured: false,
      name: {
        fa: "مهمان‌پذیر",
        en: "Guesthouse",
        ar: "بيت ضيافة"
      }
    },

    {
      id: "suite",
      icon: "🏘️",
      order: 9,
      featured: false,
      name: {
        fa: "سوئیت",
        en: "Suite",
        ar: "جناح"
      }
    },

    {
      id: "forest",
      icon: "🌳",
      order: 10,
      featured: false,
      name: {
        fa: "اقامتگاه جنگلی",
        en: "Forest Residence",
        ar: "إقامة غابية"
      }
    },

    {
      id: "desert",
      icon: "🏜️",
      order: 11,
      featured: false,
      name: {
        fa: "اقامتگاه کویری",
        en: "Desert Residence",
        ar: "إقامة صحراوية"
      }
    },

    {
      id: "other",
      icon: "➕",
      order: 99,
      featured: false,
      name: {
        fa: "سایر",
        en: "Other",
        ar: "أخرى"
      }
    }
  ];


  /* =========================================================
     STATUS
     ========================================================= */

  const RESIDENCE_STATUS = {
    active: {
      fa: "🟢 فعال",
      en: "🟢 Active",
      ar: "🟢 نشط"
    },

    pending: {
      fa: "🟡 در انتظار بررسی",
      en: "🟡 Pending Review",
      ar: "🟡 قيد المراجعة"
    },

    inactive: {
      fa: "🔵 غیرفعال موقت",
      en: "🔵 Temporarily Inactive",
      ar: "🔵 غير نشط مؤقتاً"
    },

    expired: {
      fa: "🔴 اعتبار پایان یافته",
      en: "🔴 Membership Expired",
      ar: "🔴 انتهت الصلاحية"
    },

    suspended: {
      fa: "⚫ تعلیق مدیریتی",
      en: "⚫ Administratively Suspended",
      ar: "⚫ موقوف إدارياً"
    },

    archived: {
      fa: "🗃️ آرشیو",
      en: "🗃️ Archived",
      ar: "🗃️ مؤرشف"
    }
  };


  /* =========================================================
     VIDEO SOURCES
     ========================================================= */

  const RESIDENCE_VIDEO_SOURCES = {
    aparat: {
      id: "aparat",
      name: "Aparat"
    },

    youtube: {
      id: "youtube",
      name: "YouTube"
    },

    vimeo: {
      id: "vimeo",
      name: "Vimeo"
    },

    instagram: {
      id: "instagram",
      name: "Instagram"
    },

    tiktok: {
      id: "tiktok",
      name: "TikTok"
    },

    other: {
      id: "other",
      name: "Other"
    }
  };


  /* =========================================================
     SAMPLE RESIDENCE
     =========================================================
     این رکورد فقط برای تست سیستم است.
     اطلاعات واقعی اقامتگاه‌ها بعداً جایگزین می‌شوند.
     ========================================================= */

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


      /* =====================================================
         CONTACT NUMBERS
         ===================================================== */

      phoneMobile: "09150000000",

      phoneLandline: "",

      phoneSupport: "",


      /* =====================================================
         SOCIAL / WEBSITE
         ===================================================== */

      instagram: "",

      website: "",


      /* =====================================================
         LOCATION
         ===================================================== */

      latitude: 36.2972,

      longitude: 59.6067,


      /* =====================================================
         DESCRIPTION
         ===================================================== */

      description: {
        fa: "این رکورد نمونه برای آزمایش سیستم اقامتگاه سایروس توریست ایجاد شده است.",
        en: "This sample record is used to test the Cyrus Tourist accommodation system.",
        ar: "تم إنشاء هذا السجل التجريبي لاختبار نظام أماكن الإقامة في سايروس توريست."
      },


      /* =====================================================
         MEDIA
         ===================================================== */

      imageUrl: "",

      videoUrl: "",

      videoSource: "",


      /* =====================================================
         RATING
         ===================================================== */

      rating: 4.8,

      ratingCount: 0,


      /* =====================================================
         STATUS
         ===================================================== */

      status: "active",


      /* =====================================================
         MEMBERSHIP
         ===================================================== */

      membership: {
        type: "annual",
        startDate: "",
        endDate: ""
      },


      /* =====================================================
         DISPLAY OPTIONS
         ===================================================== */

      display: {

        featured: true,

        showVideo: true,

        showPhoneMobile: true,

        showPhoneLandline: true,

        showPhoneSupport: true,

        showInstagram: true,

        showWebsite: true,

        showRating: true,

        showRoute: true
      },


      /* =====================================================
         SYSTEM DATES
         ===================================================== */

      createdAt: "",

      updatedAt: ""
    }

  ];


  /* =========================================================
     SEARCH FIELDS
     ========================================================= */

  const RESIDENCE_SEARCH_FIELDS = [
    "name",
    "province",
    "city",
    "region",
    "address",
    "type"
  ];


  /* =========================================================
     HELPERS
     ========================================================= */

  function getResidenceType(typeId) {

    return (
      RESIDENCE_TYPES.find(
        function (item) {
          return item.id === typeId;
        }
      ) || null
    );

  }


  function getResidenceStatus(statusId) {

    return (
      RESIDENCE_STATUS[statusId] || null
    );

  }


  function getActiveResidences() {

    return RESIDENCES_DATA.filter(
      function (residence) {
        return residence.status === "active";
      }
    );

  }


  function getResidenceTypes() {

    return RESIDENCE_TYPES.slice()
      .sort(function (a, b) {
        return a.order - b.order;
      });

  }


  function getFeaturedResidenceTypes() {

    return getResidenceTypes().filter(
      function (item) {
        return item.featured;
      }
    );

  }


  function getResidenceProvinces() {

    const values = {};

    RESIDENCES_DATA.forEach(
      function (residence) {

        const key =
          residence.province &&
          residence.province.fa
            ? residence.province.fa
            : "";

        if (key) {
          values[key] = residence.province;
        }

      }
    );

    return Object.values(values);

  }


  function getResidenceCities(provinceFa) {

    const values = {};

    RESIDENCES_DATA.forEach(
      function (residence) {

        const province =
          residence.province &&
          residence.province.fa
            ? residence.province.fa
            : "";

        if (
          !provinceFa ||
          province === provinceFa
        ) {

          const city =
            residence.city &&
            residence.city.fa
              ? residence.city.fa
              : "";

          if (city) {
            values[city] = residence.city;
          }

        }

      }
    );

    return Object.values(values);

  }


  function getResidenceRegions() {

    const values = {};

    RESIDENCES_DATA.forEach(
      function (residence) {

        const region =
          residence.region &&
          residence.region.fa
            ? residence.region.fa
            : "";

        if (region) {
          values[region] = residence.region;
        }

      }
    );

    return Object.values(values);

  }


  /* =========================================================
     ID GENERATOR
     ========================================================= */

  function createResidenceId() {

    const numbers =
      RESIDENCES_DATA
        .map(function (item) {

          const match =
            String(item.id || "")
              .match(/^RES-(\d+)$/);

          return match
            ? Number(match[1])
            : 0;

        });

    const max =
      numbers.length
        ? Math.max.apply(null, numbers)
        : 0;

    return (
      "RES-" +
      String(max + 1).padStart(4, "0")
    );

  }


  /* =========================================================
     VALIDATION
     ========================================================= */

  function validateResidence(residence) {

    const errors = [];

    if (!residence) {
      errors.push("Residence object is required.");
      return {
        valid: false,
        errors: errors
      };
    }

    if (!residence.id) {
      errors.push("Missing residence id.");
    }

    if (!residence.name) {
      errors.push("Missing residence name.");
    }

    if (!residence.type) {
      errors.push("Missing residence type.");
    }

    if (!RESIDENCE_TYPES.some(
      function (type) {
        return type.id === residence.type;
      }
    )) {
      errors.push("Invalid residence type.");
    }

    if (
      residence.status &&
      !RESIDENCE_STATUS[residence.status]
    ) {
      errors.push("Invalid residence status.");
    }


    /* شماره‌ها اختیاری هستند،
       اما اگر وجود داشته باشند باید رشته باشند. */

    const phoneFields = [
      "phoneMobile",
      "phoneLandline",
      "phoneSupport"
    ];

    phoneFields.forEach(
      function (field) {

        if (
          residence[field] !== undefined &&
          residence[field] !== null &&
          typeof residence[field] !== "string"
        ) {
          errors.push(
            field + " must be a string."
          );
        }

      }
    );


    return {
      valid: errors.length === 0,
      errors: errors
    };

  }


  function validateAllResidences() {

    return RESIDENCES_DATA.map(
      function (residence) {

        return {
          id: residence.id,
          result: validateResidence(residence)
        };

      }
    );

  }


  /* =========================================================
     STATISTICS
     ========================================================= */

  function getResidenceStatistics() {

    const active =
      RESIDENCES_DATA.filter(
        function (item) {
          return item.status === "active";
        }
      ).length;

    const pending =
      RESIDENCES_DATA.filter(
        function (item) {
          return item.status === "pending";
        }
      ).length;

    const expired =
      RESIDENCES_DATA.filter(
        function (item) {
          return item.status === "expired";
        }
      ).length;

    return {

      total: RESIDENCES_DATA.length,

      active: active,

      pending: pending,

      expired: expired,

      other:
        RESIDENCES_DATA.length -
        active -
        pending -
        expired

    };

  }


  /* =========================================================
     CONTACT HELPERS
     ========================================================= */

  function getResidencePhoneFields(residence) {

    if (!residence) {
      return [];
    }

    const result = [];


    if (
      residence.phoneMobile &&
      residence.display &&
      residence.display.showPhoneMobile !== false
    ) {

      result.push({
        type: "mobile",
        label: {
          fa: "📱 تماس همراه",
          en: "📱 Mobile",
          ar: "📱 هاتف محمول"
        },
        value: residence.phoneMobile
      });

    }


    if (
      residence.phoneLandline &&
      residence.display &&
      residence.display.showPhoneLandline !== false
    ) {

      result.push({
        type: "landline",
        label: {
          fa: "☎️ تماس ثابت",
          en: "☎️ Landline",
          ar: "☎️ هاتف ثابت"
        },
        value: residence.phoneLandline
      });

    }


    if (
      residence.phoneSupport &&
      residence.display &&
      residence.display.showPhoneSupport !== false
    ) {

      result.push({
        type: "support",
        label: {
          fa: "📞 تماس پشتیبان",
          en: "📞 Support",
          ar: "📞 هاتف الدعم"
        },
        value: residence.phoneSupport
      });

    }


    return result;

  }


  /* =========================================================
     PUBLIC CONFIG
     ========================================================= */

  const RESIDENCE_DATA_CONFIG = {

    version: "1.1.0",

    dataSource: "local",

    futureDataSource: "api",

    apiReady: true,

    databaseReady: true,

    databaseName: "cyrus-tourist-db",

    apiName: "cyrus-tourist-api",

    dynamicRecords: true,

    unlimitedRecords: true,

    supportedLanguages: [
      "fa",
      "en",
      "ar"
    ],

    contactFields: [
      "phoneMobile",
      "phoneLandline",
      "phoneSupport",
      "instagram",
      "website"
    ]

  };


  /* =========================================================
     GLOBAL EXPORT
     ========================================================= */

  window.RESIDENCE_TYPES =
    RESIDENCE_TYPES;

  window.RESIDENCE_STATUS =
    RESIDENCE_STATUS;

  window.RESIDENCE_VIDEO_SOURCES =
    RESIDENCE_VIDEO_SOURCES;

  window.RESIDENCES_DATA =
    RESIDENCES_DATA;

  window.RESIDENCE_SEARCH_FIELDS =
    RESIDENCE_SEARCH_FIELDS;

  window.RESIDENCE_DATA_CONFIG =
    RESIDENCE_DATA_CONFIG;


  window.getResidenceType =
    getResidenceType;

  window.getResidenceStatus =
    getResidenceStatus;

  window.getActiveResidences =
    getActiveResidences;

  window.getResidenceTypes =
    getResidenceTypes;

  window.getFeaturedResidenceTypes =
    getFeaturedResidenceTypes;

  window.getResidenceProvinces =
    getResidenceProvinces;

  window.getResidenceCities =
    getResidenceCities;

  window.getResidenceRegions =
    getResidenceRegions;

  window.createResidenceId =
    createResidenceId;

  window.validateResidence =
    validateResidence;

  window.validateAllResidences =
    validateAllResidences;

  window.getResidenceStatistics =
    getResidenceStatistics;

  window.getResidencePhoneFields =
    getResidencePhoneFields;


  /* =========================================================
     DEBUG
     ========================================================= */

  window.CyrusResidenceData = {

    config: RESIDENCE_DATA_CONFIG,

    types: RESIDENCE_TYPES,

    status: RESIDENCE_STATUS,

    videoSources: RESIDENCE_VIDEO_SOURCES,

    residences: RESIDENCES_DATA,

    getPhoneFields:
      getResidencePhoneFields,

    statistics:
      getResidenceStatistics,

    validate:
      validateResidence,

    validateAll:
      validateAllResidences

  };


})();
