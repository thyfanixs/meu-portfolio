const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const currentPage = document.body.dataset.page;
document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === currentPage) {
    link.classList.add("active");
  }
});

if (cursor && cursorRing && window.matchMedia("(pointer: fine)").matches) {
  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener("mousemove", (event) => {
    mx = event.clientX;
    my = event.clientY;
    cursor.style.left = `${mx - 6}px`;
    cursor.style.top = `${my - 6}px`;
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = `${rx - 18}px`;
    cursorRing.style.top = `${ry - 18}px`;
    requestAnimationFrame(animateRing);
  }

  animateRing();

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(2)";
      cursorRing.style.transform = "scale(1.45)";
      cursorRing.style.opacity = "1";
    });
    element.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)";
      cursorRing.style.transform = "scale(1)";
      cursorRing.style.opacity = "0.5";
    });
  });
}
