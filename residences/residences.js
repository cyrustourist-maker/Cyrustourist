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
 * - سه شماره تماس
 * - اینستاگرام
 * - وب‌سایت
 * - طراحی Premium
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
                currentLanguage();


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
       زبان فعلی
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
       داده اقامتگاه‌ها
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
       ========================================================= */

    function loadScript(
        filename
    ) {

        return new Promise(
            function (
                resolve
            ) {

                const existing =
                    document.querySelector(
                        'script[src="' +
                        filename +
                        '"]'
                    );


                if (existing) {

                    setTimeout(
                        resolve,
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


                script.async =
                    false;


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
       استایل Premium
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

        /* =====================================================
           CATEGORY
           ===================================================== */

        .ct-residence-category-row {
            display:flex;
            flex-wrap:wrap;
            gap:10px;
            align-items:center;
            justify-content:center;
            margin:20px 0;
        }

        .ct-residence-category {
            position:relative;
            overflow:hidden;
            border:1px solid rgba(17,153,142,.12);
            border-radius:18px;
            padding:12px 17px;
            cursor:pointer;
            font-size:13px;
            font-weight:900;
            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #eefaf7
                );
            color:#20313a;
            box-shadow:
                0 7px 20px rgba(20,90,90,.09);
            transition:
                transform .22s ease,
                box-shadow .22s ease,
                background .22s ease,
                color .22s ease;
        }

        .ct-residence-category::after {
            content:"";
            position:absolute;
            inset:0;
            background:
                linear-gradient(
                    120deg,
                    transparent,
                    rgba(255,255,255,.65),
                    transparent
                );
            transform:
                translateX(-120%);
            transition:
                transform .5s ease;
        }

        .ct-residence-category:hover::after {
            transform:
                translateX(120%);
        }

        .ct-residence-category:hover {
            transform:
                translateY(-3px);
            box-shadow:
                0 11px 27px rgba(20,90,90,.15);
        }

        .ct-residence-category:active {
            transform:
                scale(.96);
        }

        .ct-residence-category.active {
            color:#fff;
            border-color:transparent;
            background:
                linear-gradient(
                    135deg,
                    #007f78,
                    #16a085,
                    #38c99b
                );
            box-shadow:
                0 10px 28px rgba(0,127,120,.30);
        }


        /* =====================================================
           MORE
           ===================================================== */

        .ct-residence-more {
            border:0;
            border-radius:18px;
            padding:12px 18px;
            cursor:pointer;
            font-weight:900;
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #087f8c,
                    #3859c9
                );
            box-shadow:
                0 9px 25px rgba(56,89,201,.25);
            transition:
                transform .22s ease,
                box-shadow .22s ease;
        }

        .ct-residence-more:hover {
            transform:
                translateY(-3px);
            box-shadow:
                0 13px 30px rgba(56,89,201,.34);
        }

        .ct-residence-more:active {
            transform:
                scale(.96);
        }


        /* =====================================================
           CARD
           ===================================================== */

        .ct-residence-card {
            position:relative;
            overflow:hidden;
            height:100%;
            display:flex;
            flex-direction:column;
            border:1px solid rgba(19,103,96,.10);
            border-radius:26px;
            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #f7fcfa
                );
            box-shadow:
                0 10px 35px rgba(22,76,74,.10);
            transition:
                transform .28s ease,
                box-shadow .28s ease,
                border-color .28s ease;
        }

        .ct-residence-card::before {
            content:"";
            position:absolute;
            top:0;
            left:0;
            right:0;
            height:4px;
            z-index:3;
            background:
                linear-gradient(
                    90deg,
                    #007f78,
                    #38c99b,
                    #f3b33d
                );
        }

        .ct-residence-card:hover {
            transform:
                translateY(-7px);
            border-color:
                rgba(0,127,120,.20);
            box-shadow:
                0 20px 48px rgba(22,76,74,.17);
        }


        /* =====================================================
           IMAGE
           ===================================================== */

        .ct-residence-image {
            width:100%;
            height:215px;
            object-fit:cover;
            display:block;
            background:
                linear-gradient(
                    135deg,
                    #d9f3ed,
                    #fff1cf
                );
            transition:
                transform .45s ease;
        }

        .ct-residence-card:hover
        .ct-residence-image {
            transform:
                scale(1.035);
        }

        .ct-residence-image-placeholder {
            width:100%;
            height:215px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:62px;
            background:
                linear-gradient(
                    135deg,
                    #d9f3ed,
                    #fff0c9,
                    #e6e0ff
                );
        }


        /* =====================================================
           STATUS
           ===================================================== */

        .ct-residence-status {
            position:absolute;
            top:14px;
            right:14px;
            z-index:5;
            border-radius:14px;
            padding:7px 10px;
            color:#14564f;
            background:
                rgba(255,255,255,.90);
            backdrop-filter:
                blur(10px);
            -webkit-backdrop-filter:
                blur(10px);
            border:1px solid
                rgba(255,255,255,.65);
            box-shadow:
                0 7px 20px rgba(0,0,0,.10);
            font-size:11px;
            font-weight:900;
        }


        /* =====================================================
           BODY
           ===================================================== */

        .ct-residence-body {
            padding:18px;
            display:flex;
            flex-direction:column;
            flex:1;
        }

        .ct-residence-title {
            margin:
                0 0 8px;
            font-size:19px;
            font-weight:950;
            line-height:1.55;
            color:#17252d;
        }

        .ct-residence-location {
            color:#5d6b73;
            font-size:13px;
            line-height:1.85;
            margin-bottom:9px;
        }

        .ct-residence-description {
            color:#68777e;
            font-size:13px;
            line-height:1.95;
            margin:
                5px 0 13px;
        }


        /* =====================================================
           META
           ===================================================== */

        .ct-residence-meta {
            display:flex;
            flex-wrap:wrap;
            gap:7px;
            margin:
                5px 0 12px;
        }

        .ct-residence-badge {
            display:inline-flex;
            align-items:center;
            gap:5px;
            border-radius:13px;
            padding:7px 10px;
            background:
                linear-gradient(
                    135deg,
                    #eef8f5,
                    #f7fbfa
                );
            border:1px solid
                rgba(0,127,120,.08);
            font-size:11px;
            font-weight:900;
            color:#42545a;
        }

        .ct-residence-distance {
            color:#007f78;
            background:
                linear-gradient(
                    135deg,
                    #e7faf4,
                    #f3fffb
                );
        }


        /* =====================================================
           RATING
           ===================================================== */

        .ct-residence-rating {
            display:flex;
            align-items:center;
            flex-wrap:wrap;
            gap:6px;
            margin-bottom:11px;
            padding:
                8px 10px;
            border-radius:13px;
            background:
                linear-gradient(
                    135deg,
                    #fff9e8,
                    #fffdf5
                );
            border:1px solid
                rgba(243,179,61,.15);
            color:#7a5a16;
            font-size:13px;
            font-weight:900;
        }

        .ct-residence-rating small {
            color:#8a806c;
            font-size:10px;
            font-weight:700;
        }


        /* =====================================================
           ACTION AREA
           ===================================================== */

        .ct-residence-actions {
            display:grid;
            grid-template-columns:
                repeat(2,minmax(0,1fr));
            gap:8px;
            margin-top:auto;
            padding-top:12px;
        }

        .ct-residence-action {
            position:relative;
            overflow:hidden;
            display:flex;
            align-items:center;
            justify-content:center;
            min-height:44px;
            padding:
                9px 10px;
            border:0;
            border-radius:14px;
            text-decoration:none;
            cursor:pointer;
            font-size:12px;
            font-weight:900;
            color:#26343b;
            background:
                linear-gradient(
                    145deg,
                    #f2f7f6,
                    #eaf1ef
                );
            box-shadow:
                0 5px 15px rgba(35,70,70,.08);
            transition:
                transform .2s ease,
                box-shadow .2s ease,
                filter .2s ease;
        }

        .ct-residence-action::after {
            content:"";
            position:absolute;
            top:0;
            bottom:0;
            left:-70%;
            width:45%;
            background:
                rgba(255,255,255,.40);
            transform:
                skewX(-20deg);
            transition:
                left .45s ease;
        }

        .ct-residence-action:hover::after {
            left:130%;
        }

        .ct-residence-action:hover {
            transform:
                translateY(-2px);
            box-shadow:
                0 9px 20px rgba(35,70,70,.13);
            filter:
                brightness(1.02);
        }

        .ct-residence-action:active {
            transform:
                scale(.96);
        }


        /* =====================================================
           PHONE BUTTONS
           ===================================================== */

        .ct-residence-action.phone-mobile {
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #008f83,
                    #18b98f
                );
            box-shadow:
                0 8px 21px rgba(0,143,131,.25);
        }

        .ct-residence-action.phone-landline {
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #2674d9,
                    #4c9bea
                );
            box-shadow:
                0 8px 21px rgba(38,116,217,.23);
        }

        .ct-residence-action.phone-support {
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #7b4fd4,
                    #a067e8
                );
            box-shadow:
                0 8px 21px rgba(123,79,212,.23);
        }


        /* =====================================================
           VIDEO / ROUTE
           ===================================================== */

        .ct-residence-action.video {
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #ff512f,
                    #dd2476
                );
            box-shadow:
                0 8px 21px rgba(221,36,118,.23);
        }

        .ct-residence-action.route {
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #007f78,
                    #32c79a
                );
            box-shadow:
                0 8px 21px rgba(0,127,120,.23);
        }


        /* =====================================================
           INSTAGRAM / WEBSITE
           ===================================================== */

        .ct-residence-action.instagram {
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #833ab4,
                    #fd1d1d,
                    #fcb045
                );
            box-shadow:
                0 8px 21px rgba(131,58,180,.22);
        }

        .ct-residence-action.website {
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #0066cc,
                    #00a6d6
                );
            box-shadow:
                0 8px 21px rgba(0,102,204,.22);
        }


        /* =====================================================
           EMPTY
           ===================================================== */

        .ct-residence-empty {
            padding:50px 20px;
            text-align:center;
            border-radius:24px;
            background:
                linear-gradient(
                    145deg,
                    #eefaf7,
                    #fff9ed
                );
            border:1px solid
                rgba(0,127,120,.08);
            box-shadow:
                0 10px 30px rgba(20,80,75,.08);
        }

        .ct-residence-empty-icon {
            font-size:55px;
            margin-bottom:10px;
        }

        .ct-residence-empty-title {
            font-size:18px;
            font-weight:950;
            margin-bottom:17px;
            color:#25363c;
        }

        .ct-residence-retry {
            border:0;
            border-radius:15px;
            padding:12px 20px;
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #007f78,
                    #38c99b
                );
            box-shadow:
                0 8px 22px rgba(0,127,120,.25);
            font-weight:900;
            cursor:pointer;
            transition:
                transform .2s ease;
        }

        .ct-residence-retry:hover {
            transform:
                translateY(-2px);
        }


        /* =====================================================
           MORE CATEGORIES
           ===================================================== */

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


        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width:700px) {

            .ct-residence-category-row {
                justify-content:flex-start;
                flex-wrap:nowrap;
                overflow-x:auto;
                padding:
                    5px 3px 12px;
                scrollbar-width:none;
            }

            .ct-residence-category-row::-webkit-scrollbar {
                display:none;
            }

            .ct-residence-category {
                white-space:nowrap;
                flex:0 0 auto;
                min-height:45px;
            }

            .ct-residence-more-categories {
                flex-wrap:nowrap;
                overflow-x:auto;
                justify-content:flex-start;
                scrollbar-width:none;
                padding-bottom:5px;
            }

            .ct-residence-more-categories::-webkit-scrollbar {
                display:none;
            }

            .ct-residence-card {
                border-radius:21px;
            }

            .ct-residence-image,
            .ct-residence-image-placeholder {
                height:195px;
            }

            .ct-residence-body {
                padding:16px;
            }

            .ct-residence-title {
                font-size:18px;
            }

            .ct-residence-action {
                min-height:46px;
                font-size:11px;
            }

        }


        /* =====================================================
           SMALL MOBILE
           ===================================================== */

        @media (max-width:420px) {

            .ct-residence-actions {
                grid-template-columns:
                    1fr;
            }

            .ct-residence-action {
                min-height:47px;
                font-size:12px;
            }

        }


        /* =====================================================
           ACCESSIBILITY
           ===================================================== */

        .ct-residence-action:focus-visible,
        .ct-residence-category:focus-visible,
        .ct-residence-more:focus-visible,
        .ct-residence-retry:focus-visible {
            outline:
                3px solid rgba(243,179,61,.75);
            outline-offset:
                3px;
        }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =========================================================
       دسته‌بندی‌ها
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

                    return (
                        item.featured === true
                    );

                }
            );


        const additional =
            types.filter(
                function (item) {

                    return (
                        item.featured !== true
                    );

                }
            );


        container.innerHTML =
            "";


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
                ? residenceText(
                    "all"
                )
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
                    ? residenceText(
                        "more"
                    )
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
            "undefined" &&
            typeof ResidenceSearch.setType ===
            "function"
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
       استان‌ها
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
            "undefined" &&
            typeof ResidenceSearch.buildProvinceList ===
            "function"
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
                [
                    ...new Set(
                        residences
                            .map(
                                function (item) {

                                    return getText(
                                        item.province
                                    );

                                }
                            )
                            .filter(Boolean)
                    )
                ];

        }


        select.innerHTML =
            "";


        const all =
            document.createElement(
                "option"
            );


        all.value =
            "";


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
       شهرها
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
            "undefined" &&
            typeof ResidenceSearch.buildCityList ===
            "function"
        ) {

            cities =
                ResidenceSearch.buildCityList(
                    ResidenceAppState.residences,
                    ResidenceAppState.currentProvince,
                    language
                );

        }


        if (
            cities.length === 0
        ) {

            cities =
                ResidenceAppState
                    .residences
                    .filter(
                        function (item) {

                            if (
                                !ResidenceAppState
                                    .currentProvince
                            ) {

                                return true;

                            }

                            return (
                                getText(
                                    item.province
                                ) ===
                                ResidenceAppState
                                    .currentProvince
                            );

                        }
                    )
                    .map(
                        function (item) {

                            return getText(
                                item.city
                            );

                        }
                    )
                    .filter(Boolean);


            cities =
                [...new Set(cities)];

        }


        select.innerHTML =
            "";


        const all =
            document.createElement(
                "option"
            );


        all.value =
            "";


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

            select.value =
                "";

        }

    }


    /* =========================================================
       وضعیت
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

                /*
                 * نسخه جدید data از ساختار:
                 * {fa:"...",en:"...",ar:"..."}
                 * استفاده می‌کند.
                 */

                if (
                    typeof item ===
                    "object"
                ) {

                    return (
                        item[
                            currentLanguage()
                        ] ||
                        item.fa ||
                        item.en ||
                        item.ar ||
                        status
                    );

                }

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

                icon:
                    "🏡"

            };

        }


        const item =
            Object.values(
                RESIDENCE_TYPES
            )
            .find(
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

                icon:
                    "🏡"

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
                item.icon ||
                "🏡"

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
       پاک‌سازی URL
       ========================================================= */

    function safeUrl(
        value
    ) {

        if (
            !value
        ) {

            return "";

        }


        const raw =
            String(
                value
            ).trim();


        if (
            !raw
        ) {

            return "";

        }


        /*
         * اجازه URLهای معمول وب
         */

        if (
            /^https?:\/\//i.test(
                raw
            )
        ) {

            return raw;

        }


        /*
         * برای اینستاگرام و سایت‌هایی که
         * بدون https وارد شده‌اند.
         */

        if (
            /^www\./i.test(
                raw
            )
        ) {

            return (
                "https://" +
                raw
            );

        }


        return raw;

    }


    /* =========================================================
       لینک مسیریابی
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


        let from = "";


        if (
            ResidenceLocationAvailable()
        ) {

            const userLat =
                getLocationLatitude();


            const userLng =
                getLocationLongitude();


            if (
                Number.isFinite(
                    Number(userLat)
                ) &&
                Number.isFinite(
                    Number(userLng)
                )
            ) {

                from =
                    userLat +
                    "," +
                    userLng;

            }

        }


        return (
            "https://www.openstreetmap.org/directions" +
            "?from=" +
            encodeURIComponent(
                from
            ) +
            "&to=" +
            encodeURIComponent(
                lat +
                "," +
                lng
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

            return Number(
                ResidenceLocation
                    .state
                    .latitude
            );

        }

        return NaN;

    }


    function getLocationLongitude() {

        if (
            ResidenceLocationAvailable()
        ) {

            return Number(
                ResidenceLocation
                    .state
                    .longitude
            );

        }

        return NaN;

    }


    /* =========================================================
       فیلم
       ========================================================= */

    function buildVideoUrl(
        residence
    ) {

        if (
            !residence.videoUrl
        ) {

            return "";

        }


        return safeUrl(
            residence.videoUrl
        );

    }


    /* =========================================================
       شماره‌های تماس
       ========================================================= */

    function getPhoneFields(
        residence
    ) {

        if (
            typeof getResidencePhoneFields ===
            "function"
        ) {

            return getResidencePhoneFields(
                residence
            );

        }


        /*
         * fallback برای سازگاری با داده‌های
         * قدیمی‌تر
         */

        const result = [];


        if (
            residence.phone
        ) {

            result.push({

                type:
                    "mobile",

                label:
                    {
                        fa:
                            "📞 تماس",
                        en:
                            "📞 Call",
                        ar:
                            "📞 اتصال"
                    },

                value:
                    residence.phone

            });

        }


        return result;

    }


    /* =========================================================
       نمایش شماره تماس
       ========================================================= */

    function renderPhoneButtons(
        residence
    ) {

        const phones =
            getPhoneFields(
                residence
            );


        if (
            !phones.length
        ) {

            return "";

        }


        return phones
            .map(
                function (phone) {

                    const value =
                        String(
                            phone.value ||
                            ""
                        ).trim();


                    if (
                        !value
                    ) {

                        return "";

                    }


                    let className =
                        "phone-mobile";


                    let icon =
                        "📱";


                    if (
                        phone.type ===
                        "landline"
                    ) {

                        className =
                            "phone-landline";

                        icon =
                            "☎️";

                    }


                    if (
                        phone.type ===
                        "support"
                    ) {

                        className =
                            "phone-support";

                        icon =
                            "📞";

                    }


                    const label =
                        phone.label
                            ? getText(
                                phone.label
                            )
                            : "تماس";


                    return `
                        <a
                            class="
                                ct-residence-action
                                ${className}
                            "
                            href="tel:${escapeHTML(
                                value
                            )}"
                            aria-label="${escapeHTML(
                                label
                            )}"
                        >
                            ${icon}
                            ${escapeHTML(
                                label.replace(
                                    /^[^\p{L}\p{N}]*/u,
                                    ""
                                )
                            )}
                        </a>
                    `;

                }
            )
            .join("");

    }


    /* =========================================================
       اینستاگرام
       ========================================================= */

    function buildInstagramButton(
        residence
    ) {

        if (
            !residence.instagram
        ) {

            return "";

        }


        if (
            residence.display &&
            residence.display.showInstagram ===
            false
        ) {

            return "";

        }


        const url =
            safeUrl(
                residence.instagram
            );


        if (
            !url
        ) {

            return "";

        }


        return `
            <a
                class="
                    ct-residence-action
                    instagram
                "
                href="${escapeHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                📸 اینستاگرام
            </a>
        `;

    }


    /* =========================================================
       وب‌سایت
       ========================================================= */

    function buildWebsiteButton(
        residence
    ) {

        if (
            !residence.website
        ) {

            return "";

        }


        if (
            residence.display &&
            residence.display.showWebsite ===
            false
        ) {

            return "";

        }


        const url =
            safeUrl(
                residence.website
            );


        if (
            !url
        ) {

            return "";

        }


        return `
            <a
                class="
                    ct-residence-action
                    website
                "
                href="${escapeHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                🌐 وب‌سایت
            </a>
        `;

    }


    /* =========================================================
       کارت اقامتگاه
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
                    safeUrl(
                        residence.imageUrl
                    )
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


        const distance =
            residence.distanceText ||
            "";


        let ratingHTML =
            "";


        if (
            typeof ResidenceRating !==
            "undefined" &&
            typeof ResidenceRating.canShow ===
            "function" &&
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
                    <div
                        class="ct-residence-rating"
                    >
                        <span>
                            ${escapeHTML(
                                formatted.stars
                            )}
                        </span>

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


        let imageHTML =
            "";


        if (
            image
        ) {

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
                    class="
                        ct-residence-image-placeholder
                    "
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
                    class="
                        ct-residence-image-placeholder
                    "
                    aria-hidden="true"
                >
                    ${type.icon}
                </div>
                `;

        }


        let videoButton =
            "";


        if (
            video &&
            (
                !residence.display ||
                residence.display.showVideo !==
                false
            )
        ) {

            videoButton =
                `
                <a
                    class="
                        ct-residence-action
                        video
                    "
                    href="${escapeHTML(video)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🎬 فیلم
                </a>
                `;

        }


        let routeButton =
            "";


        if (
            route &&
            (
                !residence.display ||
                residence.display.showRoute !==
                false
            )
        ) {

            routeButton =
                `
                <a
                    class="
                        ct-residence-action
                        route
                    "
                    href="${escapeHTML(route)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🗺️ مسیریابی
                </a>
                `;

        }


        const phoneButtons =
            renderPhoneButtons(
                residence
            );


        const instagramButton =
            buildInstagramButton(
                residence
            );


        const websiteButton =
            buildWebsiteButton(
                residence
            );


        const distanceHTML =
            distance
                ? `
                    <span
                        class="
                            ct-residence-badge
                            ct-residence-distance
                        "
                    >
                        📍
                        ${escapeHTML(
                            distance
                        )}
                    </span>
                  `
                : "";


        const statusText =
            getStatusText(
                residence
            );


        return `
            <article
                class="
                    ct-residence-card
                "
                data-residence-id="${escapeHTML(
                    residence.id ||
                    ""
                )}"
            >

                <div
                    class="ct-residence-status"
                >
                    ${escapeHTML(
                        statusText
                    )}
                </div>


                ${imageHTML}


                <div
                    class="ct-residence-body"
                >

                    <h3
                        class="ct-residence-title"
                    >
                        ${name}
                    </h3>


                    <div
                        class="
                            ct-residence-location
                        "
                    >
                        📍
                        ${province}

                        ${
                            city
                                ? " — " +
                                  city
                                : ""
                        }

                        ${
                            region
                                ? " — " +
                                  region
                                : ""
                        }
                    </div>


                    <div
                        class="ct-residence-meta"
                    >

                        <span
                            class="
                                ct-residence-badge
                            "
                        >
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
                                <div
                                    class="
                                        ct-residence-description
                                    "
                                >
                                    ${description}
                                </div>
                              `
                            : ""
                    }


                    ${
                        address
                            ? `
                                <div
                                    class="
                                        ct-residence-location
                                    "
                                >
                                    🏠
                                    ${address}
                                </div>
                              `
                            : ""
                    }


                    <div
                        class="
                            ct-residence-actions
                        "
                    >

                        ${videoButton}

                        ${routeButton}

                        ${phoneButtons}

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


        grid.innerHTML =
            "";


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


        grid.style.display =
            "grid";


        grid.style.gridTemplateColumns =
            "repeat(auto-fit, minmax(280px, 1fr))";


        grid.style.gap =
            "22px";


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


                if (
                    wrapper.firstElementChild
                ) {

                    fragment.appendChild(
                        wrapper.firstElementChild
                    );

                }

            }
        );


        grid.appendChild(
            fragment
        );

    }


    /* =========================================================
       بدون نتیجه
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


        const retryText =
            typeof residenceText ===
            "function"
                ? residenceText(
                    "retry"
                )
                : "🔄 جستجوی مجدد";


        grid.innerHTML =
            `
            <div
                class="
                    ct-residence-empty
                "
            >

                <div
                    class="
                        ct-residence-empty-icon
                    "
                >
                    🏡
                </div>


                <div
                    class="
                        ct-residence-empty-title
                    "
                >
                    ${escapeHTML(
                        title
                    )}
                </div>


                <button
                    type="button"
                    class="
                        ct-residence-retry
                    "
                    id="ctResidenceRetry"
                >
                    ${escapeHTML(
                        retryText
                    )}
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
       نوار نتیجه
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


        if (
            resultCount
        ) {

            resultCount.textContent =
                String(
                    count
                );

        }


        if (
            resultBar
        ) {

            resultBar.style.display =
                "block";

        }

    }


    /* =========================================================
       اعمال فیلترها
       ========================================================= */

    function applyFilters() {

        let results =
            ResidenceAppState
                .residences
                .slice();


        /*
         * حالت نزدیک‌ترین
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

            if (
                typeof ResidenceSearch !==
                "undefined" &&
                typeof ResidenceSearch.filterResidences ===
                "function"
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

                const query =
                    String(
                        ResidenceAppState
                            .currentQuery ||
                        ""
                    )
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
                                !residence.status ||
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
            "undefined" &&
            typeof ResidenceSearch.setQuery ===
            "function"
        ) {

            ResidenceSearch.setQuery(
                value || ""
            );

        }


        applyFilters();

    }


    /* =========================================================
       استان
       ========================================================= */

    function handleProvinceChange(
        value
    ) {

        ResidenceAppState
            .currentProvince =
            value || "";


        ResidenceAppState
            .currentCity =
            "";


        populateCities();


        if (
            typeof ResidenceSearch !==
            "undefined"
        ) {

            if (
                typeof ResidenceSearch.setProvince ===
                "function"
            ) {

                ResidenceSearch.setProvince(
                    value || ""
                );

            }


            if (
                typeof ResidenceSearch.setCity ===
                "function"
            ) {

                ResidenceSearch.setCity(
                    ""
                );

            }

        }


        ResidenceAppState
            .currentMode =
            value
                ? "search"
                : "all";


        applyFilters();

    }


    /* =========================================================
       شهر
       ========================================================= */

    function handleCityChange(
        value
    ) {

        ResidenceAppState
            .currentCity =
            value || "";


        if (
            typeof ResidenceSearch !==
            "undefined" &&
            typeof ResidenceSearch.setCity ===
            "function"
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
       رویدادهای جستجو
       ========================================================= */

    function bindSearchEvents() {

        const search =
            findElement(
                SELECTORS.searchInput
            );


        if (
            search &&
            !search.dataset.ctResidenceBound
        ) {

            search.dataset.ctResidenceBound =
                "true";


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


        if (
            province &&
            !province.dataset.ctResidenceBound
        ) {

            province.dataset.ctResidenceBound =
                "true";


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


        if (
            city &&
            !city.dataset.ctResidenceBound
        ) {

            city.dataset.ctResidenceBound =
                "true";


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


        if (
            locationButton &&
            !locationButton.dataset.ctResidenceBound
        ) {

            locationButton.dataset.ctResidenceBound =
                "true";


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


        if (
            button
        ) {

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


            const search =
                findElement(
                    SELECTORS.searchInput
                );


            if (
                search
            ) {

                search.value =
                    "";

            }


            const province =
                findElement(
                    SELECTORS.provinceSelect
                );


            if (
                province
            ) {

                province.value =
                    "";

            }


            populateCities();


            const city =
                findElement(
                    SELECTORS.citySelect
                );


            if (
                city
            ) {

                city.value =
                    "";

            }


            renderCategories();


            applyFilters();

        } catch (
            error
        ) {

            console.warn(
                "Residence location:",
                error
            );


            const message =
                typeof ResidenceLocation
                    .getErrorMessage ===
                    "function"
                        ? ResidenceLocation
                            .getErrorMessage(
                                error
                            )
                        : (
                            typeof residenceText ===
                            "function"
                                ? residenceText(
                                    "locationError"
                                )
                                : "دریافت موقعیت مکانی با خطا روبه‌رو شد."
                        );


            alert(
                message
            );

        } finally {

            ResidenceAppState
                .locationLoading =
                false;


            if (
                button
            ) {

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
       نمایش همه
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


        if (
            search
        ) {

            search.value =
                "";

        }


        const province =
            findElement(
                SELECTORS.provinceSelect
            );


        if (
            province
        ) {

            province.value =
                "";

        }


        populateCities();


        const city =
            findElement(
                SELECTORS.citySelect
            );


        if (
            city
        ) {

            city.value =
                "";

        }


        if (
            typeof ResidenceSearch !==
            "undefined" &&
            typeof ResidenceSearch.selectAll ===
            "function"
        ) {

            ResidenceSearch.selectAll();

        }


        renderCategories();

        applyFilters();

    }


    /* =========================================================
       بازنشانی
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
       راه‌اندازی
       ========================================================= */

    async function initResidences() {

        if (
            ResidenceAppState.initialized
        ) {

            return;

        }


        ResidenceAppState.loading =
            true;


        await ensureDependencies();


        injectResidenceStyles();


        prepareData();


        populateProvinces();

        populateCities();


        renderCategories();


        bindSearchEvents();


        applyFilters();


        ResidenceAppState.loading =
            false;


        ResidenceAppState.initialized =
            true;


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

        renderCategories:
            renderCategories,

        applyFilters:
            applyFilters,

        search:
            handleSearch,

        showAll:
            showAllResidences,

        reset:
            resetSearch,

        setCategory:
            setCategory,

        findNearby:
            findNearbyResidences,

        refreshLanguage:
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
                    once:true
                }
            );

        } else {

            initResidences();

        }

    }


    startWhenReady();


})();
