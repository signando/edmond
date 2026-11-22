"use strict";
document.addEventListener("DOMContentLoaded", function() {
    const nav = document.getElementById('navMain');
    const toggleBtn = document.querySelector('.menu-toggle');
    const submenuTriggers = document.querySelectorAll('.h2-airco, .h2-verwarming, .h3-central-ver, .h3-radiatoren-ver');

    function toggleMenu() {
        if (!nav) return;

        const isOpen = nav.classList.toggle('active');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', String(isOpen));
            toggleBtn.textContent = isOpen ? '✕ Sluiten' : '☰ Menu';
        }
    }

    function toggleSubmenu(element) {
        if (window.innerWidth > 992 || !element) return;

        const submenu = element.nextElementSibling;
        if (!submenu) return;

        const isOpen = submenu.classList.toggle('open');
        element.setAttribute('aria-expanded', String(isOpen));
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMenu);
    }

    submenuTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            toggleSubmenu(trigger);
        });

        trigger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleSubmenu(trigger);
            }
        });
    });

    // Reset mobiele open-status als het scherm naar desktop wordt vergroot
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            document.querySelectorAll('.nav-hidden-cont.open, .verwarming.open').forEach((el) => {
                el.classList.remove('open');
            });
            document.querySelectorAll('.nav-main [aria-expanded="true"]').forEach((el) => {
                el.setAttribute('aria-expanded', 'false');
            });
        }
    });



    const sliderWrapper = document.getElementById('slider-wrapper');
const sliderTrack = document.getElementById('slider-track');
const dotsContainer = document.getElementById('slider-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const reviewForm = document.getElementById('review-form');

// Standaard recensies
const defaultReviews = [
    {
        name: "Sophie de Jong",
        city: "Rotterdam",
        rating: 5,
        text: "Snelle en vakkundige service bij het plaatsen en onderhouden van onze klimaatinstallatie."
    },
    {
        name: "Mark van Beek",
        city: "Utrecht",
        rating: 5,
        text: "Duidelijke communicatie, nette monteurs en alles werkt naar behoren."
    },
    {
        name: "Lisa Bakker",
        city: "Eindhoven",
        rating: 4,
        text: "Erg tevreden over het advies en de snelle hulp bij het onderhoud."
    }
];

let reviews = JSON.parse(localStorage.getItem('sliderReviews')) || defaultReviews;
let currentIndex = 0;
let autoSlideInterval;

// Sterren genereren
function generateStars(rating) {
    const safeRating = Math.min(5, Math.max(1, Number(rating) || 5));
    return '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating);
}

// Slides en bolletjes opbouwen
function renderSlider() {
    sliderTrack.innerHTML = '';
    dotsContainer.innerHTML = '';

    reviews.forEach((review, index) => {
        const slide = document.createElement('div');
        slide.className = 'review-slide';

        const stars = document.createElement('div');
        stars.className = 'stars';
        stars.textContent = generateStars(review.rating);

        const text = document.createElement('p');
        text.className = 'review-text';
        text.textContent = `"${review.text}"`;

        const name = document.createElement('h4');
        name.className = 'client-name';
        name.textContent = review.name || 'Anonieme klant';

        const city = document.createElement('span');
        city.className = 'client-role';
        city.textContent = review.city || 'Nederland';

        slide.append(stars, text, name, city);
        sliderTrack.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Ga naar recensie ${index + 1}`);
        if (index === currentIndex) dot.classList.add('active');

        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });

        dotsContainer.appendChild(dot);
    });

    updateSliderPosition();
}

    // Slider verschuiven
    function updateSliderPosition() {
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        if (reviews.length === 0) return;
        currentIndex = (index + reviews.length) % reviews.length;
        updateSliderPosition();
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Pijlknoppen
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
    });

    // Pauzeren bij hover
    sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
    sliderWrapper.addEventListener('mouseleave', startAutoSlide);

    // Nieuwe recensie toevoegen via formulier
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const rawName = document.getElementById('reviewer-name').value.trim();
        const city = document.getElementById('reviewer-city').value.trim();
        const rating = parseInt(document.getElementById('reviewer-rating').value, 10);
        const text = document.getElementById('reviewer-text').value.trim();

        // Stad en tekst zijn verplicht; naam is optioneel
        if (!city || !text) return;

        const name = rawName || 'Anonieme klant';
        const newReview = { name, city, rating, text };

        reviews.unshift(newReview);
        localStorage.setItem('sliderReviews', JSON.stringify(reviews));

        currentIndex = 0;
        renderSlider();
        resetAutoSlide();

        reviewForm.reset();
    });

    // Initialiseren bij laden van de pagina
    renderSlider();
    startAutoSlide();
});
