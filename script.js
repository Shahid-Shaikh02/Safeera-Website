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

// Handler
if (enquiryForm) {
    enquiryForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        try {
            // Create FormData (NO JSON.stringify)
            const formData = new FormData();
            formData.append('name', document.getElementById("name").value);
            formData.append('phone', iti ? iti.getNumber() : phoneInput.value);
            formData.append('email', document.getElementById("email").value);
            formData.append('subject', document.getElementById("subject").value);
            formData.append('message', document.getElementById("message").value);

            // Send to Formspree WITHOUT JSON header
            const response = await fetch('https://formspree.io/f/xzzgzdka', {
                method: 'POST',
                body: formData
                // DO NOT ADD Content-Type header
            });

            // Check if successful
            if (response.status === 200 || response.status === 302 || response.redirected) {
                document.getElementById("responseMessage").textContent = '✅ Form submitted successfully! We will contact you soon.';
                document.getElementById("responseMessage").style.color = 'green';
                enquiryForm.reset();
                if (iti) iti.setCountry("in");
            } else {
                throw new Error('Server error: ' + response.status);
            }
            
        } catch (error) {
            document.getElementById("responseMessage").textContent = '❌ Error submitting form: ' + error.message;
            document.getElementById("responseMessage").style.color = 'red';
            console.error(error);
        }
    });
}

// ✅ Form submission function
// ✅ FIXED: Formspree-compatible submission
async function submitFormWithToken(token) {
    try {
        // Safe phone handling
        const phoneValue = iti && iti.getNumber() ? iti.getNumber() : (phoneInput ? phoneInput.value : '');
        
        // ✅ FIXED: Use FormData instead of JSON
        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('phone', phoneValue);
        formData.append('email', document.getElementById('email').value);
        formData.append('subject', document.getElementById('subject').value);
        formData.append('message', document.getElementById('message').value);
        formData.append('g-recaptcha-response', token);
        
        const response = await fetch('https://formspree.io/f/xzzgzdka', {
            method: 'POST',
            body: formData  // ✅ No Content-Type header (Formspree auto-detects)
        });
        
        // ✅ Check actual response status
        if (response.ok) {
            showMessage('Form submitted successfully! We will contact you soon.', 'green');
            document.getElementById('enquiryForm').reset();
            if (iti) iti.setCountry('in');
        } else {
            const errorText = await response.text();
            throw new Error('Server error: ' + response.status + ' - ' + errorText);
        }
        
    } catch (error) {
        showMessage('Error submitting form: ' + error.message, 'red');
        console.error('Form submission error:', error);
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





