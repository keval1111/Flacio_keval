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

function openUserSidebar() {
    const sidebar = document.getElementById("userSidebar");
    const overlay = document.getElementById("userSidebarOverlay");
    if (!sidebar || !overlay) return;

    sidebar.classList.add("is-open");
    sidebar.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-visible");
    document.body.classList.add("sidebar-open");
}

function closeUserSidebar() {
    const sidebar = document.getElementById("userSidebar");
    const overlay = document.getElementById("userSidebarOverlay");
    if (!sidebar || !overlay) return;

    sidebar.classList.remove("is-open");
    sidebar.setAttribute("aria-hidden", "true");
    overlay.classList.remove("is-visible");
    document.body.classList.remove("sidebar-open");
}

function toggleSidebarPassword() {
    const passwordInput = document.getElementById("sidebarPassword");
    if (!passwordInput) return;

    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function toggleNavSearch() {
    const searchBar = document.getElementById("navSearchBar");
    const searchInput = document.getElementById("navSearchInput");
    if (!searchBar) return;

    const isHidden = searchBar.classList.contains("hidden");
    searchBar.classList.toggle("hidden", !isHidden);

    if (isHidden) {
        setTimeout(() => searchInput?.focus(), 0);
    }
}

function closeNavSearch() {
    const searchBar = document.getElementById("navSearchBar");
    if (!searchBar) return;
    searchBar.classList.add("hidden");
}

function setupProductCardNavigation() {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card) => {
        card.classList.add("cursor-pointer");

        card.addEventListener("click", () => {
            const container = card.closest(".text-center");
            if (!container) return;

            const name = container.querySelector("h6, h4")?.textContent?.trim() || "Product";

            const explicitPriceText = container.querySelector(".shop-price")?.textContent || "";
            const fallbackText = container.querySelector("p")?.textContent || "";
            const combinedPriceText = `${explicitPriceText} ${fallbackText}`.replace(/\s+/g, " ").trim();
            const prices = combinedPriceText.match(/\$\d+(?:\.\d+)?/g);
            const price = prices?.length ? prices[prices.length - 1] : "$0.00";

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

function setupShopPageInteractions() {
    const shopPage = document.querySelector(".shop-page");
    if (!shopPage) return;

    const shopGrid = shopPage.querySelector(".shop-grid");
    const resultCount = shopPage.querySelector(".shop-result-count");
    const sortButton = shopPage.querySelector(".shop-sort-btn");
    const viewButtons = Array.from(shopPage.querySelectorAll(".shop-view-icons button"));
    const pageButtons = Array.from(shopPage.querySelectorAll(".shop-pagination button[data-page]"));
    const nextPageButton = shopPage.querySelector(".shop-pagination button[data-role='next']");
    const collectionLinks = Array.from(shopPage.querySelectorAll("[data-collection]"));
    const stockInputs = Array.from(shopPage.querySelectorAll("input[data-stock]"));
    const sizeButtons = Array.from(shopPage.querySelectorAll(".shop-size-options button[data-size]"));
    const colorItems = Array.from(shopPage.querySelectorAll(".shop-color-list li[data-color]"));
    const filterHeaders = Array.from(shopPage.querySelectorAll(".shop-filter-block h3"));
    const scrollTopButton = document.querySelector(".shop-scroll-top");

    if (!shopGrid) return;

    const items = Array.from(shopGrid.querySelectorAll(".shop-item"));
    const perPage = Number(shopGrid.dataset.perPage || "6");

    const state = {
        collection: "all",
        size: "all",
        color: "all",
        stock: new Set(),
        sortOrder: sortButton?.dataset.sortOrder || "asc",
        page: 1,
        columns: 3
    };

    function parseItemPrice(item) {
        const dataPrice = Number(item.dataset.price);
        if (!Number.isNaN(dataPrice) && dataPrice > 0) return dataPrice;

        const text = item.querySelector(".shop-price")?.textContent || "";
        const matches = text.match(/\$\d+(?:\.\d+)?/g);
        if (!matches?.length) return 0;

        return Number(matches[matches.length - 1].replace("$", ""));
    }

    function normalizeFilterBlockHeader() {
        filterHeaders.forEach((header) => {
            header.style.cursor = "pointer";
            header.addEventListener("click", () => {
                const block = header.closest(".shop-filter-block");
                if (!block) return;

                const content = block.querySelector("ul, .shop-price-range, .shop-size-options, .shop-feature-list");
                if (!content) return;

                const isHidden = content.style.display === "none";
                content.style.display = isHidden ? "" : "none";
            });
        });
    }

    function applyViewColumns() {
        if (window.innerWidth <= 640) {
            shopGrid.style.removeProperty("grid-template-columns");
            return;
        }

        shopGrid.style.gridTemplateColumns = `repeat(${state.columns}, minmax(0, 1fr))`;
    }

    function getFilteredItems() {
        return items.filter((item) => {
            const matchesCollection = state.collection === "all" || item.dataset.collection === state.collection;
            const matchesSize = state.size === "all" || item.dataset.size === state.size;
            const matchesColor = state.color === "all" || item.dataset.color === state.color;
            const matchesStock = !state.stock.size || state.stock.has(item.dataset.stock);

            return matchesCollection && matchesSize && matchesColor && matchesStock;
        });
    }

    function render() {
        const filteredItems = getFilteredItems().sort((a, b) => {
            const delta = parseItemPrice(a) - parseItemPrice(b);
            return state.sortOrder === "asc" ? delta : -delta;
        });

        filteredItems.forEach((item) => shopGrid.appendChild(item));

        const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));
        if (state.page > totalPages) state.page = 1;

        const start = (state.page - 1) * perPage;
        const end = start + perPage;

        items.forEach((item) => {
            item.style.display = "none";
        });

        filteredItems.slice(start, end).forEach((item) => {
            item.style.display = "";
        });

        if (resultCount) {
            const showingCount = filteredItems.slice(start, end).length;
            resultCount.textContent = `You've viewed ${showingCount} of ${filteredItems.length} products`;
        }

        pageButtons.forEach((button) => {
            const page = Number(button.dataset.page || "1");
            const isActive = page === state.page;
            button.classList.toggle("active", isActive);
            button.disabled = page > totalPages;
            button.style.opacity = page > totalPages ? "0.45" : "1";
        });

        if (nextPageButton) {
            nextPageButton.disabled = state.page >= totalPages;
            nextPageButton.style.opacity = state.page >= totalPages ? "0.45" : "1";
        }
    }

    function initCollectionFilter() {
        const links = collectionLinks.filter((el) => el.matches("a[data-collection]"));

        links.forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                const value = link.dataset.collection || "all";

                state.collection = state.collection === value ? "all" : value;
                state.page = 1;

                links.forEach((item) => item.classList.remove("active-filter"));
                if (state.collection !== "all") {
                    link.classList.add("active-filter");
                }

                render();
            });
        });
    }

    function initStockFilter() {
        stockInputs.forEach((input) => {
            input.addEventListener("change", () => {
                const value = input.dataset.stock;
                if (!value) return;

                if (input.checked) {
                    state.stock.add(value);
                } else {
                    state.stock.delete(value);
                }

                state.page = 1;
                render();
            });
        });
    }

    function initSizeFilter() {
        sizeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const value = button.dataset.size || "all";
                const isSame = state.size === value;

                state.size = isSame ? "all" : value;
                state.page = 1;

                sizeButtons.forEach((item) => item.classList.remove("active-filter"));
                if (!isSame) button.classList.add("active-filter");

                render();
            });
        });
    }

    function initColorFilter() {
        colorItems.forEach((colorItem) => {
            colorItem.style.cursor = "pointer";
            colorItem.addEventListener("click", () => {
                const value = colorItem.dataset.color || "all";
                const isSame = state.color === value;

                state.color = isSame ? "all" : value;
                state.page = 1;

                colorItems.forEach((item) => item.classList.remove("active-filter"));
                if (!isSame) colorItem.classList.add("active-filter");

                render();
            });
        });
    }

    function initSort() {
        if (!sortButton) return;

        sortButton.addEventListener("click", () => {
            state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
            sortButton.dataset.sortOrder = state.sortOrder;
            sortButton.innerHTML = state.sortOrder === "asc"
                ? 'Price, low to high <i class="bi bi-caret-down-fill"></i>'
                : 'Price, high to low <i class="bi bi-caret-up-fill"></i>';
            state.page = 1;
            render();
        });
    }

    function initViewControls() {
        viewButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const cols = Number(button.dataset.cols || "3");
                state.columns = Math.max(1, cols);

                viewButtons.forEach((item) => item.classList.remove("active"));
                button.classList.add("active");

                applyViewColumns();
            });
        });

        window.addEventListener("resize", applyViewColumns);
    }

    function initPagination() {
        pageButtons.forEach((button) => {
            button.addEventListener("click", () => {
                if (button.disabled) return;
                state.page = Number(button.dataset.page || "1");
                render();
            });
        });

        if (nextPageButton) {
            nextPageButton.addEventListener("click", () => {
                if (nextPageButton.disabled) return;
                state.page += 1;
                render();
            });
        }
    }

    function initScrollTopButton() {
        if (!scrollTopButton) return;

        const toggleVisibility = () => {
            scrollTopButton.style.display = window.scrollY > 260 ? "inline-flex" : "none";
        };

        scrollTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        toggleVisibility();
        window.addEventListener("scroll", toggleVisibility, { passive: true });
    }

    normalizeFilterBlockHeader();
    initCollectionFilter();
    initStockFilter();
    initSizeFilter();
    initColorFilter();
    initSort();
    initViewControls();
    initPagination();
    initScrollTopButton();
    applyViewColumns();
    render();
}

