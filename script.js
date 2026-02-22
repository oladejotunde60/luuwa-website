/* ============================================
   LUUWA — Main JavaScript
   ============================================ */

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => preloader.remove(), 600);
        }, 800);
    }

    // Init AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
        });
    }

    // Counter animation
    animateCounters();

    // Load approved reviews
    loadApprovedReviews();
});

// ============================================
// NAVBAR
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Scroll effect
window.addEventListener('scroll', () => {
    if (navbar && !navbar.classList.contains('navbar-solid')) {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Back to top button
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        if (window.scrollY > 500) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    }
});

// Mobile toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// HERO SLIDER
// ============================================
const heroSlides = document.querySelectorAll('.hero-slide');
const sliderDots = document.querySelectorAll('.dot');
let currentSlide = 0;

function changeSlide(index) {
    heroSlides.forEach(s => s.classList.remove('active'));
    sliderDots.forEach(d => d.classList.remove('active'));
    currentSlide = index;
    if (heroSlides[currentSlide]) heroSlides[currentSlide].classList.add('active');
    if (sliderDots[currentSlide]) sliderDots[currentSlide].classList.add('active');
}

if (heroSlides.length > 1) {
    setInterval(() => {
        changeSlide((currentSlide + 1) % heroSlides.length);
    }, 5000);

    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            changeSlide(parseInt(dot.dataset.slide));
        });
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        if (!target) return;

        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
            } else {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            }
        };

        // Use IntersectionObserver to start counting when visible
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    update();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// ============================================
// GALLERY FILTER
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.classList.remove('hidden');
                item.style.display = '';
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });
    });
});

// ============================================
// LIGHTBOX
// ============================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lightboxIndex = 0;
let visibleGalleryImages = [];

function openLightbox(index) {
    visibleGalleryImages = [...document.querySelectorAll('.gallery-item:not(.hidden) img')];
    lightboxIndex = index;
    if (lightboxImg && visibleGalleryImages[lightboxIndex]) {
        lightboxImg.src = visibleGalleryImages[lightboxIndex].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
        // Find index among visible items
        const visible = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
        const idx = visible.indexOf(item);
        openLightbox(idx >= 0 ? idx : 0);
    });
});

if (lightbox) {
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev')?.addEventListener('click', () => {
        lightboxIndex = (lightboxIndex - 1 + visibleGalleryImages.length) % visibleGalleryImages.length;
        lightboxImg.src = visibleGalleryImages[lightboxIndex].src;
    });
    document.querySelector('.lightbox-next')?.addEventListener('click', () => {
        lightboxIndex = (lightboxIndex + 1) % visibleGalleryImages.length;
        lightboxImg.src = visibleGalleryImages[lightboxIndex].src;
    });

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev')?.click();
        if (e.key === 'ArrowRight') document.querySelector('.lightbox-next')?.click();
    });
}

// ============================================
// TESTIMONIAL SLIDER
// ============================================
const testTrack = document.getElementById('testimonialTrack');
const testPrev = document.getElementById('testPrev');
const testNext = document.getElementById('testNext');
let testIndex = 0;

function updateTestSlider() {
    if (!testTrack) return;
    const cards = testTrack.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 24; // gap
    const visibleCount = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    const maxIndex = Math.max(0, cards.length - visibleCount);
    testIndex = Math.min(testIndex, maxIndex);
    testTrack.style.transform = `translateX(-${testIndex * cardWidth}px)`;
}

if (testPrev && testNext) {
    testPrev.addEventListener('click', () => {
        testIndex = Math.max(0, testIndex - 1);
        updateTestSlider();
    });
    testNext.addEventListener('click', () => {
        testIndex++;
        updateTestSlider();
    });
    window.addEventListener('resize', updateTestSlider);
}

// ============================================
// CONTACT FORM -> WHATSAPP
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('contactName').value;
        const phone = document.getElementById('contactPhone').value;
        const message = document.getElementById('contactMessage').value;

        const text = `Hello Luuwa!%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Message:* ${encodeURIComponent(message)}`;
        window.open(`https://wa.me/2347032947078?text=${text}`, '_blank');
    });
}

