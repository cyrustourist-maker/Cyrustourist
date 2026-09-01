/*
 * ============================================================
 * Cyrus Tourist
 * Residences Main Engine
 * ============================================================
 *
 * موتور اصلی صفحه اقامتگاه‌ها
 *
 * امکانات:
 * - اتصال داده‌های اقامتگاه
 * - جستجوی هوشمند
 * - فیلتر استان
 * - فیلتر شهر
 * - دسته‌بندی پویا
 * - نمایش کارت اقامتگاه
 * - نمایش امتیاز
 * - نمایش فاصله
 * - مکان من
 * - نزدیک‌ترین اقامتگاه‌ها
 * - فیلم
 * - مسیریابی
 * - تماس
 * - اینستاگرام
 * - وب‌سایت
 * - طراحی واکنش‌گرا
 *
 * بدون Firebase
 * بدون وابستگی به دیتابیس در این مرحله
 *
 * آماده برای اتصال آینده به:
 * API / Cloudflare D1 / پنل مدیریت
 * ============================================================
 */

(function () {

    "use strict";


    /* =========================================================
       وضعیت برنامه
       ========================================================= */

    const ResidenceAppState = {

        initialized: false,

        residences: [],

        filteredResidences: [],

        currentMode: "all",

        currentQuery: "",

        currentProvince: "",

        currentCity: "",

        currentType: "",

        categoriesExpanded: false,

        loading: false,

        locationLoading: false

    };


    /* =========================================================
       انتخابگرهای DOM
       ========================================================= */

    const SELECTORS = {

        searchInput: [
            "#searchInput",
            "#residenceSearch",
            "#searchResidence",
            "[data-residence-search]"
        ],

        provinceSelect: [
            "#provinceSelect",
            "#residenceProvince",
            "[data-residence-province]"
        ],

        citySelect: [
            "#citySelect",
            "#residenceCity",
            "[data-residence-city]"
        ],

        locationButton: [
            "#myLocationBtn",
            "#locationBtn",
            "#residenceLocationBtn",
            "[data-residence-location]"
        ],

        categoryButtons: [
            "#categoryButtons",
            "#residenceCategories",
            "[data-residence-categories]"
        ],

        residenceGrid: [
            "#residenceGrid",
            "#residencesGrid",
            "#residenceResults",
            "[data-residence-grid]"
        ],

        resultBar: [
            "#resultBar",
            "#residenceResultBar",
            "[data-residence-result]"
        ],

        resultCount: [
            "#resultCount",
            "#residenceResultCount",
            "[data-residence-count]"
        ]

    };


    /* =========================================================
       پیدا کردن اولین عنصر موجود
       ========================================================= */

    function findElement(list) {

        for (
            let i = 0;
            i < list.length;
            i++
        ) {

            const element =
                document.querySelector(
                    list[i]
                );

            if (element) {
                return element;
            }

        }

        return null;

    }


    /* =========================================================
       گرفتن متن چندزبانه
       ========================================================= */

    function getText(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }


        if (
            typeof value === "string"
        ) {
            return value;
        }


        if (
            typeof value === "object"
        ) {

            const language =
                typeof getResidenceLanguage ===
                "function"
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


    /* =========================================================
       گرفتن زبان فعلی
       ========================================================= */

    function currentLanguage() {

        if (
            typeof getResidenceLanguage ===
            "function"
        ) {

            return getResidenceLanguage();

        }

        return "fa";

    }


    /* =========================================================
       گرفتن داده اقامتگاه‌ها
       ========================================================= */

    function getResidenceData() {

        if (
            typeof RESIDENCES_DATA !==
            "undefined" &&
            Array.isArray(
                RESIDENCES_DATA
            )
        ) {

            return RESIDENCES_DATA;

        }


        return [];

    }


    /* =========================================================
       بارگذاری وابستگی‌ها
       =========================================================
       این بخش عمداً اضافه شده تا اگر در
       residences.html نام فایل‌های قدیمی
       residence-search.js و ...
       وجود داشته باشد، نسخه جدید
       residences-*.js نیز به‌صورت خودکار
       بارگذاری شود.
       ========================================================= */

    function loadScript(
        filename
    ) {

        return new Promise(
            function (
                resolve,
                reject
            ) {

                const existing =
                    document.querySelector(
                        'script[src="' +
                        filename +
                        '"]'
                    );


                if (existing) {

                    /*
                     * اگر قبلاً بارگذاری شده،
                     * چند لحظه فرصت می‌دهیم.
                     */

                    setTimeout(
                        function () {
                            resolve();
                        },
                        0
                    );

                    return;

                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    filename;


                script.async = false;


                script.onload =
                    function () {
                        resolve();
                    };


                script.onerror =
                    function () {

                        console.warn(
                            "Cyrus Tourist: فایل بارگذاری نشد:",
                            filename
                        );

                        resolve();

                    };


                document.head.appendChild(
                    script
                );

            }
        );

    }


    async function ensureDependencies() {

        const dependencies = [

            "residences-i18n.js",
            "residences-data.js",
            "residences-search.js",
            "residences-location.js",
            "residences-rating.js"

        ];


        for (
            const file of dependencies
        ) {

            await loadScript(file);

        }

    }


    /* =========================================================
       تزریق استایل‌های تکمیلی
       ========================================================= */

    function injectResidenceStyles() {

        if (
            document.getElementById(
                "cyrusResidenceDynamicStyle"
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "cyrusResidenceDynamicStyle";


        style.textContent = `

        .ct-residence-category-row {
            display:flex;
            flex-wrap:wrap;
            gap:10px;
            align-items:center;
            justify-content:center;
            margin:18px 0;
        }

        .ct-residence-category {
            border:0;
            border-radius:16px;
            padding:11px 16px;
            cursor:pointer;
            font-size:14px;
            font-weight:700;
            background:linear-gradient(
                135deg,
                #ffffff,
                #eef6ff
            );
            box-shadow:
                0 5px 18px rgba(0,0,0,.08);
            transition:
                transform .2s ease,
                box-shadow .2s ease,
                background .2s ease;
        }

        .ct-residence-category:hover {
            transform:translateY(-2px);
            box-shadow:
                0 8px 22px rgba(0,0,0,.13);
        }

        .ct-residence-category.active {
            background:
                linear-gradient(
                    135deg,
                    #f7b733,
                    #fc4a1a
                );
            color:#fff;
            box-shadow:
                0 8px 24px rgba(252,74,26,.28);
        }

        .ct-residence-more {
            border:0;
            border-radius:16px;
            padding:11px 17px;
            cursor:pointer;
            font-weight:800;
            background:
                linear-gradient(
                    135deg,
                    #7f53ac,
                    #647dee
                );
            color:#fff;
            box-shadow:
                0 7px 20px rgba(100,125,222,.25);
        }

        .ct-residence-card {
            position:relative;
            overflow:hidden;
            background:#fff;
            border-radius:22px;
            box-shadow:
                0 8px 30px rgba(0,0,0,.09);
            transition:
                transform .25s ease,
                box-shadow .25s ease;
            height:100%;
            display:flex;
            flex-direction:column;
        }

        .ct-residence-card:hover {
            transform:translateY(-5px);
            box-shadow:
                0 14px 38px rgba(0,0,0,.15);
        }

        .ct-residence-image {
            width:100%;
            height:210px;
            object-fit:cover;
            display:block;
            background:
                linear-gradient(
                    135deg,
                    #dff3ff,
                    #f8e8c8
                );
        }

        .ct-residence-image-placeholder {
            width:100%;
            height:210px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:58px;
            background:
                linear-gradient(
                    135deg,
                    #dff3ff,
                    #fff1cf,
                    #e5ddff
                );
        }

        .ct-residence-body {
            padding:17px;
            display:flex;
            flex-direction:column;
            flex:1;
        }

        .ct-residence-title {
            margin:0 0 8px;
            font-size:19px;
            font-weight:900;
            line-height:1.5;
            color:#18202a;
        }

        .ct-residence-location {
            color:#596574;
            font-size:13px;
            line-height:1.8;
            margin-bottom:9px;
        }

        .ct-residence-description {
            color:#68727e;
            font-size:13px;
            line-height:1.9;
            margin:5px 0 12px;
        }

        .ct-residence-meta {
            display:flex;
            flex-wrap:wrap;
            gap:7px;
            margin:5px 0 12px;
        }

        .ct-residence-badge {
            display:inline-flex;
            align-items:center;
            gap:4px;
            border-radius:12px;
            padding:6px 9px;
            background:#f3f6fa;
            font-size:12px;
            font-weight:700;
            color:#46515d;
        }

        .ct-residence-rating {
            font-size:14px;
            font-weight:800;
            margin-bottom:10px;
        }

        .ct-residence-actions {
            display:grid;
            grid-template-columns:
                repeat(2, minmax(0,1fr));
            gap:8px;
            margin-top:auto;
        }

        .ct-residence-action {
            display:flex;
            align-items:center;
            justify-content:center;
            min-height:42px;
            padding:8px 10px;
            border-radius:13px;
            text-decoration:none;
            border:0;
            cursor:pointer;
            font-size:12px;
            font-weight:800;
            background:#f2f5f8;
            color:#26313d;
            transition:
                transform .2s ease,
                filter .2s ease;
        }

        .ct-residence-action:hover {
            transform:translateY(-2px);
            filter:brightness(.97);
        }

        .ct-residence-action.primary {
            background:
                linear-gradient(
                    135deg,
                    #2193b0,
                    #6dd5ed
                );
            color:#fff;
        }

        .ct-residence-action.video {
            background:
                linear-gradient(
                    135deg,
                    #ff512f,
                    #dd2476
                );
            color:#fff;
        }

        .ct-residence-action.route {
            background:
                linear-gradient(
                    135deg,
                    #11998e,
                    #38ef7d
                );
            color:#fff;
        }

        .ct-residence-distance {
            color:#0b7a75;
            font-weight:900;
        }

        .ct-residence-empty {
            padding:45px 20px;
            text-align:center;
            border-radius:20px;
            background:
                linear-gradient(
                    135deg,
                    #f8fbff,
                    #fff8ed
                );
            box-shadow:
                0 7px 25px rgba(0,0,0,.06);
        }

        .ct-residence-empty-icon {
            font-size:52px;
            margin-bottom:10px;
        }

        .ct-residence-empty-title {
            font-size:18px;
            font-weight:900;
            margin-bottom:15px;
        }

        .ct-residence-retry {
            border:0;
            border-radius:13px;
            padding:11px 18px;
            background:
                linear-gradient(
                    135deg,
                    #667eea,
                    #764ba2
                );
            color:#fff;
            font-weight:800;
            cursor:pointer;
        }

        .ct-residence-status {
            position:absolute;
            top:12px;
            right:12px;
            z-index:2;
            border-radius:12px;
            padding:6px 9px;
            background:rgba(255,255,255,.93);
            backdrop-filter:blur(5px);
            font-size:11px;
            font-weight:900;
        }

        .ct-residence-more-categories {
            display:none;
            width:100%;
            flex-wrap:wrap;
            gap:10px;
            justify-content:center;
        }

        .ct-residence-more-categories.open {
            display:flex;
        }

        @media (max-width:700px) {

            .ct-residence-category-row {
                justify-content:flex-start;
                flex-wrap:nowrap;
                overflow-x:auto;
                padding:4px 3px 10px;
                scrollbar-width:none;
            }

            .ct-residence-category-row::-webkit-scrollbar {
                display:none;
            }

            .ct-residence-category {
                white-space:nowrap;
                flex:0 0 auto;
            }

            .ct-residence-more-categories {
                flex-wrap:nowrap;
                overflow-x:auto;
                justify-content:flex-start;
            }

            .ct-residence-card {
                border-radius:18px;
            }

            .ct-residence-image,
            .ct-residence-image-placeholder {
                height:190px;
            }

        }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =========================================================
       نمایش دسته‌بندی‌ها
       ========================================================= */

    function renderCategories() {

        const container =
            findElement(
                SELECTORS.categoryButtons
            );


        if (!container) {
            return;
        }


        if (
            typeof RESIDENCE_TYPES ===
            "undefined"
        ) {
            return;
        }


        const language =
            currentLanguage();


        const types =
            Object.values(
                RESIDENCE_TYPES
            )
            .sort(
                function (a, b) {
                    return (
                        Number(a.order || 99) -
                        Number(b.order || 99)
                    );
                }
            );


        const featured =
            types.filter(
                function (item) {
                    return item.featured === true;
                }
            );


        const additional =
            types.filter(
                function (item) {
                    return item.featured !== true;
                }
            );


        container.innerHTML = "";


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "ct-residence-category-row";


        function createButton(
            type,
            active
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "ct-residence-category" +
                (
                    active
                        ? " active"
                        : ""
                );


            button.dataset.type =
                type.id;


            button.textContent =
                (
                    type.icon || ""
                ) +
                " " +
                (
                    type.name?.[language] ||
                    type.name?.fa ||
                    type.id
                );


            button.addEventListener(
                "click",
                function () {

                    setCategory(
                        type.id
                    );

                }
            );


            return button;

        }


        /*
         * دکمه همه
         */

        const allButton =
            document.createElement(
                "button"
            );


        allButton.type =
            "button";


        allButton.className =
            "ct-residence-category" +
            (
                !ResidenceAppState.currentType
                    ? " active"
                    : ""
            );


        allButton.textContent =
            typeof residenceText ===
            "function"
                ? residenceText("all")
                : "🌍 همه";


        allButton.addEventListener(
            "click",
            function () {

                setCategory("");

            }
        );


        wrapper.appendChild(
            allButton
        );


        /*
         * دسته‌های اصلی
         */

        featured.forEach(
            function (type) {

                wrapper.appendChild(
                    createButton(
                        type,
                        type.id ===
                        ResidenceAppState.currentType
                    )
                );

            }
        );


        /*
         * دکمه بیشتر
         */

        if (
            additional.length > 0
        ) {

            const moreButton =
                document.createElement(
                    "button"
                );


            moreButton.type =
                "button";


            moreButton.className =
                "ct-residence-more";


            moreButton.textContent =
                typeof residenceText ===
                "function"
                    ? residenceText("more")
                    : "⋮ بیشتر";


            moreButton.addEventListener(
                "click",
                function () {

                    ResidenceAppState
                        .categoriesExpanded =
                        !ResidenceAppState
                            .categoriesExpanded;


                    renderCategories();

                }
            );


            wrapper.appendChild(
                moreButton
            );

        }


        container.appendChild(
            wrapper
        );


        /*
         * دسته‌های بیشتر
         */

        if (
            ResidenceAppState
                .categoriesExpanded &&
            additional.length > 0
        ) {

            const moreContainer =
                document.createElement(
                    "div"
                );


            moreContainer.className =
                "ct-residence-more-categories open";


            additional.forEach(
                function (type) {

                    moreContainer.appendChild(
                        createButton(
                            type,
                            type.id ===
                            ResidenceAppState.currentType
                        )
                    );

                }
            );


            container.appendChild(
                moreContainer
            );

        }

    }


    /* =========================================================
       انتخاب دسته
       ========================================================= */

    function setCategory(
        type
    ) {

        ResidenceAppState.currentType =
            type || "";


        if (
            typeof ResidenceSearch !==
            "undefined"
        ) {

            ResidenceSearch.setType(
                type || ""
            );

        }


        ResidenceAppState.currentMode =
            type
                ? "category"
                : "all";


        renderCategories();
        applyFilters();

    }


    /* =========================================================
       پر کردن استان‌ها
       ========================================================= */

    function populateProvinces() {

        const select =
            findElement(
                SELECTORS.provinceSelect
            );


        if (!select) {
            return;
        }


        const residences =
            ResidenceAppState.residences;


        const language =
            currentLanguage();


        let provinces = [];


        if (
            typeof ResidenceSearch !==
            "undefined"
        ) {

            provinces =
                ResidenceSearch.buildProvinceList(
                    residences,
                    language
                );

        }


        if (
            provinces.length === 0
        ) {

            provinces =
                [...new Set(
                    residences
                        .map(
                            function (item) {
                                return getText(
                                    item.province
                                );
                            }
                        )
                        .filter(Boolean)
                )];

        }


        select.innerHTML = "";


        const all =
            document.createElement(
                "option"
            );


        all.value = "";


        all.textContent =
            typeof residenceText ===
            "function"
                ? residenceText(
                    "allProvinces"
                )
                : "🌍 همه استان‌ها";


        select.appendChild(
            all
        );


        provinces.forEach(
            function (province) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    province;


                option.textContent =
                    province;


                select.appendChild(
                    option
                );

            }
        );


        select.value =
            ResidenceAppState.currentProvince ||
            "";

    }


    /* =========================================================
       پر کردن شهرها
       ========================================================= */

    function populateCities() {

        const select =
            findElement(
                SELECTORS.citySelect
            );


        if (!select) {
            return;
        }


        const language =
            currentLanguage();


        let cities = [];


        if (
            typeof ResidenceSearch !==
            "undefined"
        ) {

            cities =
                ResidenceSearch.buildCityList(
                    ResidenceAppState.residences,
                    ResidenceAppState.currentProvince,
                    language
                );

        }


        select.innerHTML = "";


        const all =
            document.createElement(
                "option"
            );


        all.value = "";


        all.textContent =
            typeof residenceText ===
            "function"
                ? residenceText(
                    "allCities"
                )
                : "🏙️ همه شهرها";


        select.appendChild(
            all
        );


        cities.forEach(
            function (city) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    city;


                option.textContent =
                    city;


                select.appendChild(
                    option
                );

            }
        );


        /*
         * اگر شهر قبلی در استان جدید وجود ندارد،
         * پاک می‌شود.
         */

        const exists =
            cities.includes(
                ResidenceAppState.currentCity
            );


        if (exists) {

            select.value =
                ResidenceAppState.currentCity;

        } else {

            ResidenceAppState.currentCity =
                "";

            select.value = "";

        }

    }


    /* =========================================================
       دریافت وضعیت اقامتگاه
       ========================================================= */

    function getStatusText(
        residence
    ) {

        const status =
            residence.status ||
            "active";


        if (
            typeof RESIDENCE_STATUS !==
            "undefined"
        ) {

            const item =
                RESIDENCE_STATUS[
                    status
                ];


            if (item) {

                return (
                    item.name?.[
                        currentLanguage()
                    ] ||
                    item.name?.fa ||
                    status
                );

            }

        }


        if (
            typeof residenceText ===
            "function"
        ) {

            return residenceText(
                status
            );

        }


        return status;

    }


    /* =========================================================
       نوع اقامتگاه
       ========================================================= */

    function getTypeInfo(
        residence
    ) {

        if (
            typeof RESIDENCE_TYPES ===
            "undefined"
        ) {

            return {

                name:
                    residence.type || "",

                icon: "🏡"

            };

        }


        const item =
            Object.values(
                RESIDENCE_TYPES
            ).find(
                function (type) {
                    return (
                        type.id ===
                        residence.type
                    );
                }
            );


        if (!item) {

            return {

                name:
                    residence.type || "",

                icon: "🏡"

            };

        }


        const language =
            currentLanguage();


        return {

            name:
                item.name?.[
                    language
                ] ||
                item.name?.fa ||
                item.id,

            icon:
                item.icon || "🏡"

        };

    }


    /* =========================================================
       امن‌سازی HTML
       ========================================================= */

    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* =========================================================
       ساخت لینک مسیریابی
       ========================================================= */

    function buildRouteUrl(
        residence
    ) {

        const lat =
            Number(
                residence.latitude
            );

        const lng =
            Number(
                residence.longitude
            );


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {

            return "";

        }


        /*
         * OpenStreetMap
         * مناسب با ساختار سایروس توریست
         */

        return (
            "https://www.openstreetmap.org/directions" +
            "?from=" +
            encodeURIComponent(
                ResidenceLocationAvailable()
                    ? (
                        getLocationLatitude() +
                        "," +
                        getLocationLongitude()
                    )
                    : ""
            ) +
            "&to=" +
            encodeURIComponent(
                lat + "," + lng
            )
        );

    }


    function ResidenceLocationAvailable() {

        return (
            typeof ResidenceLocation !==
            "undefined" &&
            ResidenceLocation.state &&
            ResidenceLocation.state.available
        );

    }


    function getLocationLatitude() {

        if (
            ResidenceLocationAvailable()
        ) {

            return ResidenceLocation
                .state
                .latitude;

        }

        return "";

    }


    function getLocationLongitude() {

        if (
            ResidenceLocationAvailable()
        ) {

            return ResidenceLocation
                .state
                .longitude;

        }

        return "";

    }


    /* =========================================================
       لینک فیلم
       ========================================================= */

    function buildVideoUrl(
        residence
    ) {

        if (
            !residence.videoUrl
        ) {
            return "";
        }


        return String(
            residence.videoUrl
        );

    }


    /* =========================================================
       ساخت کارت اقامتگاه
       ========================================================= */

    function createResidenceCard(
        residence
    ) {

        const type =
            getTypeInfo(
                residence
            );


        const name =
            escapeHTML(
                getText(
                    residence.name
                )
            );


        const province =
            escapeHTML(
                getText(
                    residence.province
                )
            );


        const city =
            escapeHTML(
                getText(
                    residence.city
                )
            );


        const region =
            escapeHTML(
                getText(
                    residence.region
                )
            );


        const address =
            escapeHTML(
                getText(
                    residence.address
                )
            );


        const description =
            escapeHTML(
                getText(
                    residence.description
                )
            );


        const image =
            residence.imageUrl
                ? escapeHTML(
                    residence.imageUrl
                )
                : "";


        const video =
            buildVideoUrl(
                residence
            );


        const route =
            buildRouteUrl(
                residence
            );


        const phone =
            residence.phone
                ? String(
                    residence.phone
                )
                : "";


        const website =
            residence.website
                ? String(
                    residence.website
                )
                : "";


        const instagram =
            residence.instagram
                ? String(
                    residence.instagram
                )
                : "";


        const distance =
            residence.distanceText ||
            "";


        let ratingHTML = "";


        if (
            typeof ResidenceRating !==
            "undefined" &&
            ResidenceRating.canShow(
                residence
            )
        ) {

            const rating =
                ResidenceRating.getResidenceRating(
                    residence
                );


            const formatted =
                ResidenceRating.format(
                    rating.average,
                    rating.count,
                    currentLanguage()
                );


            if (
                rating.average > 0
            ) {

                ratingHTML =
                    `
                    <div class="ct-residence-rating">
                        ${escapeHTML(
                            formatted.stars
                        )}
                        <span>
                            ${escapeHTML(
                                String(
                                    formatted.value
                                )
                            )}
                        </span>
                        <small>
                            (${escapeHTML(
                                formatted.countText
                            )})
                        </small>
                    </div>
                    `;

            }

        }


        let imageHTML;


        if (image) {

            imageHTML =
                `
                <img
                    class="ct-residence-image"
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='flex';
                    "
                >
                <div
                    class="ct-residence-image-placeholder"
                    style="display:none"
                    aria-hidden="true"
                >
                    ${type.icon}
                </div>
                `;

        } else {

            imageHTML =
                `
                <div
                    class="ct-residence-image-placeholder"
                    aria-hidden="true"
                >
                    ${type.icon}
                </div>
                `;

        }


        let videoButton = "";


        if (video) {

            videoButton =
                `
                <a
                    class="ct-residence-action video"
                    href="${escapeHTML(video)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🎬 فیلم
                </a>
                `;

        }


        let routeButton = "";


        if (route) {

            routeButton =
                `
                <a
                    class="ct-residence-action route"
                    href="${escapeHTML(route)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🗺️ مسیریابی
                </a>
                `;

        }


        let callButton = "";


        if (phone) {

            callButton =
                `
                <a
                    class="ct-residence-action primary"
                    href="tel:${escapeHTML(phone)}"
                >
                    📞 تماس
                </a>
                `;

        }


        let instagramButton = "";


        if (instagram) {

            instagramButton =
                `
                <a
                    class="ct-residence-action"
                    href="${escapeHTML(instagram)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    📸 اینستاگرام
                </a>
                `;

        }


        let websiteButton = "";


        if (website) {

            websiteButton =
                `
                <a
                    class="ct-residence-action"
                    href="${escapeHTML(website)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🌐 وب‌سایت
                </a>
                `;

        }


        const distanceHTML =
            distance
                ? `
                    <span class="ct-residence-badge ct-residence-distance">
                        📍 ${escapeHTML(distance)}
                    </span>
                  `
                : "";


        return `
            <article
                class="ct-residence-card"
                data-residence-id="${escapeHTML(
                    residence.id || ""
                )}"
            >

                <div class="ct-residence-status">
                    🟢 ${escapeHTML(
                        getStatusText(
                            residence
                        )
                    )}
                </div>

                ${imageHTML}

                <div class="ct-residence-body">

                    <h3 class="ct-residence-title">
                        ${name}
                    </h3>

                    <div class="ct-residence-location">
                        📍
                        ${province}
                        ${city ? " — " + city : ""}
                        ${region ? " — " + region : ""}
                    </div>

                    <div class="ct-residence-meta">

                        <span class="ct-residence-badge">
                            ${type.icon}
                            ${escapeHTML(
                                type.name
                            )}
                        </span>

                        ${distanceHTML}

                    </div>

                    ${ratingHTML}

                    ${
                        description
                            ? `
                            <div class="ct-residence-description">
                                ${description}
                            </div>
                            `
                            : ""
                    }

                    ${
                        address
                            ? `
                            <div class="ct-residence-location">
                                🏠 ${address}
                            </div>
                            `
                            : ""
                    }

                    <div class="ct-residence-actions">

                        ${videoButton}

                        ${routeButton}

                        ${callButton}

                        ${instagramButton}

                        ${websiteButton}

                    </div>

                </div>

            </article>
        `;

    }


    /* =========================================================
       نمایش کارت‌ها
       ========================================================= */

    function renderResidences(
        residences
    ) {

        const grid =
            findElement(
                SELECTORS.residenceGrid
            );


        if (!grid) {
            return;
        }


        grid.innerHTML = "";


        if (
            !Array.isArray(
                residences
            ) ||
            residences.length === 0
        ) {

            renderEmptyState(
                grid
            );

            return;

        }


        /*
         * اطمینان از Grid مناسب
         */

        if (
            !grid.style.display
        ) {

            grid.style.display =
                "grid";

        }


        if (
            !grid.style.gridTemplateColumns
        ) {

            grid.style.gridTemplateColumns =
                "repeat(auto-fit, minmax(280px, 1fr))";

        }


        if (
            !grid.style.gap
        ) {

            grid.style.gap =
                "22px";

        }


        const fragment =
            document.createDocumentFragment();


        residences.forEach(
            function (residence) {

                const wrapper =
                    document.createElement(
                        "div"
                    );


                wrapper.innerHTML =
                    createResidenceCard(
                        residence
                    );


                fragment.appendChild(
                    wrapper.firstElementChild
                );

            }
        );


        grid.appendChild(
            fragment
        );

    }


    /* =========================================================
       حالت بدون نتیجه
       ========================================================= */

    function renderEmptyState(
        grid
    ) {

        const title =
            typeof residenceText ===
            "function"
                ? residenceText(
                    "noResults"
                )
                : "اقامتگاهی با این مشخصات پیدا نشد.";


        grid.innerHTML =
            `
            <div class="ct-residence-empty">

                <div class="ct-residence-empty-icon">
                    🏡
                </div>

                <div class="ct-residence-empty-title">
                    ${escapeHTML(title)}
                </div>

                <button
                    type="button"
                    class="ct-residence-retry"
                    id="ctResidenceRetry"
                >
                    🔄 جستجوی مجدد
                </button>

            </div>
            `;


        const retry =
            document.getElementById(
                "ctResidenceRetry"
            );


        if (retry) {

            retry.addEventListener(
                "click",
                function () {

                    resetSearch();

                }
            );

        }

    }


    /* =========================================================
       نمایش نوار نتیجه
       ========================================================= */

    function renderResultBar(
        count
    ) {

        const resultBar =
            findElement(
                SELECTORS.resultBar
            );


        const resultCount =
            findElement(
                SELECTORS.resultCount
            );


        if (resultCount) {

            resultCount.textContent =
                String(count);

        }


        if (resultBar) {

            resultBar.style.display =
                "block";

            /*
             * اگر resultBar متن قابل تغییر دارد،
             * فقط بخش count را تغییر نمی‌دهیم تا
             * طراحی مادر صفحه خراب نشود.
             */

        }

    }


    /* =========================================================
       اعمال تمام فیلترها
       ========================================================= */

    function applyFilters() {

        let results =
            ResidenceAppState
                .residences
                .slice();


        /*
         * حالت مکان من
         */

        if (
            ResidenceAppState.currentMode ===
            "nearby"
        ) {

            if (
                typeof ResidenceLocation !==
                "undefined" &&
                ResidenceLocation.state &&
                ResidenceLocation.state.available
            ) {

                results =
                    ResidenceLocation.sortByDistance(
                        results
                    );

            }

        } else {

            /*
             * جستجوی معمولی
             */

            if (
                typeof ResidenceSearch !==
                "undefined"
            ) {

                results =
                    ResidenceSearch.filterResidences(
                        results,
                        {
                            query:
                                ResidenceAppState.currentQuery,

                            province:
                                ResidenceAppState.currentProvince,

                            city:
                                ResidenceAppState.currentCity,

                            type:
                                ResidenceAppState.currentType

                        }
                    );

            } else {

                /*
                 * fallback ساده
                 */

                const query =
                    ResidenceAppState
                        .currentQuery
                        .toLowerCase();


                results =
                    results.filter(
                        function (residence) {

                            if (
                                ResidenceAppState
                                    .currentProvince &&
                                getText(
                                    residence.province
                                ) !==
                                ResidenceAppState
                                    .currentProvince
                            ) {
                                return false;
                            }


                            if (
                                ResidenceAppState
                                    .currentCity &&
                                getText(
                                    residence.city
                                ) !==
                                ResidenceAppState
                                    .currentCity
                            ) {
                                return false;
                            }


                            if (
                                ResidenceAppState
                                    .currentType &&
                                residence.type !==
                                ResidenceAppState
                                    .currentType
                            ) {
                                return false;
                            }


                            if (
                                query &&
                                !getText(
                                    residence.name
                                )
                                .toLowerCase()
                                .includes(
                                    query
                                )
                            ) {
                                return false;
                            }


                            return (
                                residence.status ===
                                "active"
                            );

                        }
                    );

            }

        }


        ResidenceAppState
            .filteredResidences =
            results;


        renderResultBar(
            results.length
        );


        renderResidences(
            results
        );

    }


    /* =========================================================
       جستجو
       ========================================================= */

    function handleSearch(
        value
    ) {

        ResidenceAppState
            .currentQuery =
            value || "";


        if (
            ResidenceAppState.currentQuery
        ) {

            ResidenceAppState
                .currentMode =
                "search";

        } else if (
            !ResidenceAppState.currentProvince &&
            !ResidenceAppState.currentCity &&
            !ResidenceAppState.currentType
        ) {

            ResidenceAppState
                .currentMode =
                "all";

        }


        if (
            typeof ResidenceSearch !==
            "undefined"
        ) {

            ResidenceSearch.setQuery(
                value || ""
            );

        }


        applyFilters();

    }


    /* =========================================================
       تغییر استان
       ========================================================= */

    function handleProvinceChange(
        value
    ) {

        ResidenceAppState
            .currentProvince =
            value || "";


        /*
         * با تغییر استان،
         * شهرها دوباره ساخته می‌شوند.
         */

        ResidenceAppState
            .currentCity =
            "";


        populateCities();


        if (
            typeof ResidenceSearch !==
            "undefined"
        ) {

            ResidenceSearch.setProvince(
                value || ""
            );

            ResidenceSearch.setCity(
                ""
            );

        }


        ResidenceAppState
            .currentMode =
            value
                ? "search"
                : "all";


        applyFilters();

    }


    /* =========================================================
       تغییر شهر
       ========================================================= */

    function handleCityChange(
        value
    ) {

        ResidenceAppState
            .currentCity =
            value || "";


        if (
            typeof ResidenceSearch !==
            "undefined"
        ) {

            ResidenceSearch.setCity(
                value || ""
            );

        }


        ResidenceAppState
            .currentMode =
            value
                ? "search"
                : "all";


        applyFilters();

    }


    /* =========================================================
       اتصال رویدادهای جستجو
       ========================================================= */

    function bindSearchEvents() {

        const search =
            findElement(
                SELECTORS.searchInput
            );


        if (search) {

            search.addEventListener(
                "input",
                function () {

                    handleSearch(
                        search.value
                    );

                }
            );


            search.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        handleSearch(
                            search.value
                        );

                    }

                }
            );

        }


        const province =
            findElement(
                SELECTORS.provinceSelect
            );


        if (province) {

            province.addEventListener(
                "change",
                function () {

                    handleProvinceChange(
                        province.value
                    );

                }
            );

        }


        const city =
            findElement(
                SELECTORS.citySelect
            );


        if (city) {

            city.addEventListener(
                "change",
                function () {

                    handleCityChange(
                        city.value
                    );

                }
            );

        }


        const locationButton =
            findElement(
                SELECTORS.locationButton
            );


        if (locationButton) {

            locationButton.addEventListener(
                "click",
                function () {

                    findNearbyResidences();

                }
            );

        }

    }


    /* =========================================================
       مکان من
       ========================================================= */

    async function findNearbyResidences() {

        if (
            typeof ResidenceLocation ===
            "undefined"
        ) {

            alert(
                "امکان دریافت موقعیت مکانی در این نسخه فعال نیست."
            );

            return;

        }


        const button =
            findElement(
                SELECTORS.locationButton
            );


        ResidenceAppState
            .locationLoading =
            true;


        if (button) {

            button.disabled =
                true;

            button.dataset.oldText =
                button.textContent;


            button.textContent =
                typeof residenceText ===
                "function"
                    ? residenceText(
                        "searchingLocation"
                    )
                    : "📍 در حال دریافت مکان شما...";

        }


        try {

            await ResidenceLocation
                .getUserLocation();


            ResidenceAppState
                .currentMode =
                "nearby";


            ResidenceAppState
                .currentQuery =
                "";


            ResidenceAppState
                .currentProvince =
                "";


            ResidenceAppState
                .currentCity =
                "";


            ResidenceAppState
                .currentType =
                "";


            /*
             * پاک کردن ورودی‌ها
             */

            const search =
                findElement(
                    SELECTORS.searchInput
                );


            if (search) {
                search.value = "";
            }


            const province =
                findElement(
                    SELECTORS.provinceSelect
                );


            if (province) {
                province.value = "";
            }


            populateCities();


            const city =
                findElement(
                    SELECTORS.citySelect
                );


            if (city) {
                city.value = "";
            }


            renderCategories();


            applyFilters();


        } catch (error) {

            console.warn(
                "Residence location:",
                error
            );


            const message =
                ResidenceLocation
                    .getErrorMessage(
                        error
                    );


            alert(
                message
            );

        } finally {

            ResidenceAppState
                .locationLoading =
                false;


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    button.dataset.oldText ||
                    (
                        typeof residenceText ===
                        "function"
                            ? residenceText(
                                "myLocation"
                            )
                            : "📍 مکان من"
                    );

            }

        }

    }


    /* =========================================================
       نمایش همه اقامتگاه‌ها
       ========================================================= */

    function showAllResidences() {

        ResidenceAppState
            .currentMode =
            "all";

        ResidenceAppState
            .currentQuery =
            "";

        ResidenceAppState
            .currentProvince =
            "";

        ResidenceAppState
            .currentCity =
            "";

        ResidenceAppState
            .currentType =
            "";


        const search =
            findElement(
                SELECTORS.searchInput
            );


        if (search) {
            search.value = "";
        }


        const province =
            findElement(
                SELECTORS.provinceSelect
            );


        if (province) {
            province.value = "";
        }


        populateCities();


        const city =
            findElement(
                SELECTORS.citySelect
            );


        if (city) {
            city.value = "";
        }


        if (
            typeof ResidenceSearch !==
            "undefined"
        ) {

            ResidenceSearch.selectAll();

        }


        renderCategories();
        applyFilters();

    }


    /* =========================================================
       بازنشانی جستجو
       ========================================================= */

    function resetSearch() {

        showAllResidences();

    }


    /* =========================================================
       تغییر زبان
       ========================================================= */

    function refreshLanguage() {

        populateProvinces();

        populateCities();

        renderCategories();

        applyFilters();

    }


    /* =========================================================
       آماده‌سازی داده‌ها
       ========================================================= */

    function prepareData() {

        ResidenceAppState
            .residences =
            getResidenceData()
                .filter(
                    function (residence) {

                        return (
                            !residence.status ||
                            residence.status ===
                            "active"
                        );

                    }
                );

    }


    /* =========================================================
       راه‌اندازی اصلی
       ========================================================= */

    async function initResidences() {

        if (
            ResidenceAppState.initialized
        ) {
            return;
        }


        ResidenceAppState.loading =
            true;


        /*
         * بارگذاری فایل‌های وابسته
         */

        await ensureDependencies();


        /*
         * استایل‌ها
         */

        injectResidenceStyles();


        /*
         * داده‌ها
         */

        prepareData();


        /*
         * فرم‌ها
         */

        populateProvinces();

        populateCities();


        /*
         * دسته‌بندی‌ها
         */

        renderCategories();


        /*
         * رویدادها
         */

        bindSearchEvents();


        /*
         * نمایش اولیه
         */

        applyFilters();


        ResidenceAppState.loading =
            false;


        ResidenceAppState.initialized =
            true;


        /*
         * اعلام آماده بودن سیستم
         */

        window.dispatchEvent(
            new CustomEvent(
                "cyrusResidencesReady"
            )
        );

    }


    /* =========================================================
       API عمومی
       ========================================================= */

    window.CyrusResidences = {

        state:
            ResidenceAppState,

        init:
            initResidences,

        render:
            renderResidences,

        renderCategories,

        applyFilters,

        search:
            handleSearch,

        showAll:
            showAllResidences,

        reset:
            resetSearch,

        setCategory,

        findNearby:
            findNearbyResidences,

        refreshLanguage,

        getData:
            function () {
                return ResidenceAppState
                    .residences
                    .slice();
            },

        getResults:
            function () {
                return ResidenceAppState
                    .filteredResidences
                    .slice();
            }

    };


    /* =========================================================
       اجرای خودکار
       ========================================================= */

    function startWhenReady() {

        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                function () {

                    initResidences();

                },
                {
                    once: true
                }
            );

        } else {

            initResidences();

        }

    }


    startWhenReady();


})();
