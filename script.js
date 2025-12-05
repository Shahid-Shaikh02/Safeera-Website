// ✅ GLOBAL iti variable - Fixes "iti is not defined"
let iti = null;
let phoneInput = null;

// DOMContentLoaded for nav + phone input + intl-tel-input
document.addEventListener("DOMContentLoaded", function () {
    // Highlight current nav link
    const links = document.querySelectorAll(".nav-link");
    const currentPage = location.pathname.split("/").pop() || "index.html";
    links.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    // Restrict phone to numeric only
    phoneInput = document.getElementById("phone");
    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            this.value = this.value.replace(/D/g, "");
        });

        // Initialize intl-tel-input (makes iti global)
        iti = window.intlTelInput(phoneInput, {
            initialCountry: "in",
            separateDialCode: true,
            preferredCountries: ["in", "us", "gb"],
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
        });
    }

    // Handle product redirection
    window.openProduct = function (page) {
        window.location.href = page;
    };
});

// ✅ FORM HANDLER - Place OUTSIDE DOMContentLoaded (works on all pages)
const enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        grecaptcha.ready(function() {
            grecaptcha.execute('6Le1TyIsAAAAAC5Iuoq0qL-nN54hPhbHx-lz1fd9', 
                {action: 'submit'}
            ).then(function(token) {
                submitFormWithToken(token);
            }).catch(function(error) {
                console.error('reCAPTCHA error:', error);
                showMessage('reCAPTCHA verification failed', 'red');
            });
        });
    });
}

// ✅ Form submission function
async function submitFormWithToken(token) {
    try {
        // Safe phone handling
        const phoneValue = iti && iti.getNumber() ? iti.getNumber() : (phoneInput ? phoneInput.value : '');
        
        const formData = {
            name: document.getElementById('name').value,
            phone: phoneValue,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            'g-recaptcha-response': token
        };
        
        const response = await fetch('https://formspree.io/f/xzzgzdka', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        showMessage(result.message || 'Form submitted successfully!', 'green');
        enquiryForm.reset();
        if (iti) iti.setCountry('in');
        
    } catch (error) {
        showMessage('Error submitting form: ' + error.message, 'red');
        console.error(error);
    }
}

// ✅ Helper function
function showMessage(text, color) {
    const msgEl = document.getElementById('responseMessage');
    if (msgEl) {
        msgEl.textContent = text;
        msgEl.style.color = color;
    }
}

// Product filter functionality (separate DOMContentLoaded)
document.addEventListener("DOMContentLoaded", () => {
    const catSelect = document.getElementById("catSelect");
    const subSelect = document.getElementById("subSelect");
    const cards = document.querySelectorAll(".product-card");
    
    function applyFilter() {
        const cat = catSelect.value;
        const sub = subSelect.value;
        cards.forEach(card => {
            const cardCat = card.dataset.cat;
            const cardSub = card.dataset.sub || "all";
            const catMatch = (cat === "all") || (cardCat === cat);
            const subMatch = (sub === "all") || (cardSub === sub);
            card.style.display = (catMatch && subMatch) ? "block" : "none";
        });
    }
    
    if (catSelect) {
        catSelect.addEventListener("change", () => {
            const selectedCat = catSelect.value;
            let hasSubOptions = false;
            
            Array.from(subSelect.options).forEach(option => {
                const parent = option.dataset.parent;
                const isGlobal = !parent && option.value === "all";
                if (isGlobal || parent === selectedCat) {
                    option.style.display = "block";
                    if (parent === selectedCat) hasSubOptions = true;
                } else {
                    option.style.display = "none";
                }
            });
            
            subSelect.disabled = !hasSubOptions;
            subSelect.value = "all";
            applyFilter();
        });
    }
    
    if (subSelect) {
        subSelect.addEventListener("change", applyFilter);
    }
    
    applyFilter();
});