// ============================================
// ORDER FORM
// ============================================
const orderForm = document.getElementById('orderForm');

// Product checkbox handlers — show/hide conditional fields
document.querySelectorAll('input[name="products"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // Custom Cake details
        const cakeDetails = document.getElementById('cakeDetails');
        if (cakeDetails) {
            const cakeChecked = document.querySelector('input[value="Custom Cake"]')?.checked;
            cakeDetails.style.display = cakeChecked ? 'block' : 'none';
        }

        // Small Chops details
        const chopsDetails = document.getElementById('smallChopsDetails');
        if (chopsDetails) {
            const chopsChecked = document.querySelector('input[value="Small Chops"]')?.checked || 
                                 document.querySelector('input[value="Event Catering"]')?.checked;
            chopsDetails.style.display = chopsChecked ? 'block' : 'none';
        }

        // Bead details
        const beadDetails = document.getElementById('beadDetails');
        if (beadDetails) {
            const beadChecked = document.querySelector('input[value="Bead Accessories"]')?.checked;
            beadDetails.style.display = beadChecked ? 'block' : 'none';
        }

        updateOrderSummary();
    });
});

// Pre-select product from URL params
(function() {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');
    if (!product) return;

    const mapping = {
        'custom-cakes': 'Custom Cake',
        'small-chops': 'Small Chops',
        'plantain-chips': 'Plantain Chips',
        'drinks': 'Zobo Drink',
        'beads': 'Bead Accessories',
        'catering': 'Event Catering'
    };

    const value = mapping[product];
    if (value) {
        const checkbox = document.querySelector(`input[value="${value}"]`);
        if (checkbox) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        }
    }
})();

function updateOrderSummary() {
    const summary = document.getElementById('orderSummary');
    if (!summary) return;

    const selected = [...document.querySelectorAll('input[name="products"]:checked')].map(c => c.value);
    
    if (selected.length === 0) {
        summary.innerHTML = '<p class="empty-summary">Select products to see your order summary</p>';
        return;
    }

    const icons = {
        'Custom Cake': 'fa-birthday-cake',
        'Small Chops': 'fa-utensils',
        'Plantain Chips': 'fa-cookie-bite',
        'Zobo Drink': 'fa-wine-bottle',
        'Fruit Juice': 'fa-glass-cheers',
        'Bead Accessories': 'fa-gem',
        'Event Catering': 'fa-concierge-bell'
    };

    let html = selected.map(p => `
        <div class="summary-item">
            <span><i class="fas ${icons[p] || 'fa-check'}"></i> ${p}</span>
            <span><i class="fas fa-check-circle" style="color: var(--success)"></i></span>
        </div>
    `).join('');

    const qty = document.getElementById('quantity')?.value || 1;
    const date = document.getElementById('deliveryDate')?.value || 'Not set';

    html += `
        <div class="summary-item" style="margin-top:12px; padding-top:12px; border-top:2px solid var(--gray-200);">
            <span><strong>Quantity:</strong></span>
            <span>${qty}</span>
        </div>
        <div class="summary-item">
            <span><strong>Delivery:</strong></span>
            <span>${date}</span>
        </div>
    `;

    summary.innerHTML = html;
}

// Listen for quantity/date changes
document.getElementById('quantity')?.addEventListener('change', updateOrderSummary);
document.getElementById('deliveryDate')?.addEventListener('change', updateOrderSummary);

// Set minimum delivery date to today
const deliveryDate = document.getElementById('deliveryDate');
if (deliveryDate) {
    const today = new Date().toISOString().split('T')[0];
    deliveryDate.min = today;
}

