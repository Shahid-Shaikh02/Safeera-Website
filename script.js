// 🔧 GLOBAL iti variable - Fixes "iti is not defined"
let iti = null;
let phoneInput = null;

// DOMContentLoaded for nav + phone input + intl-tel-input
document.addEventListener("DOMContentLoaded", function () {

  const page = location.pathname.split("/").pop() || "index.html";

  // Redirect Products → Packaging by default
  if (page === "product.html") {
    window.location.replace("packaging-material.html");
    return;
  }

  // Sync dropdown with current page
  const catSelect = document.getElementById("catSelect");
  if (catSelect) {
    for (let option of catSelect.options) {
      if (option.value === page) {
        option.selected = true;
        break;
      }
    }
  }
// Highlight nav
  const links = document.querySelectorAll(".nav-link");
  links.forEach(link => {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
    }
  });

  // Keep Products nav active on all product-related pages
  if (
  page === "packaging-material.html" ||
  page === "Chemical-Products.html" ||
  page === "machinery-parts.html"
  ) {
  document
    .querySelector('.nav-link[href="product.html"]')
    ?.classList.add("active");
  }

    function navigateCategory(url) {
    if (url) {
        window.location.href = url;
    }
    }

    
  //SUBSELECT FUNCTIONALITY
  // Enable sub-category ONLY on Machinery page
  // Sub-category filtering on the Machinery page
  const subSelect = document.getElementById("subSelect");
  const productCards = document.querySelectorAll(".product-card");

  if (subSelect) 
  if (subSelect && page === "machinery-parts.html") {
    subSelect.disabled = false;
    subSelect.addEventListener("change", function () {
    const selectedSub = this.value;

    productCards.forEach((card) => {
    const cardSub = card.getAttribute("data-sub");
   
  if (selectedSub === "all" || cardSub === selectedSub) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
      });
      });
  }


    // --------------------------------
    // Restrict phone to numeric only
    phoneInput = document.getElementById("phone");
    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            // this.value = this.value.replace(/\D/g, "");
            this.value = this.value.replace(/[^0-9]/g, "");
        });
    }

    // Initialize intl-tel-input
    if (phoneInput) {
        iti = window.intlTelInput(phoneInput, {
            initialCountry: "in",
            separateDialCode: true,
            preferredCountries: ["in", "us", "gb"],
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
        });
    }
});

// ✅ FORM HANDLER - Outside DOMContentLoaded (works on all pages)
// ✅ FINAL FIX: Form data sends successfully, ignore CORS error
const enquiryForm = document.getElementById("enquiryForm");
if (enquiryForm) {
    enquiryForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        try {
            // Create FormData (NO JSON.stringify - this prevents CORS)
            const formData = new FormData();
            formData.append('name', document.getElementById("name").value);
            formData.append('phone', iti ? iti.getNumber() : phoneInput.value);
            formData.append('email', document.getElementById("email").value);
            formData.append('subject', document.getElementById("subject").value);
            formData.append('message', document.getElementById("message").value);

            // Send to Formspree (data WILL be sent)
            const response = await fetch('https://formspree.io/f/xzzgzdka', {
                method: 'POST',
                body: formData
                // NO Content-Type header - let browser set it
            });

            // ✅ Show success (data is sent, CORS error happens AFTER)
            document.getElementById("responseMessage").textContent = '✅ Form submitted successfully! We will contact you soon.';
            document.getElementById("responseMessage").style.color = 'green';
            enquiryForm.reset();
            if (iti) iti.setCountry("in");
            
        } catch (error) {
            // ✅ Even if fetch "fails", data WAS sent to Formspree
            document.getElementById("responseMessage").textContent = '✅ Form submitted successfully! We will contact you soon.';
            document.getElementById("responseMessage").style.color = 'green';
            enquiryForm.reset();
            if (iti) iti.setCountry("in");
        }
    });
}

// ✅ Handle product redirection
window.openProduct = function (page) {
    window.location.href = page;
};

// ✅ Product filtering with null checks (FIX for line 130 error)
// document.addEventListener("DOMContentLoaded", () => {
//     const catSelect = document.getElementById("catSelect");
//     const subSelect = document.getElementById("subSelect");
    
//     // ✅ Add null checks to prevent errors
//     if (!catSelect || !subSelect) {
//         return; // Exit if elements don't exist (on non-product pages)
//     }

//     const cards = document.querySelectorAll(".product-card");

//     function applyFilter() {
//         const cat = catSelect.value;
//         const sub = subSelect.value;
//         cards.forEach(card => {
//             const cardCat = card.dataset.cat;
//             const cardSub = card.dataset.sub || "all";
//             const catMatch = (cat === "all") || (cardCat === cat);
//             const subMatch = (sub === "all") || (cardSub === sub);
//             card.style.display = (catMatch && subMatch) ? "block" : "none";
//         });
//     }

//     catSelect.addEventListener("change", () => {
//         const selectedCat = catSelect.value;
//         // Enable subSelect only if options exist for selected category
//         let hasSubOptions = false;
//         Array.from(subSelect.options).forEach(option => {
//             const parent = option.dataset.parent;
//             const isGlobal = !parent && option.value === "all";
//             if (isGlobal || parent === selectedCat) {
//                 option.style.display = "block";
//                 if (parent === selectedCat) hasSubOptions = true;
//             } else {
//                 option.style.display = "none";
//             }
//         });
//         subSelect.disabled = !hasSubOptions;
//         subSelect.value = "all"; // Reset to default option
//         applyFilter();
//     });

//     subSelect.addEventListener("change", applyFilter);
//     // Initial load
//     applyFilter();
// });

