let currentIndex = 0;

function showNextSlide() {
    const slides = document.querySelector('.slides');
    currentIndex = (currentIndex + 1) % 3; // 3 images in total
    slides.style.transform = `translateX(-${currentIndex * 600}px)`;
}

setInterval(showNextSlide, 3000); // Change slide every 3 seconds

//Function for typewriter
const text = "In a world owned by data, rebellion begins with a single line of corrupted code.Dive into the world of cyberpunk2077 gameplay and experience an asthetic feel"
const delayBetween = 1500; // time before erasing or typing again

let i = 0;
let isDeleting = false;
const el = document.getElementById("type-text");

function typeEffect() {
  if (!isDeleting && i <= text.length) {
    el.innerHTML = text.substring(0, i);
    i++;
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

