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

        card.addEventListener("click", (event) => {
            if (event.target.closest(".action-icons a, [data-wishlist-trigger]")) return;

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

const WISHLIST_STORAGE_KEY = "flacio_wishlist";
const CART_STORAGE_KEY = "flacio_cart";

function getWishlistItems() {
    try {
        const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function setWishlistItems(items) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    updateWishlistCountBadges(items.length);
}

function makeWishlistId(name, image, price) {
    return `${name}|${image}|${price}`.toLowerCase();
}

function parsePriceFromText(text) {
    const prices = (text || "").match(/\$\d+(?:\.\d+)?/g);
    return prices?.length ? prices[prices.length - 1] : "$0.00";
}

function extractWishlistProduct(trigger) {
    const container = trigger.closest(".shop-item, .text-center");
    if (!container) return null;

    const name = container.querySelector("h6, h4, h3, h2")?.textContent?.trim() || "Product";
    const priceText = [
        container.querySelector(".shop-price")?.textContent || "",
        container.querySelector("p")?.textContent || ""
    ].join(" ");
    const price = parsePriceFromText(priceText);

    const productCard = container.querySelector(".product-card");
    const mainImage = productCard?.querySelector(".main-img")?.getAttribute("src") || "";
    const hoverImage = productCard?.querySelector(".hover-img")?.getAttribute("src") || mainImage;

    return {
        id: makeWishlistId(name, mainImage, price),
        name,
        price,
        image: mainImage,
        hoverImage
    };
}

function setWishlistIconVisual(trigger, isActive) {
    const icon = trigger.querySelector("i");
    if (!icon) return;

    icon.classList.toggle("fa-regular", !isActive);
    icon.classList.toggle("fa-solid", isActive);
    trigger.classList.toggle("is-active", isActive);
}

function markWishlistTriggers() {
    document.querySelectorAll(".action-icons a").forEach((anchor) => {
        if (!anchor.querySelector(".fa-heart")) return;
        anchor.setAttribute("data-wishlist-trigger", "true");
        anchor.setAttribute("aria-label", "Toggle wishlist");
    });
}

function syncWishlistIcons() {
    const items = getWishlistItems();
    const ids = new Set(items.map((item) => item.id));

    document.querySelectorAll("[data-wishlist-trigger]").forEach((trigger) => {
        const product = extractWishlistProduct(trigger);
        const isActive = Boolean(product?.id && ids.has(product.id));
        setWishlistIconVisual(trigger, isActive);
    });
}

function setupWishlistInteractions() {
    markWishlistTriggers();
    syncWishlistIcons();
    updateWishlistCountBadges();

    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-wishlist-trigger]");
        if (!trigger) return;

        event.preventDefault();
        event.stopPropagation();

        const product = extractWishlistProduct(trigger);
        if (!product) return;

        const items = getWishlistItems();
        const existingIndex = items.findIndex((item) => item.id === product.id);
        const exists = existingIndex > -1;

        if (exists) {
            items.splice(existingIndex, 1);
            setWishlistIconVisual(trigger, false);
        } else {
            items.push(product);
            setWishlistIconVisual(trigger, true);
        }

        setWishlistItems(items);
    });
}

function getCartItems() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function setCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartCountBadges(items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0));
}

