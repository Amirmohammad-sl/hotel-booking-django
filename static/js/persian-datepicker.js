/**
 * تقویم هوشمند شمسی (Jalali Datepicker)
 * بدون هیچ وابستگی خارجی - کاملاً مستقل، سازگار با راست‌چین و بوت‌استرپ
 */
(function () {
    const PERSIAN_MONTHS = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];

    const PERSIAN_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

    function toPersianDigits(str) {
        const p = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(str).replace(/[0-9]/g, function (w) { return p[+w]; });
    }

    function toEnglishDigits(str) {
        if (!str) return '';
        const p = {'۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'};
        return String(str).replace(/[۰-۹]/g, function (w) { return p[w]; });
    }

    // تبدیل جلالی به میلادی
    function jalaliToGregorian(jy, jm, jd) {
        let gy = jy <= 979 ? 621 : 1600;
        jy -= jy <= 979 ? 0 : 979;
        let days = (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
        gy += 400 * Math.floor(days / 146097);
        days %= 146097;
        if (days > 36524) {
            gy += 100 * Math.floor(--days / 36524);
            days %= 36524;
            if (days >= 365) days++;
        }
        gy += 4 * Math.floor(days / 1461);
        days %= 1461;
        if (days > 365) {
            gy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }
        let gd = days + 1;
        let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let gm = 0;
        for (gm = 0; gm < 13; gm++) {
            let v = sal_a[gm];
            if (gd <= v) break;
            gd -= v;
        }
        return [gy, gm, gd];
    }

    // تبدیل میلادی به جلالی
    function gregorianToJalali(gy, gm, gd) {
        const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let jy = gy <= 1600 ? 0 : 979;
        gy -= gy <= 1600 ? 621 : 1600;
        let gy2 = gm > 2 ? gy + 1 : gy;
        let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
        jy += 33 * Math.floor(days / 12053);
        days %= 12053;
        jy += 4 * Math.floor(days / 1461);
        days %= 1461;
        if (days > 365) {
            jy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }
        let jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
        let jd = 1 + (days < 186 ? (days % 31) : ((days - 186) % 30));
        return [jy, jm, jd];
    }

    function isJalaliLeapYear(jy) {
        const [g1y, g1m, g1d] = jalaliToGregorian(jy, 1, 1);
        const [g2y, g2m, g2d] = jalaliToGregorian(jy + 1, 1, 1);
        const diff = (new Date(g2y, g2m - 1, g2d) - new Date(g1y, g1m - 1, g1d)) / (1000 * 60 * 60 * 24);
        return diff === 366;
    }

    function getDaysInJalaliMonth(jy, jm) {
        if (jm <= 6) return 31;
        if (jm <= 11) return 30;
        return isJalaliLeapYear(jy) ? 30 : 29;
    }

    // محاسبه روز هفته برای ۱ هر ماه شمسی (شنبه = 0، جمعه = 6)
    function getFirstDayOfWeekInJalaliMonth(jy, jm) {
        const [gy, gm, gd] = jalaliToGregorian(jy, jm, 1);
        const d = new Date(gy, gm - 1, gd);
        // روز میلادی: 0 یکشنبه، 6 شنبه -> در ایران شنبه 0 است
        const day = d.getDay();
        return (day + 1) % 7;
    }

    // تاریخ امروز به شمسی
    function getTodayJalali() {
        const now = new Date();
        return gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    // ایجاد المان واحد تقویم
    let calendarEl = null;
    let activeInput = null;
    let viewYear = 1403;
    let viewMonth = 1;

    function createCalendarDOM() {
        if (calendarEl) return;
        calendarEl = document.createElement('div');
        calendarEl.className = 'jdp-calendar';
        calendarEl.innerHTML = `
            <div class="jdp-header">
                <button type="button" class="jdp-nav-btn" id="jdpNextMonth" title="ماه بعد"><i class="fa-solid fa-chevron-right"></i></button>
                <div class="jdp-title" id="jdpTitle"></div>
                <button type="button" class="jdp-nav-btn" id="jdpPrevMonth" title="ماه قبل"><i class="fa-solid fa-chevron-left"></i></button>
            </div>
            <div class="jdp-weekdays">
                ${PERSIAN_WEEKDAYS.map(w => `<span>${w}</span>`).join('')}
            </div>
            <div class="jdp-days" id="jdpDaysContainer"></div>
            <div class="jdp-footer">
                <button type="button" class="jdp-today-btn" id="jdpGoToday">امروز</button>
                <button type="button" class="jdp-today-btn text-danger" id="jdpClose">بستن</button>
            </div>
        `;
        document.body.appendChild(calendarEl);

        calendarEl.querySelector('#jdpPrevMonth').addEventListener('click', (e) => {
            e.stopPropagation();
            viewMonth--;
            if (viewMonth < 1) {
                viewMonth = 12;
                viewYear--;
            }
            renderMonth();
        });

        calendarEl.querySelector('#jdpNextMonth').addEventListener('click', (e) => {
            e.stopPropagation();
            viewMonth++;
            if (viewMonth > 12) {
                viewMonth = 1;
                viewYear++;
            }
            renderMonth();
        });

        calendarEl.querySelector('#jdpGoToday').addEventListener('click', (e) => {
            e.stopPropagation();
            const [ty, tm, td] = getTodayJalali();
            selectDate(ty, tm, td);
        });

        calendarEl.querySelector('#jdpClose').addEventListener('click', (e) => {
            e.stopPropagation();
            hideCalendar();
        });

        calendarEl.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        document.addEventListener('click', (e) => {
            if (calendarEl.classList.contains('show') && e.target !== activeInput && !calendarEl.contains(e.target)) {
                hideCalendar();
            }
        });
    }

    function renderMonth() {
        const titleEl = calendarEl.querySelector('#jdpTitle');
        const daysContainer = calendarEl.querySelector('#jdpDaysContainer');
        titleEl.textContent = `${PERSIAN_MONTHS[viewMonth - 1]} ${toPersianDigits(viewYear)}`;

        daysContainer.innerHTML = '';

        const startWeekday = getFirstDayOfWeekInJalaliMonth(viewYear, viewMonth);
        const daysInMonth = getDaysInJalaliMonth(viewYear, viewMonth);
        const [todayY, todayM, todayD] = getTodayJalali();

        let selectedY = null, selectedM = null, selectedD = null;
        if (activeInput && activeInput.value) {
            const parts = toEnglishDigits(activeInput.value).replace(/-/g, '/').split('/');
            if (parts.length === 3) {
                selectedY = parseInt(parts[0]);
                selectedM = parseInt(parts[1]);
                selectedD = parseInt(parts[2]);
            }
        }

        // خانه‌های خالی قبل از شروع روز اول ماه
        for (let i = 0; i < startWeekday; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'jdp-day jdp-empty';
            daysContainer.appendChild(emptyEl);
        }

        // روزهای ماه
        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'jdp-day';
            dayEl.textContent = toPersianDigits(d);

            if (viewYear === todayY && viewMonth === todayM && d === todayD) {
                dayEl.classList.add('jdp-today');
            }
            if (viewYear === selectedY && viewMonth === selectedM && d === selectedD) {
                dayEl.classList.add('jdp-selected');
            }

            dayEl.addEventListener('click', () => {
                selectDate(viewYear, viewMonth, d);
            });

            daysContainer.appendChild(dayEl);
        }
    }

    function selectDate(jy, jm, jd) {
        if (!activeInput) return;
        const formatted = `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
        activeInput.value = formatted;
        activeInput.dispatchEvent(new Event('input', { bubbles: true }));
        activeInput.dispatchEvent(new Event('change', { bubbles: true }));
        hideCalendar();
    }

    function showCalendarFor(input) {
        createCalendarDOM();
        activeInput = input;

        // تعیین ماه اولیه نمایش بر اساس مقدار فیلد یا امروز
        if (input.value) {
            const parts = toEnglishDigits(input.value).replace(/-/g, '/').split('/');
            if (parts.length === 3 && parseInt(parts[0]) > 1300 && parseInt(parts[0]) < 1500) {
                viewYear = parseInt(parts[0]);
                viewMonth = parseInt(parts[1]);
            } else {
                const [ty, tm] = getTodayJalali();
                viewYear = ty;
                viewMonth = tm;
            }
        } else {
            const [ty, tm] = getTodayJalali();
            viewYear = ty;
            viewMonth = tm;
        }

        renderMonth();

        // محاسبه موقعیت نمایش
        const rect = input.getBoundingClientRect();
        const top = rect.bottom + window.scrollY + 6;
        let left = rect.right + window.scrollX - 290; // Align to right in RTL
        if (left < 10) left = 10;

        calendarEl.style.top = `${top}px`;
        calendarEl.style.left = `${left}px`;
        calendarEl.classList.add('show');
    }

    function hideCalendar() {
        if (calendarEl) {
            calendarEl.classList.remove('show');
        }
        activeInput = null;
    }

    function initDatepickers() {
        createCalendarDOM();
        const inputs = document.querySelectorAll('.jalali-datepicker, input[data-jdp], input[name="check_in"], input[name="check_out"], input[name="valid_from"], input[name="valid_to"]');
        inputs.forEach(input => {
            if (input.dataset.jdpAttached) return;
            input.dataset.jdpAttached = "true";
            
            // در صورت داشتن type="date"، آن را به text تغییر می‌دهیم تا تقویم شمسی کار کند
            if (input.type === 'date') {
                input.type = 'text';
            }
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('dir', 'ltr');
            input.style.textAlign = 'center';

            input.addEventListener('focus', () => showCalendarFor(input));
            input.addEventListener('click', (e) => {
                e.stopPropagation();
                showCalendarFor(input);
            });
        });
    }

    window.JalaliUtils = {
        toEnglishDigits,
        toPersianDigits,
        jalaliToGregorian,
        gregorianToJalali,
        getTodayJalali,
        initDatepickers
    };

    document.addEventListener('DOMContentLoaded', initDatepickers);
})();
