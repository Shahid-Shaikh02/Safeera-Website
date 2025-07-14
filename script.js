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

  // // Handle enquiry form submission
  // const enquiryForm = document.getElementById("enquiryForm");
  // if (enquiryForm) {
  //   enquiryForm.addEventListener("submit", async function (e) {
  //     e.preventDefault();

  //     if (typeof grecaptcha === "undefined") {
  //       alert("reCAPTCHA not loaded. Please try again later.");
  //       return;
  //     }

  //     const recaptchaToken = grecaptcha.getResponse();
  //     if (!recaptchaToken) {
  //       alert("Please complete the reCAPTCHA.");
  //       return;
  //     }

  //     const formData = {
  //       name: document.getElementById("name").value,
  //       phone: iti ? iti.getNumber() : phoneInput.value,
  //       email: document.getElementById("email").value,
  //       subject: document.getElementById("subject").value,
  //       message: document.getElementById("message").value,
  //       recaptchaToken: recaptchaToken
  //     };

  //     try {
  //       const response = await fetch("/submit-enquiry", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(formData)
  //       });

  //       const result = await response.json();
  //       document.getElementById("responseMessage").textContent = result.message;

  //       enquiryForm.reset();
  //       grecaptcha.reset();
  //       if (iti) iti.setCountry("in");
  //     } catch (error) {
  //       document.getElementById("responseMessage").textContent = "There was an error submitting the form.";
  //       console.error(error);
  //     }
  //   });
  // }

  // Handle product redirection
  window.openProduct = function (page) {
    window.location.href = page;
  };
});


document.addEventListener("DOMContentLoaded", () => {
  const catSelect = document.getElementById("catSelect");
  const subSelect = document.getElementById("subSelect");
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
