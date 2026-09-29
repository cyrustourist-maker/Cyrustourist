/*
 * ============================================================
 * Cyrus Tourist
 * Residence Registration
 * ============================================================
 *
 * بخش ثبت اقامتگاه
 *
 * مراحل:
 * 1. معرفی مزایا
 * 2. نمایش قوانین و شرایط
 * 3. پذیرش قوانین
 * 4. ادامه
 * 5. ارتباط با پشتیبانی
 *
 * در این مرحله:
 * - بدون Firebase
 * - بدون درگاه پرداخت
 * - بدون ذخیره اطلاعات شخصی
 * - بدون نیاز به API
 *
 * آماده برای اتصال آینده به API سایروس توریست
 * ============================================================
 */

(function () {

    "use strict";


    /* =========================================================
       تنظیمات ثبت اقامتگاه
       ========================================================= */

    const REGISTRATION_CONFIG = {

        supportPhone:
            "09153448818",

        telegram:
            "https://t.me/Cyrustourist",

        whatsapp:
            "https://wa.me/989153448818",

        eitaa:
            "https://eitaa.com/cyrustourist",

        supportUsername:
            "@Cyrustourist"

    };


    /* =========================================================
       دسته‌بندی‌های ثبت‌نام (اقامتگاه، لیدر تور، گردشگری سلامت و ...)
       ========================================================= */

    const REGISTRATION_CATEGORIES = {

        residence: { fa: "اقامتگاه", en: "Residence", ar: "الإقامة" },
        cafe: { fa: "کافه", en: "Cafe", ar: "مقهى" },
        restaurant: { fa: "رستوران", en: "Restaurant", ar: "مطعم" },
        tourleader: { fa: "لیدر تور", en: "Tour Leader", ar: "قائد الجولة" },
        health: { fa: "گردشگری سلامت", en: "Health Tourism", ar: "السياحة العلاجية" },
        agency: { fa: "آژانس مسافرتی", en: "Travel Agency", ar: "وكالة سفر" },
        services: { fa: "خدمات گردشگری", en: "Tourism Services", ar: "خدمات سياحية" },
        handicraft: { fa: "صنایع دستی", en: "Handicrafts", ar: "الصناعات اليدوية" },
        partner: { fa: "همکار گردشگری", en: "Tourism Partner", ar: "شريك سياحي" }

    };


    let CurrentCategory = "residence";


    /* =========================================================
       تنظیمات کارت نمونه (برای مشاهده مالک اقامتگاه)
       ========================================================= */

    const SAMPLE_CARD_CONFIG = {

        videoEmbedUrl:
            "https://www.aparat.com/video/video/embed/videohash/w43c127/vt/frame",

        routeUrl:
            "../index.html#map",

        instagram:
            "https://www.instagram.com/cyrustourist?igsi=aDc3end6dTNqNW1o",

        website:
            "https://cyrustourist-maker.github.io/Cyrustourist/#residence",

        youtube:
            "https://www.youtube.com/@cyrustourist",

        tiktok:
            "https://www.tiktok.com/@cyrustourist",

        aparat:
            "https://www.aparat.com/cyrustourist",

        telegram:
            "https://t.me/Cyrustourist",

        whatsapp:
            "https://wa.me/989153448818",

        eitaa:
            "https://eitaa.com/cyrustourist"

    };


    /* =========================================================
       وضعیت ثبت
       ========================================================= */

    const RegistrationState = {

        opened:
            false,

        accepted:
            false,

        completed:
            false

    };


    /* =========================================================
       متن‌های چندزبانه
       ========================================================= */

    const REGISTRATION_TEXT = {

        fa: {

            title:
                "➕ ثبت اقامتگاه در سایروس توریست",

            titleTemplate:
                "➕ ثبت {cat} در سایروس توریست",

            subtitle:
                "کسب‌وکار یا خدمات گردشگری خود را معرفی کنید و در سامانه گردشگری سایروس توریست دیده شوید.",

            benefitsTitle:
                "🌟 مزایای ثبت‌نام در سایروس توریست",

            benefit1:
                "🎬 نمایش فیلم معرفی در سایت و نرم‌افزار سایروس توریست",

            benefit1Desc:
                "لینک فیلم معرفی خود را ارسال کنید یا در صورت درخواست، تولید فیلم توسط سایروس توریست انجام می‌شود.",

            benefit2:
                "🗺️ مسیریابی",

            benefit2Desc:
                "گردشگران می‌توانند مسیر رسیدن به شما را مشاهده کنند.",

            benefit3:
                "📞 تماس مستقیم گردشگر",

            benefit3Desc:
                "امکان تماس مستقیم گردشگر با شما در صورت فعال بودن شماره تماس.",

            benefit4:
                "📸 نمایش اینستاگرام",

            benefit4Desc:
                "صفحه اینستاگرام اقامتگاه در کارت معرفی نمایش داده می‌شود.",

            benefit5:
                "🌐 نمایش وب‌سایت",

            benefit5Desc:
                "وب‌سایت اقامتگاه می‌تواند در صفحه معرفی قرار گیرد.",

            benefit6:
                "⭐ امتیاز گردشگران",

            benefit6Desc:
                "گردشگران می‌توانند از ۱ تا ۵ ستاره به شما امتیاز دهند.",

            benefit7:
                "📢 حضور در فضای تبلیغاتی سایروس توریست",

            benefit7Desc:
                "معرفی مستمر شما در وب‌سایت، نرم‌افزار و شبکه‌های اجتماعی سایروس توریست در طول دوره عضویت.",

            benefit8:
                "🤝 دیده‌شدن توسط گردشگران بیشتر",

            benefit8Desc:
                "دسترسی گردشگران داخلی و خارجی به اطلاعات و راه‌های ارتباطی شما از طریق یک سامانه واحد.",

            sampleTitle:
                "🏡 نمونه کارت معرفی شما",

            sampleDesc:
                "این یک نمونه از کارت معرفی شماست. برای فیلم معرفی دو روش دارید: ۱. ارسال لینک فیلم شبکه‌های اجتماعی‌تان به پشتیبانی سایروس توریست ۲. سفارش تولید محتوای حرفه‌ای توسط تیم سایروس توریست (حضوری یا دورکاری).",

            sampleRoute:
                "🗺️ مسیریابی (مکان من)",

            sampleCall:
                "📞 تماس مستقیم",

            sampleCallMobile:
                "📱 تلفن همراه",

            sampleCallLandline:
                "☎️ تلفن ثابت",

            sampleCallSupport:
                "🛟 تلفن پشتیبان",

            sampleCallNote:
                "پس از ثبت‌نام آماده به کار است.",

            sampleInstagram:
                "📸 اینستاگرام",

            sampleWebsite:
                "🌐 وب‌سایت",

            sampleYoutube:
                "▶️ یوتیوب",

            sampleTiktok:
                "🎵 تیک‌تاک",

            sampleAparat:
                "▶️ آپارات",

            sampleTelegram:
                "✈️ تلگرام",

            sampleWhatsapp:
                "💬 واتساپ",

            sampleEitaa:
                "💬 ایتا",

            rulesTitle:
                "📋 قوانین و شرایط خدمات",

            rules:
                "ثبت‌نام در سایروس توریست با پرداخت حق عضویت یک‌ساله انجام می‌شود و صرفاً برای حضور در فضای تبلیغاتی سایروس توریست و معرفی شما به کاربران است. این خدمت در چارچوب خدمات دیجیتال، تبلیغاتی و زیرساخت‌های مبتنی بر اینترنت ارائه می‌شود. در صورت اختلال، محدودیت یا قطعی اینترنت، مخابرات یا سرویس‌های شخص ثالث که خارج از کنترل سایروس توریست است، سایروس توریست مسئولیت مستقیمی نخواهد داشت.",

            accept:
                "☐ قوانین و شرایط خدمات سایروس توریست را مطالعه کرده‌ام و می‌پذیرم.",

            continueButton:
                "➡️ ادامه",

            supportTitle:
                "🤝 هماهنگی با پشتیبانی سایروس توریست",

            supportDescription:
                "برای ثبت اطلاعات اقامتگاه و هماهنگی مراحل بعدی، با پشتیبانی سایروس توریست در ارتباط باشید.",

            callSupport:
                "📞 تماس با پشتیبانی",

            telegramSupport:
                "✈️ پشتیبانی تلگرام",

            whatsappSupport:
                "💬 پشتیبانی واتساپ",

            eitaaSupport:
                "💬 پشتیبانی ایتا",

            back:
                "↩ برگشت",

            accepted:
                "✅ قوانین و شرایط پذیرفته شد.",

            supportReady:
                "اکنون می‌توانید برای تکمیل ثبت اقامتگاه با پشتیبانی سایروس توریست هماهنگ کنید."

        },


        en: {

            title:
                "➕ Register a Residence on Cyrus Tourist",

            titleTemplate:
                "➕ Register {cat} on Cyrus Tourist",

            subtitle:
                "Introduce your tourism business or service and make it visible on Cyrus Tourist.",

            benefitsTitle:
                "🌟 Registration Benefits",

            benefit1:
                "🎬 Residence video",

            benefit1Desc:
                "Send your residence video link, or request video production by Cyrus Tourist.",

            benefit2:
                "🗺️ Route navigation",

            benefit2Desc:
                "Tourists can find the route to your residence.",

            benefit3:
                "📞 Direct tourist call",

            benefit3Desc:
                "Tourists can directly contact the residence when a phone number is enabled.",

            benefit4:
                "📸 Instagram",

            benefit4Desc:
                "Your residence Instagram page can be displayed.",

            benefit5:
                "🌐 Website",

            benefit5Desc:
                "Your residence website can be displayed on the profile.",

            benefit6:
                "⭐ Tourist ratings",

            benefit6Desc:
                "Tourists can rate you from 1 to 5 stars.",

            benefit7:
                "📢 Presence in Cyrus Tourist's advertising space",

            benefit7Desc:
                "Ongoing visibility on the Cyrus Tourist website, app and social media during your membership period.",

            benefit8:
                "🤝 Reach more tourists",

            benefit8Desc:
                "Domestic and international tourists can find your information and contact details in one place.",

            sampleTitle:
                "🏡 Sample Listing Card",

            sampleDesc:
                "This is a sample of your listing card. There are two ways to add your video: 1. Send your social media video link to Cyrus Tourist support 2. Order professional content production by the Cyrus Tourist team (in person or remote).",

            sampleRoute:
                "🗺️ Route (My Location)",

            sampleCall:
                "📞 Direct Call",

            sampleCallMobile:
                "📱 Mobile Number",

            sampleCallLandline:
                "☎️ Landline Number",

            sampleCallSupport:
                "🛟 Support Line",

            sampleCallNote:
                "Ready to use after registration.",

            sampleInstagram:
                "📸 Instagram",

            sampleWebsite:
                "🌐 Website",

            sampleYoutube:
                "▶️ YouTube",

            sampleTiktok:
                "🎵 TikTok",

            sampleAparat:
                "▶️ Aparat",

            sampleTelegram:
                "✈️ Telegram",

            sampleWhatsapp:
                "💬 WhatsApp",

            sampleEitaa:
                "💬 Eitaa",

            rulesTitle:
                "📋 Terms and Conditions",

            rules:
                "Registration with Cyrus Tourist is completed by paying a one-year membership fee and is solely for having a presence in the Cyrus Tourist advertising space and being introduced to users. This service is provided within the framework of digital, advertising and internet-based infrastructure services. In the event of disruption, limitation or interruption of internet, telecommunications or third-party services beyond the control of Cyrus Tourist, Cyrus Tourist shall not be directly responsible.",

            accept:
                "☐ I have read and accept the Cyrus Tourist terms and conditions.",

            continueButton:
                "➡️ Continue",

            supportTitle:
                "🤝 Contact Cyrus Tourist Support",

            supportDescription:
                "Contact Cyrus Tourist support to provide your residence information and coordinate the next steps.",

            callSupport:
                "📞 Call Support",

            telegramSupport:
                "✈️ Telegram Support",

            whatsappSupport:
                "💬 WhatsApp Support",

            eitaaSupport:
                "💬 Eitaa Support",

            back:
                "↩ Back",

            accepted:
                "✅ Terms and conditions accepted.",

            supportReady:
                "You can now contact Cyrus Tourist support to complete your residence registration."

        },


        ar: {

            title:
                "➕ تسجيل مكان الإقامة في سايروس توريست",

            titleTemplate:
                "➕ تسجيل {cat} في سايروس توريست",

            subtitle:
                "عرّف بعملك أو خدماتك السياحية واظهر في منصة سايروس توريست السياحية.",

            benefitsTitle:
                "🌟 مزايا التسجيل",

            benefit1:
                "🎬 عرض فيديو مكان الإقامة",

            benefit1Desc:
                "يمكنك إرسال رابط الفيديو أو طلب إنتاج فيديو من سايروس توريست.",

            benefit2:
                "🗺️ الملاحة",

            benefit2Desc:
                "يمكن للسياح مشاهدة الطريق إلى مكان الإقامة.",

            benefit3:
                "📞 اتصال مباشر",

            benefit3Desc:
                "يمكن للسائح الاتصال مباشرة بمكان الإقامة عند تفعيل رقم الهاتف.",

            benefit4:
                "📸 إنستغرام",

            benefit4Desc:
                "يمكن عرض صفحة إنستغرام الخاصة بمكان الإقامة.",

            benefit5:
                "🌐 الموقع الإلكتروني",

            benefit5Desc:
                "يمكن عرض الموقع الإلكتروني لمكان الإقامة.",

            benefit6:
                "⭐ تقييم السياح",

            benefit6Desc:
                "يمكن للسياح تقييمك من نجمة إلى خمس نجوم.",

            benefit7:
                "📢 التواجد في المساحة الإعلانية لسايروس توريست",

            benefit7Desc:
                "ظهور مستمر لك على موقع وتطبيق ووسائل التواصل الاجتماعي لسايروس توريست خلال فترة العضوية.",

            benefit8:
                "🤝 الوصول إلى مزيد من السياح",

            benefit8Desc:
                "يمكن للسياح المحليين والأجانب الوصول إلى معلوماتك وطرق التواصل معك من خلال منصة واحدة.",

            sampleTitle:
                "🏡 نموذج بطاقة التعريف الخاصة بك",

            sampleDesc:
                "هذا نموذج لبطاقة إقامتك. لديك طريقتان لإضافة الفيديو: ١. إرسال رابط فيديو من وسائل التواصل الاجتماعي إلى دعم سايروس توريست ٢. طلب إنتاج محتوى احترافي من فريق سايروس توريست (حضورياً أو عن بُعد).",

            sampleRoute:
                "🗺️ الملاحة (موقعي)",

            sampleCall:
                "📞 اتصال مباشر",

            sampleCallMobile:
                "📱 رقم الجوال",

            sampleCallLandline:
                "☎️ رقم الهاتف الأرضي",

            sampleCallSupport:
                "🛟 خط الدعم",

            sampleCallNote:
                "جاهز للاستخدام بعد التسجيل.",

            sampleInstagram:
                "📸 إنستغرام",

            sampleWebsite:
                "🌐 الموقع الإلكتروني",

            sampleYoutube:
                "▶️ يوتيوب",

            sampleTiktok:
                "🎵 تيك توك",

            sampleAparat:
                "▶️ آپارات",

            sampleTelegram:
                "✈️ تلغرام",

            sampleWhatsapp:
                "💬 واتساب",

            sampleEitaa:
                "💬 ایتا",

            rulesTitle:
                "📋 الشروط والأحكام",

            rules:
                "يتم التسجيل في سايروس توريست عبر دفع رسوم عضوية لمدة سنة واحدة، وهو مخصص حصراً للتواجد في المساحة الإعلانية لسايروس توريست وتعريفكم للمستخدمين. تُقدَّم هذه الخدمة ضمن إطار الخدمات الرقمية والإعلانية والبنى التحتية القائمة على الإنترنت. وفي حال حدوث خلل أو تقييد أو انقطاع في خدمات الإنترنت أو الاتصالات أو خدمات الجهات الخارجية الخارجة عن سيطرة سايروس توريست، فلا تتحمل سايروس توريست مسؤولية مباشرة.",

            accept:
                "☐ لقد قرأت شروط خدمات سايروس توريست وأوافق عليها.",

            continueButton:
                "➡️ متابعة",

            supportTitle:
                "🤝 التواصل مع دعم سايروس توريست",

            supportDescription:
                "تواصل مع دعم سايروس توريست لتقديم معلومات مكان الإقامة وتنسيق الخطوات التالية.",

            callSupport:
                "📞 الاتصال بالدعم",

            telegramSupport:
                "✈️ دعم تيليغرام",

            whatsappSupport:
                "💬 دعم واتساب",

            eitaaSupport:
                "💬 دعم إيتا",

            back:
                "↩ رجوع",

            accepted:
                "✅ تمت الموافقة على الشروط والأحكام.",

            supportReady:
                "يمكنك الآن التواصل مع دعم سايروس توريست لإكمال تسجيل مكان الإقامة."

        }

    };


    /* =========================================================
       زبان
       ========================================================= */

    function getLanguage() {

        if (
            typeof getResidenceLanguage ===
            "function"
        ) {

            return getResidenceLanguage();

        }

        return "fa";

    }


    function text(
        key
    ) {

        const language =
            getLanguage();


        const current =
            REGISTRATION_TEXT[
                language
            ] ||
            REGISTRATION_TEXT.fa;


        return (
            current[key] ||
            REGISTRATION_TEXT.fa[key] ||
            key
        );

    }



    /* =========================================================
       متن‌های فرم ثبت‌نام
       ========================================================= */

    const FORM_TEXT = {
        fa: {
            title: "📝 فرم ثبت‌نام",
            desc: "اطلاعات زیر را تکمیل کنید. فیلدهای ستاره‌دار الزامی هستند.",
            name: "نام کسب‌وکار / اقامتگاه *",
            category: "دسته‌بندی *",
            phone: "شماره تلفن *",
            video: "لینک فیلم معرفی",
            socials: "شبکه‌های اجتماعی (اختیاری)",
            confirm: "اطلاعات واردشده را بررسی کرده‌ام و صحت آن را تأیید می‌کنم. *",
            submit: "✅ تأیید و ارسال",
            back: "↩ برگشت",
            errName: "نام را وارد کنید.",
            errPhone: "شماره تلفن معتبر وارد کنید.",
            errLink: "لینک واردشده معتبر نیست.",
            errConfirm: "تأیید نهایی الزامی است.",
            sendTitle: "ارسال اطلاعات",
            sendDesc: "اطلاعات شما کپی شد. یکی از پیام‌رسان‌ها را باز کنید و پیام را برای پشتیبانی ارسال (paste) کنید.",
            msgHead: "درخواست ثبت‌نام در سایروس توریست"
        },
        en: {
            title: "📝 Registration Form",
            desc: "Please complete the details below. Fields marked * are required.",
            name: "Business / Residence name *",
            category: "Category *",
            phone: "Phone number *",
            video: "Intro video link",
            socials: "Social networks (optional)",
            confirm: "I have reviewed the information and confirm it is correct. *",
            submit: "✅ Confirm and send",
            back: "↩ Back",
            errName: "Please enter the name.",
            errPhone: "Please enter a valid phone number.",
            errLink: "The link is not valid.",
            errConfirm: "Final confirmation is required.",
            sendTitle: "Send your information",
            sendDesc: "Your details were copied. Open a messenger and paste the message to support.",
            msgHead: "Cyrus Tourist registration request"
        },
        ar: {
            title: "📝 نموذج التسجيل",
            desc: "يرجى إكمال البيانات أدناه. الحقول المعلَّمة بـ * إلزامية.",
            name: "اسم النشاط / الإقامة *",
            category: "الفئة *",
            phone: "رقم الهاتف *",
            video: "رابط فيديو التعريف",
            socials: "شبكات التواصل (اختياري)",
            confirm: "لقد راجعت المعلومات وأؤكد صحتها. *",
            submit: "✅ تأكيد وإرسال",
            back: "↩ رجوع",
            errName: "يرجى إدخال الاسم.",
            errPhone: "يرجى إدخال رقم هاتف صحيح.",
            errLink: "الرابط غير صالح.",
            errConfirm: "التأكيد النهائي مطلوب.",
            sendTitle: "إرسال المعلومات",
            sendDesc: "تم نسخ بياناتكم. افتحوا أحد التطبيقات والصقوا الرسالة للدعم.",
            msgHead: "طلب تسجيل في سايروس توريست"
        }
    };

    const FORM_SOCIALS = [
        ["instagram", "اینستاگرام / Instagram"],
        ["website", "وب‌سایت / Website"],
        ["youtube", "یوتیوب / YouTube"],
        ["tiktok", "تیک‌تاک / TikTok"],
        ["aparat", "آپارات / Aparat"],
        ["telegram", "تلگرام / Telegram"],
        ["whatsapp", "واتساپ / WhatsApp"],
        ["eitaa", "ایتا / Eitaa"]
    ];

    function ft(key) {
        const l = getLanguage();
        return (FORM_TEXT[l] || FORM_TEXT.fa)[key] || FORM_TEXT.fa[key] || key;
    }

    function isValidLink(v) {
        if (!v) { return true; }
        try {
            const u = new URL(/^https?:\/\//i.test(v) ? v : "https://" + v);
            return u.hostname.indexOf(".") > 0;
        } catch (e) { return false; }
    }

    function formHTML() {
        const l = getLanguage();
        const cats = Object.keys(REGISTRATION_CATEGORIES).map(function (k) {
            return '<option value="' + k + '"' + (k === CurrentCategory ? " selected" : "") + ">" +
                escapeHTML(REGISTRATION_CATEGORIES[k][l] || REGISTRATION_CATEGORIES[k].fa) + "</option>";
        }).join("");
        const socials = FORM_SOCIALS.map(function (x) {
            return '<label class="ct-form-field"><span>' + escapeHTML(x[1]) +
                '</span><input type="text" dir="ltr" inputmode="url" data-social="' + x[0] +
                '" placeholder="https://"></label>';
        }).join("");
        return '<div id="ctRegistrationFormStep" class="ct-registration-support">' +
            '<h3 class="ct-registration-section-title">' + escapeHTML(ft("title")) + "</h3>" +
            '<p class="ct-form-desc">' + escapeHTML(ft("desc")) + "</p>" +
            '<label class="ct-form-field"><span>' + escapeHTML(ft("name")) + '</span><input type="text" id="ctFormName" maxlength="120"></label>' +
            '<label class="ct-form-field"><span>' + escapeHTML(ft("category")) + '</span><select id="ctFormCategory">' + cats + "</select></label>" +
            '<label class="ct-form-field"><span>' + escapeHTML(ft("phone")) + '</span><input type="tel" dir="ltr" id="ctFormPhone" maxlength="20" placeholder="09xxxxxxxxx"></label>' +
            '<label class="ct-form-field"><span>' + escapeHTML(ft("video")) + '</span><input type="text" dir="ltr" inputmode="url" id="ctFormVideo" placeholder="https://"></label>' +
            '<div class="ct-form-group">' + escapeHTML(ft("socials")) + "</div>" + socials +
            '<label class="ct-registration-check"><input type="checkbox" id="ctFormConfirm"><span>' + escapeHTML(ft("confirm")) + "</span></label>" +
            '<div class="ct-form-error" id="ctFormError" role="alert"></div>' +
            '<div class="ct-registration-actions">' +
            '<button type="button" class="ct-registration-button primary" id="ctFormSubmit">' + escapeHTML(ft("submit")) + "</button>" +
            '<button type="button" class="ct-registration-button secondary" id="ctFormBack">' + escapeHTML(ft("back")) + "</button>" +
            "</div></div>";
    }

    function collectForm() {
        const g = function (id) { const e = document.getElementById(id); return e ? e.value.trim() : ""; };
        const socials = {};
        document.querySelectorAll("#ctRegistrationFormStep [data-social]").forEach(function (i) {
            socials[i.getAttribute("data-social")] = i.value.trim();
        });
        return { name: g("ctFormName"), category: g("ctFormCategory"), phone: g("ctFormPhone"), video: g("ctFormVideo"), socials: socials };
    }

    function buildMessage(d) {
        const l = getLanguage();
        const cat = REGISTRATION_CATEGORIES[d.category] || REGISTRATION_CATEGORIES.residence;
        const lines = [ft("msgHead"), "",
            ft("name").replace(" *", "") + ": " + d.name,
            ft("category").replace(" *", "") + ": " + (cat[l] || cat.fa),
            ft("phone").replace(" *", "") + ": " + d.phone];
        if (d.video) { lines.push(ft("video") + ": " + d.video); }
        FORM_SOCIALS.forEach(function (x) {
            if (d.socials[x[0]]) { lines.push(x[1].split(" / ")[1] + ": " + d.socials[x[0]]); }
        });
        return lines.join("\n");
    }

    function showFormError(msg) {
        const e = document.getElementById("ctFormError");
        if (e) { e.textContent = msg || ""; }
    }

    function submitForm() {
        const d = collectForm();
        const confirmBox = document.getElementById("ctFormConfirm");
        if (!d.name) { return showFormError(ft("errName")); }
        if (d.phone.replace(/\D/g, "").length < 8) { return showFormError(ft("errPhone")); }
        const links = [d.video].concat(Object.keys(d.socials).map(function (k) { return d.socials[k]; }));
        if (!links.every(isValidLink)) { return showFormError(ft("errLink")); }
        if (!confirmBox || !confirmBox.checked) { return showFormError(ft("errConfirm")); }
        showFormError("");

        const message = buildMessage(d);
        RegistrationState.message = message;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(message).catch(function () {});
        }
        const wa = document.querySelector(".ct-support-whatsapp");
        if (wa) {
            wa.href = REGISTRATION_CONFIG.whatsapp + "?text=" + encodeURIComponent(message);
        }
        const desc = document.getElementById("ctSendDesc");
        if (desc) { desc.textContent = ft("sendDesc"); }
        showSupportStep();
    }



    /* =========================================================
       آب‌وهوا (Open-Meteo — بدون کلید و بدون محدودیت منطقه‌ای)
       ========================================================= */

    const WEATHER_TEXT = {
        fa: { chip: "آب‌وهوای موقعیت شما", chipLoading: "در حال دریافت آب‌وهوا…", chipAsk: "نمایش آب‌وهوای موقعیت من", title: "🌤 هواشناسی", back: "↩ برگشت", refresh: "🔄 به‌روزرسانی", feels: "احساس‌شده", humidity: "رطوبت", wind: "باد", kmh: "کیلومتر/ساعت", forecast: "پیش‌بینی روزهای آینده", today: "امروز", yourLocation: "موقعیت شما", errDenied: "دسترسی به موقعیت مکانی داده نشد. اجازه‌ی مکان را در مرورگر فعال کنید.", errUnsupported: "مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.", errFetch: "دریافت اطلاعات آب‌وهوا ممکن نشد. اتصال اینترنت را بررسی کنید.", locale: "fa-IR" },
        en: { chip: "Weather at your location", chipLoading: "Loading weather…", chipAsk: "Show weather at my location", title: "🌤 Weather", back: "↩ Back", refresh: "🔄 Refresh", feels: "Feels like", humidity: "Humidity", wind: "Wind", kmh: "km/h", forecast: "Upcoming days", today: "Today", yourLocation: "Your location", errDenied: "Location access was denied. Allow location in your browser.", errUnsupported: "Your browser does not support geolocation.", errFetch: "Could not load weather. Check your connection.", locale: "en-US" },
        ar: { chip: "طقس موقعك", chipLoading: "جارٍ تحميل الطقس…", chipAsk: "عرض الطقس في موقعي", title: "🌤 الأرصاد الجوية", back: "↩ رجوع", refresh: "🔄 تحديث", feels: "الإحساس", humidity: "الرطوبة", wind: "الرياح", kmh: "كم/س", forecast: "الأيام القادمة", today: "اليوم", yourLocation: "موقعك", errDenied: "تم رفض الوصول إلى الموقع. فعّل إذن الموقع في المتصفح.", errUnsupported: "متصفحك لا يدعم تحديد الموقع.", errFetch: "تعذّر تحميل الطقس. تحقق من الاتصال.", locale: "ar" }
    };

    const WEATHER_CODES = {
        0: ["☀️", { fa: "آفتابی", en: "Clear", ar: "صافٍ" }],
        1: ["🌤", { fa: "عمدتاً صاف", en: "Mostly clear", ar: "صافٍ غالباً" }],
        2: ["⛅", { fa: "کمی ابری", en: "Partly cloudy", ar: "غائم جزئياً" }],
        3: ["☁️", { fa: "ابری", en: "Cloudy", ar: "غائم" }],
        45: ["🌫", { fa: "مه", en: "Fog", ar: "ضباب" }],
        51: ["🌦", { fa: "نم‌نم باران", en: "Drizzle", ar: "رذاذ" }],
        61: ["🌧", { fa: "باران", en: "Rain", ar: "مطر" }],
        66: ["🌧", { fa: "باران یخ‌زده", en: "Freezing rain", ar: "مطر متجمد" }],
        71: ["🌨", { fa: "برف", en: "Snow", ar: "ثلج" }],
        80: ["🌦", { fa: "رگبار", en: "Showers", ar: "زخات" }],
        85: ["🌨", { fa: "رگبار برف", en: "Snow showers", ar: "زخات ثلج" }],
        95: ["⛈", { fa: "رعدوبرق", en: "Thunderstorm", ar: "عاصفة رعدية" }]
    };

    function weatherInfo(code) {
        const keys = [0, 1, 2, 3, 45, 51, 61, 66, 71, 80, 85, 95];
        let k = 0;
        keys.forEach(function (x) { if (code >= x) { k = x; } });
        if (code >= 51 && code <= 57) { k = 51; }
        if (code >= 56 && code <= 57) { k = 66; }
        if (code >= 61 && code <= 65) { k = 61; }
        if (code >= 71 && code <= 77) { k = 71; }
        if (code >= 80 && code <= 82) { k = 80; }
        return WEATHER_CODES[k] || WEATHER_CODES[0];
    }

    function wt(key) {
        const l = getLanguage();
        return (WEATHER_TEXT[l] || WEATHER_TEXT.fa)[key] || WEATHER_TEXT.fa[key] || key;
    }

    const WeatherState = { data: null, place: "", loading: false, error: "" };

    function fetchJSON(url, ms) {
        const c = new AbortController();
        const t = setTimeout(function () { c.abort(); }, ms || 10000);
        return fetch(url, { signal: c.signal }).then(function (r) {
            clearTimeout(t);
            if (!r.ok) { throw new Error("http"); }
            return r.json();
        });
    }

    function getPosition() {
        return new Promise(function (resolve, reject) {
            if (!navigator.geolocation) { return reject(new Error("unsupported")); }
            navigator.geolocation.getCurrentPosition(resolve, function () { reject(new Error("denied")); },
                { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 });
        });
    }

    function loadWeather() {
        if (WeatherState.loading) { return Promise.resolve(); }
        WeatherState.loading = true;
        WeatherState.error = "";
        renderWeatherChip();
        renderWeatherPanel();
        return getPosition().then(function (pos) {
            const lat = pos.coords.latitude.toFixed(4);
            const lon = pos.coords.longitude.toFixed(4);
            const wx = fetchJSON("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
                "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
                "&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4");
            const geo = fetchJSON("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat +
                "&longitude=" + lon + "&localityLanguage=" + (getLanguage() === "ar" ? "ar" : getLanguage() === "en" ? "en" : "fa"), 6000)
                .then(function (g) { return g.city || g.locality || g.principalSubdivision || ""; })
                .catch(function () { return ""; });
            return Promise.all([wx, geo]).then(function (r) {
                WeatherState.data = r[0];
                WeatherState.place = r[1];
            });
        }).catch(function (e) {
            WeatherState.error = e && e.message === "denied" ? "errDenied" :
                e && e.message === "unsupported" ? "errUnsupported" : "errFetch";
        }).then(function () {
            WeatherState.loading = false;
            renderWeatherChip();
            renderWeatherPanel();
        });
    }

    function renderWeatherChip() {
        const chip = document.getElementById("ctWeatherChip");
        if (!chip) { return; }
        const l = getLanguage();
        if (WeatherState.loading) { chip.textContent = "⏳ " + wt("chipLoading"); return; }
        if (WeatherState.data && WeatherState.data.current) {
            const c = WeatherState.data.current;
            const info = weatherInfo(c.weather_code);
            chip.textContent = info[0] + " " + Math.round(c.temperature_2m) + "° · " +
                (WeatherState.place || wt("chip")) + " · " + info[1][l];
            return;
        }
        chip.textContent = "📍 " + wt("chipAsk");
    }

    function closeWeatherPanel() {
        const p = document.getElementById("ctWeatherPanel");
        if (p) { p.remove(); }
    }

    function renderWeatherPanel() {
        const p = document.getElementById("ctWeatherPanel");
        if (!p) { return; }
        const l = getLanguage();
        const nf = new Intl.NumberFormat(wt("locale"));
        let body = "";
        if (WeatherState.loading) {
            body = '<div class="ct-weather-msg">⏳ ' + escapeHTML(wt("chipLoading")) + "</div>";
        } else if (WeatherState.error) {
            body = '<div class="ct-weather-msg">' + escapeHTML(wt(WeatherState.error)) + "</div>";
        } else if (WeatherState.data && WeatherState.data.current) {
            const c = WeatherState.data.current;
            const d = WeatherState.data.daily;
            const info = weatherInfo(c.weather_code);
            let days = "";
            for (let i = 0; i < d.time.length; i++) {
                const di = weatherInfo(d.weather_code[i]);
                const label = i === 0 ? wt("today") :
                    new Date(d.time[i] + "T12:00:00").toLocaleDateString(wt("locale"), { weekday: "long" });
                days += '<div class="ct-weather-day"><span>' + escapeHTML(label) + "</span><span>" + di[0] + "</span><span dir=\"ltr\">" +
                    nf.format(Math.round(d.temperature_2m_max[i])) + "° / " + nf.format(Math.round(d.temperature_2m_min[i])) + "°</span></div>";
            }
            body = '<div class="ct-weather-place">📍 ' + escapeHTML(WeatherState.place || wt("yourLocation")) + "</div>" +
                '<div class="ct-weather-main"><span class="ct-weather-icon">' + info[0] + '</span><span class="ct-weather-temp" dir="ltr">' +
                nf.format(Math.round(c.temperature_2m)) + "°C</span></div>" +
                '<div class="ct-weather-cond">' + escapeHTML(info[1][l]) + "</div>" +
                '<div class="ct-weather-stats"><div><b>' + escapeHTML(wt("feels")) + "</b><span dir=\"ltr\">" + nf.format(Math.round(c.apparent_temperature)) + "°</span></div>" +
                "<div><b>" + escapeHTML(wt("humidity")) + "</b><span dir=\"ltr\">" + nf.format(Math.round(c.relative_humidity_2m)) + "%</span></div>" +
                "<div><b>" + escapeHTML(wt("wind")) + "</b><span>" + nf.format(Math.round(c.wind_speed_10m)) + " " + escapeHTML(wt("kmh")) + "</span></div></div>" +
                '<h4 class="ct-weather-sub">' + escapeHTML(wt("forecast")) + "</h4>" + days;
        }
        p.innerHTML = '<div class="ct-weather-box"><h3 class="ct-registration-section-title">' + escapeHTML(wt("title")) + "</h3>" + body +
            '<div class="ct-registration-actions" style="margin-top:16px">' +
            '<button type="button" class="ct-registration-button secondary" id="ctWeatherBack">' + escapeHTML(wt("back")) + "</button>" +
            '<button type="button" class="ct-registration-button primary" id="ctWeatherRefresh">' + escapeHTML(wt("refresh")) + "</button></div></div>";
        const b = document.getElementById("ctWeatherBack");
        const r = document.getElementById("ctWeatherRefresh");
        if (b) { b.addEventListener("click", closeWeatherPanel); }
        if (r) { r.addEventListener("click", function () { WeatherState.data = null; loadWeather(); }); }
    }

    function openWeatherPanel() {
        const overlay = document.getElementById("cyrusResidenceRegistration");
        if (!overlay) { return; }
        closeWeatherPanel();
        const p = document.createElement("div");
        p.id = "ctWeatherPanel";
        p.className = "ct-weather-panel";
        p.setAttribute("dir", getLanguage() === "en" ? "ltr" : "rtl");
        p.addEventListener("click", function (e) { if (e.target === p) { closeWeatherPanel(); } });
        overlay.appendChild(p);
        renderWeatherPanel();
        if (!WeatherState.data && !WeatherState.loading) { loadWeather(); }
    }

    function initWeather() {
        const chip = document.getElementById("ctWeatherChip");
        if (!chip) { return; }
        chip.addEventListener("click", openWeatherPanel);
        renderWeatherChip();
        if (!WeatherState.data && !WeatherState.loading && !WeatherState.error) { loadWeather(); }
    }


    /* =========================================================
       عنوان پنجره ثبت‌نام بر اساس دسته‌بندی انتخاب‌شده
       ========================================================= */

    function registrationTitle() {

        const language =
            getLanguage();

        const category =
            REGISTRATION_CATEGORIES[CurrentCategory] ||
            REGISTRATION_CATEGORIES.residence;

        const label =
            category[language] ||
            category.fa;

        return text("titleTemplate").replace(
            "{cat}",
            label
        );

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
       استایل
       ========================================================= */

    function injectStyles() {

        if (
            document.getElementById(
                "cyrusResidenceRegistrationStyle"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "cyrusResidenceRegistrationStyle";


        style.textContent = `

        .ct-registration-overlay {
            position:fixed;
            inset:0;
            z-index:99999;
            display:none;
            align-items:center;
            justify-content:center;
            padding:18px;
            background:
                rgba(12,20,35,.72);
            backdrop-filter:
                blur(7px);
        }

        .ct-registration-overlay.open {
            display:flex;
        }

        .ct-registration-modal {
            width:min(920px,100%);
            max-height:92vh;
            overflow-y:auto;
            border-radius:28px;
            background:#fff;
            box-shadow:
                0 25px 80px rgba(0,0,0,.28);
            direction:rtl;
        }

        .ct-registration-header {
            position:relative;
            padding:28px 24px 22px;
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #11998e,
                    #38ef7d,
                    #667eea
                );
        }

        .ct-registration-close {
            position:absolute;
            top:14px;
            left:14px;
            width:38px;
            height:38px;
            border:0;
            border-radius:50%;
            cursor:pointer;
            background:
                rgba(255,255,255,.2);
            color:#fff;
            font-size:20px;
            font-weight:900;
        }

        .ct-registration-header h2 {
            margin:0 45px 8px 0;
            font-size:25px;
            line-height:1.5;
        }

        .ct-registration-header p {
            margin:0;
            opacity:.95;
            line-height:1.9;
            font-size:14px;
        }

        .ct-registration-content {
            padding:22px;
        }

        .ct-registration-section-title {
            margin:0 0 15px;
            font-size:20px;
            font-weight:900;
            color:#202936;
        }

        .ct-sample-card {
            margin-bottom:24px;
            border-radius:20px;
            overflow:hidden;
            border:1px solid #e5edf0;
            background:
                linear-gradient(
                    135deg,
                    #f8fbff,
                    #eef8f5
                );
        }

        .ct-weather-chip {
            display:block; width:100%; border:0; cursor:pointer; padding:10px 14px; font-size:13px; font-weight:900;
            font-family:inherit; color:#0b5f57; background:linear-gradient(135deg,#e3f7f2,#eaf4ff); text-align:center;
            border-bottom:1px solid #d6e9e6;
        }
        .ct-weather-chip:hover { filter:brightness(.97); }
        .ct-weather-panel {
            position:fixed; inset:0; z-index:2147483000; display:flex; align-items:center; justify-content:center;
            padding:16px; background:rgba(15,25,35,.55);
        }
        .ct-weather-box {
            width:100%; max-width:420px; max-height:90vh; overflow:auto; box-sizing:border-box;
            background:#fff; border-radius:22px; padding:20px;
        }
        .ct-weather-place { font-size:14px; font-weight:900; color:#313b46; text-align:center; }
        .ct-weather-main { display:flex; align-items:center; justify-content:center; gap:12px; margin:8px 0 2px; }
        .ct-weather-icon { font-size:52px; }
        .ct-weather-temp { font-size:44px; font-weight:900; color:#11998e; }
        .ct-weather-cond { text-align:center; font-size:14px; font-weight:800; color:#5a6572; margin-bottom:14px; }
        .ct-weather-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
        .ct-weather-stats div { background:#f4f7fa; border-radius:12px; padding:9px 4px; text-align:center; }
        .ct-weather-stats b { display:block; font-size:11px; color:#6b7683; margin-bottom:3px; }
        .ct-weather-stats span { font-size:13px; font-weight:900; color:#25303b; }
        .ct-weather-sub { margin:6px 0; font-size:13px; color:#11998e; }
        .ct-weather-day { display:flex; justify-content:space-between; align-items:center; padding:8px 4px; border-top:1px solid #eef1f4; font-size:13px; font-weight:800; color:#313b46; }
        .ct-weather-msg { text-align:center; padding:24px 8px; font-size:13px; font-weight:800; line-height:2; color:#5a6572; }
        .ct-sample-video {
            position:relative;
            padding-top:56.25%;
            background:#000;
        }

        .ct-sample-video iframe {
            position:absolute;
            inset:0;
            width:100%;
            height:100%;
            border:0;
        }

        .ct-sample-body {
            padding:16px;
        }

        .ct-sample-title {
            margin:0 0 8px;
            font-size:16px;
            font-weight:900;
            color:#1d2935;
        }

        .ct-sample-desc {
            margin:0 0 14px;
            font-size:12.5px;
            line-height:1.9;
            color:#687482;
        }

        .ct-sample-actions {
            display:flex;
            gap:8px;
            flex-wrap:wrap;
            margin-bottom:10px;
        }

        .ct-sample-btn {
            flex:1 1 auto;
            min-width:130px;
            text-align:center;
            padding:11px 10px;
            border-radius:12px;
            font-size:12.5px;
            font-weight:900;
            cursor:pointer;
            border:0;
            text-decoration:none;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            color:#344050;
            background:#edf1f5;
        }

        .ct-sample-btn.call {
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #11998e,
                    #38ef7d
                );
        }

        .ct-sample-call-options {
            display:none;
            gap:8px;
            flex-wrap:wrap;
            margin-bottom:10px;
        }

        .ct-sample-call-options.open {
            display:flex;
        }

        .ct-sample-call-options button {
            flex:1 1 auto;
            min-width:100px;
            padding:10px;
            border-radius:10px;
            border:1px solid #dbe3ea;
            background:#fff;
            color:#344050;
            font-size:12px;
            font-weight:800;
            cursor:pointer;
        }

        .ct-sample-call-note {
            display:none;
            margin-bottom:10px;
            padding:10px 12px;
            border-radius:10px;
            background:#fff7e6;
            color:#8a6d1d;
            font-size:12px;
            font-weight:800;
            text-align:center;
        }

        .ct-sample-call-note.open {
            display:block;
        }

        .ct-sample-links {
            display:flex;
            flex-wrap:wrap;
            gap:8px;
        }

        .ct-sample-link {
            flex:1 1 calc(50% - 8px);
            display:flex;
            align-items:center;
            justify-content:center;
            gap:6px;
            padding:10px;
            border-radius:12px;
            background:#fff;
            border:1px solid #e5edf0;
            color:#344050;
            text-decoration:none;
            font-size:12.5px;
            font-weight:800;
        }

        .ct-registration-benefits {
            display:grid;
            grid-template-columns:
                repeat(2,minmax(0,1fr));
            gap:13px;
            margin-bottom:24px;
        }

        .ct-registration-benefit {
            padding:17px;
            border-radius:18px;
            background:
                linear-gradient(
                    135deg,
                    #f8fbff,
                    #eef8f5
                );
            border:1px solid #e5edf0;
        }

        .ct-registration-benefit-title {
            font-size:15px;
            font-weight:900;
            color:#1d2935;
            line-height:1.7;
        }

        .ct-registration-benefit-description {
            margin-top:6px;
            color:#687482;
            font-size:12px;
            line-height:1.9;
        }

        .ct-registration-rules {
            padding:18px;
            border-radius:18px;
            background:
                #fff9ed;
            border:1px solid #f3dfb3;
            color:#4d4331;
            line-height:2;
            font-size:13px;
            margin-bottom:18px;
        }

        .ct-registration-check {
            display:flex;
            align-items:flex-start;
            gap:10px;
            padding:15px;
            border-radius:15px;
            background:#f4f7fa;
            cursor:pointer;
            user-select:none;
            margin-bottom:18px;
        }

        .ct-registration-check input {
            width:20px;
            height:20px;
            flex:0 0 auto;
            margin-top:2px;
            cursor:pointer;
            accent-color:#11998e;
        }

        .ct-registration-check span {
            font-size:13px;
            font-weight:800;
            line-height:1.9;
            color:#313b46;
        }

        .ct-registration-actions {
            display:flex;
            gap:10px;
            flex-wrap:wrap;
        }

        .ct-registration-button {
            border:0;
            border-radius:14px;
            padding:12px 18px;
            cursor:pointer;
            font-size:14px;
            font-weight:900;
            transition:
                transform .2s ease,
                filter .2s ease,
                opacity .2s ease;
        }

        .ct-registration-button:hover {
            transform:translateY(-2px);
        }

        .ct-registration-button.primary {
            color:#fff;
            background:
                linear-gradient(
                    135deg,
                    #11998e,
                    #38ef7d
                );
        }

        .ct-registration-button.primary:disabled {
            opacity:.45;
            cursor:not-allowed;
            transform:none;
        }

        .ct-registration-button.secondary {
            color:#344050;
            background:#edf1f5;
        }

        .ct-form-desc { font-size:13px; color:#5a6572; line-height:1.9; margin:0 0 14px; }
        .ct-form-field { display:block; margin-bottom:12px; }
        .ct-form-field > span { display:block; font-size:12px; font-weight:800; color:#313b46; margin-bottom:5px; }
        .ct-form-field input, .ct-form-field select {
            width:100%; box-sizing:border-box; padding:11px 13px; font-size:14px; font-family:inherit;
            border:1px solid #d9e0e7; border-radius:12px; background:#fff; color:#25303b;
        }
        .ct-form-field input:focus, .ct-form-field select:focus { outline:2px solid #11998e55; border-color:#11998e; }
        .ct-form-group { font-size:13px; font-weight:900; color:#11998e; margin:16px 0 8px; }
        .ct-form-error { color:#c0392b; font-size:13px; font-weight:800; min-height:18px; margin-bottom:10px; }
        .ct-registration-support {
            display:none;
        }

        .ct-registration-support.active {
            display:block;
        }

        .ct-support-box {
            padding:20px;
            border-radius:20px;
            background:
                linear-gradient(
                    135deg,
                    #f4f8ff,
                    #f4fff9
                );
            border:1px solid #e3eaf0;
        }

        .ct-support-box h3 {
            margin:0 0 8px;
            font-size:21px;
            font-weight:900;
        }

        .ct-support-box p {
            margin:0 0 18px;
            color:#637080;
            font-size:13px;
            line-height:1.9;
        }

        .ct-support-buttons {
            display:grid;
            grid-template-columns:
                repeat(2,minmax(0,1fr));
            gap:10px;
        }

        .ct-support-button {
            min-height:48px;
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:14px;
            text-decoration:none;
            font-size:13px;
            font-weight:900;
            color:#fff;
            transition:
                transform .2s ease;
        }

        .ct-support-button:hover {
            transform:translateY(-2px);
        }

        .ct-support-call {
            background:
                linear-gradient(
                    135deg,
                    #00b09b,
                    #96c93d
                );
        }

        .ct-support-telegram {
            background:
                linear-gradient(
                    135deg,
                    #229ed9,
                    #2aabee
                );
        }

        .ct-support-whatsapp {
            background:
                linear-gradient(
                    135deg,
                    #25d366,
                    #128c7e
                );
        }

        .ct-support-eitaa {
            background:
                linear-gradient(
                    135deg,
                    #5fc9a8,
                    #0f9d78
                );
        }

        .ct-registration-success {
            margin-bottom:16px;
            padding:13px 15px;
            border-radius:14px;
            background:#eafaf1;
            color:#176b43;
            font-size:13px;
            font-weight:800;
            line-height:1.8;
        }

        @media (max-width:650px) {

            .ct-registration-overlay {
                padding:8px;
                align-items:flex-end;
            }

            .ct-registration-modal {
                max-height:94vh;
                border-radius:24px 24px 12px 12px;
            }

            .ct-registration-header {
                padding:24px 17px 19px;
            }

            .ct-registration-header h2 {
                font-size:20px;
                margin-right:38px;
            }

            .ct-registration-content {
                padding:16px;
            }

            .ct-registration-benefits {
                grid-template-columns:1fr;
            }

            .ct-support-buttons {
                grid-template-columns:1fr;
            }

            .ct-registration-actions {
                flex-direction:column;
            }

            .ct-registration-button {
                width:100%;
            }

        }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =========================================================
       ساخت پنجره ثبت اقامتگاه
       ========================================================= */

    function createRegistrationModal() {

        if (
            document.getElementById(
                "cyrusResidenceRegistration"
            )
        ) {

            return;

        }


        const overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "cyrusResidenceRegistration";


        overlay.className =
            "ct-registration-overlay";


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );


        overlay.innerHTML = `

            <div
                class="ct-registration-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ctRegistrationTitle"
            >

                <div class="ct-registration-header">

                    <button
                        type="button"
                        class="ct-registration-close"
                        id="ctRegistrationClose"
                        aria-label="Close"
                    >
                        ×
                    </button>

                    <h2 id="ctRegistrationTitle">
                        ${escapeHTML(
                            registrationTitle()
                        )}
                    </h2>

                    <p>
                        ${escapeHTML(
                            text("subtitle")
                        )}
                    </p>

                </div>


                <div class="ct-registration-content">

                    <div
                        id="ctRegistrationTermsStep"
                    >

                        ${sampleCardHTML()}

                        <h3
                            class="ct-registration-section-title"
                        >
                            ${escapeHTML(
                                text(
                                    "benefitsTitle"
                                )
                            )}
                        </h3>


                        <div
                            class="ct-registration-benefits"
                        >

                            ${benefitHTML(
                                "benefit1",
                                "benefit1Desc"
                            )}

                            ${benefitHTML(
                                "benefit2",
                                "benefit2Desc"
                            )}

                            ${benefitHTML(
                                "benefit3",
                                "benefit3Desc"
                            )}

                            ${benefitHTML(
                                "benefit4",
                                "benefit4Desc"
                            )}

                            ${benefitHTML(
                                "benefit5",
                                "benefit5Desc"
                            )}

                            ${benefitHTML(
                                "benefit6",
                                "benefit6Desc"
                            )}

                            ${benefitHTML(
                                "benefit7",
                                "benefit7Desc"
                            )}

                            ${benefitHTML(
                                "benefit8",
                                "benefit8Desc"
                            )}

                        </div>


                        <h3
                            class="ct-registration-section-title"
                        >
                            ${escapeHTML(
                                text(
                                    "rulesTitle"
                                )
                            )}
                        </h3>


                        <div
                            class="ct-registration-rules"
                        >
                            ${escapeHTML(
                                text("rules")
                            )}
                        </div>


                        <label
                            class="ct-registration-check"
                        >

                            <input
                                type="checkbox"
                                id="ctRegistrationAccept"
                            >

                            <span>
                                ${escapeHTML(
                                    text("accept")
                                )}
                            </span>

                        </label>


                        <div
                            class="ct-registration-actions"
                        >

                            <button
                                type="button"
                                class="ct-registration-button primary"
                                id="ctRegistrationContinue"
                                disabled
                            >
                                ${escapeHTML(
                                    text(
                                        "continueButton"
                                    )
                                )}
                            </button>

                        </div>

                    </div>


                    ${formHTML()}

                    <div
                        id="ctRegistrationSupportStep"
                        class="ct-registration-support"
                    >

                        <div
                            class="ct-registration-success"
                        >
                            ${escapeHTML(
                                text(
                                    "accepted"
                                )
                            )}
                            <br>
                            ${escapeHTML(
                                text(
                                    "supportReady"
                                )
                            )}
                        <br><span id="ctSendDesc"></span>
                        </div>


                        <div
                            class="ct-support-box"
                        >

                            <h3>
                                ${escapeHTML(
                                    text(
                                        "supportTitle"
                                    )
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    text(
                                        "supportDescription"
                                    )
                                )}
                            </p>


                            <div
                                class="ct-support-buttons"
                            >

                                <a
                                    class="ct-support-button ct-support-call"
                                    href="tel:${escapeHTML(
                                        REGISTRATION_CONFIG.supportPhone
                                    )}"
                                >
                                    ${escapeHTML(
                                        text(
                                            "callSupport"
                                        )
                                    )}
                                </a>


                                <a
                                    class="ct-support-button ct-support-telegram"
                                    href="${escapeHTML(
                                        REGISTRATION_CONFIG.telegram
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${escapeHTML(
                                        text(
                                            "telegramSupport"
                                        )
                                    )}
                                </a>


                                <a
                                    class="ct-support-button ct-support-whatsapp"
                                    href="${escapeHTML(
                                        REGISTRATION_CONFIG.whatsapp
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${escapeHTML(
                                        text(
                                            "whatsappSupport"
                                        )
                                    )}
                                </a>


                                <a
                                    class="ct-support-button ct-support-eitaa"
                                    href="${escapeHTML(
                                        REGISTRATION_CONFIG.eitaa
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${escapeHTML(
                                        text(
                                            "eitaaSupport"
                                        )
                                    )}
                                </a>

                            </div>

                        </div>


                        <div
                            class="ct-registration-actions"
                            style="margin-top:15px"
                        >

                            <button
                                type="button"
                                class="ct-registration-button secondary"
                                id="ctRegistrationBack"
                            >
                                ${escapeHTML(
                                    text("back")
                                )}
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        `;


        document.body.appendChild(
            overlay
        );


        bindRegistrationEvents();

    }


    /* =========================================================
       ساخت کارت مزایا
       ========================================================= */

    function benefitHTML(
        titleKey,
        descriptionKey
    ) {

        return `
            <div
                class="ct-registration-benefit"
            >

                <div
                    class="ct-registration-benefit-title"
                >
                    ${escapeHTML(
                        text(titleKey)
                    )}
                </div>

                <div
                    class="ct-registration-benefit-description"
                >
                    ${escapeHTML(
                        text(
                            descriptionKey
                        )
                    )}
                </div>

            </div>
        `;

    }


    /* =========================================================
       ساخت کارت نمونه اقامتگاه
       ========================================================= */

    function sampleCardHTML() {

        return `
            <div class="ct-sample-card">

                <button type="button" class="ct-weather-chip" id="ctWeatherChip">📍</button>

                <div class="ct-sample-video">
                    <iframe
                        src="${escapeHTML(
                            SAMPLE_CARD_CONFIG.videoEmbedUrl
                        )}"
                        allowfullscreen
                        loading="lazy"
                    ></iframe>
                </div>

                <div class="ct-sample-body">

                    <div class="ct-sample-title">
                        ${escapeHTML(
                            text("sampleTitle")
                        )}
                    </div>

                    <p class="ct-sample-desc">
                        ${escapeHTML(
                            text("sampleDesc")
                        )}
                    </p>

                    <div class="ct-sample-actions">

                        <a
                            class="ct-sample-btn"
                            href="${escapeHTML(
                                SAMPLE_CARD_CONFIG.routeUrl
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                text("sampleRoute")
                            )}
                        </a>

                        <button
                            type="button"
                            class="ct-sample-btn call"
                            id="ctSampleCallToggle"
                        >
                            ${escapeHTML(
                                text("sampleCall")
                            )}
                        </button>

                    </div>

                    <div
                        class="ct-sample-call-options"
                        id="ctSampleCallOptions"
                    >

                        <button type="button" class="ct-sample-call-opt">
                            ${escapeHTML(
                                text(
                                    "sampleCallMobile"
                                )
                            )}
                        </button>

                        <button type="button" class="ct-sample-call-opt">
                            ${escapeHTML(
                                text(
                                    "sampleCallLandline"
                                )
                            )}
                        </button>

                        <button type="button" class="ct-sample-call-opt">
                            ${escapeHTML(
                                text(
                                    "sampleCallSupport"
                                )
                            )}
                        </button>

                    </div>

                    <div
                        class="ct-sample-call-note"
                        id="ctSampleCallNote"
                    >
                        ${escapeHTML(
                            text("sampleCallNote")
                        )}
                    </div>

                    <div class="ct-sample-links">

                        <a
                            class="ct-sample-link"
                            href="${escapeHTML(
                                SAMPLE_CARD_CONFIG.instagram
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                text(
                                    "sampleInstagram"
                                )
                            )}
                        </a>

                        <a
                            class="ct-sample-link"
                            href="${escapeHTML(
                                SAMPLE_CARD_CONFIG.website
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                text("sampleWebsite")
                            )}
                        </a>

                        <a
                            class="ct-sample-link"
                            href="${escapeHTML(
                                SAMPLE_CARD_CONFIG.youtube
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                text("sampleYoutube")
                            )}
                        </a>

                        <a
                            class="ct-sample-link"
                            href="${escapeHTML(
                                SAMPLE_CARD_CONFIG.tiktok
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                text("sampleTiktok")
                            )}
                        </a>

                        <a
                            class="ct-sample-link"
                            href="${escapeHTML(
                                SAMPLE_CARD_CONFIG.aparat
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                text("sampleAparat")
                            )}
                        </a>

                        <a
                            class="ct-sample-link"
                            href="${escapeHTML(
                                SAMPLE_CARD_CONFIG.telegram
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                text("sampleTelegram")
                            )}
                        </a>

                        <a
                            class="ct-sample-link"
                            href="${escapeHTML(
                                SAMPLE_CARD_CONFIG.whatsapp
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                text("sampleWhatsapp")
                            )}
                        </a>

                        <a
                            class="ct-sample-link"
                            href="${escapeHTML(
                                SAMPLE_CARD_CONFIG.eitaa
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                text("sampleEitaa")
                            )}
                        </a>

                    </div>

                </div>

            </div>
        `;

    }


    /* =========================================================
       اتصال رویدادها
       ========================================================= */

    function bindRegistrationEvents() {

        const overlay =
            document.getElementById(
                "cyrusResidenceRegistration"
            );


        if (!overlay) {
            return;
        }


        const close =
            document.getElementById(
                "ctRegistrationClose"
            );


        const checkbox =
            document.getElementById(
                "ctRegistrationAccept"
            );


        const continueButton =
            document.getElementById(
                "ctRegistrationContinue"
            );


        const backButton =
            document.getElementById(
                "ctRegistrationBack"
            );


        if (close) {

            close.addEventListener(
                "click",
                closeRegistration
            );

        }


        if (checkbox) {

            checkbox.addEventListener(
                "change",
                function () {

                    RegistrationState.accepted =
                        checkbox.checked;


                    if (
                        continueButton
                    ) {

                        continueButton.disabled =
                            !checkbox.checked;

                    }

                }
            );

        }


        if (continueButton) {

            continueButton.addEventListener(
                "click",
                function () {

                    if (
                        !checkbox ||
                        !checkbox.checked
                    ) {

                        return;

                    }


                    showFormStep();

                }
            );

        }


        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    showFormStep();

                }
            );

        }


        const formSubmit = document.getElementById("ctFormSubmit");
        const formBack = document.getElementById("ctFormBack");
        if (formSubmit) { formSubmit.addEventListener("click", submitForm); }
        if (formBack) { formBack.addEventListener("click", showTermsStep); }

        bindSampleCardEvents();


        /*
         * کلیک روی فضای بیرون پنجره
         */

        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    overlay
                ) {

                    closeRegistration();

                }

            }
        );


        /*
         * کلید Escape
         */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape" &&
                    RegistrationState.opened
                ) {

                    closeRegistration();

                }

            }
        );

    }


    /* =========================================================
       اتصال رویدادهای کارت نمونه
       ========================================================= */

    function bindSampleCardEvents() {
        initWeather();


        const toggle =
            document.getElementById(
                "ctSampleCallToggle"
            );


        const options =
            document.getElementById(
                "ctSampleCallOptions"
            );


        const note =
            document.getElementById(
                "ctSampleCallNote"
            );


        if (toggle && options) {

            toggle.addEventListener(
                "click",
                function () {

                    options.classList.toggle(
                        "open"
                    );


                    if (note) {

                        note.classList.remove(
                            "open"
                        );

                    }

                }
            );

        }


        if (options && note) {

            options
                .querySelectorAll(
                    ".ct-sample-call-opt"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                note.classList.add(
                                    "open"
                                );

                            }
                        );

                    }
                );

        }

    }


    /* =========================================================
       نمایش مرحله قوانین
       ========================================================= */

    function showFormStep() {
        const t = document.getElementById("ctRegistrationTermsStep");
        const f = document.getElementById("ctRegistrationFormStep");
        const sp = document.getElementById("ctRegistrationSupportStep");
        if (t) { t.style.display = "none"; }
        if (sp) { sp.classList.remove("active"); }
        if (f) { f.classList.add("active"); }
        RegistrationState.completed = false;
    }

    function showTermsStep() {
        const _f = document.getElementById("ctRegistrationFormStep");
        if (_f) { _f.classList.remove("active"); }


        const terms =
            document.getElementById(
                "ctRegistrationTermsStep"
            );


        const support =
            document.getElementById(
                "ctRegistrationSupportStep"
            );


        if (terms) {

            terms.style.display =
                "block";

        }


        if (support) {

            support.classList.remove(
                "active"
            );

        }


        RegistrationState.completed =
            false;

    }


    /* =========================================================
       نمایش مرحله پشتیبانی
       ========================================================= */

    function showSupportStep() {
        const _f = document.getElementById("ctRegistrationFormStep");
        if (_f) { _f.classList.remove("active"); }


        const terms =
            document.getElementById(
                "ctRegistrationTermsStep"
            );


        const support =
            document.getElementById(
                "ctRegistrationSupportStep"
            );


        if (terms) {

            terms.style.display =
                "none";

        }


        if (support) {

            support.classList.add(
                "active"
            );

        }


        RegistrationState.completed =
            true;

    }


    /* =========================================================
       باز کردن ثبت اقامتگاه
       ========================================================= */

    function openRegistration(category) {

        if (
            category &&
            REGISTRATION_CATEGORIES[category] &&
            category !== CurrentCategory
        ) {

            CurrentCategory = category;

            const existing =
                document.getElementById(
                    "cyrusResidenceRegistration"
                );

            if (existing) {
                existing.remove();
            }

        }


        createRegistrationModal();


        const overlay =
            document.getElementById(
                "cyrusResidenceRegistration"
            );


        if (!overlay) {
            return;
        }


        showTermsStep();


        overlay.classList.add(
            "open"
        );


        overlay.setAttribute(
            "aria-hidden",
            "false"
        );


        RegistrationState.opened =
            true;


        /*
         * جلوگیری از اسکرول صفحه اصلی
         */

        document.body.dataset
            .ctResidencePreviousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";

    }


    /* =========================================================
       بستن ثبت اقامتگاه
       ========================================================= */

    function closeRegistration() {

        const overlay =
            document.getElementById(
                "cyrusResidenceRegistration"
            );


        if (!overlay) {
            return;
        }


        overlay.classList.remove(
            "open"
        );


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );


        RegistrationState.opened =
            false;


        document.body.style.overflow =
            document.body.dataset
                .ctResidencePreviousOverflow ||
            "";

    }


    /* =========================================================
       اتصال خودکار دکمه ثبت
       ========================================================= */

    function bindOpenButtons() {

        const selectors = [

            "#registerResidenceBtn",

            "#residenceRegistrationBtn",

            "#addResidenceBtn",

            "[data-residence-register]",

            ".register-residence-btn"

        ];


        selectors.forEach(
            function (selector) {

                document
                    .querySelectorAll(
                        selector
                    )
                    .forEach(
                        function (button) {

                            if (
                                button.dataset
                                    .ctRegistrationBound
                            ) {

                                return;

                            }


                            button.dataset
                                .ctRegistrationBound =
                                "true";


                            button.addEventListener(
                                "click",
                                function (event) {

                                    event.preventDefault();

                                    openRegistration(
                                        button.getAttribute(
                                            "data-category"
                                        )
                                    );

                                }
                            );

                        }
                    );

            }
        );

    }


    /* =========================================================
       تازه‌سازی زبان
       ========================================================= */

    function refreshRegistrationLanguage() {

        const overlay =
            document.getElementById(
                "cyrusResidenceRegistration"
            );


        if (!overlay) {
            return;
        }


        /*
         * پنجره را دوباره می‌سازیم تا
         * تمام متن‌ها به زبان جدید تبدیل شوند.
         */

        const wasOpen =
            RegistrationState.opened;


        overlay.remove();


        createRegistrationModal();


        if (wasOpen) {

            const newOverlay =
                document.getElementById(
                    "cyrusResidenceRegistration"
                );


            if (newOverlay) {

                newOverlay.classList.add(
                    "open"
                );

                newOverlay.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }

        }

    }


    /* =========================================================
       API عمومی
       ========================================================= */

    window.CyrusResidenceRegistration = {

        config:
            REGISTRATION_CONFIG,

        state:
            RegistrationState,

        open:
            openRegistration,

        close:
            closeRegistration,

        refreshLanguage:
            refreshRegistrationLanguage

    };


    /* =========================================================
       راه‌اندازی
       ========================================================= */

    function initRegistration() {

        injectStyles();

        createRegistrationModal();

        bindOpenButtons();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initRegistration,
            {
                once: true
            }
        );

    } else {

        initRegistration();

    }


})();