document.addEventListener("DOMContentLoaded", () => {
    showTab("top");
    setupProductCardNavigation();
    setupShopPageInteractions();
    setupBlogPageInteractions();

    document.addEventListener("click", (event) => {
        if (event.target.closest("nav")) return;

        closeDesktopDropdowns();
        closeMobileDropdowns();
        document.getElementById("mobileMenu")?.classList.add("hidden");
        closeNavSearch();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeUserSidebar();
            closeNavSearch();
        }
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

if (typeof Swiper !== "undefined" && document.querySelector(".mySwiper")) {
    new Swiper(".mySwiper", {
        slidesPerView: 3,
        spaceBetween: 0,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}

// product details
function changeImage(el) {
    document.getElementById("mainImage").src = el.src;
}

function plus() {
    let q = document.getElementById("qty");
    q.value = parseInt(q.value) + 1;
}

function minus() {
    let q = document.getElementById("qty");
    if (q.value > 1) q.value = parseInt(q.value) - 1;
}

// blog
function setupBlogPageInteractions() {
    const blogPage = document.querySelector(".blog-page");
    if (!blogPage) return;

    const searchInput = blogPage.querySelector("[data-blog-search]");
    const filterLinks = Array.from(document.querySelectorAll("a[data-blog-filter]"));
    const tagButtons = Array.from(blogPage.querySelectorAll("button[data-blog-tag]"));
    const posts = Array.from(blogPage.querySelectorAll(".blog-post-card"));
    const emptyState = blogPage.querySelector(".blog-empty-state");

    const relatedCards = Array.from(blogPage.querySelectorAll(".blog-related-card"));

    const state = {
        category: "life-style",
        tag: "",
        query: ""
    };

    function normalizeText(value) {
        return (value || "").toLowerCase().trim();
    }

    function toCategoryLabel(value) {
        return (value || "")
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }

    function updateRelatedPosts(visiblePosts) {
        if (!relatedCards.length) return;

        relatedCards.forEach((card, index) => {
            const post = visiblePosts[index];
            const relatedImage = card.querySelector("img");
            const relatedCategory = card.querySelector("span");
            const relatedTitle = card.querySelector("a");
            const relatedComments = card.querySelector("p");

            if (!relatedImage || !relatedCategory || !relatedTitle || !relatedComments) return;

            if (!post) {
                card.style.display = "none";
                return;
            }

            card.style.display = "";
            card.style.opacity = "1";

            const imageEl = post.querySelector(".blog-post-image");
            const titleText = (post.dataset.title || post.querySelector("h2")?.textContent || "Blog post").trim();
            const categoryText = toCategoryLabel(post.dataset.category || "");
            const commentsText = Array.from(post.querySelectorAll(".blog-post-meta span"))
                .map((span) => span.textContent || "")
                .find((text) => /comments?/i.test(text)) || "0 comments";

            if (imageEl) {
                relatedImage.src = imageEl.getAttribute("src") || relatedImage.src;
                relatedImage.alt = imageEl.getAttribute("alt") || titleText;
            }

            relatedCategory.textContent = categoryText.toUpperCase();
            relatedTitle.textContent = titleText;
            relatedTitle.dataset.blogFilter = post.dataset.category || "life-style";
            relatedComments.textContent = commentsText.trim();
        });
    }

    function updateActiveFilters() {
        filterLinks.forEach((link) => {
            const isActive = (link.dataset.blogFilter || "") === state.category;
            link.classList.toggle("active", isActive && link.closest(".blog-hero-tabs"));
            link.classList.toggle("active-filter", isActive && link.closest(".blog-category-list"));
        });

        tagButtons.forEach((button) => {
            const isActive = (button.dataset.blogTag || "") === state.tag;
            button.classList.toggle("active-tag", isActive);
        });
    }

    function renderPosts() {
        const query = normalizeText(state.query);

        const visiblePosts = posts.filter((post) => {
            const category = normalizeText(post.dataset.category);
            const tags = normalizeText(post.dataset.tags).split(",").map((item) => item.trim()).filter(Boolean);
            const title = normalizeText(post.dataset.title || post.querySelector("h2")?.textContent || "");
            const description = normalizeText(post.querySelector("p")?.textContent || "");

            const categoryMatch = !state.category || category === state.category;
            const tagMatch = !state.tag || tags.includes(state.tag);
            const queryMatch = !query || title.includes(query) || description.includes(query);

            return categoryMatch && tagMatch && queryMatch;
        });

        posts.forEach((post) => {
            post.style.display = visiblePosts.includes(post) ? "" : "none";
        });

        if (emptyState) {
            emptyState.hidden = visiblePosts.length > 0;
        }

        updateRelatedPosts(visiblePosts.slice(0, 3));
        updateActiveFilters();
    }

    filterLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const value = normalizeText(link.dataset.blogFilter);
            if (!value) return;

            state.category = value;
            renderPosts();
        });
    });

    tagButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const value = normalizeText(button.dataset.blogTag);
            state.tag = state.tag === value ? "" : value;
            renderPosts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            state.query = searchInput.value || "";
            renderPosts();
        });
    }

    renderPosts();
}

// FOOTER IMG SLIDE
var swiper = new Swiper(".mySwiper", {
    loop: true,
    spaceBetween: 20,

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    // ✅ Responsive Breakpoints
    breakpoints: {
        0: {
            slidesPerView: 1,   // 📱 Mobile → 1 image
        },
        640: {
            slidesPerView: 2,   // 📲 Tablet → 2 images
        },
        1024: {
            slidesPerView: 4,   // 💻 Desktop → 4 images (change if needed)
        }
    }
});
