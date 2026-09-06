document.addEventListener('DOMContentLoaded', () => {
    // Scroll animation observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));

    // Language Toggle Logic
    const langToggleBtn = document.getElementById('langToggle');
    let currentLang = localStorage.getItem('alnada_lang') || 'ar';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('alnada_lang', lang);
        
        // Ensure html root attributes are updated and protected
        document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('translate', 'no');
        document.documentElement.classList.add('notranslate');

        if (langToggleBtn) {
            langToggleBtn.textContent = lang === 'en' ? 'عربي' : 'English';
            langToggleBtn.setAttribute('translate', 'no');
            langToggleBtn.classList.add('notranslate');
        }

        // Translate standard elements with data-ar and data-en
        document.querySelectorAll('[data-ar]').forEach(el => {
            const textAr = el.getAttribute('data-ar');
            const textEn = el.getAttribute('data-en');
            const targetText = lang === 'en' ? textEn : textAr;
            
            if (targetText) {
                // Prevent translation engine conflicts by setting inner text cleanly
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = targetText;
                } else {
                    el.textContent = targetText;
                }
            }
        });

        // Translate placeholders explicitly defined with data-placeholder-ar
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            const phAr = el.getAttribute('data-placeholder-ar');
            const phEn = el.getAttribute('data-placeholder-en');
            const targetPh = lang === 'en' ? phEn : phAr;
            if (targetPh) {
                el.placeholder = targetPh;
            }
        });

        // Translate select options safely
        document.querySelectorAll('select option').forEach(opt => {
            const optAr = opt.getAttribute('data-ar');
            const optEn = opt.getAttribute('data-en');
            const targetOpt = lang === 'en' ? optEn : optAr;
            if (targetOpt) {
                opt.textContent = targetOpt;
            }
        });
    }

    // Initialize language on load
    setLanguage(currentLang);

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'ar' ? 'en' : 'ar');
        });
    }

    // Booking Form Validation and WhatsApp mapping
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const treatmentSelect = document.getElementById('treatment');
            const treatment = treatmentSelect.options[treatmentSelect.selectedIndex].text;
            const date = document.getElementById('date').value;
            const notes = document.getElementById('notes').value.trim();

            if (!fullName || !phone) {
                alert(currentLang === 'en' ? 'Please fill in your full name and phone number.' : 'يرجى إدخال الاسم بالكامل ورقم الهاتف.');
                return;
            }

            const phoneRegex = /^[0-9+\s-]{8,15}$/;
            if (!phoneRegex.test(phone)) {
                alert(currentLang === 'en' ? 'Please enter a valid phone number.' : 'يرجى إدخال رقم هاتف صحيح.');
                return;
            }

            const message = currentLang === 'en' 
                ? `Hello, I would like to book an appointment:\n- Name: ${fullName}\n- Phone: ${phone}\n- Treatment: ${treatment}\n- Preferred Date: ${date}\n- Notes: ${notes}`
                : `مرحباً، أرغب في حجز موعد:\n- الاسم: ${fullName}\n- الهاتف: ${phone}\n- نوع العلاج: ${treatment}\n- التاريخ المفضل: ${date}\n- الملاحظات: ${notes}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/201500818332?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }
});