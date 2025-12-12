// MENU MOBILE
function toggleMenu() {
    document.getElementById("menuMobile").classList.toggle("open");
}

// SLIDER
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("ativo"));
    dots.forEach(dot => dot.classList.remove("ativo"));

    slides[i].classList.add("ativo");
    dots[i].classList.add("ativo");

    slideIndex = i;
}

function mudarSlide(i) {
    showSlide(i);
}

// Troca automática
setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
}, 5000);
