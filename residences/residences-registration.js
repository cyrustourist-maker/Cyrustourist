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

        supportUsername:
            "@Cyrustourist"

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

            subtitle:
                "اقامتگاه خود را معرفی کنید و در سامانه گردشگری سایروس توریست دیده شوید.",

            benefitsTitle:
                "🌟 مزایای ثبت اقامتگاه",

            benefit1:
                "🎬 نمایش فیلم اقامتگاه در سایت و نرم‌افزار سایروس توریست",

            benefit1Desc:
                "لینک فیلم اقامتگاه را ارسال کنید یا در صورت درخواست، تولید فیلم توسط سایروس توریست انجام می‌شود.",

            benefit2:
                "🗺️ مسیریابی",

            benefit2Desc:
                "گردشگران می‌توانند مسیر رسیدن به اقامتگاه را مشاهده کنند.",

            benefit3:
                "📞 تماس مستقیم گردشگر",

            benefit3Desc:
                "امکان تماس مستقیم گردشگر با اقامتگاه در صورت فعال بودن شماره تماس.",

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
                "گردشگران می‌توانند به اقامتگاه از ۱ تا ۵ ستاره امتیاز دهند.",

            rulesTitle:
                "📋 قوانین و شرایط خدمات",

            rules:
                "خدمات سایروس توریست در این بخش صرفاً در چارچوب تبلیغات، معرفی و خدمات دیجیتال و مجازی ارائه می‌شود. در صورت بروز اختلال، محدودیت یا قطعی در زیرساخت‌های اینترنت، مخابرات یا سرویس‌های شخص ثالث که خارج از کنترل سایروس توریست باشد، مسئولیت مستقیم اختلال متوجه سایروس توریست نخواهد بود.",

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

            subtitle:
                "Introduce your accommodation and make it visible on Cyrus Tourist.",

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
                "Tourists can rate the residence from 1 to 5 stars.",

            rulesTitle:
                "📋 Terms and Conditions",

            rules:
                "Cyrus Tourist services in this section are provided solely within the framework of advertising, introduction and digital/virtual services. In the event of disruption, limitation or interruption of internet, telecommunications or third-party services beyond the control of Cyrus Tourist, Cyrus Tourist shall not be directly responsible for such disruption.",

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

            subtitle:
                "عرّف بمكان إقامتك واظهر في منصة سايروس توريست السياحية.",

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
                "يمكن للسياح تقييم مكان الإقامة من نجمة إلى خمس نجوم.",

            rulesTitle:
                "📋 الشروط والأحكام",

            rules:
                "تُقدَّم خدمات سايروس توريست في هذا القسم حصراً ضمن إطار الإعلان والتعريف والخدمات الرقمية والافتراضية. وفي حال حدوث خلل أو تقييد أو انقطاع في خدمات الإنترنت أو الاتصالات أو خدمات الجهات الخارجية الخارجة عن سيطرة سايروس توريست، فلا تتحمل سايروس توريست المسؤولية المباشرة عن هذا الخلل.",

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
                repeat(3,minmax(0,1fr));
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
                            text("title")
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


                    showSupportStep();

                }
            );

        }


        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    showTermsStep();

                }
            );

        }


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
       نمایش مرحله قوانین
       ========================================================= */

    function showTermsStep() {

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

    function openRegistration() {

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

                                    openRegistration();

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
