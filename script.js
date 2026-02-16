function showTab(tab) {
    const top = document.getElementById("topRating");
    const best = document.getElementById("bestSelling");

    const topTab = document.getElementById("topTab");
    const bestTab = document.getElementById("bestTab");

    if (!top || !best || !topTab || !bestTab) return;

    const setActive = (el) => {
        el.classList.add("text-black", "border-b-2", "border-black");
        el.classList.remove("text-gray-400");
    };

    const setInactive = (el) => {
        el.classList.add("text-gray-400");
        el.classList.remove("text-black", "border-b-2", "border-black");
    };

    if (tab === "top") {
        top.classList.remove("hidden");
        best.classList.add("hidden");

        setActive(topTab);
        setInactive(bestTab);
    } else {
        best.classList.remove("hidden");
        top.classList.add("hidden");

        setActive(bestTab);
        setInactive(topTab);
    }
}

const desktopDropdownIds = ["home", "shop", "product", "blog", "featured"];
const mobileDropdownIds = ["mhome", "mshop", "mproduct", "mblog", "mfeatured"];

function closeDesktopDropdowns(exceptId = "") {
    desktopDropdownIds.forEach((dropdownId) => {
        if (dropdownId === exceptId) return;
        document.getElementById(dropdownId)?.classList.add("hidden");
    });
}

function closeMobileDropdowns(exceptId = "") {
    mobileDropdownIds.forEach((dropdownId) => {
        if (dropdownId === exceptId) return;
        document.getElementById(dropdownId)?.classList.add("hidden");
    });
}

function toggleMenu() {
    const mobileMenu = document.getElementById("mobileMenu");
    if (!mobileMenu) return;

    const isOpening = mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden");

    if (!isOpening) {
        closeMobileDropdowns();
    }
}

function toggleDropdown(id) {
    if (!desktopDropdownIds.includes(id)) return;

    const dropdown = document.getElementById(id);
    if (!dropdown) return;

    const isOpening = dropdown.classList.contains("hidden");
    closeDesktopDropdowns(id);
    dropdown.classList.toggle("hidden", !isOpening);
}

function toggleMobileDropdown(id) {
    if (!mobileDropdownIds.includes(id)) return;

    const dropdown = document.getElementById(id);
    if (!dropdown) return;

    const isOpening = dropdown.classList.contains("hidden");
    closeMobileDropdowns(id);
    dropdown.classList.toggle("hidden", !isOpening);
}

function setupProductCardNavigation() {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card) => {
        card.classList.add("cursor-pointer");

        card.addEventListener("click", () => {
            const container = card.closest(".text-center");
            if (!container) return;

            const name = container.querySelector("h6")?.textContent?.trim() || "Product";
            const price = container.querySelector("p")?.textContent?.replace(/\s+/g, " ").trim() || "$0.00";
            const image = card.querySelector(".main-img")?.getAttribute("src") || "";

            const url = `product-detail.html?name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&image=${encodeURIComponent(image)}`;
            window.location.href = url;
        });
    });
}

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
    if (!slides.length || !dots.length) return;

    slides.forEach((slide, i) => {
        slide.classList.toggle("hidden", i !== index);
        dots[i].classList.toggle("bg-white", i === index);
        dots[i].classList.toggle("bg-white/50", i !== index);
    });
    currentSlide = index;
}

document.addEventListener("DOMContentLoaded", () => {
    showTab("top");
    setupProductCardNavigation();

    document.addEventListener("click", (event) => {
        if (event.target.closest("nav")) return;

        closeDesktopDropdowns();
        closeMobileDropdowns();
        document.getElementById("mobileMenu")?.classList.add("hidden");
    });
});

// Auto slide
if (slides.length && dots.length) {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
}

// swiper js
const testimonialSwiperEl = document.querySelector(".testimonialSwiper");

if (testimonialSwiperEl && typeof Swiper !== "undefined") {
    new Swiper(".testimonialSwiper", {
        loop: true,
        direction: "horizontal",
        effect: "slide",
        speed: 900,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false
        }
    });
}

// PRODUCT DETAIL PAGE JAVASCRIPT
const params = new URLSearchParams(window.location.search);
const name = params.get("name") || "Product";
const price = params.get("price") || "$0.00";
const image = params.get("image") || "";

const productNameEl = document.getElementById("productName");
const productPriceEl = document.getElementById("productPrice");
const productImageEl = document.getElementById("productImage");

if (productNameEl && productPriceEl && productImageEl) {
    productNameEl.textContent = name;
    productPriceEl.textContent = price;
    productImageEl.src = image;
    productImageEl.alt = name;
}
