// document.addEventListener("DOMContentLoaded", function () {
// gsap.registerPlugin(ScrollTrigger);

// console.log("document loaded");

const frameImgs = document.querySelectorAll(".frame_images img");
const items = document.querySelectorAll(".frame_content");
const rotatingImg = document.querySelector(".rotating_image");
const bottomTxt = document.querySelector(".bottom_text");
const dotContainer = document.querySelector(".dot-container");

const isMobile = window.innerWidth <= 968;

const translateAxis = isMobile ? "y" : "x";
const translateValue = isMobile ? "0%" : "calc(40% - 100px)";

gsap.from(".center_image", {
  opacity: 0,
  y: "400px",
  delay: 0.8,
  duration: 0.3,
});
gsap.from(frameImgs[0], {
  x: "-100%",
  duration: 0.2,
  delay: 1,
});
gsap.from(".frame_title_1", {
  opacity: 0,
  x: "-40px",
  delay: 1,
  duration: 0.2,
});
gsap.from(".frame_title_2", {
  opacity: 0,
  x: "-40px",
  duration: 0.2,
  delay: 1.05,
});
gsap.from(".bottom_text", {
  opacity: 0,
  bottom: "-60%",
  duration: 0.23,
  delay: 1,
  ease: "easeInOut",
});

let currentIndex = 0;
let isAnimating = false;

items.forEach((item, index) => {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  dot.dataset.index = index;
  dotContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");
updateDots();

function showSlide(index, prev = false) {
  if (isAnimating || index < 0 || index >= items.length) return;
  isAnimating = true;

  const odd = index % 2 === 0;

  const tl = gsap.timeline({
    onComplete: () => {
      currentIndex = index;
      isAnimating = false;
      updateDots();
    },
  });

  tl.to(
    bottomTxt,
    {
      opacity: 0,
      duration: 0.1,
      bottom: odd ? "-10%" : "40%",
    },
    0
  )
    .to(
      rotatingImg,
      {
        rotate: prev ? "-=180" : "+=180",
        duration: 0.7,
        ease: "power2.inOut",
        top: isMobile && (odd ? "60%" : "40%"),
      },
      0
    )
    .to(
      bottomTxt,
      {
        opacity: 1,
        duration: 0.2,
        bottom: odd ? "-5%" : "50%",
      },
      1
    )
    .to(
      items[currentIndex],
      {
        [translateAxis]: "-200%",
        duration: 0.1,
        opacity: 0,
        ease: "power2.inOut",
      },
      0
    )
    .fromTo(
      items[index],
      {
        [translateAxis]: "-200%",
        opacity: 0,
      },
      {
        [translateAxis]: translateValue,
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
      },
      1
    )
    .to(
      frameImgs[currentIndex],
      {
        opacity: 0.1,
        zIndex: 6,
      },
      0
    )
    .fromTo(
      frameImgs[index],
      {
        x: "-100%",
        opacity: 0,
      },
      {
        x: "0%",
        opacity: 1,
        duration: 0.5,
        zIndex: 8,
        ease: "power2.inOut",
      },
      0
    );
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1, true);
}

function updateDots() {
  dots.forEach((dot) => {
    dot.classList.remove("active", "clickable");
  });
  dots[currentIndex].classList.add("active");
  if (dots[currentIndex + 1]) {
    dots[currentIndex + 1].classList.add("clickable");
  }
  if (dots[currentIndex - 1]) {
    dots[currentIndex - 1].classList.add("clickable");
  }
}

dots.forEach((dot) => {
  dot.addEventListener("click", (event) => {
    const index = parseInt(event.target.dataset.index);
    let previo = index <= currentIndex;
    if (dot.classList.contains("clickable")) {
      showSlide(index, previo);
    }
  });
});

gsap.set(items, { [translateAxis]: "-200%" });
gsap.set(items[0], { [translateAxis]: "0%" });
gsap.set(bottomTxt, { bottom: 0 });

function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

window.addEventListener(
  "wheel",
  debounce((event) => {
    if (event.deltaY > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }, 100)
);

let touchStartY = 0;
window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientY;
});
window.addEventListener(
  "touchmove",
  debounce((event) => {
    const touchEndY = event.touches[0].clientY;
    if (touchStartY > touchEndY + 50) {
      nextSlide();
    } else if (touchStartY < touchEndY - 50) {
      prevSlide();
    }
  }, 100)
);