function parseNumberFromPrice(priceText) {
    const numeric = Number((priceText || "").replace(/[^0-9.]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
}

function formatPrice(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function getProductFromPdp() {
    const name = document.getElementById("productName")?.textContent?.trim() || "Product";
    const price = document.getElementById("productPrice")?.textContent?.trim() || "$0.00";
    const image = document.getElementById("mainImage")?.getAttribute("src") || document.getElementById("productImage")?.getAttribute("src") || "";
    const qtyInput = document.getElementById("qty");
    const quantity = Math.max(1, parseInt(qtyInput?.value || "1", 10) || 1);

    return {
        id: makeWishlistId(name, image, price),
        name,
        price,
        image,
        hoverImage: image,
        quantity
    };
}

function getCartProductFromTrigger(trigger) {
    if (trigger.hasAttribute("data-cart-button")) {
        return getProductFromPdp();
    }

    const product = extractWishlistProduct(trigger);
    if (!product) return null;

    return {
        ...product,
        quantity: 1
    };
}

function addToCart(product) {
    if (!product) return;

    const items = getCartItems();
    const index = items.findIndex((item) => item.id === product.id);

    if (index > -1) {
        const nextQty = (Number(items[index].quantity) || 0) + (Number(product.quantity) || 1);
        items[index].quantity = Math.max(1, nextQty);
    } else {
        items.push({
            ...product,
            quantity: Math.max(1, Number(product.quantity) || 1)
        });
    }

    setCartItems(items);
}

function markCartTriggers() {
    document.querySelectorAll(".action-icons a").forEach((anchor) => {
        if (!anchor.querySelector(".fa-cart-shopping")) return;
        anchor.setAttribute("data-cart-trigger", "true");
        anchor.setAttribute("aria-label", "Add to cart");
    });

    const pdpAddButton = document.querySelector(".add-btn");
    if (pdpAddButton) {
        pdpAddButton.setAttribute("data-cart-button", "true");
        pdpAddButton.setAttribute("type", "button");
    }
}

function setupCartInteractions() {
    markCartTriggers();
    updateCartCountBadges();

    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-cart-trigger], [data-cart-button]");
        if (!trigger) return;

        event.preventDefault();
        event.stopPropagation();

        const product = getCartProductFromTrigger(trigger);
        addToCart(product);
    });
}

function updateCartCountBadges(forcedCount) {
    const count = Number.isInteger(forcedCount)
        ? forcedCount
        : getCartItems().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

    const navCartLinks = Array.from(document.querySelectorAll("a[href='cart.html']"))
        .filter((link) => link.querySelector("i.fa-cart-shopping"));

    navCartLinks.forEach((link) => {
        link.classList.add("cart-nav-link");

        let badge = link.querySelector(".cart-count-badge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "cart-count-badge";
            link.appendChild(badge);
        }

        badge.textContent = String(count);
        badge.classList.toggle("is-hidden", count < 1);
    });
}

function renderCartPage() {
    const cartGrid = document.getElementById("cartGrid");
    const cartCount = document.getElementById("cartCount");
    const cartEmpty = document.getElementById("cartEmpty");
    const cartSubtotal = document.getElementById("cartSubtotal");
    if (!cartGrid || !cartCount || !cartEmpty || !cartSubtotal) return;

    const items = getCartItems();
    const totalQty = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const subtotal = items.reduce((sum, item) => sum + (parseNumberFromPrice(item.price) * (Number(item.quantity) || 0)), 0);

    cartCount.textContent = `${totalQty} item${totalQty === 1 ? "" : "s"}`;
    cartSubtotal.textContent = formatPrice(subtotal);

    if (!items.length) {
        cartGrid.innerHTML = "";
        cartEmpty.classList.remove("hidden");
        return;
    }

    cartEmpty.classList.add("hidden");
    cartGrid.innerHTML = items.map((item) => {
        const detailUrl = `product-detail.html?name=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}&image=${encodeURIComponent(item.image)}`;
        const unitPrice = parseNumberFromPrice(item.price);
        const lineTotal = unitPrice * (Number(item.quantity) || 0);

        return `
        <div class="col-12" data-cart-id="${item.id}">
          <div class="cart-line-item d-flex flex-column flex-md-row align-items-center gap-4 p-3 border rounded bg-white">
            <div class="product-card bg-gray-100 p-2" style="width: 140px;">
              <img src="${item.image}" class="w-full main-img" alt="${item.name}">
              <img src="${item.hoverImage || item.image}" class="w-full hover-img" alt="${item.name}">
            </div>
            <div class="flex-grow-1 text-center text-md-start">
              <h5 class="mb-1">${item.name}</h5>
              <p class="mb-2 text-muted">Unit Price: ${item.price}</p>
              <p class="mb-0 fw-semibold">Line Total: ${formatPrice(lineTotal)}</p>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-outline-secondary btn-sm" data-cart-dec="true" type="button">-</button>
              <span class="px-2 fw-semibold">${Math.max(1, Number(item.quantity) || 1)}</span>
              <button class="btn btn-outline-secondary btn-sm" data-cart-inc="true" type="button">+</button>
            </div>
            <div class="d-flex align-items-center gap-2">
              <a href="${detailUrl}" class="btn btn-outline-dark btn-sm" type="button">View</a>
              <button class="btn btn-danger btn-sm" data-cart-remove="true" type="button">Remove</button>
            </div>
          </div>
        </div>`;
    }).join("");

    cartGrid.querySelectorAll("[data-cart-remove], [data-cart-inc], [data-cart-dec]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const card = button.closest("[data-cart-id]");
            const id = card?.getAttribute("data-cart-id");
            if (!id) return;

            const itemsNext = getCartItems();
            const index = itemsNext.findIndex((item) => item.id === id);
            if (index < 0) return;

            if (button.hasAttribute("data-cart-remove")) {
                itemsNext.splice(index, 1);
            } else if (button.hasAttribute("data-cart-inc")) {
                itemsNext[index].quantity = Math.max(1, (Number(itemsNext[index].quantity) || 1) + 1);
            } else if (button.hasAttribute("data-cart-dec")) {
                const nextQty = Math.max(1, (Number(itemsNext[index].quantity) || 1) - 1);
                itemsNext[index].quantity = nextQty;
            }

            setCartItems(itemsNext);
            renderCartPage();
        });
    });
}

