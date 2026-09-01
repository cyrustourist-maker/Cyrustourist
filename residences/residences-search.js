/*
 * Cyrus Tourist
 * Residences Search Engine
 *
 * مسئول:
 * - جستجوی نام اقامتگاه
 * - جستجوی استان
 * - جستجوی شهر
 * - جستجوی منطقه
 * - جستجوی آدرس
 * - فیلتر نوع اقامتگاه
 * - فیلتر دسته‌بندی
 * - ترکیب هم‌زمان چند فیلتر
 * - آماده برای تعداد زیاد اقامتگاه
 */

(function () {
  "use strict";

  /*
   * وضعیت فعلی جستجو
   */

  const ResidenceSearchState = {
    query: "",
    province: "",
    city: "",
    type: "",
    mode: "all",
    useLocation: false,
    userLatitude: null,
    userLongitude: null
  };


  /*
   * نرمال‌سازی متن
   *
   * برای جستجوی بهتر پارسی:
   * ی / ي
   * ک / ك
   * فاصله‌های اضافی
   * نیم‌فاصله
   */

  function normalizeText(value) {

    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .trim()
      .toLowerCase()
      .replace(/ي/g, "ی")
      .replace(/ى/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/ۀ/g, "ه")
      .replace(/ة/g, "ه")
      .replace(/‌/g, "")
      .replace(/\s+/g, " ");

  }


  /*
   * تبدیل اعداد پارسی و عربی به انگلیسی
   *
   * باعث می‌شود جستجوی شماره یا کد اقامتگاه
   * نیز راحت‌تر انجام شود.
   */

  function normalizeNumbers(value) {

    return String(value)
      .replace(/[۰-۹]/g, function (char) {
        return String(
          "۰۱۲۳۴۵۶۷۸۹".indexOf(char)
        );
      })
      .replace(/[٠-٩]/g, function (char) {
        return String(
          "٠١٢٣٤٥٦٧٨٩".indexOf(char)
        );
      });

  }


  /*
   * گرفتن متن چندزبانه
   */

  function getLocalizedValue(value) {

    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "object") {

      const language =
        typeof getResidenceLanguage === "function"
          ? getResidenceLanguage()
          : "fa";

      return (
        value[language] ||
        value.fa ||
        value.en ||
        value.ar ||
        ""
      );
    }

    return String(value);

  }


  /*
   * تمام متن‌هایی که باید در جستجو بررسی شوند.
   *
   * جستجو فقط به زبان فعلی محدود نیست.
   * نام پارسی، انگلیسی و عربی هم بررسی می‌شوند.
   */

  function getMultilingualValues(value) {

    if (!value) {
      return [];
    }

    if (typeof value === "string") {
      return [value];
    }

    if (typeof value === "object") {
      return Object.values(value);
    }

    return [String(value)];

  }


  /*
   * متن قابل جستجوی کامل برای هر اقامتگاه
   */

  function buildSearchText(residence) {

    const parts = [];

    const fields = [
      "id",
      "name",
      "province",
      "city",
      "region",
      "address",
      "description",
      "phone",
      "instagram",
      "website"
    ];

    fields.forEach(function (field) {

      if (!residence[field]) {
        return;
      }

      getMultilingualValues(
        residence[field]
      ).forEach(function (value) {

        parts.push(value);

      });

    });


    /*
     * نام دسته‌بندی نیز وارد جستجو می‌شود.
     */

    if (
      residence.type &&
      typeof RESIDENCE_TYPES !== "undefined"
    ) {

      const type =
        Object.values(RESIDENCE_TYPES)
          .find(function (item) {
            return item.id === residence.type;
          });

      if (type && type.name) {

        getMultilingualValues(
          type.name
        ).forEach(function (value) {
          parts.push(value);
        });

      }

    }


    return normalizeText(
      normalizeNumbers(
        parts.join(" ")
      )
    );

  }


  /*
   * بررسی تطابق متن جستجو
   */

  function matchesQuery(residence, query) {

    if (!query) {
      return true;
    }

    const normalizedQuery =
      normalizeText(
        normalizeNumbers(query)
      );

    if (!normalizedQuery) {
      return true;
    }

    const searchText =
      buildSearchText(residence);

    /*
     * جستجوی چند کلمه‌ای
     *
     * مثال:
     * "مشهد بوم گردی"
     *
     * باید هر دو کلمه پیدا شوند.
     */

    const words =
      normalizedQuery
        .split(" ")
        .filter(Boolean);

    return words.every(function (word) {
      return searchText.includes(word);
    });

  }


  /*
   * بررسی استان
   */

  function matchesProvince(
    residence,
    province
  ) {

    if (!province) {
      return true;
    }

    const residenceProvince =
      getLocalizedValue(
        residence.province
      );

    return (
      normalizeText(residenceProvince) ===
      normalizeText(province)
    );

  }


  /*
   * بررسی شهر
   */

  function matchesCity(
    residence,
    city
  ) {

    if (!city) {
      return true;
    }

    const residenceCity =
      getLocalizedValue(
        residence.city
      );

    return (
      normalizeText(residenceCity) ===
      normalizeText(city)
    );

  }


  /*
   * بررسی نوع اقامتگاه
   */

  function matchesType(
    residence,
    type
  ) {

    if (!type) {
      return true;
    }

    /*
     * اگر نوع انتخابی «همه» باشد.
     */

    if (
      type === "all" ||
      type === ""
    ) {
      return true;
    }

    return residence.type === type;

  }


  /*
   * فیلتر اصلی
   */

  function filterResidences(
    residences,
    options
  ) {

    if (!Array.isArray(residences)) {
      return [];
    }

    options = options || {};

    const query =
      options.query ??
      ResidenceSearchState.query;

    const province =
      options.province ??
      ResidenceSearchState.province;

    const city =
      options.city ??
      ResidenceSearchState.city;

    const type =
      options.type ??
      ResidenceSearchState.type;

    return residences.filter(
      function (residence) {

        /*
         * فقط اقامتگاه‌های قابل نمایش
         */

        if (
          residence.status &&
          residence.status !== "active"
        ) {
          return false;
        }


        if (
          !matchesQuery(
            residence,
            query
          )
        ) {
          return false;
        }


        if (
          !matchesProvince(
            residence,
            province
          )
        ) {
          return false;
        }


        if (
          !matchesCity(
            residence,
            city
          )
        ) {
          return false;
        }


        if (
          !matchesType(
            residence,
            type
          )
        ) {
          return false;
        }


        return true;

      }
    );

  }


  /*
   * حذف فیلترها
   */

  function clearResidenceSearch() {

    ResidenceSearchState.query = "";
    ResidenceSearchState.province = "";
    ResidenceSearchState.city = "";
    ResidenceSearchState.type = "";
    ResidenceSearchState.mode = "all";

  }


  /*
   * تنظیم متن جستجو
   */

  function setResidenceSearchQuery(
    query
  ) {

    ResidenceSearchState.query =
      query || "";

    ResidenceSearchState.mode =
      ResidenceSearchState.query
        ? "search"
        : "all";

  }


  /*
   * تنظیم استان
   */

  function setResidenceProvince(
    province
  ) {

    ResidenceSearchState.province =
      province || "";

    ResidenceSearchState.mode =
      "search";

  }


  /*
   * تنظیم شهر
   */

  function setResidenceCity(
    city
  ) {

    ResidenceSearchState.city =
      city || "";

    ResidenceSearchState.mode =
      "search";

  }


  /*
   * تنظیم نوع اقامتگاه
   */

  function setResidenceTypeFilter(
    type
  ) {

    ResidenceSearchState.type =
      type || "";

    ResidenceSearchState.mode =
      type ? "category" : "all";

  }


  /*
   * انتخاب همه
   */

  function selectAllResidences() {

    ResidenceSearchState.query = "";
    ResidenceSearchState.province = "";
    ResidenceSearchState.city = "";
    ResidenceSearchState.type = "";
    ResidenceSearchState.mode = "all";

  }


  /*
   * دریافت وضعیت فعلی جستجو
   */

  function getResidenceSearchState() {

    return {
      ...ResidenceSearchState
    };

  }


  /*
   * دریافت تعداد نتیجه
   */

  function getResidenceResultCount(
    residences,
    options
  ) {

    return filterResidences(
      residences,
      options
    ).length;

  }


  /*
   * استخراج استان‌ها
   *
   * این تابع از داده‌های واقعی استفاده می‌کند.
   */

  function buildProvinceList(
    residences,
    language = "fa"
  ) {

    if (!Array.isArray(residences)) {
      return [];
    }

    const values = [];

    residences.forEach(
      function (residence) {

        const value =
          residence.province?.[language] ||
          residence.province?.fa ||
          residence.province?.en ||
          residence.province?.ar ||
          "";

        if (value) {
          values.push(value);
        }

      }
    );

    return [
      ...new Set(values)
    ].sort(
      function (a, b) {
        return a.localeCompare(
          b,
          language
        );
      }
    );

  }


  /*
   * استخراج شهرهای یک استان
   */

  function buildCityList(
    residences,
    province = "",
    language = "fa"
  ) {

    if (!Array.isArray(residences)) {
      return [];
    }

    const values = [];

    residences.forEach(
      function (residence) {

        if (
          province &&
          !matchesProvince(
            residence,
            province
          )
        ) {
          return;
        }

        const value =
          residence.city?.[language] ||
          residence.city?.fa ||
          residence.city?.en ||
          residence.city?.ar ||
          "";

        if (value) {
          values.push(value);
        }

      }
    );

    return [
      ...new Set(values)
    ].sort(
      function (a, b) {
        return a.localeCompare(
          b,
          language
        );
      }
    );

  }


  /*
   * گرفتن دسته‌بندی‌هایی که واقعاً
   * در داده‌های اقامتگاه‌ها استفاده شده‌اند.
   */

  function getUsedResidenceTypes(
    residences
  ) {

    if (!Array.isArray(residences)) {
      return [];
    }

    const used =
      new Set(
        residences
          .map(
            function (residence) {
              return residence.type;
            }
          )
          .filter(Boolean)
      );

    if (
      typeof RESIDENCE_TYPES === "undefined"
    ) {
      return [];
    }

    return Object.values(
      RESIDENCE_TYPES
    )
      .filter(
        function (type) {
          return used.has(type.id);
        }
      )
      .sort(
        function (a, b) {
          return a.order - b.order;
        }
      );

  }


  /*
   * جستجوی سریع بر اساس شناسه
   */

  function findResidenceById(
    residences,
    id
  ) {

    if (!Array.isArray(residences)) {
      return null;
    }

    return (
      residences.find(
        function (residence) {
          return residence.id === id;
        }
      ) || null
    );

  }


  /*
   * جستجوی نام
   */

  function findResidencesByName(
    residences,
    name
  ) {

    if (!Array.isArray(residences)) {
      return [];
    }

    return residences.filter(
      function (residence) {

        return matchesQuery(
          residence,
          name
        );

      }
    );

  }


  /*
   * انتشار API عمومی
   *
   * فایل residences.js در مرحله بعد
   * از این توابع استفاده خواهد کرد.
   */

  window.ResidenceSearch = {

    state: ResidenceSearchState,

    normalizeText,
    normalizeNumbers,

    getLocalizedValue,
    getMultilingualValues,
    buildSearchText,

    matchesQuery,
    matchesProvince,
    matchesCity,
    matchesType,

    filterResidences,

    clearResidenceSearch,

    setQuery: setResidenceSearchQuery,
    setProvince: setResidenceProvince,
    setCity: setResidenceCity,
    setType: setResidenceTypeFilter,

    selectAll: selectAllResidences,

    getState: getResidenceSearchState,
    getResultCount: getResidenceResultCount,

    buildProvinceList,
    buildCityList,
    getUsedResidenceTypes,

    findById: findResidenceById,
    findByName: findResidencesByName

  };

})();
