(function () {
  "use strict";

  /* =========================================================
     CYRUS TOURIST — RESIDENCES
     High Performance Edition
     Version: 1.2.0
     ========================================================= */

  const ResidenceAppState = {
    initialized: false,
    loading: false,
    language: "fa",
    query: "",
    province: "",
    city: "",
    type: "",
    mode: "all",
    location: null,
    residences: [],
    filteredResidences: [],
    lastRenderSignature: ""
  };

  const SELECTORS = {
    searchInput: "#searchInput",
    provinceSelect: "#provinceSelect",
    citySelect: "#citySelect",
    locationButton: "#myLocationBtn",
    categoryButtons: "#categoryButtons",
    resultBar: "#resultBar",
    resultCount: "#resultCount",
    residenceGrid: "#residenceGrid",
    registerButton: "#registerResidenceBtn"
  };

  /* =========================================================
     BASIC HELPERS
     ========================================================= */

  function findElement(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      return null;
    }
  }

  function getText(key) {
    if (typeof residenceText === "function") {
      return residenceText(key);
    }

    if (
      typeof RESIDENCE_I18N !== "undefined" &&
      RESIDENCE_I18N.fa &&
      RESIDENCE_I18N.fa[key]
    ) {
      return RESIDENCE_I18N.fa[key];
    }

    return key;
  }

  function currentLanguage() {
    if (typeof getResidenceLanguage === "function") {
      return getResidenceLanguage();
    }

    return ResidenceAppState.language || "fa";
  }

  function getResidenceData() {
    if (Array.isArray(window.RESIDENCES_DATA)) {
      return window.RESIDENCES_DATA;
    }

    if (
      window.CyrusResidenceData &&
      Array.isArray(window.CyrusResidenceData.residences)
    ) {
      return window.CyrusResidenceData.residences;
    }

    return [];
  }

  function getLocalizedValue(value) {
    if (value == null) return "";

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "object") {
      const lang = currentLanguage();

      return (
        value[lang] ||
        value.fa ||
        value.en ||
        value.ar ||
        Object.values(value)[0] ||
        ""
      );
    }

    return String(value);
  }

  /* =========================================================
     DEPENDENCIES
     ========================================================= */

  /*
   * residences.html already loads:
   * i18n
   * data
   * search
   * location
   * rating
   *
   * Therefore we DO NOT load them again.
   *
   * This removes unnecessary network/script work during startup.
   */

  function dependenciesReady() {
    const hasData =
      Array.isArray(window.RESIDENCES_DATA) ||
      (
        window.CyrusResidenceData &&
        Array.isArray(window.CyrusResidenceData.residences)
      );

    const hasSearch =
      !!window.ResidenceSearch ||
      typeof window.filterResidences === "function";

    const hasLocation =
      !!window.ResidenceLocation ||
      typeof window.calculateResidenceDistance === "function";

    const hasRating =
      !!window.ResidenceRating;

    return hasData && hasSearch && hasLocation && hasRating;
  }

  function ensureDependencies() {
    /*
     * No dynamic loading.
     *
     * The HTML file already places all dependencies before
     * residences.js, so returning immediately is the fastest path.
     */
    return dependenciesReady();
  }

  /* =========================================================
     PREMIUM STYLES
     ========================================================= */

  function injectResidenceStyles() {
    if (document.getElementById("cyrus-residence-premium-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "cyrus-residence-premium-styles";

    style.textContent = `
      .ct-residence-category-wrap{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        margin:14px 0 20px;
      }

      .ct-residence-category{
        appearance:none;
        border:1px solid rgba(13,148,136,.18);
        background:linear-gradient(135deg,#ffffff,#f2fbf8);
        color:#155e59;
        min-height:44px;
        padding:10px 15px;
        border-radius:15px;
        cursor:pointer;
        font-weight:800;
        font-size:14px;
        box-shadow:0 5px 16px rgba(15,118,110,.08);
        transition:
          transform .16s ease,
          box-shadow .16s ease,
          background .16s ease;
        -webkit-tap-highlight-color:transparent;
      }

      .ct-residence-category:hover{
        transform:translateY(-2px);
        box-shadow:0 9px 22px rgba(15,118,110,.14);
      }

      .ct-residence-category:active{
        transform:scale(.97);
      }

      .ct-residence-category.active{
        background:linear-gradient(135deg,#087f72,#0f766e);
        color:#fff;
        border-color:#0f766e;
        box-shadow:0 8px 22px rgba(15,118,110,.25);
      }

      .ct-residence-more{
        appearance:none;
        border:1px solid rgba(180,130,25,.25);
        background:linear-gradient(135deg,#fffdf5,#fff7d6);
        color:#8a6412;
        min-height:44px;
        padding:10px 16px;
        border-radius:15px;
        cursor:pointer;
        font-weight:900;
        box-shadow:0 5px 16px rgba(180,130,25,.08);
      }

      .ct-residence-more:active{
        transform:scale(.97);
      }

      .ct-residence-card{
        position:relative;
        overflow:hidden;
        background:rgba(255,255,255,.97);
        border:1px solid rgba(15,118,110,.10);
        border-radius:22px;
        box-shadow:
          0 10px 28px rgba(15,23,42,.08),
          0 2px 7px rgba(15,118,110,.05);
        transition:
          transform .18s ease,
          box-shadow .18s ease;
        contain:layout paint;
      }

      .ct-residence-card::before{
        content:"";
        position:absolute;
        top:0;
        left:0;
        right:0;
        height:4px;
        background:linear-gradient(
          90deg,
          #0f766e,
          #14b8a6,
          #d4a72c
        );
        z-index:2;
      }

      .ct-residence-card:hover{
        transform:translateY(-3px);
        box-shadow:
          0 16px 34px rgba(15,23,42,.12),
          0 4px 12px rgba(15,118,110,.08);
      }

      .ct-residence-image{
        width:100%;
        height:220px;
        object-fit:cover;
        display:block;
        background:#e8f3f0;
      }

      .ct-residence-placeholder{
        width:100%;
        height:220px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:
          radial-gradient(circle at 25% 20%,rgba(20,184,166,.16),transparent 30%),
          linear-gradient(135deg,#eaf8f5,#dcefea);
        color:#17736b;
        font-size:52px;
      }

      .ct-residence-body{
        padding:17px;
      }

      .ct-residence-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        margin-bottom:9px;
      }

      .ct-residence-title{
        margin:0;
        color:#123c39;
        font-size:19px;
        line-height:1.5;
        font-weight:900;
      }

      .ct-residence-status{
        flex:0 0 auto;
        border-radius:999px;
        padding:5px 9px;
        background:#eef8f5;
        color:#11665f;
        font-size:11px;
        font-weight:900;
        white-space:nowrap;
      }

      .ct-residence-location{
        color:#47706c;
        font-size:13px;
        line-height:1.8;
        margin-bottom:8px;
      }

      .ct-residence-description{
        color:#526c69;
        font-size:13px;
        line-height:1.9;
        margin:8px 0;
      }

      .ct-residence-meta{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        margin:10px 0;
      }

      .ct-residence-meta-item{
        display:inline-flex;
        align-items:center;
        gap:4px;
        padding:6px 9px;
        border-radius:10px;
        background:#f3f9f7;
        color:#31635f;
        font-size:12px;
        font-weight:800;
      }

      .ct-residence-rating{
        display:flex;
        align-items:center;
        gap:7px;
        margin:10px 0;
        color:#876517;
        font-weight:900;
      }

      .ct-residence-stars{
        letter-spacing:1px;
      }

      .ct-residence-actions{
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:8px;
        margin-top:13px;
      }

      .ct-residence-action{
        display:flex;
        align-items:center;
        justify-content:center;
        min-height:42px;
        padding:9px 10px;
        border-radius:13px;
        text-decoration:none;
        font-size:12px;
        font-weight:900;
        border:1px solid transparent;
        transition:
          transform .15s ease,
          box-shadow .15s ease;
      }

      .ct-residence-action:hover{
        transform:translateY(-1px);
      }

      .ct-residence-action:active{
        transform:scale(.97);
      }

      .ct-residence-action.video{
        color:#fff;
        background:linear-gradient(135deg,#a66a00,#d6a629);
        box-shadow:0 5px 14px rgba(166,106,0,.16);
      }

      .ct-residence-action.route{
        color:#fff;
        background:linear-gradient(135deg,#087f72,#0f9d8f);
        box-shadow:0 5px 14px rgba(15,118,110,.16);
      }

      .ct-residence-action.phone{
        color:#fff;
        background:linear-gradient(135deg,#1769aa,#2489d2);
      }

      .ct-residence-action.instagram{
        color:#fff;
        background:linear-gradient(135deg,#8e3d8f,#d44f72);
      }

      .ct-residence-action.website{
        color:#fff;
        background:linear-gradient(135deg,#355c7d,#3d8db7);
      }

      .ct-residence-empty{
        width:100%;
        padding:38px 18px;
        text-align:center;
        background:rgba(255,255,255,.86);
        border:1px solid rgba(15,118,110,.10);
        border-radius:20px;
        color:#55706c;
        box-shadow:0 8px 22px rgba(15,23,42,.05);
      }

      .ct-residence-empty-icon{
        font-size:42px;
        margin-bottom:10px;
      }

      .ct-residence-empty-title{
        font-size:17px;
        font-weight:900;
        color:#315c58;
        margin-bottom:7px;
      }

      .ct-residence-empty-button{
        border:0;
        margin-top:14px;
        padding:10px 18px;
        border-radius:13px;
        cursor:pointer;
        color:#fff;
        background:linear-gradient(135deg,#0f766e,#14a897);
        font-weight:900;
      }

      #residenceGrid{
        contain:layout style;
      }

      #residenceGrid img{
        content-visibility:auto;
      }

      @media(max-width:700px){
        .ct-residence-category-wrap{
          gap:8px;
        }

        .ct-residence-category,
        .ct-residence-more{
          flex:1 1 calc(50% - 8px);
          min-width:0;
        }

        .ct-residence-image,
        .ct-residence-placeholder{
          height:190px;
        }

        .ct-residence-title{
          font-size:17px;
        }

        .ct-residence-actions{
          grid-template-columns:1fr 1fr;
        }
      }

      @media(max-width:430px){
        .ct-residence-category,
        .ct-residence-more{
          flex:1 1 100%;
        }

        .ct-residence-actions{
          grid-template-columns:1fr;
        }

        .ct-residence-head{
          flex-direction:column;
        }
      }

      @media(prefers-reduced-motion:reduce){
        .ct-residence-card,
        .ct-residence-category,
        .ct-residence-action{
          transition:none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================================
     CATEGORY BUTTONS
     ========================================================= */

  function renderCategories() {
    const container = findElement(SELECTORS.categoryButtons);
    if (!container) return;

    const types =
      typeof getResidenceTypes === "function"
        ? getResidenceTypes()
        : (window.RESIDENCE_TYPES || []);

    if (!Array.isArray(types) || !types.length) {
      container.innerHTML = "";
      return;
    }

    const featured =
      typeof getFeaturedResidenceTypes === "function"
        ? getFeaturedResidenceTypes()
        : types.filter(function (item) {
            return item.featured;
          });

    const visibleTypes =
      featured.length > 0 ? featured : types.slice(0, 5);

    const currentType = ResidenceAppState.type;

    let html = "";

    visibleTypes.forEach(function (type) {
      const name = getLocalizedValue(type.name);
      const active = currentType === type.id;

      html += `
        <button
          type="button"
          class="ct-residence-category${active ? " active" : ""}"
          data-residence-type="${escapeHtml(type.id)}"
          aria-pressed="${active ? "true" : "false"}"
        >
          ${escapeHtml(type.icon || "")}
          ${escapeHtml(name)}
        </button>
      `;
    });

    const hiddenTypes = types.filter(function (type) {
      return !visibleTypes.some(function (item) {
        return item.id === type.id;
      });
    });

    if (hiddenTypes.length > 0) {
      html += `
        <button
          type="button"
          class="ct-residence-more"
          id="ctResidenceMoreButton"
        >
          ⋮ ${escapeHtml(getText("more"))}
        </button>
      `;
    }

    container.innerHTML = html;

    container.querySelectorAll("[data-residence-type]").forEach(function (button) {
      button.addEventListener("click", function () {
        const typeId = button.getAttribute("data-residence-type") || "";

        ResidenceAppState.type =
          ResidenceAppState.type === typeId ? "" : typeId;

        renderCategories();
        applyFilters();
      });
    });

    const moreButton = document.getElementById(
      "ctResidenceMoreButton"
    );

    if (moreButton) {
      moreButton.addEventListener("click", function () {
        showAllCategories(types);
      });
    }
  }

  function showAllCategories(types) {
    const container = findElement(SELECTORS.categoryButtons);
    if (!container) return;

    let html = "";

    types.forEach(function (type) {
      const active = ResidenceAppState.type === type.id;

      html += `
        <button
          type="button"
          class="ct-residence-category${active ? " active" : ""}"
          data-residence-type="${escapeHtml(type.id)}"
          aria-pressed="${active ? "true" : "false"}"
        >
          ${escapeHtml(type.icon || "")}
          ${escapeHtml(getLocalizedValue(type.name))}
        </button>
      `;
    });

    html += `
      <button
        type="button"
        class="ct-residence-more"
        id="ctResidenceMoreButton"
      >
        ${escapeHtml(getText("allResidences"))}
      </button>
    `;

    container.innerHTML = html;

    container.querySelectorAll("[data-residence-type]").forEach(function (button) {
      button.addEventListener("click", function () {
        const typeId = button.getAttribute("data-residence-type") || "";

        ResidenceAppState.type =
          ResidenceAppState.type === typeId ? "" : typeId;

        renderCategories();
        applyFilters();
      });
    });

    const allButton = document.getElementById(
      "ctResidenceMoreButton"
    );

    if (allButton) {
      allButton.addEventListener("click", function () {
        ResidenceAppState.type = "";
        renderCategories();
        applyFilters();
      });
    }
  }

  /* =========================================================
     FILTER SELECTS
     ========================================================= */

  function populateProvinceSelect() {
    const select = findElement(SELECTORS.provinceSelect);
    if (!select) return;

    const provinces =
      typeof getResidenceProvinces === "function"
        ? getResidenceProvinces()
        : [];

    const current = ResidenceAppState.province;

    let html = `
      <option value="">
        ${escapeHtml(getText("allProvinces"))}
      </option>
    `;

    provinces.forEach(function (province) {
      html += `
        <option
          value="${escapeHtml(province)}"
          ${current === province ? "selected" : ""}
        >
          ${escapeHtml(province)}
        </option>
      `;
    });

    select.innerHTML = html;
  }

  function populateCitySelect() {
    const select = findElement(SELECTORS.citySelect);
    if (!select) return;

    const cities =
      typeof getResidenceCities === "function"
        ? getResidenceCities(ResidenceAppState.province)
        : [];

    const current = ResidenceAppState.city;

    let html = `
      <option value="">
        ${escapeHtml(getText("allCities"))}
      </option>
    `;

    cities.forEach(function (city) {
      html += `
        <option
          value="${escapeHtml(city)}"
          ${current === city ? "selected" : ""}
        >
          ${escapeHtml(city)}
        </option>
      `;
    });

    select.innerHTML = html;
  }

  /* =========================================================
     STATUS / TYPE
     ========================================================= */

  function getTypeInfo(typeId) {
    if (typeof getResidenceType === "function") {
      return getResidenceType(typeId);
    }

    const types = window.RESIDENCE_TYPES || [];

    return types.find(function (type) {
      return type.id === typeId;
    }) || null;
  }

  function getStatusInfo(statusId) {
    if (typeof getResidenceStatus === "function") {
      return getResidenceStatus(statusId);
    }

    const statuses = window.RESIDENCE_STATUS || {};

    return statuses[statusId] || null;
  }

  /* =========================================================
     SECURITY
     ========================================================= */

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeUrl(value) {
    if (!value) return "";

    const url = String(value).trim();

    if (!url) return "";

    if (
      url.startsWith("https://") ||
      url.startsWith("http://") ||
      url.startsWith("tel:") ||
      url.startsWith("mailto:")
    ) {
      return url;
    }

    return "";
  }

  /* =========================================================
     ROUTE
     ========================================================= */

  function buildRouteUrl(residence) {
    if (
      !residence ||
      !Number.isFinite(Number(residence.latitude)) ||
      !Number.isFinite(Number(residence.longitude))
    ) {
      return "";
    }

    const lat = Number(residence.latitude);
    const lng = Number(residence.longitude);

    let from = "";

    if (
      ResidenceAppState.location &&
      Number.isFinite(Number(ResidenceAppState.location.latitude)) &&
      Number.isFinite(Number(ResidenceAppState.location.longitude))
    ) {
      from =
        Number(ResidenceAppState.location.latitude) +
        "," +
        Number(ResidenceAppState.location.longitude);
    }

    const destination = lat + "," + lng;

    if (from) {
      return (
        "https://www.openstreetmap.org/directions?from=" +
        encodeURIComponent(from) +
        "&to=" +
        encodeURIComponent(destination)
      );
    }

    return (
      "https://www.openstreetmap.org/directions?to=" +
      encodeURIComponent(destination)
    );
  }

  /* =========================================================
     VIDEO
     ========================================================= */

  function getVideoUrl(residence) {
    if (!residence || !residence.videoUrl) {
      return "";
    }

    return safeUrl(residence.videoUrl);
  }

  /* =========================================================
     PHONES
     ========================================================= */

  function getPhoneFields(residence) {
    if (
      typeof getResidencePhoneFields === "function"
    ) {
      return getResidencePhoneFields(residence);
    }

    return [];
  }

  /* =========================================================
     IMAGE
     ========================================================= */

  function buildImage(residence) {
    const imageUrl = safeUrl(residence.imageUrl);

    if (!imageUrl) {
      return `
        <div
          class="ct-residence-placeholder"
          aria-label="${escapeHtml(getText("title"))}"
        >
          🏡
        </div>
      `;
    }

    return `
      <img
        class="ct-residence-image"
        src="${escapeHtml(imageUrl)}"
        alt="${escapeHtml(getLocalizedValue(residence.name))}"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
      >
      <div
        class="ct-residence-placeholder"
        style="display:none"
        aria-hidden="true"
      >
        🏡
      </div>
    `;
  }

  /* =========================================================
     ACTION BUTTONS
     ========================================================= */

  function buildVideoButton(residence) {
    if (
      !residence ||
      !residence.display ||
      residence.display.showVideo === false
    ) {
      return "";
    }

    const url = getVideoUrl(residence);

    if (!url) {
      return "";
    }

    return `
      <a
        class="ct-residence-action video"
        href="${escapeHtml(url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${escapeHtml(getText("video"))}
      </a>
    `;
  }

  function buildRouteButton(residence) {
    if (
      !residence ||
      !residence.display ||
      residence.display.showRoute === false
    ) {
      return "";
    }

    const url = buildRouteUrl(residence);

    if (!url) {
      return "";
    }

    return `
      <a
        class="ct-residence-action route"
        href="${escapeHtml(url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${escapeHtml(getText("route"))}
      </a>
    `;
  }

  function buildPhoneButtons(residence) {
    const phones = getPhoneFields(residence);

    if (!phones.length) {
      return "";
    }

    return phones.map(function (phone) {
      const value = String(phone.value || "").trim();

      if (!value) return "";

      const telValue = value.replace(/[^\d+]/g, "");

      if (!telValue) return "";

      return `
        <a
          class="ct-residence-action phone"
          href="tel:${escapeHtml(telValue)}"
        >
          ${escapeHtml(phone.label)}
        </a>
      `;
    }).join("");
  }

  function buildInstagramButton(residence) {
    if (
      !residence ||
      !residence.instagram ||
      !residence.display ||
      residence.display.showInstagram === false
    ) {
      return "";
    }

    const url = safeUrl(residence.instagram);

    if (!url) return "";

    return `
      <a
        class="ct-residence-action instagram"
        href="${escapeHtml(url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        📸 ${escapeHtml(getText("instagram"))}
      </a>
    `;
  }

  function buildWebsiteButton(residence) {
    if (
      !residence ||
      !residence.website ||
      !residence.display ||
      residence.display.showWebsite === false
    ) {
      return "";
    }

    const url = safeUrl(residence.website);

    if (!url) return "";

    return `
      <a
        class="ct-residence-action website"
        href="${escapeHtml(url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        🌐 ${escapeHtml(getText("website"))}
      </a>
    `;
  }

  /* =========================================================
     RATING
     ========================================================= */

  function buildRating(residence) {
    if (
      !residence ||
      !residence.display ||
      residence.display.showRating === false
    ) {
      return "";
    }

    if (!window.ResidenceRating) {
      return "";
    }

    const rating = Number(residence.rating);

    if (!Number.isFinite(rating) || rating <= 0) {
      return "";
    }

    const rounded =
      typeof ResidenceRating.round === "function"
        ? ResidenceRating.round(rating)
        : Math.round(rating * 10) / 10;

    const stars =
      typeof ResidenceRating.toStars === "function"
        ? ResidenceRating.toStars(rounded)
        : "★★★★★";

    const count = Number(residence.ratingCount || 0);

    return `
      <div class="ct-residence-rating">
        <span class="ct-residence-stars">${escapeHtml(stars)}</span>
        <span>${escapeHtml(String(rounded))}</span>
        ${
          count > 0
            ? `<span>(${escapeHtml(String(count))})</span>`
            : ""
        }
      </div>
    `;
  }

  /* =========================================================
     DISTANCE
     ========================================================= */

  function getDistanceText(residence) {
    if (
      !ResidenceAppState.location ||
      !window.ResidenceLocation
    ) {
      return "";
    }

    if (
      !Number.isFinite(Number(residence.latitude)) ||
      !Number.isFinite(Number(residence.longitude))
    ) {
      return "";
    }

    try {
      let distance = null;

      if (
        typeof ResidenceLocation.distanceKm === "function"
      ) {
        distance = ResidenceLocation.distanceKm(
          ResidenceAppState.location.latitude,
          ResidenceAppState.location.longitude,
          residence.latitude,
          residence.longitude
        );
      } else if (
        typeof ResidenceLocation.calculateDistanceKm === "function"
      ) {
        distance = ResidenceLocation.calculateDistanceKm(
          ResidenceAppState.location.latitude,
          ResidenceAppState.location.longitude,
          residence.latitude,
          residence.longitude
        );
      }

      if (!Number.isFinite(Number(distance))) {
        return "";
      }

      const rounded =
        Number(distance) < 10
          ? Number(distance).toFixed(1)
          : Math.round(Number(distance));

      return `
        <span class="ct-residence-meta-item">
          📍 ${escapeHtml(String(rounded))}
          ${escapeHtml(getText("kilometer"))}
        </span>
      `;
    } catch (error) {
      return "";
    }
  }

  /* =========================================================
     RESIDENCE CARD
     ========================================================= */

  function createResidenceCard(residence) {
    const name =
      getLocalizedValue(residence.name) ||
      "Cyrus Tourist";

    const province =
      getLocalizedValue(residence.province);

    const city =
      getLocalizedValue(residence.city);

    const region =
      getLocalizedValue(residence.region);

    const address =
      getLocalizedValue(residence.address);

    const description =
      getLocalizedValue(residence.description);

    const typeInfo =
      getTypeInfo(residence.type);

    const typeName =
      typeInfo
        ? getLocalizedValue(typeInfo.name)
        : "";

    const statusInfo =
      getStatusInfo(residence.status);

    const statusName =
      statusInfo
        ? getLocalizedValue(statusInfo)
        : "";

    const locationParts = [
      province,
      city,
      region
    ].filter(Boolean);

    const metaParts = [];

    if (typeName) {
      metaParts.push(`
        <span class="ct-residence-meta-item">
          ${escapeHtml(typeInfo.icon || "🏡")}
          ${escapeHtml(typeName)}
        </span>
      `);
    }

    if (address) {
      metaParts.push(`
        <span class="ct-residence-meta-item">
          📌 ${escapeHtml(address)}
        </span>
      `);
    }

    const distanceText =
      getDistanceText(residence);

    if (distanceText) {
      metaParts.push(distanceText);
    }

    const actions = [
      buildVideoButton(residence),
      buildRouteButton(residence),
      buildPhoneButtons(residence),
      buildInstagramButton(residence),
      buildWebsiteButton(residence)
    ].join("");

    return `
      <article
        class="ct-residence-card"
        data-residence-id="${escapeHtml(residence.id || "")}"
      >
        ${buildImage(residence)}

        <div class="ct-residence-body">

          <div class="ct-residence-head">
            <h3 class="ct-residence-title">
              ${escapeHtml(name)}
            </h3>

            ${
              statusName
                ? `
                  <span class="ct-residence-status">
                    ${escapeHtml(statusName)}
                  </span>
                `
                : ""
            }
          </div>

          ${
            locationParts.length
              ? `
                <div class="ct-residence-location">
                  📍 ${escapeHtml(locationParts.join(" • "))}
                </div>
              `
              : ""
          }

          ${
            description
              ? `
                <div class="ct-residence-description">
                  ${escapeHtml(description)}
                </div>
              `
              : ""
          }

          ${
            metaParts.length
              ? `
                <div class="ct-residence-meta">
                  ${metaParts.join("")}
                </div>
              `
              : ""
          }

          ${buildRating(residence)}

          ${
            actions
              ? `
                <div class="ct-residence-actions">
                  ${actions}
                </div>
              `
              : ""
          }

        </div>
      </article>
    `;
  }

  /* =========================================================
     RENDER GRID
     ========================================================= */

  function renderResidences(residences) {
    const grid = findElement(SELECTORS.residenceGrid);

    if (!grid) return;

    const list =
      Array.isArray(residences)
        ? residences
        : [];

    const signature =
      list.map(function (item) {
        return item.id || "";
      }).join("|") +
      "::" +
      currentLanguage() +
      "::" +
      ResidenceAppState.location
        ? JSON.stringify(ResidenceAppState.location || {})
        : "";

    /*
     * Prevent identical consecutive renders.
     */
    if (
      ResidenceAppState.lastRenderSignature === signature &&
      grid.children.length === list.length
    ) {
      return;
    }

    ResidenceAppState.lastRenderSignature = signature;

    if (!list.length) {
      renderEmptyState();
      return;
    }

    /*
     * One DOM write only.
     */
    grid.innerHTML = list
      .map(createResidenceCard)
      .join("");
  }

  function renderEmptyState() {
    const grid = findElement(SELECTORS.residenceGrid);

    if (!grid) return;

    grid.innerHTML = `
      <div class="ct-residence-empty">
        <div class="ct-residence-empty-icon">
          🏡
        </div>

        <div class="ct-residence-empty-title">
          ${escapeHtml(getText("noResults"))}
        </div>

        <button
          type="button"
          class="ct-residence-empty-button"
          id="ctResidenceRetryButton"
        >
          ${escapeHtml(getText("retry"))}
        </button>
      </div>
    `;

    const retry =
      document.getElementById(
        "ctResidenceRetryButton"
      );

    if (retry) {
      retry.addEventListener("click", function () {
        resetSearch();
      });
    }
  }

  /* =========================================================
     RESULT BAR
     ========================================================= */

  function updateResultBar(count) {
    const bar = findElement(SELECTORS.resultBar);
    const resultCount = findElement(
      SELECTORS.resultCount
    );

    if (resultCount) {
      resultCount.textContent = String(count);
    }

    if (bar) {
      bar.style.display = "flex";
    }
  }

  /* =========================================================
     FILTERING
     ========================================================= */

  function applyFilters() {
    let results =
      ResidenceAppState.residences.slice();

    const query =
      ResidenceAppState.query.trim();

    /*
     * Nearby mode.
     */
    if (
      ResidenceAppState.mode === "nearby" &&
      window.ResidenceLocation &&
      ResidenceAppState.location
    ) {
      try {
        if (
          typeof ResidenceLocation.sortByDistance === "function"
        ) {
          results =
            ResidenceLocation.sortByDistance(
              results,
              ResidenceAppState.location
            );
        }
      } catch (error) {
        // graceful fallback
      }
    }

    /*
     * Standard search engine.
     */
    if (window.ResidenceSearch) {
      try {
        if (
          typeof ResidenceSearch.filterResidences === "function"
        ) {
          results =
            ResidenceSearch.filterResidences(
              results,
              query,
              ResidenceAppState.province,
              ResidenceAppState.city,
              ResidenceAppState.type
            );
        } else if (
          typeof window.filterResidences === "function"
        ) {
          results =
            window.filterResidences(
              results,
              query,
              ResidenceAppState.province,
              ResidenceAppState.city,
              ResidenceAppState.type
            );
        }
      } catch (error) {
        results =
          fallbackFilter(results);
      }
    } else {
      results =
        fallbackFilter(results);
    }

    /*
     * Nearby sorting should remain after filtering.
     */
    if (
      ResidenceAppState.mode === "nearby" &&
      window.ResidenceLocation &&
      ResidenceAppState.location
    ) {
      try {
        if (
          typeof ResidenceLocation.sortByDistance === "function"
        ) {
          results =
            ResidenceLocation.sortByDistance(
              results,
              ResidenceAppState.location
            );
        }
      } catch (error) {
        // ignore
      }
    }

    ResidenceAppState.filteredResidences =
      Array.isArray(results)
        ? results
        : [];

    updateResultBar(
      ResidenceAppState.filteredResidences.length
    );

    renderResidences(
      ResidenceAppState.filteredResidences
    );
  }

  function fallbackFilter(list) {
    const query =
      ResidenceAppState.query.trim().toLowerCase();

    return list.filter(function (residence) {
      const active =
        !residence.status ||
        residence.status === "active";

      if (!active) {
        return false;
      }

      if (
        ResidenceAppState.province &&
        getLocalizedValue(residence.province) !==
          ResidenceAppState.province
      ) {
        return false;
      }

      if (
        ResidenceAppState.city &&
        getLocalizedValue(residence.city) !==
          ResidenceAppState.city
      ) {
        return false;
      }

      if (
        ResidenceAppState.type &&
        residence.type !== ResidenceAppState.type
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const text = [
        getLocalizedValue(residence.name),
        getLocalizedValue(residence.province),
        getLocalizedValue(residence.city),
        getLocalizedValue(residence.region),
        getLocalizedValue(residence.address),
        getLocalizedValue(residence.description)
      ]
        .join(" ")
        .toLowerCase();

      return text.indexOf(query) !== -1;
    });
  }

  /* =========================================================
     SEARCH EVENTS
     ========================================================= */

  function setupSearch() {
    const input =
      findElement(SELECTORS.searchInput);

    if (!input) return;

    let timer = null;

    input.addEventListener("input", function () {
      const value = input.value || "";

      clearTimeout(timer);

      /*
       * Small debounce prevents excessive renders while typing.
       */
      timer = setTimeout(function () {
        ResidenceAppState.query = value;

        ResidenceAppState.mode = "all";

        applyFilters();
      }, 100);
    });
  }

  function setupProvince() {
    const select =
      findElement(SELECTORS.provinceSelect);

    if (!select) return;

    select.addEventListener("change", function () {
      ResidenceAppState.province =
        select.value || "";

      ResidenceAppState.city = "";

      populateCitySelect();

      ResidenceAppState.mode = "all";

      applyFilters();
    });
  }

  function setupCity() {
    const select =
      findElement(SELECTORS.citySelect);

    if (!select) return;

    select.addEventListener("change", function () {
      ResidenceAppState.city =
        select.value || "";

      ResidenceAppState.mode = "all";

      applyFilters();
    });
  }

  /* =========================================================
     LOCATION
     ========================================================= */

  function setupLocation() {
    const button =
      findElement(SELECTORS.locationButton);

    if (!button) return;

    button.addEventListener("click", function () {
      if (!window.ResidenceLocation) {
        return;
      }

      const originalText =
        button.textContent;

      button.disabled = true;
      button.textContent =
        getText("searchingLocation");

      const success =
        function (location) {
          ResidenceAppState.location = location;
          ResidenceAppState.mode = "nearby";

          button.disabled = false;
          button.textContent =
            getText("myLocation");

          applyFilters();
        };

      const failure =
        function () {
          button.disabled = false;
          button.textContent =
            originalText || getText("myLocation");
        };

      try {
        if (
          typeof ResidenceLocation.getCurrentLocation ===
          "function"
        ) {
          ResidenceLocation.getCurrentLocation(
            success,
            failure
          );
          return;
        }

        if (
          typeof ResidenceLocation.getLocation ===
          "function"
        ) {
          ResidenceLocation.getLocation(
            success,
            failure
          );
          return;
        }

        failure();
      } catch (error) {
        failure();
      }
    });
  }

  /* =========================================================
     REGISTRATION
     ========================================================= */

  function setupRegistration() {
    const buttons =
      document.querySelectorAll(
        [
          SELECTORS.registerButton,
          "#residenceRegistrationBtn",
          "#addResidenceBtn",
          "[data-residence-register]",
          ".register-residence-btn"
        ].join(",")
      );

    if (!buttons.length) return;

    buttons.forEach(function (button) {
      if (
        button.dataset.ctRegistrationReady === "1"
      ) {
        return;
      }

      button.dataset.ctRegistrationReady = "1";

      button.addEventListener("click", function (event) {
        event.preventDefault();

        if (
          window.CyrusResidenceRegistration &&
          typeof window.CyrusResidenceRegistration.open ===
            "function"
        ) {
          window.CyrusResidenceRegistration.open();
        }
      });
    });
  }

  /* =========================================================
     LANGUAGE
     ========================================================= */

  function refreshLanguage() {
    ResidenceAppState.language =
      currentLanguage();

    /*
     * Rebuild only what needs localization.
     */
    renderCategories();
    populateProvinceSelect();
    populateCitySelect();

    ResidenceAppState.lastRenderSignature = "";

    applyFilters();

    if (
      window.CyrusResidenceRegistration &&
      typeof window.CyrusResidenceRegistration
        .refreshLanguage === "function"
    ) {
      try {
        window.CyrusResidenceRegistration
          .refreshLanguage();
      } catch (error) {
        // ignore
      }
    }
  }

  /* =========================================================
     RESET
     ========================================================= */

  function resetSearch() {
    ResidenceAppState.query = "";
    ResidenceAppState.province = "";
    ResidenceAppState.city = "";
    ResidenceAppState.type = "";
    ResidenceAppState.mode = "all";
    ResidenceAppState.lastRenderSignature = "";

    const input =
      findElement(SELECTORS.searchInput);

    if (input) {
      input.value = "";
    }

    populateProvinceSelect();
    populateCitySelect();
    renderCategories();

    applyFilters();
  }

  /* =========================================================
     PREPARE DATA
     ========================================================= */

  function prepareData() {
    const data =
      getResidenceData();

    ResidenceAppState.residences =
      data.filter(function (residence) {
        return (
          !residence.status ||
          residence.status === "active"
        );
      });
  }

  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function initResidences() {
    if (ResidenceAppState.initialized) {
      return;
    }

    ResidenceAppState.loading = true;

    /*
     * All dependencies are already loaded by HTML.
     */
    ensureDependencies();

    injectResidenceStyles();

    ResidenceAppState.language =
      currentLanguage();

    prepareData();

    renderCategories();

    populateProvinceSelect();

    populateCitySelect();

    setupSearch();

    setupProvince();

    setupCity();

    setupLocation();

    setupRegistration();

    /*
     * First render immediately from local data.
     * No network request is required.
     */
    applyFilters();

    ResidenceAppState.initialized = true;
    ResidenceAppState.loading = false;

    /*
     * Refresh registration after the page is fully painted.
     * This keeps the critical first render lighter.
     */
    if (
      window.requestAnimationFrame &&
      window.CyrusResidenceRegistration
    ) {
      requestAnimationFrame(function () {
        try {
          if (
            typeof window.CyrusResidenceRegistration
              .refreshLanguage === "function"
          ) {
            window.CyrusResidenceRegistration
              .refreshLanguage();
          }
        } catch (error) {
          // ignore
        }
      });
    }
  }

  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.CyrusResidences = {
    version: "1.2.0",

    state: ResidenceAppState,

    init: initResidences,

    refresh: function () {
      ResidenceAppState.lastRenderSignature = "";
      prepareData();
      applyFilters();
    },

    refreshLanguage: refreshLanguage,

    search: function (query) {
      ResidenceAppState.query =
        String(query || "");

      ResidenceAppState.mode = "all";

      const input =
        findElement(SELECTORS.searchInput);

      if (input) {
        input.value =
          ResidenceAppState.query;
      }

      applyFilters();
    },

    setProvince: function (province) {
      ResidenceAppState.province =
        String(province || "");

      ResidenceAppState.city = "";

      populateProvinceSelect();
      populateCitySelect();

      applyFilters();
    },

    setCity: function (city) {
      ResidenceAppState.city =
        String(city || "");

      populateCitySelect();

      applyFilters();
    },

    setType: function (type) {
      ResidenceAppState.type =
        String(type || "");

      renderCategories();

      applyFilters();
    },

    nearby: function (location) {
      ResidenceAppState.location =
        location || null;

      ResidenceAppState.mode =
        "nearby";

      applyFilters();
    },

    showAll: function () {
      ResidenceAppState.mode = "all";
      applyFilters();
    },

    reset: resetSearch,

    getResults: function () {
      return ResidenceAppState
        .filteredResidences
        .slice();
    }
  };

  /* =========================================================
     START
     ========================================================= */

  /*
   * residences.js is the last script in residences.html,
   * so DOM and dependencies are already available.
   *
   * We still keep a tiny DOMContentLoaded fallback for
   * unusual embedding situations.
   */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initResidences,
      { once: true }
    );
  } else {
    initResidences();
  }

})();