function updateWishlistCountBadges(forcedCount) {
    const count = Number.isInteger(forcedCount) ? forcedCount : getWishlistItems().length;
    const navWishlistLinks = Array.from(document.querySelectorAll("a[href='wishlist.html']"))
        .filter((link) => link.querySelector("i.fa-heart"));

    navWishlistLinks.forEach((link) => {
        link.classList.add("wishlist-nav-link");

        let badge = link.querySelector(".wishlist-count-badge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "wishlist-count-badge";
            link.appendChild(badge);
        }

        badge.textContent = String(count);
        badge.classList.toggle("is-hidden", count < 1);
    });
}

function renderWishlistPage() {
    const wishlistGrid = document.getElementById("wishlistGrid");
    const wishlistCount = document.getElementById("wishlistCount");
    const wishlistEmpty = document.getElementById("wishlistEmpty");
    if (!wishlistGrid || !wishlistCount || !wishlistEmpty) return;

    const items = getWishlistItems();
    wishlistCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

    if (!items.length) {
        wishlistGrid.innerHTML = "";
        wishlistEmpty.classList.remove("hidden");
        return;
    }

    wishlistEmpty.classList.add("hidden");
    wishlistGrid.innerHTML = items.map((item) => {
        const detailUrl = `product-detail.html?name=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}&image=${encodeURIComponent(item.image)}`;

        return `
        <div class="col-12 col-sm-6 col-lg-3" data-wishlist-id="${item.id}">
          <div class="text-center">
            <div class="product-card bg-gray-100 p-4">
              <img src="${item.image}" class="w-full main-img" alt="${item.name}">
              <img src="${item.hoverImage || item.image}" class="w-full hover-img" alt="${item.name}">
              <div class="action-icons">
                <a href="#" data-remove-wishlist="true" aria-label="Remove from wishlist"><i class="fa-solid fa-heart"></i></a>
                <a href="${detailUrl}" aria-label="View product"><i class="fa-regular fa-eye"></i></a>
                <a href="#" aria-label="Add to cart"><i class="fa-solid fa-cart-shopping"></i></a>
              </div>
            </div>
            <h6 class="mt-3">${item.name}</h6>
            <p class="font-semibold">${item.price}</p>
          </div>
        </div>`;
    }).join("");

    wishlistGrid.querySelectorAll("[data-remove-wishlist]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const card = button.closest("[data-wishlist-id]");
            const id = card?.getAttribute("data-wishlist-id");
            if (!id) return;

            const nextItems = getWishlistItems().filter((item) => item.id !== id);
            setWishlistItems(nextItems);
            renderWishlistPage();
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
    setupProductDetailTabs();
    setupShopPageInteractions();
    setupBlogPageInteractions();
    setupBlogPostNavigation();
    renderBlogDetailPage();
    setupWishlistInteractions();
    setupCartInteractions();
    renderWishlistPage();
    renderCartPage();
    updateWishlistCountBadges();
    updateCartCountBadges();

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

window.addEventListener("storage", (event) => {
    if (event.key === WISHLIST_STORAGE_KEY) {
        updateWishlistCountBadges();
        syncWishlistIcons();
        renderWishlistPage();
    }

    if (event.key === CART_STORAGE_KEY) {
        updateCartCountBadges();
        renderCartPage();
    }
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
const productImageEl = document.getElementById("productImage") || document.getElementById("mainImage");
const productThumbEls = Array.from(document.querySelectorAll(".thumb"));
const fallbackProductImage = "img/10-2_600x.webp";

if (productNameEl) {
    productNameEl.textContent = name;
}

if (productPriceEl) {
    productPriceEl.textContent = price;
}

if (productImageEl) {
    const resolvedImage = image || productImageEl.getAttribute("src") || fallbackProductImage;
    productImageEl.src = resolvedImage;
    productImageEl.alt = name;

    if (productThumbEls.length) {
        productThumbEls[0].src = resolvedImage;
        productThumbEls[0].alt = `${name} thumbnail`;
    }
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
    const mainImage = document.getElementById("mainImage") || document.getElementById("productImage");
    if (!mainImage || !el?.src) return;
    mainImage.src = el.src;
    mainImage.alt = el.alt || "Product image";
}

function plus() {
    const q = document.getElementById("qty");
    if (!q) return;

    const current = parseInt(q.value, 10);
    q.value = Number.isNaN(current) ? 1 : current + 1;
}

function minus() {
    const q = document.getElementById("qty");
    if (!q) return;

    const current = parseInt(q.value, 10);
    if (Number.isNaN(current) || current <= 1) {
        q.value = 1;
        return;
    }

    q.value = current - 1;
}

function setupProductDetailTabs() {
    const tabButtons = Array.from(document.querySelectorAll("[data-pd-tab]"));
    const tabPanes = Array.from(document.querySelectorAll("[data-pd-pane]"));
    if (!tabButtons.length || !tabPanes.length) return;

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.getAttribute("data-pd-tab");
            if (!target) return;

            tabButtons.forEach((tab) => {
                const isActive = tab === button;
                tab.classList.toggle("is-active", isActive);
                tab.setAttribute("aria-selected", isActive ? "true" : "false");
            });

            tabPanes.forEach((pane) => {
                const isActive = pane.getAttribute("data-pd-pane") === target;
                pane.classList.toggle("is-active", isActive);
                pane.hidden = !isActive;
            });
        });
    });
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

function setupBlogPostNavigation() {
    const posts = Array.from(document.querySelectorAll(".blog-post-card"));
    if (!posts.length) return;

    function getPostPayload(post) {
        const title = (post.dataset.title || post.querySelector("h2")?.textContent || "Blog Post").trim();
        const image = post.querySelector(".blog-post-image")?.getAttribute("src") || "";
        const date = post.querySelector(".blog-post-date")?.textContent?.trim() || "";
        const excerpt = post.querySelector("p")?.textContent?.trim() || "";

        const metaSpans = Array.from(post.querySelectorAll(".blog-post-meta span")).map((item) => item.textContent?.trim() || "");
        const authorText = metaSpans.find((item) => /^by:/i.test(item)) || "By: Flacio Desk";
        const author = authorText.replace(/^by:\s*/i, "").trim();
        const comments = (metaSpans.find((item) => /comments?/i.test(item)) || "0 comments").trim();
        const category = (metaSpans.find((item) => !/^by:/i.test(item) && !/comments?/i.test(item)) || post.dataset.category || "Life Style").trim();

        return { title, image, date, excerpt, author, comments, category };
    }

    function openPostDetail(post) {
        const payload = getPostPayload(post);
        const params = new URLSearchParams({
            title: payload.title,
            image: payload.image,
            date: payload.date,
            excerpt: payload.excerpt,
            author: payload.author,
            comments: payload.comments,
            category: payload.category
        });

        window.location.href = `blog-detail.html?${params.toString()}`;
    }

    posts.forEach((post) => {
        const image = post.querySelector(".blog-post-image");
        const title = post.querySelector("h2");
        const readMore = post.querySelector(".blog-read-more");

        [image, title, readMore].forEach((target) => {
            if (!target) return;

            if (target.tagName === "A") {
                target.setAttribute("href", "#");
            }

            target.style.cursor = "pointer";
            target.addEventListener("click", (event) => {
                event.preventDefault();
                openPostDetail(post);
            });
        });
    });
}

function renderBlogDetailPage() {
    const detailPage = document.querySelector(".blog-detail-page");
    if (!detailPage) return;

    const posts = [
        {
            title: "Traveling Solo Is Awesome",
            image: "img/blog-4_1296x.webp",
            date: "Sep 30, 2024",
            author: "Tung Hoang",
            category: "News",
            categoryKey: "news",
            detailCategory: "indoor-plants",
            tags: ["baber", "beauty", "hot", "simple"],
            excerpt: "Quisque elementum nibh at dolor pellentesque, a eleifend libero pharetra. Mauris neque felis, volutpat nec ullamcorper eget.",
            body: [
                "Quisque elementum nibh at dolor pellentesque, a eleifend libero pharetra. Mauris neque felis, volutpat nec ullamcorper eget, sagittis vel enim.",
                "Lorem quasi aliquid maiores iusto suscipit perspiciatis a aspernatur et fuga repudiandae deleniti excepturi nesciunt animi reprehenderit similique sit.",
                "Donec sed tincidunt lacus. Duis vehicula aliquam vestibulum. Aenean at mollis mi. Cras ac urna sed nisi auctor venenatis ut id sapien."
            ],
            quote: {
                text: "Maecenas semper aliquam massa. Praesent pharetra sem vitae nisi eleifend molestie. Aliquam molestie scelerisque ultricies.",
                author: "Robert Smith"
            },
            comments: [
                { name: "wer", date: "October 11, 2025", message: "wefgv" },
                { name: "ya", date: "October 9, 2025", message: "edwee" }
            ]
        },
        {
            title: "Indoor Plants Are Good For Health.",
            image: "img/blog-3_1296x.webp",
            date: "Oct 04, 2024",
            author: "Team Flacio",
            category: "News",
            categoryKey: "news",
            detailCategory: "air-purifying",
            tags: ["organic", "new", "beauty"],
            excerpt: "Integer hendrerit velit vel turpis feugiat, non fringilla massa iaculis. Etiam in faucibus lectus.",
            body: [
                "Indoor plants can improve comfort by balancing humidity and adding visual calm to daily spaces.",
                "Pick low-maintenance varieties if your routine is busy, then build a consistent watering schedule.",
                "Position plants where they receive stable light and keep airflow around leaves to avoid pests."
            ],
            quote: {
                text: "The healthiest spaces are built with small habits repeated consistently.",
                author: "Flacio Team"
            },
            comments: [
                { name: "nina", date: "October 7, 2025", message: "Great practical tips." }
            ]
        },
        {
            title: "What Is The Best Plant For You?",
            image: "img/blog-1_1296x.webp",
            date: "Oct 08, 2024",
            author: "Flacio Desk",
            category: "Life Style",
            categoryKey: "life-style",
            detailCategory: "low-maintenance",
            tags: ["simple", "baby-needs", "new"],
            excerpt: "Praesent bibendum orci sed sem ultrices, at dapibus elit ullamcorper.",
            body: [
                "The best plant is the one that matches your home light and your weekly routine.",
                "Before buying, check sunlight hours, room temperature, and how often you can water.",
                "Start with one forgiving plant, then expand as your care rhythm becomes stable."
            ],
            quote: {
                text: "Choose plants for your lifestyle first, aesthetics second.",
                author: "Garden Notes"
            },
            comments: [
                { name: "mira", date: "October 5, 2025", message: "This helped me choose my first plant." }
            ]
        },
        {
            title: "The Best Tree Care Tips For You",
            image: "img/blog-4_1296x.webp",
            date: "September 30, 2024",
            author: "Tung Hoang",
            category: "Life Style",
            categoryKey: "life-style",
            detailCategory: "plant-bundle",
            tags: ["organic", "beauty", "new"],
            excerpt: "Quisque elementum nibh at dolor pellentesque, a eleifend libero pharetra. Mauris neque felis, volutpat nec ullamcorper.",
            body: [
                "Healthy trees start with consistent watering and seasonal pruning. Focus on removing weak branches first.",
                "Mulch helps lock in moisture and regulate root temperature. Keep mulch away from the trunk.",
                "Feed slowly during growth periods and monitor leaf color, spotting, and texture."
            ],
            quote: {
                text: "Stronger plants come from regular care, not occasional overcorrection.",
                author: "Flacio Desk"
            },
            comments: []
        },
        {
            title: "How To Style Indoor Corners With Plants",
            image: "img/blog-3_1296x.webp",
            date: "October 04, 2024",
            author: "Team Flacio",
            category: "Fashion",
            categoryKey: "fashion",
            detailCategory: "ceramic-pots",
            tags: ["beauty", "simple"],
            excerpt: "Integer hendrerit velit vel turpis feugiat, non fringilla massa iaculis. Etiam in faucibus lectus.",
            body: [
                "Start with one hero plant in a textured pot and add two smaller layers at different heights.",
                "Use shelves or stools to avoid a flat arrangement and mix leaf shapes for contrast.",
                "Keep wall tones neutral so greenery remains the primary visual element."
            ],
            quote: {
                text: "Corners become intentional when height, shape, and light are balanced.",
                author: "Team Flacio"
            },
            comments: [
                { name: "rose", date: "October 4, 2025", message: "Love this styling idea." },
                { name: "jon", date: "October 6, 2025", message: "Worked perfectly for my studio room." }
            ]
        },
        {
            title: "New Seasonal Collection Is Live",
            image: "img/blog-6_1296x.webp",
            date: "October 08, 2024",
            author: "Flacio Desk",
            category: "News",
            categoryKey: "news",
            detailCategory: "herb-seeds",
            tags: ["new", "baby-needs"],
            excerpt: "Praesent bibendum orci sed sem ultrices, at dapibus elit ullamcorper. Integer eu urna sodales.",
            body: [
                "Our seasonal collection introduces fresh foliage, low-maintenance planters, and compact sets.",
                "Each plant is selected for resilience and visual impact in homes and offices.",
                "Shop early to access limited seasonal varieties before they sell out."
            ],
            quote: {
                text: "Seasonal releases are curated for both style and daily practicality.",
                author: "Flacio Updates"
            },
            comments: [
                { name: "amy", date: "October 8, 2025", message: "Waiting for this launch." },
                { name: "kai", date: "October 10, 2025", message: "Great new lineup." },
                { name: "sia", date: "October 12, 2025", message: "Ordered the compact set." }
            ]
        },
        {
            title: "Urban Balcony Planting Trends 2024",
            image: "img/blog-2_1296x.webp",
            date: "October 12, 2024",
            author: "Flacio Desk",
            category: "News",
            categoryKey: "news",
            detailCategory: "air-purifying",
            tags: ["new", "organic"],
            excerpt: "Donec blandit sem in lacus ultricies, et aliquet diam elementum. Sed luctus eros in mauris feugiat porttitor.",
            body: [
                "Balcony gardening trends now prioritize modular planters and mixed-height layouts.",
                "Hardy species that tolerate heat and wind are ideal for compact urban spaces.",
                "Pair decorative pots with practical drip trays to keep maintenance simple."
            ],
            quote: {
                text: "A productive balcony starts with structure first, then variety.",
                author: "Urban Grow Notes"
            },
            comments: [
                { name: "harry", date: "October 13, 2025", message: "Very useful for small balconies." },
                { name: "mina", date: "October 14, 2025", message: "The modular setup tip is great." },
                { name: "leo", date: "October 14, 2025", message: "Clear and practical." },
                { name: "nora", date: "October 15, 2025", message: "Trying this layout this weekend." },
                { name: "vic", date: "October 16, 2025", message: "Loved this article." }
            ]
        },
        {
            title: "Flacio Community Green Week Highlights",
            image: "img/blog-1_1296x.webp",
            date: "October 16, 2024",
            author: "Flacio Updates",
            category: "News",
            categoryKey: "news",
            detailCategory: "plant-bundle",
            tags: ["new", "beauty"],
            excerpt: "Vivamus finibus, arcu in vulputate vestibulum, nunc ipsum luctus lorem, non lacinia libero mi eget odio.",
            body: [
                "Green Week brought together the community for repotting, pruning, and styling workshops.",
                "Participants shared practical routines and before-and-after plant setups.",
                "Monthly sessions will continue with guided care tips and curated bundles."
            ],
            quote: {
                text: "Community learning turns plant care into a lasting habit.",
                author: "Flacio Community"
            },
            comments: [
                { name: "dina", date: "October 16, 2025", message: "Excited for the next event." },
                { name: "ali", date: "October 17, 2025", message: "Workshops were excellent." },
                { name: "josh", date: "October 18, 2025", message: "Please share the next schedule." },
                { name: "eva", date: "October 18, 2025", message: "Loved the repotting session." },
                { name: "ian", date: "October 19, 2025", message: "Great community vibe." },
                { name: "tara", date: "October 19, 2025", message: "Thanks for organizing this." },
                { name: "noah", date: "October 20, 2025", message: "Very inspiring event." }
            ]
        }
    ];

    const params = new URLSearchParams(window.location.search);
    const queryTitle = (params.get("title") || "").trim().toLowerCase();
    const matchedPost = posts.find((post) => post.title.toLowerCase() === queryTitle) || posts[0];
    const activePost = {
        ...matchedPost,
        title: params.get("title") || matchedPost.title,
        image: params.get("image") || matchedPost.image,
        date: params.get("date") || matchedPost.date,
        author: params.get("author") || matchedPost.author,
        category: params.get("category") || matchedPost.category,
        excerpt: params.get("excerpt") || matchedPost.excerpt
    };

    const titleEl = document.getElementById("blogDetailTitle");
    const imageEl = document.getElementById("blogDetailImage");
    const dateEl = document.getElementById("blogDetailDate");
    const authorEl = document.getElementById("blogDetailAuthor");
    const commentsEl = document.getElementById("blogDetailComments");
    const categoryEl = document.getElementById("blogDetailCategory");
    const excerptEl = document.getElementById("blogDetailExcerpt");
    const bodyEl = document.getElementById("blogDetailBody");
    const quoteTextEl = document.getElementById("blogDetailQuoteText");
    const quoteAuthorEl = document.getElementById("blogDetailQuoteAuthor");
    const tagsEl = document.getElementById("blogDetailPostTags");
    const relatedListEl = document.getElementById("blogDetailRelatedList");
    const commentsHeadingEl = document.getElementById("blogDetailCommentsHeading");
    const commentsListEl = document.getElementById("blogDetailCommentsList");
    const prevLinkEl = document.getElementById("blogDetailPrevLink");
    const categoryButtons = Array.from(document.querySelectorAll("[data-detail-category]"));
    const tagButtons = Array.from(document.querySelectorAll("[data-detail-tag]"));
    const searchInput = document.getElementById("blogDetailSearchInput");
    const searchBtn = document.getElementById("blogDetailSearchBtn");
    const commentForm = document.getElementById("blogDetailCommentForm");
    const commentName = document.getElementById("blogCommentName");
    const commentEmail = document.getElementById("blogCommentEmail");
    const commentMessage = document.getElementById("blogCommentMessage");
    const commentNotice = document.getElementById("blogCommentFormNotice");

    const commentState = [...matchedPost.comments];
    const urlCommentCount = parseInt((params.get("comments") || "0").replace(/\D/g, ""), 10);
    if (Number.isFinite(urlCommentCount) && urlCommentCount >= 0) {
        if (urlCommentCount < commentState.length) {
            commentState.splice(urlCommentCount);
        } else if (urlCommentCount > commentState.length) {
            for (let i = commentState.length; i < urlCommentCount; i += 1) {
                commentState.push({
                    name: `Guest ${i + 1}`,
                    date: activePost.date,
                    message: "Thanks for sharing this article."
                });
            }
        }
    }

    function getCommentLabel(total) {
        return `${total} comment${total === 1 ? "" : "s"}`;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function toQuery(post) {
        return new URLSearchParams({
            title: post.title,
            image: post.image,
            date: post.date,
            excerpt: post.excerpt,
            author: post.author,
            comments: getCommentLabel(post.comments.length),
            category: post.category
        });
    }

    function openPost(post) {
        window.location.href = `blog-detail.html?${toQuery(post).toString()}`;
    }

    function renderRelatedPosts(queryText = "") {
        if (!relatedListEl) return;

        const query = (queryText || "").trim().toLowerCase();
        const relatedPosts = posts
            .filter((post) => post.title !== matchedPost.title)
            .filter((post) => !query || post.title.toLowerCase().includes(query))
            .slice(0, 3);

        if (!relatedPosts.length) {
            relatedListEl.innerHTML = `<p class="blog-detail-related-comments">No related articles found.</p>`;
            return;
        }

        relatedListEl.innerHTML = relatedPosts.map((post) => `
            <article class="blog-detail-related-item" data-related-title="${post.title}">
              <img src="${post.image}" alt="${post.title}">
              <div>
                <span class="blog-detail-related-meta">${post.category.toUpperCase()}</span>
                <a href="#" class="blog-detail-related-link">${post.title}</a>
                <p class="blog-detail-related-comments">${getCommentLabel(post.comments.length)}</p>
              </div>
            </article>
        `).join("");

        relatedListEl.querySelectorAll(".blog-detail-related-item").forEach((item) => {
            const post = posts.find((entry) => entry.title === item.dataset.relatedTitle);
            if (!post) return;
            item.addEventListener("click", (event) => {
                event.preventDefault();
                openPost(post);
            });
        });
    }

    function renderComments() {
        if (commentsHeadingEl) commentsHeadingEl.textContent = getCommentLabel(commentState.length);
        if (commentsEl) commentsEl.textContent = getCommentLabel(commentState.length);
        if (!commentsListEl) return;

        commentsListEl.innerHTML = commentState.map((item) => `
            <article class="blog-detail-comment-item">
              <div class="blog-detail-comment-head">
                <strong>${escapeHtml(item.name)}</strong>
                <span><i class="bi bi-calendar4"></i> ${escapeHtml(item.date)}</span>
              </div>
              <p>${escapeHtml(item.message)}</p>
            </article>
        `).join("");
    }

    if (titleEl) titleEl.textContent = activePost.title;
    if (imageEl) {
        imageEl.src = activePost.image;
        imageEl.alt = activePost.title;
    }
    if (dateEl) dateEl.textContent = activePost.date;
    if (authorEl) authorEl.textContent = activePost.author;
    if (categoryEl) categoryEl.textContent = activePost.category;
    if (excerptEl) excerptEl.textContent = activePost.excerpt;
    if (bodyEl) {
        bodyEl.innerHTML = matchedPost.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
    }
    if (quoteTextEl) quoteTextEl.textContent = matchedPost.quote.text;
    if (quoteAuthorEl) quoteAuthorEl.textContent = matchedPost.quote.author.toUpperCase();

    if (tagsEl) {
        tagsEl.innerHTML = matchedPost.tags.map((tag) => {
            const label = tag.split("-").map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1)).join(" ");
            return `<button type="button" data-post-tag="${tag}">${label}</button>`;
        }).join("");

        tagsEl.querySelectorAll("[data-post-tag]").forEach((button) => {
            button.addEventListener("click", () => button.classList.toggle("active"));
        });
    }

    const currentIndex = posts.findIndex((post) => post.title === matchedPost.title);
    const prevIndex = currentIndex <= 0 ? posts.length - 1 : currentIndex - 1;
    if (prevLinkEl) {
        const prevPost = posts[prevIndex];
        prevLinkEl.textContent = prevPost.title;
        prevLinkEl.addEventListener("click", (event) => {
            event.preventDefault();
            openPost(prevPost);
        });
    }

    categoryButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.detailCategory === matchedPost.detailCategory);
        button.addEventListener("click", () => {
            const selected = posts.find((post) => post.detailCategory === button.dataset.detailCategory);
            if (selected) openPost(selected);
        });
    });

    tagButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selected = posts.find((post) => post.tags.includes(button.dataset.detailTag));
            if (selected) openPost(selected);
        });
    });

    if (searchInput) {
        const applySearch = () => renderRelatedPosts(searchInput.value || "");
        searchInput.addEventListener("input", applySearch);
        if (searchBtn) searchBtn.addEventListener("click", applySearch);
    }

    if (commentForm && commentName && commentEmail && commentMessage) {
        commentForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = commentName.value.trim();
            const email = commentEmail.value.trim();
            const message = commentMessage.value.trim();

            if (!name || !email || !message) {
                if (commentNotice) commentNotice.textContent = "Please fill in all fields.";
                return;
            }

            commentState.push({
                name,
                date: new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }),
                message
            });

            renderComments();
            commentForm.reset();
            if (commentNotice) commentNotice.textContent = "Comment posted successfully.";
        });
    }

    renderRelatedPosts();
    renderComments();
}

// FOOTER IMG SLIDE
if (typeof Swiper !== "undefined" && document.querySelector(".mySwiper")) {
    new Swiper(".mySwiper", {
        loop: true,
        spaceBetween: 20,

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 4,
            }
        }
    });
}