// Submit order to WhatsApp
if (orderForm) {
    orderForm.addEventListener('submit', e => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('deliveryAddress').value;
        const products = [...document.querySelectorAll('input[name="products"]:checked')].map(c => c.value);
        const quantity = document.getElementById('quantity').value;
        const delDate = document.getElementById('deliveryDate').value;
        const delTime = document.getElementById('deliveryTime')?.value || 'Not specified';
        const instructions = document.getElementById('specialInstructions')?.value || 'None';

        if (products.length === 0) {
            showToast('Please select at least one product', 'error');
            return;
        }

        // Generate Order ID
        const orderId = generateOrderId();

        // Build WhatsApp message
        let message = `🛒 *NEW ORDER — LUUWA*%0A`;
        message += `━━━━━━━━━━━━━━━━━%0A`;
        message += `*Order ID:* ${orderId}%0A%0A`;
        message += `👤 *Customer Details*%0A`;
        message += `*Name:* ${encodeURIComponent(fullName)}%0A`;
        message += `*Phone:* ${encodeURIComponent(phone)}%0A`;
        message += `*Email:* ${encodeURIComponent(email || 'N/A')}%0A`;
        message += `*Address:* ${encodeURIComponent(address)}%0A%0A`;
        message += `📦 *Order Details*%0A`;
        message += `*Products:* ${encodeURIComponent(products.join(', '))}%0A`;
        message += `*Quantity:* ${quantity}%0A`;

        // Cake details
        const cakeSize = document.getElementById('cakeSize')?.value;
        const cakeFlavor = document.getElementById('cakeFlavor')?.value;
        const cakeInscription = document.getElementById('cakeInscription')?.value;
        if (products.includes('Custom Cake')) {
            message += `%0A🎂 *Cake Details*%0A`;
            message += `*Size:* ${encodeURIComponent(cakeSize || 'Not specified')}%0A`;
            message += `*Flavor:* ${encodeURIComponent(cakeFlavor || 'Not specified')}%0A`;
            message += `*Inscription:* ${encodeURIComponent(cakeInscription || 'None')}%0A`;
        }

        // Small Chops details
        const chopsQty = document.getElementById('chopsQuantity')?.value;
        const chopsTypes = document.getElementById('chopsTypes')?.value;
        if (products.includes('Small Chops') || products.includes('Event Catering')) {
            message += `%0A🍢 *Small Chops/Catering Details*%0A`;
            message += `*Servings:* ${encodeURIComponent(chopsQty || 'Not specified')}%0A`;
            message += `*Types:* ${encodeURIComponent(chopsTypes || 'Not specified')}%0A`;
        }

        // Bead details
        const beadType = document.getElementById('beadType')?.value;
        if (products.includes('Bead Accessories')) {
            message += `%0A💎 *Bead Details*%0A`;
            message += `*Description:* ${encodeURIComponent(beadType || 'Not specified')}%0A`;
        }

        message += `%0A🚚 *Delivery*%0A`;
        message += `*Date:* ${encodeURIComponent(delDate)}%0A`;
        message += `*Time:* ${encodeURIComponent(delTime)}%0A%0A`;
        message += `📝 *Special Instructions:* ${encodeURIComponent(instructions)}%0A`;
        message += `━━━━━━━━━━━━━━━━━%0A`;
        message += `💳 *Payment:* Bank Transfer (details to be shared)%0A`;

        // Save order to localStorage
        saveOrder({
            id: orderId,
            name: fullName,
            phone: phone,
            email: email,
            address: address,
            products: products,
            quantity: quantity,
            deliveryDate: delDate,
            deliveryTime: delTime,
            instructions: instructions,
            status: 'received',
            date: new Date().toISOString(),
            timeline: {
                received: new Date().toISOString()
            }
        });

        showToast(`Order ${orderId} created! Redirecting to WhatsApp...`, 'success');

        setTimeout(() => {
            window.open(`https://wa.me/2347032947078?text=${message}`, '_blank');
        }, 1000);
    });
}

function generateOrderId() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `LUW-${date}-${rand}`;
}

// ============================================
// ORDER STORAGE (localStorage)
// ============================================
function saveOrder(order) {
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem('luuwa_orders', JSON.stringify(orders));
}

