const carousel = document.querySelector(".hero-carousel");

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const nextButton = carousel.querySelector(".carousel-next");
    const prevButton = carousel.querySelector(".carousel-prev");
    const dotsContainer = carousel.querySelector(".carousel-dots");
    let activeIndex = 0;
    let autoplayId;

    const dots = slides.map((slide, index) => {
        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Show slide ${index + 1}`);
        dot.addEventListener("click", () => {
            showSlide(index);
            restartAutoplay();
        });
        dotsContainer.appendChild(dot);
        return dot;
    });

    function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("active", slideIndex === activeIndex);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === activeIndex);
        });
    }

    function nextSlide() {
        showSlide(activeIndex + 1);
    }

    function prevSlide() {
        showSlide(activeIndex - 1);
    }

    function startAutoplay() {
        autoplayId = setInterval(nextSlide, 3500);
    }

    function restartAutoplay() {
        clearInterval(autoplayId);
        startAutoplay();
    }

    nextButton.addEventListener("click", () => {
        nextSlide();
        restartAutoplay();
    });

    prevButton.addEventListener("click", () => {
        prevSlide();
        restartAutoplay();
    });

    showSlide(activeIndex);
    startAutoplay();
}
