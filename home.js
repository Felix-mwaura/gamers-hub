// Swiper is installed via npm (see package.json). We import the prebuilt ESM
// bundle with a relative path so the site works with no bundler/build step —
// just serve the folder over HTTP.
import Swiper from './node_modules/swiper/swiper-bundle.mjs';

/* Featured products carousel */
const featuredSwiper = new Swiper('#featured-swiper', {
    loop: true,
    grabCursor: true,
    keyboard: { enabled: true },
    slidesPerView: 1,
    spaceBetween: 24,
    autoplay: {
        delay: 3000, // change slide every 3 seconds
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    pagination: {
        el: '#featured-swiper .swiper-pagination',
        clickable: true
    },
    navigation: {
        nextEl: '#featured-swiper .swiper-button-next',
        prevEl: '#featured-swiper .swiper-button-prev'
    },
    breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
    }
});

/* Keep a handle around for debugging in the console */
window.featuredSwiper = featuredSwiper;

//Function for typewriter
const text = "In a world owned by data, rebellion begins with a single line of corrupted code.Dive into the world of cyberpunk2077 gameplay and experience an asthetic feel"
const delayBetween = 1500; // time before erasing or typing again

let i = 0;
let isDeleting = false;
const el = document.getElementById("type-text");

function typeEffect() {
  if (!isDeleting && i <= text.length) {
    el.innerHTML = text.substring(0, i);
    i++
    setTimeout(typeEffect, typingSpeed);
  } else if (isDeleting && i >= 0) {
    el.innerHTML = text.substring(0, i);
    i--;
    setTimeout(typeEffect, erasingSpeed);
  } else {
    isDeleting = !isDeleting;
    setTimeout(typeEffect, delayBetween);
  }
}
const typingSpeed = 150;
const erasingSpeed = 100;


typeEffect();

//other type writer
function typeWriter(elementId, text, speed = 100) {
  let i = 0;
  const el = document.getElementById(elementId);

  function type() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Apply typewriter to multiple elements
typeWriter("type-header", "Welcome to Gamers Hub Store", 200);