function getOrders() {
    try {
        return JSON.parse(localStorage.getItem('luuwa_orders')) || [];
    } catch {
        return [];
    }
}

function getOrderById(id) {
    // First check localStorage
    const orders = getOrders();
    const found = orders.find(o => o.id === id);
    if (found) return found;

    // Demo orders
    return getDemoOrder(id);
}

function getOrdersByPhone(phone) {
    const orders = getOrders();
    const cleanPhone = phone.replace(/\D/g, '');
    const found = orders.filter(o => o.phone.replace(/\D/g, '').includes(cleanPhone));
    
    // Add demo orders
    const demoOrders = getDemoOrders();
    return [...found, ...demoOrders];
}

function getDemoOrder(id) {
    const demos = {
        'LUW-20260222-001': {
            id: 'LUW-20260222-001',
            name: 'Adebola Johnson',
            phone: '08031234567',
            products: ['Custom Cake', 'Small Chops'],
            quantity: 1,
            deliveryDate: '2026-02-24',
            deliveryTime: 'Afternoon (12pm - 4pm)',
            address: '15 Lekki Phase 1, Lagos',
            status: 'preparing',
            date: '2026-02-22T10:30:00',
            timeline: {
                received: '2026-02-22T10:30:00',
                confirmed: '2026-02-22T11:15:00',
                preparing: '2026-02-22T14:00:00'
            }
        },
        'LUW-20260220-002': {
            id: 'LUW-20260220-002',
            name: 'Chioma Nwosu',
            phone: '08055678901',
            products: ['Plantain Chips', 'Zobo Drink'],
            quantity: 5,
            deliveryDate: '2026-02-21',
            deliveryTime: 'Morning (8am - 12pm)',
            address: '23 Allen Avenue, Ikeja',
            status: 'delivered',
            date: '2026-02-20T08:00:00',
            timeline: {
                received: '2026-02-20T08:00:00',
                confirmed: '2026-02-20T08:45:00',
                preparing: '2026-02-20T10:00:00',
                ready: '2026-02-20T16:00:00',
                transit: '2026-02-21T08:30:00',
                delivered: '2026-02-21T10:15:00'
            }
        },
        'LUW-20260218-003': {
            id: 'LUW-20260218-003',
            name: 'Emeka Obi',
            phone: '08098765432',
            products: ['Bead Accessories'],
            quantity: 3,
            deliveryDate: '2026-02-22',
            deliveryTime: 'Evening (4pm - 8pm)',
            address: '7 Victoria Island, Lagos',
            status: 'transit',
            date: '2026-02-18T15:00:00',
            timeline: {
                received: '2026-02-18T15:00:00',
                confirmed: '2026-02-18T16:30:00',
                preparing: '2026-02-19T09:00:00',
                ready: '2026-02-21T11:00:00',
                transit: '2026-02-22T08:00:00'
            }
        }
    };
    return demos[id] || null;
}

function getDemoOrders() {
    return [
        getDemoOrder('LUW-20260222-001'),
        getDemoOrder('LUW-20260220-002'),
        getDemoOrder('LUW-20260218-003')
    ];
}

// ============================================
// ORDER TRACKING
// ============================================
const trackForm = document.getElementById('trackForm');
const trackPhoneForm = document.getElementById('trackPhoneForm');

if (trackForm) {
    trackForm.addEventListener('submit', e => {
        e.preventDefault();
        const orderId = document.getElementById('orderIdInput').value.trim().toUpperCase();
        if (!orderId) return;

        const order = getOrderById(orderId);
        if (order) {
            displayOrderStatus(order);
        } else {
            hideAll();
            document.getElementById('noOrderWrap').style.display = 'block';
        }
    });
}

if (trackPhoneForm) {
    trackPhoneForm.addEventListener('submit', e => {
        e.preventDefault();
        const phone = document.getElementById('phoneInput').value.trim();
        if (!phone) return;

        const orders = getOrdersByPhone(phone);
        if (orders.length > 0) {
            displayOrdersList(orders);
        } else {
            hideAll();
            document.getElementById('noOrderWrap').style.display = 'block';
        }
    });
}

