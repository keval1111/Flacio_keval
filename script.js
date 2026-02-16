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

function toggleMenu() {
    document.getElementById("mobileMenu").classList.toggle("hidden");
}

function toggleDropdown(id) {
    document.querySelectorAll("ul[id]").forEach(el => {
        if (el.id !== id) el.classList.add("hidden");
    });
    document.getElementById(id).classList.toggle("hidden");
}

function toggleMobileDropdown(id) {
    document.getElementById(id).classList.toggle("hidden");
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
});

// Auto slide
if (slides.length && dots.length) {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
}

// swiper js 
const swiper = new Swiper(".testimonialSwiper", {
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    speed: 900,
    effect: "fade",
    fadeEffect: {
        crossFade: true
    }
});