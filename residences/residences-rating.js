/*
 * Cyrus Tourist
 * Residences Rating Engine
 *
 * سیستم امتیازدهی اقامتگاه‌ها
 *
 * نسخه فعلی:
 * - امتیاز 1 تا 5 ستاره
 * - سه عبارت آماده برای هر امتیاز
 * - محاسبه میانگین
 * - شمارش تعداد رأی‌ها
 * - اعتبارسنجی امتیاز
 * - آماده برای اتصال آینده به API / Database
 *
 * توجه:
 * در این مرحله اطلاعات امتیازدهی روی سرور ذخیره نمی‌شود.
 * این فایل فقط موتور و ساختار امتیازدهی را آماده می‌کند.
 */

(function () {
  "use strict";


  /*
   * حداقل و حداکثر امتیاز
   */

  const MIN_RATING = 1;
  const MAX_RATING = 5;


  /*
   * عبارات آماده امتیازدهی
   *
   * برای هر ستاره سه عبارت داریم.
   */

  const RESIDENCE_RATING_PHRASES = {

    1: {
      fa: [
        "اصلاً راضی نبودم",
        "نیاز به بهبود جدی دارد",
        "تجربه خوبی نداشتم"
      ],
      en: [
        "Not satisfied at all",
        "Needs major improvement",
        "I did not have a good experience"
      ],
      ar: [
        "لم أكن راضياً إطلاقاً",
        "يحتاج إلى تحسين كبير",
        "لم تكن تجربتي جيدة"
      ]
    },


    2: {
      fa: [
        "رضایت کمی داشتم",
        "نیاز به بهبود دارد",
        "تجربه ضعیفی بود"
      ],
      en: [
        "Slightly satisfied",
        "Needs improvement",
        "It was a weak experience"
      ],
      ar: [
        "كنت راضياً بدرجة قليلة",
        "يحتاج إلى تحسين",
        "كانت تجربة ضعيفة"
      ]
    },


    3: {
      fa: [
        "تجربه متوسطی بود",
        "قابل قبول بود",
        "نسبتاً راضی بودم"
      ],
      en: [
        "It was an average experience",
        "It was acceptable",
        "I was fairly satisfied"
      ],
      ar: [
        "كانت تجربة متوسطة",
        "كانت مقبولة",
        "كنت راضياً إلى حد ما"
      ]
    },


    4: {
      fa: [
        "تجربه خوبی بود",
        "راضی بودم",
        "پیشنهاد می‌کنم"
      ],
      en: [
        "It was a good experience",
        "I was satisfied",
        "I recommend it"
      ],
      ar: [
        "كانت تجربة جيدة",
        "كنت راضياً",
        "أنصح به"
      ]
    },


    5: {
      fa: [
        "عالی بود",
        "کاملاً راضی بودم",
        "حتماً پیشنهاد می‌کنم"
      ],
      en: [
        "Excellent",
        "Completely satisfied",
        "I highly recommend it"
      ],
      ar: [
        "كانت التجربة ممتازة",
        "كنت راضياً تماماً",
        "أنصح به بشدة"
      ]
    }

  };


  /*
   * بررسی معتبر بودن امتیاز
   */

  function isValidRating(
    rating
  ) {

    const value =
      Number(rating);


    return (
      Number.isFinite(value) &&
      value >= MIN_RATING &&
      value <= MAX_RATING
    );

  }


  /*
   * تبدیل امتیاز به عدد استاندارد
   *
   * امتیازها می‌توانند اعشاری باشند
   * برای میانگین، اما رأی کاربر باید
   * در محدوده 1 تا 5 باشد.
   */

  function normalizeRating(
    rating
  ) {

    const value =
      Number(rating);


    if (
      !Number.isFinite(value)
    ) {
      return 0;
    }


    return Math.min(
      MAX_RATING,
      Math.max(
        MIN_RATING,
        value
      )
    );

  }


  /*
   * گرد کردن امتیاز برای نمایش
   */

  function roundRating(
    rating,
    decimals
  ) {

    if (
      !Number.isFinite(
        Number(rating)
      )
    ) {
      return 0;
    }


    const digits =
      Number.isInteger(
        decimals
      )
        ? decimals
        : 1;


    const multiplier =
      Math.pow(
        10,
        digits
      );


    return (
      Math.round(
        Number(rating) *
        multiplier
      ) /
      multiplier
    );

  }


  /*
   * دریافت عبارات یک امتیاز
   */

  function getRatingPhrases(
    rating,
    language
  ) {

    const normalized =
      Math.round(
        normalizeRating(
          rating
        )
      );


    const item =
      RESIDENCE_RATING_PHRASES[
        normalized
      ];


    if (!item) {
      return [];
    }


    const lang =
      language ||
      (
        typeof getResidenceLanguage ===
        "function"
          ? getResidenceLanguage()
          : "fa"
      );


    return (
      item[lang] ||
      item.fa ||
      item.en ||
      item.ar ||
      []
    ).slice();

  }


  /*
   * دریافت همه عبارات
   */

  function getAllRatingPhrases(
    language
  ) {

    const result = {};


    Object.keys(
      RESIDENCE_RATING_PHRASES
    ).forEach(
      function (rating) {

        result[rating] =
          getRatingPhrases(
            Number(rating),
            language
          );

      }
    );


    return result;

  }


  /*
   * تبدیل امتیاز به ستاره
   *
   * مثال:
   * 5     → ★★★★★
   * 4     → ★★★★☆
   * 3.5   → ★★★½☆
   */

  function ratingToStars(
    rating
  ) {

    if (
      !Number.isFinite(
        Number(rating)
      )
    ) {
      return "☆☆☆☆☆";
    }


    const value =
      Math.max(
        0,
        Math.min(
          MAX_RATING,
          Number(rating)
        )
      );


    const fullStars =
      Math.floor(value);


    const decimal =
      value - fullStars;


    let stars = "";


    for (
      let i = 0;
      i < MAX_RATING;
      i++
    ) {

      if (
        i < fullStars
      ) {

        stars += "★";

      } else if (
        i === fullStars &&
        decimal >= 0.5
      ) {

        stars += "½";

      } else {

        stars += "☆";

      }

    }


    return stars;

  }


  /*
   * ساخت شیء امتیاز جدید
   */

  function createRating(
    rating,
    phraseIndex,
    language
  ) {

    if (
      !isValidRating(
        rating
      )
    ) {
      return null;
    }


    const normalized =
      Math.round(
        normalizeRating(
          rating
        )
      );


    const phrases =
      getRatingPhrases(
        normalized,
        language
      );


    let selectedPhrase = "";


    if (
      Number.isInteger(
        phraseIndex
      ) &&
      phrases[
        phraseIndex
      ]
    ) {

      selectedPhrase =
        phrases[
          phraseIndex
        ];

    }


    return {

      rating:
        normalized,

      stars:
        ratingToStars(
          normalized
        ),

      phrase:
        selectedPhrase,

      phraseIndex:
        Number.isInteger(
          phraseIndex
        )
          ? phraseIndex
          : null,

      language:
        language ||
        (
          typeof getResidenceLanguage ===
          "function"
            ? getResidenceLanguage()
            : "fa"
        ),

      createdAt:
        new Date().toISOString()

    };

  }


  /*
   * محاسبه میانگین از آرایه امتیازها
   */

  function calculateAverageRating(
    ratings
  ) {

    if (
      !Array.isArray(ratings) ||
      ratings.length === 0
    ) {
      return 0;
    }


    const validRatings =
      ratings
        .map(
          function (item) {

            if (
              typeof item ===
              "object" &&
              item !== null
            ) {

              return Number(
                item.rating
              );

            }

            return Number(item);

          }
        )
        .filter(
          function (value) {

            return isValidRating(
              value
            );

          }
        );


    if (
      validRatings.length === 0
    ) {
      return 0;
    }


    const total =
      validRatings.reduce(
        function (
          sum,
          value
        ) {

          return sum + value;

        },
        0
      );


    return roundRating(
      total /
      validRatings.length,
      1
    );

  }


  /*
   * محاسبه آمار کامل امتیازها
   */

  function calculateRatingStatistics(
    ratings
  ) {

    const statistics = {

      average: 0,

      count: 0,

      distribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }

    };


    if (
      !Array.isArray(ratings)
    ) {
      return statistics;
    }


    ratings.forEach(
      function (item) {

        const value =
          typeof item ===
          "object" &&
          item !== null
            ? Number(item.rating)
            : Number(item);


        if (
          !isValidRating(
            value
          )
        ) {
          return;
        }


        const rounded =
          Math.round(
            value
          );


        statistics
          .distribution[
            rounded
          ]++;


        statistics.count++;

      }
    );


    if (
      statistics.count > 0
    ) {

      let total = 0;


      Object.keys(
        statistics.distribution
      ).forEach(
        function (rating) {

          total +=
            Number(rating) *
            statistics
              .distribution[
                rating
              ];

        }
      );


      statistics.average =
        roundRating(
          total /
          statistics.count,
          1
        );

    }


    return statistics;

  }


  /*
   * دریافت امتیاز ذخیره‌شده یک اقامتگاه
   */

  function getResidenceRating(
    residence
  ) {

    if (!residence) {

      return {

        average: 0,
        count: 0,
        stars: "☆☆☆☆☆"

      };

    }


    const rating =
      Number(
        residence.rating
      );


    const count =
      Number(
        residence.ratingCount
      );


    if (
      !isValidRating(
        rating
      ) ||
      !Number.isFinite(count) ||
      count < 0
    ) {

      return {

        average: 0,
        count: 0,
        stars: "☆☆☆☆☆"

      };

    }


    return {

      average:
        roundRating(
          rating,
          1
        ),

      count:
        Math.floor(
          count
        ),

      stars:
        ratingToStars(
          rating
        )

    };

  }


  /*
   * متن آماده برای نمایش امتیاز
   */

  function formatRating(
    rating,
    ratingCount,
    language
  ) {

    const value =
      roundRating(
        rating,
        1
      );


    const count =
      Math.max(
        0,
        Number(
          ratingCount || 0
        )
      );


    const lang =
      language ||
      (
        typeof getResidenceLanguage ===
        "function"
          ? getResidenceLanguage()
          : "fa"
      );


    let countText;


    if (lang === "en") {

      countText =
        count === 1
          ? "1 rating"
          : count + " ratings";

    } else if (
      lang === "ar"
    ) {

      countText =
        count +
        " تقييم";

    } else {

      countText =
        count +
        " امتیاز";

    }


    return {

      value,

      stars:
        ratingToStars(
          value
        ),

      count,

      countText,

      text:
        value > 0
          ? value +
            " " +
            ratingToStars(
              value
            ) +
            " (" +
            countText +
            ")"
          : (
              lang === "en"
                ? "No ratings yet"
                : lang === "ar"
                  ? "لا توجد تقييمات بعد"
                  : "هنوز امتیازی ثبت نشده است"
            )

    };

  }


  /*
   * بررسی اینکه اقامتگاه
   * قابلیت نمایش امتیاز دارد یا خیر
   */

  function canShowResidenceRating(
    residence
  ) {

    if (!residence) {
      return false;
    }


    if (
      residence.display &&
      residence.display.showRating ===
      false
    ) {
      return false;
    }


    return true;

  }


  /*
   * ایجاد یک امتیاز تصادفی برای تست
   *
   * فقط برای توسعه و آزمایش UI.
   * در نسخه واقعی استفاده نمی‌شود.
   */

  function createTestRatings(
    count
  ) {

    const total =
      Math.max(
        0,
        Math.floor(
          Number(count) || 0
        )
      );


    const result = [];


    for (
      let i = 0;
      i < total;
      i++
    ) {

      const rating =
        Math.floor(
          Math.random() * 5
        ) + 1;


      result.push({

        rating,

        phraseIndex:
          Math.floor(
            Math.random() * 3
          ),

        createdAt:
          new Date().toISOString()

      });

    }


    return result;

  }


  /*
   * ساخت مدل آماده برای ذخیره در API
   *
   * در آینده API می‌تواند همین ساختار
   * را دریافت کند.
   */

  function buildRatingPayload(
    residenceId,
    rating,
    phraseIndex,
    language
  ) {

    if (!residenceId) {
      return null;
    }


    const ratingObject =
      createRating(
        rating,
        phraseIndex,
        language
      );


    if (!ratingObject) {
      return null;
    }


    return {

      residenceId:
        String(
          residenceId
        ),

      rating:
        ratingObject.rating,

      phrase:
        ratingObject.phrase,

      phraseIndex:
        ratingObject.phraseIndex,

      language:
        ratingObject.language,

      createdAt:
        ratingObject.createdAt

    };

  }


  /*
   * انتشار API عمومی
   */

  window.ResidenceRating = {

    MIN_RATING,

    MAX_RATING,

    PHRASES:
      RESIDENCE_RATING_PHRASES,

    isValid:
      isValidRating,

    normalize:
      normalizeRating,

    round:
      roundRating,

    getPhrases:
      getRatingPhrases,

    getAllPhrases:
      getAllRatingPhrases,

    toStars:
      ratingToStars,

    create:
      createRating,

    calculateAverage:
      calculateAverageRating,

    calculateStatistics:
      calculateRatingStatistics,

    getResidenceRating,

    format:
      formatRating,

    canShow:
      canShowResidenceRating,

    createTestRatings,

    buildPayload:
      buildRatingPayload

  };


})();