function hideAll() {
    document.getElementById('orderStatusWrap').style.display = 'none';
    document.getElementById('ordersListWrap').style.display = 'none';
    document.getElementById('noOrderWrap').style.display = 'none';
    document.getElementById('feedbackWrap').style.display = 'none';
}

function displayOrderStatus(order) {
    hideAll();
    document.getElementById('orderStatusWrap').style.display = 'block';

    // Header
    document.getElementById('displayOrderId').textContent = order.id;
    document.getElementById('orderDate').textContent = `Placed on ${formatDate(order.date)}`;

    // Status badge
    const badge = document.getElementById('statusBadge');
    const statusLabels = {
        received: 'Order Received',
        confirmed: 'Confirmed',
        preparing: 'Preparing',
        ready: 'Ready',
        transit: 'Out for Delivery',
        delivered: 'Delivered'
    };
    badge.textContent = statusLabels[order.status] || order.status;
    badge.className = `status-badge ${order.status}`;

    // Timeline
    const steps = ['received', 'confirmed', 'preparing', 'ready', 'transit', 'delivered'];
    const currentIdx = steps.indexOf(order.status);

    steps.forEach((step, i) => {
        const el = document.getElementById(`step-${step}`);
        const timeEl = document.getElementById(`time-${step}`);
        if (!el) return;

        el.classList.remove('active', 'completed');

        if (i < currentIdx) {
            el.classList.add('completed');
        } else if (i === currentIdx) {
            el.classList.add('active');
        }

        if (timeEl) {
            timeEl.textContent = order.timeline?.[step] ? formatDateTime(order.timeline[step]) : '';
        }
    });

    // Order details
    const detailsGrid = document.getElementById('orderDetailsGrid');
    if (detailsGrid) {
        detailsGrid.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Customer</span>
                <span class="detail-value">${order.name}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${order.phone}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Products</span>
                <span class="detail-value">${order.products.join(', ')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Quantity</span>
                <span class="detail-value">${order.quantity}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Delivery Date</span>
                <span class="detail-value">${order.deliveryDate}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Delivery Time</span>
                <span class="detail-value">${order.deliveryTime || 'Not specified'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Address</span>
                <span class="detail-value">${order.address || 'Not provided'}</span>
            </div>
        `;
    }

    // Show feedback button if delivered
    const feedbackBtn = document.getElementById('leaveFeedbackBtn');
    if (feedbackBtn) {
        feedbackBtn.style.display = order.status === 'delivered' ? 'inline-flex' : 'none';
        feedbackBtn.onclick = () => {
            document.getElementById('feedbackWrap').style.display = 'block';
            document.getElementById('feedbackOrderId').value = order.id;
            document.getElementById('feedbackName').value = order.name;
            document.getElementById('feedbackProduct').value = order.products.join(', ');
            document.getElementById('feedbackWrap').scrollIntoView({ behavior: 'smooth' });
        };
    }
}

function displayOrdersList(orders) {
    hideAll();
    document.getElementById('ordersListWrap').style.display = 'block';

    const tbody = document.getElementById('ordersTableBody');
    const statusLabels = {
        received: 'Received',
        confirmed: 'Confirmed',
        preparing: 'Preparing',
        ready: 'Ready',
        transit: 'In Transit',
        delivered: 'Delivered'
    };

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${formatDate(order.date)}</td>
            <td>${order.products.join(', ')}</td>
            <td><span class="status-badge ${order.status}">${statusLabels[order.status] || order.status}</span></td>
            <td><button class="btn btn-primary btn-sm" onclick="trackOrder('${order.id}')">View</button></td>
        </tr>
    `).join('');
}

// Global function for table buttons
window.trackOrder = function(orderId) {
    const order = getOrderById(orderId);
    if (order) {
        displayOrderStatus(order);
        document.getElementById('orderStatusWrap').scrollIntoView({ behavior: 'smooth' });
    }
};

// ============================================
// FEEDBACK SYSTEM
// ============================================
const feedbackFormEl = document.getElementById('feedbackForm');
const starRating = document.getElementById('starRating');
let currentRating = 0;

if (starRating) {
    starRating.querySelectorAll('i').forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.rating);
            document.getElementById('ratingValue').value = currentRating;
            updateStars();
        });

        star.addEventListener('mouseenter', () => {
            highlightStars(parseInt(star.dataset.rating));
        });
    });

    starRating.addEventListener('mouseleave', () => {
        updateStars();
    });
}

