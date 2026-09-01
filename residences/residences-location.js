/*
 * Cyrus Tourist
 * Residences Location Engine
 *
 * مسئول:
 * - دریافت موقعیت تقریبی کاربر
 * - مدیریت اجازه دسترسی به مکان
 * - محاسبه فاصله کاربر تا اقامتگاه
 * - مرتب‌سازی اقامتگاه‌ها بر اساس فاصله
 * - نمایش فاصله به کیلومتر
 * - آماده‌سازی برای استفاده در نقشه و مسیریابی
 */

(function () {
  "use strict";

  /*
   * وضعیت مکان کاربر
   */

  const ResidenceLocationState = {
    latitude: null,
    longitude: null,
    accuracy: null,

    available: false,
    loading: false,
    permission: "unknown",

    error: null,

    lastUpdated: null
  };


  /*
   * شعاع زمین بر حسب کیلومتر
   */

  const EARTH_RADIUS_KM = 6371;


  /*
   * تبدیل درجه به رادیان
   */

  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }


  /*
   * بررسی معتبر بودن مختصات
   */

  function isValidCoordinate(
    latitude,
    longitude
  ) {

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat)) {
      return false;
    }

    if (!Number.isFinite(lng)) {
      return false;
    }

    if (lat < -90 || lat > 90) {
      return false;
    }

    if (lng < -180 || lng > 180) {
      return false;
    }

    return true;
  }


  /*
   * محاسبه فاصله دو نقطه با فرمول Haversine
   */

  function calculateDistanceKm(
    latitude1,
    longitude1,
    latitude2,
    longitude2
  ) {

    if (
      !isValidCoordinate(
        latitude1,
        longitude1
      )
    ) {
      return null;
    }

    if (
      !isValidCoordinate(
        latitude2,
        longitude2
      )
    ) {
      return null;
    }

    const lat1 = toRadians(
      Number(latitude1)
    );

    const lat2 = toRadians(
      Number(latitude2)
    );

    const deltaLat = toRadians(
      Number(latitude2) -
      Number(latitude1)
    );

    const deltaLng = toRadians(
      Number(longitude2) -
      Number(longitude1)
    );


    const a =
      Math.sin(deltaLat / 2) *
      Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);


    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );


    return (
      EARTH_RADIUS_KM * c
    );

  }


  /*
   * قالب مناسب نمایش فاصله
   */

  function formatResidenceDistance(
    distanceKm
  ) {

    if (
      distanceKm === null ||
      distanceKm === undefined ||
      !Number.isFinite(
        Number(distanceKm)
      )
    ) {
      return "";
    }

    const distance =
      Number(distanceKm);


    if (distance < 1) {

      const meters =
        Math.round(
          distance * 1000
        );

      return (
        meters + " متر"
      );

    }


    if (distance < 10) {

      return (
        distance.toFixed(1) +
        " کیلومتر"
      );

    }


    return (
      Math.round(distance) +
      " کیلومتر"
    );

  }


  /*
   * گرفتن موقعیت فعلی کاربر
   */

  function getResidenceUserLocation(
    options
  ) {

    options = options || {};


    return new Promise(
      function (resolve, reject) {

        /*
         * بررسی پشتیبانی مرورگر
         */

        if (
          !navigator.geolocation
        ) {

          ResidenceLocationState.available =
            false;

          ResidenceLocationState.loading =
            false;

          ResidenceLocationState.permission =
            "unavailable";

          ResidenceLocationState.error =
            "geolocation-unavailable";

          reject(
            new Error(
              "مرورگر از موقعیت مکانی پشتیبانی نمی‌کند."
            )
          );

          return;
        }


        /*
         * شروع دریافت مکان
         */

        ResidenceLocationState.loading =
          true;

        ResidenceLocationState.error =
          null;


        const positionOptions = {

          enableHighAccuracy:
            options.enableHighAccuracy ??
            true,

          timeout:
            options.timeout ??
            15000,

          maximumAge:
            options.maximumAge ??
            300000

        };


        navigator.geolocation.getCurrentPosition(

          function (position) {

            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            const accuracy =
              position.coords.accuracy;


            if (
              !isValidCoordinate(
                latitude,
                longitude
              )
            ) {

              ResidenceLocationState.loading =
                false;

              ResidenceLocationState.available =
                false;

              ResidenceLocationState.error =
                "invalid-coordinate";

              reject(
                new Error(
                  "مختصات دریافت‌شده معتبر نیست."
                )
              );

              return;

            }


            ResidenceLocationState.latitude =
              latitude;

            ResidenceLocationState.longitude =
              longitude;

            ResidenceLocationState.accuracy =
              Number.isFinite(
                Number(accuracy)
              )
                ? accuracy
                : null;

            ResidenceLocationState.available =
              true;

            ResidenceLocationState.loading =
              false;

            ResidenceLocationState.permission =
              "granted";

            ResidenceLocationState.error =
              null;

            ResidenceLocationState.lastUpdated =
              new Date().toISOString();


            /*
             * ذخیره در state جستجو
             * برای استفاده توسط residences-search.js
             */

            if (
              typeof ResidenceSearch !==
              "undefined"
            ) {

              ResidenceSearch.state
                .userLatitude =
                latitude;

              ResidenceSearch.state
                .userLongitude =
                longitude;

              ResidenceSearch.state
                .useLocation =
                true;

              ResidenceSearch.state
                .mode =
                "nearby";

            }


            resolve({

              latitude,
              longitude,
              accuracy,

              timestamp:
                position.timestamp

            });

          },


          function (error) {

            ResidenceLocationState.loading =
              false;

            ResidenceLocationState.available =
              false;


            switch (
              error.code
            ) {

              case error.PERMISSION_DENIED:

                ResidenceLocationState.permission =
                  "denied";

                ResidenceLocationState.error =
                  "permission-denied";

                break;


              case error.POSITION_UNAVAILABLE:

                ResidenceLocationState.permission =
                  "unavailable";

                ResidenceLocationState.error =
                  "position-unavailable";

                break;


              case error.TIMEOUT:

                ResidenceLocationState.permission =
                  "timeout";

                ResidenceLocationState.error =
                  "timeout";

                break;


              default:

                ResidenceLocationState.permission =
                  "error";

                ResidenceLocationState.error =
                  "unknown";

            }


            reject(error);

          },

          positionOptions

        );

      }
    );

  }


  /*
   * اضافه کردن فاصله به اطلاعات اقامتگاه
   */

  function addDistanceToResidence(
    residence
  ) {

    if (!residence) {
      return null;
    }


    const result = {
      ...residence
    };


    if (
      !ResidenceLocationState.available
    ) {

      result.distanceKm =
        null;

      result.distanceText =
        "";

      return result;

    }


    const latitude =
      residence.latitude;

    const longitude =
      residence.longitude;


    const distance =
      calculateDistanceKm(

        ResidenceLocationState.latitude,
        ResidenceLocationState.longitude,

        latitude,
        longitude

      );


    result.distanceKm =
      distance;

    result.distanceText =
      formatResidenceDistance(
        distance
      );


    return result;

  }


  /*
   * اضافه کردن فاصله به تمام اقامتگاه‌ها
   */

  function addDistancesToResidences(
    residences
  ) {

    if (!Array.isArray(residences)) {
      return [];
    }

    return residences.map(
      function (residence) {

        return addDistanceToResidence(
          residence
        );

      }
    );

  }


  /*
   * مرتب‌سازی بر اساس نزدیک‌ترین فاصله
   */

  function sortResidencesByDistance(
    residences
  ) {

    if (!Array.isArray(residences)) {
      return [];
    }


    return residences
      .map(
        function (residence) {

          return addDistanceToResidence(
            residence
          );

        }
      )
      .sort(
        function (a, b) {

          /*
           * اقامتگاه بدون مختصات
           * در انتهای لیست قرار می‌گیرد.
           */

          if (
            a.distanceKm === null ||
            a.distanceKm === undefined
          ) {

            return 1;

          }


          if (
            b.distanceKm === null ||
            b.distanceKm === undefined
          ) {

            return -1;

          }


          return (
            a.distanceKm -
            b.distanceKm
          );

        }
      );

  }


  /*
   * دریافت نزدیک‌ترین اقامتگاه‌ها
   */

  function getNearestResidences(
    residences,
    limit
  ) {

    if (!Array.isArray(residences)) {
      return [];
    }


    const sorted =
      sortResidencesByDistance(
        residences
      );


    if (
      !Number.isFinite(
        Number(limit)
      )
    ) {

      return sorted;

    }


    const count =
      Math.max(
        1,
        Number(limit)
      );


    return sorted.slice(
      0,
      count
    );

  }


  /*
   * دریافت اقامتگاه‌های داخل شعاع مشخص
   *
   * radiusKm مثال:
   * 5
   * 10
   * 50
   */

  function getResidencesWithinRadius(
    residences,
    radiusKm
  ) {

    if (!Array.isArray(residences)) {
      return [];
    }


    const radius =
      Number(radiusKm);


    if (
      !Number.isFinite(radius) ||
      radius < 0
    ) {

      return [];

    }


    return sortResidencesByDistance(
      residences
    ).filter(
      function (residence) {

        return (
          residence.distanceKm !== null &&
          residence.distanceKm <= radius
        );

      }
    );

  }


  /*
   * محاسبه فاصله مستقیم بین کاربر
   * و یک اقامتگاه
   */

  function getDistanceFromUser(
    residence
  ) {

    if (
      !ResidenceLocationState.available
    ) {
      return null;
    }


    if (!residence) {
      return null;
    }


    return calculateDistanceKm(

      ResidenceLocationState.latitude,
      ResidenceLocationState.longitude,

      residence.latitude,
      residence.longitude

    );

  }


  /*
   * فعال کردن حالت «مکان من»
   */

  function enableNearbyMode() {

    if (
      typeof ResidenceSearch !==
      "undefined"
    ) {

      ResidenceSearch.state
        .useLocation =
        true;

      ResidenceSearch.state
        .mode =
        "nearby";

    }

  }


  /*
   * غیرفعال کردن حالت «مکان من»
   */

  function disableNearbyMode() {

    if (
      typeof ResidenceSearch !==
      "undefined"
    ) {

      ResidenceSearch.state
        .useLocation =
        false;

      ResidenceSearch.state
        .mode =
        "all";

    }

  }


  /*
   * دریافت وضعیت مکان
   */

  function getResidenceLocationState() {

    return {
      ...ResidenceLocationState
    };

  }


  /*
   * پاک کردن اطلاعات مکان
   */

  function clearResidenceLocation() {

    ResidenceLocationState.latitude =
      null;

    ResidenceLocationState.longitude =
      null;

    ResidenceLocationState.accuracy =
      null;

    ResidenceLocationState.available =
      false;

    ResidenceLocationState.loading =
      false;

    ResidenceLocationState.permission =
      "unknown";

    ResidenceLocationState.error =
      null;

    ResidenceLocationState.lastUpdated =
      null;


    if (
      typeof ResidenceSearch !==
      "undefined"
    ) {

      ResidenceSearch.state
        .userLatitude =
        null;

      ResidenceSearch.state
        .userLongitude =
        null;

      ResidenceSearch.state
        .useLocation =
        false;

    }

  }


  /*
   * بررسی HTTPS
   *
   * مرورگرها معمولاً برای geolocation
   * به HTTPS یا localhost نیاز دارند.
   */

  function isResidenceLocationSecureContext() {

    if (
      typeof window ===
      "undefined"
    ) {
      return false;
    }


    if (
      window.isSecureContext === true
    ) {
      return true;
    }


    /*
     * localhost نیز برای توسعه مجاز است.
     */

    const hostname =
      window.location.hostname;


    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1"
    );

  }


  /*
   * پیام مناسب برای خطای مکان
   */

  function getResidenceLocationErrorMessage(
    error
  ) {

    if (!error) {

      return (
        typeof residenceText ===
        "function"
          ? residenceText(
              "locationError"
            )
          : "دریافت موقعیت مکانی با خطا روبه‌رو شد."
      );

    }


    const code =
      error.code ||
      ResidenceLocationState.error;


    switch (code) {

      case 1:
      case "permission-denied":

        return (
          typeof residenceText ===
          "function"
            ? residenceText(
                "locationDenied"
              )
            : "دسترسی به مکان فعال نیست."
        );


      case 2:
      case "position-unavailable":

        return (
          typeof residenceText ===
          "function"
            ? residenceText(
                "locationUnavailable"
              )
            : "موقعیت مکانی در دسترس نیست."
        );


      case 3:
      case "timeout":

        return (
          typeof residenceText ===
          "function"
            ? residenceText(
                "locationError"
              )
            : "زمان دریافت موقعیت به پایان رسید."
        );


      case "geolocation-unavailable":

        return (
          "مرورگر از موقعیت مکانی پشتیبانی نمی‌کند."
        );


      case "invalid-coordinate":

        return (
          "مختصات دریافت‌شده معتبر نیست."
        );


      default:

        return (
          typeof residenceText ===
          "function"
            ? residenceText(
                "locationError"
              )
            : "دریافت موقعیت مکانی با خطا روبه‌رو شد."
        );

    }

  }


  /*
   * انتشار عمومی
   */

  window.ResidenceLocation = {

    state:
      ResidenceLocationState,

    EARTH_RADIUS_KM,

    isValidCoordinate,

    calculateDistanceKm,

    formatDistance:
      formatResidenceDistance,

    getUserLocation:
      getResidenceUserLocation,

    addDistance:
      addDistanceToResidence,

    addDistances:
      addDistancesToResidences,

    sortByDistance:
      sortResidencesByDistance,

    getNearest:
      getNearestResidences,

    getWithinRadius:
      getResidencesWithinRadius,

    getDistanceFromUser,

    enableNearby:
      enableNearbyMode,

    disableNearby:
      disableNearbyMode,

    getState:
      getResidenceLocationState,

    clear:
      clearResidenceLocation,

    isSecureContext:
      isResidenceLocationSecureContext,

    getErrorMessage:
      getResidenceLocationErrorMessage

  };


})();
