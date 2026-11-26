"use strict";
document.addEventListener("DOMContentLoaded", function() {

    /* Start Alle paginas hoofd navegatie menu */
    const menuToggle = document.querySelector('.menu-toggle');
    const navMain = document.getElementById('navMain');

    menuToggle.addEventListener('click', () => {
        // Wissel de 'is-open' class om het menu te tonen/verbergen
        const isOpen = navMain.classList.toggle('is-open');
        
        // Update accessibility (toegankelijkheid) en knoptekst
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.textContent = isOpen ? '✕ Sluiten' : '☰ Menu';
    });



    const sliderWrapper = document.getElementById('slider-wrapper');
const sliderTrack = document.getElementById('slider-track');
const dotsContainer = document.getElementById('slider-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const reviewForm = document.getElementById('review-form');

/* End Alle paginas hoofd navegatie menu */






/* Start Pagina5 Contact formulier */

const contactFormulier = document.getElementById("contactFormulier");
const formBevestiging = document.getElementById("formBevestiging");
const formFoutmelding = document.getElementById("formFoutmelding");

if (contactFormulier && formBevestiging && formFoutmelding) {
    const verzendKnop = contactFormulier.querySelector('button[type="submit"]');
    const origineleKnopTekst = verzendKnop ? verzendKnop.textContent : "Verzend bericht";

    contactFormulier.addEventListener("submit", async (e) => {
        // Houdt de browser op de huidige pagina (stopt de standaard Formspree-pagina)
        e.preventDefault();

        const naam = document.getElementById("naam").value.trim();
        const email = document.getElementById("email").value.trim();
        const tel = document.getElementById("tel").value.trim();
        const vraagWens = document.getElementById("vraagWens").value.trim();

        const emailGeldig = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Controleer verplichte velden
        if (!naam || !emailGeldig || !tel || !vraagWens) {
            formBevestiging.hidden = true;
            formFoutmelding.textContent = "Vul alstublieft uw naam, een geldig e-mailadres, telefoonnummer en bericht in.";
            formFoutmelding.hidden = false;
            return;
        }

        formFoutmelding.hidden = true;
        formBevestiging.hidden = true;

        if (verzendKnop) {
            verzendKnop.disabled = true;
            verzendKnop.textContent = "Bezig met verzenden...";
        }

        try {
            // Verzamelt alle ingevulde waarden (naam, email, tel, straat, huisnummer, toevoeging, postcode, stad, message)
            const formData = new FormData(contactFormulier);

            const response = await fetch(contactFormulier.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json" // Vertelt Formspree dat we JSON terug willen i.p.v. een redirect
                }
            });

            if (response.ok) {
                // Toon jouw eigen bevestigingsbericht uit de HTML
                formBevestiging.hidden = false;
                contactFormulier.reset();
                formBevestiging.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } else {
                const data = await response.json().catch(() => null);
                const foutTekst = data?.errors?.map(err => err.message).join(" ")
                    || "Verzenden is tijdelijk niet gelukt. Probeer het later opnieuw of bel ons direct.";
                formFoutmelding.textContent = foutTekst;
                formFoutmelding.hidden = false;
            }
        } catch (error) {
            formFoutmelding.textContent = "Er is een verbindingsfout opgetreden. Controleer uw internetverbinding en probeer het opnieuw.";
            formFoutmelding.hidden = false;
        } finally {
            if (verzendKnop) {
                verzendKnop.disabled = false;
                verzendKnop.textContent = origineleKnopTekst;
            }
        }
    });
}

/* End Pagina5 Contact formulier */




/* Recenties */

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