function highlightStars(rating) {
    starRating?.querySelectorAll('i').forEach((star, i) => {
        star.classList.toggle('active', i < rating);
    });
}

function updateStars() {
    highlightStars(currentRating);
}

if (feedbackFormEl) {
    feedbackFormEl.addEventListener('submit', e => {
        e.preventDefault();

        if (currentRating === 0) {
            showToast('Please select a rating', 'error');
            return;
        }

        const feedback = {
            orderId: document.getElementById('feedbackOrderId').value,
            name: document.getElementById('feedbackName').value,
            rating: currentRating,
            product: document.getElementById('feedbackProduct').value,
            text: document.getElementById('feedbackText').value,
            date: new Date().toISOString(),
            approved: false // Needs admin approval
        };

        // Save to localStorage
        saveFeedback(feedback);

        showToast('Thank you! Your feedback has been submitted for review.', 'success');
        document.getElementById('feedbackWrap').style.display = 'none';
        feedbackFormEl.reset();
        currentRating = 0;
        updateStars();
    });
}

function saveFeedback(feedback) {
    const feedbacks = getFeedbacks();
    feedbacks.push(feedback);
    localStorage.setItem('luuwa_feedbacks', JSON.stringify(feedbacks));
}

function getFeedbacks() {
    try {
        return JSON.parse(localStorage.getItem('luuwa_feedbacks')) || [];
    } catch {
        return [];
    }
}

function getApprovedFeedbacks() {
    const feedbacks = getFeedbacks();
    const approved = feedbacks.filter(f => f.approved);
    
    // Add demo reviews if no approved reviews exist
    if (approved.length === 0) {
        return [
            {
                name: 'Blessing A.',
                rating: 5,
                product: 'Custom Cake',
                text: 'The birthday cake was absolutely gorgeous and delicious! Everyone at the party loved it. Will definitely order again!',
                date: '2026-02-10T10:00:00',
                approved: true
            },
            {
                name: 'Oluwaseun D.',
                rating: 5,
                product: 'Small Chops & Zobo',
                text: 'Ordered small chops and zobo for my office party. The quality was top-notch and delivery was on time. Highly recommend Luuwa!',
                date: '2026-02-15T14:00:00',
                approved: true
            },
            {
                name: 'Amara I.',
                rating: 4,
                product: 'Bead Accessories',
                text: 'Beautiful handcrafted beads! I got compliments everywhere I wore them. The attention to detail is amazing.',
                date: '2026-02-18T09:00:00',
                approved: true
            }
        ];
    }
    return approved;
}

function loadApprovedReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    const reviews = getApprovedFeedbacks();
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="text-align:center; color: var(--text-light);">No reviews yet. Be the first to leave one!</p>';
        return;
    }

    reviewsList.innerHTML = reviews.map(r => `
        <div class="review-item">
            <div class="review-stars">
                ${'<i class="fas fa-star"></i>'.repeat(r.rating)}${'<i class="far fa-star"></i>'.repeat(5 - r.rating)}
            </div>
            <p class="review-text">"${r.text}"</p>
            <span class="review-author">${r.name}</span>
            ${r.product ? `<span class="review-product"> — ${r.product}</span>` : ''}
        </div>
    `).join('');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDate(dateStr) {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

function formatDateTime(dateStr) {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) + 
               ' at ' + d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return dateStr;
    }
}

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// ACTIVE NAV LINK on scroll
// ============================================
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);

        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});
