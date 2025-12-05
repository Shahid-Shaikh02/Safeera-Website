document.addEventListener("DOMContentLoaded", function () {
  // Highlight current nav link
  const links = document.querySelectorAll(".nav-link");
  const currentPage = location.pathname.split("/").pop() || "index.html"; // Default to index.html if no specific page

  links.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Restrict phone to numeric only
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
    });
  }

  // Initialize intl-tel-input
  let iti;
  if (phoneInput) {
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


document.addEventListener("DOMContentLoaded", () => {
  const catSelect = document.getElementById("catSelect");
  const subSelect = document.getEleme
  
  // Handle enquiry form submission with reCAPTCHA v3 - FIXED
const enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ✅ FIXED: Proper grecaptcha.ready() callback chaining
        grecaptcha.ready(function() {
            grecaptcha.execute('6Le1TyIsAAAAAC5Iuoq0qL-nN54hPhbHx-lz1fd9', 
                {action: 'submit'}
            ).then(function(token) {
                // Token received - submit form
                submitFormWithToken(token);
            }).catch(function(error) {
                console.error('reCAPTCHA error:', error);
                document.getElementById('responseMessage').textContent = 'reCAPTCHA verification failed';
                document.getElementById('responseMessage').style.color = 'red';
            });
        });
    });
}

// Separate function to submit form data
async function submitFormWithToken(token) {
    try {
        const formData = {
            name: document.getElementById('name').value,
            phone: iti ? iti.getNumber() : document.getElementById('phone').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            'g-recaptcha-response': token  // ✅ Token included
        };
        
        const response = await fetch('https://formspree.io/f/xzzgzdka', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        document.getElementById('responseMessage').textContent = result.message || 'Form submitted successfully!';
        document.getElementById('responseMessage').style.color = 'green';
        document.getElementById('enquiryForm').reset();
        if (iti) iti.setCountry('in');
        
    } catch (error) {
        document.getElementById('responseMessage').textContent = 'Error submitting form: ' + error.message;
        document.getElementById('responseMessage').style.color = 'red';
        console.error(error);
    }
}ntById("subSelect");
  const cards     = document.querySelectorAll(".product-card");

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

  catSelect.addEventListener("change", () => {
    const selectedCat = catSelect.value;

    // Enable subSelect only if options exist for selected category
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
    subSelect.value = "all"; // Reset to default option

    applyFilter();
  });

  subSelect.addEventListener("change", applyFilter);

  // Initial load
  applyFilter();
});











