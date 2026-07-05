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

function initDataCanvas() {
  const canvas = document.getElementById("dataCanvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const context = canvas.getContext("2d");
  const pointer = { x: -1000, y: -1000 };
  let points = [];
  let frame;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const amount = Math.max(28, Math.min(72, Math.round(rect.width / 22)));
    points = Array.from({ length: amount }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.5 + 0.7
    }));
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    points.forEach((point) => {
      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 150 && distance > 0) {
        point.x += (dx / distance) * 0.65;
        point.y += (dy / distance) * 0.65;
      }
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;
    });

    for (let i = 0; i < points.length; i += 1) {
      for (let k = i + 1; k < points.length; k += 1) {
        const distance = Math.hypot(points[i].x - points[k].x, points[i].y - points[k].y);
        if (distance < 115) {
          context.strokeStyle = `rgba(0, 245, 160, ${0.15 * (1 - distance / 115)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(points[i].x, points[i].y);
          context.lineTo(points[k].x, points[k].y);
          context.stroke();
        }
      }
    }

    points.forEach((point) => {
      context.fillStyle = "rgba(232, 232, 240, 0.65)";
      context.beginPath();
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fill();
    });
    frame = requestAnimationFrame(draw);
  }

  canvas.parentElement.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });
  canvas.parentElement.addEventListener("pointerleave", () => {
    pointer.x = -1000;
    pointer.y = -1000;
  });
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(frame);
    if (!document.hidden) draw();
  });
  resize();
  draw();
}

function initVisitorCounter() {
  const code = document.querySelector('meta[name="goatcounter-code"]')?.content.trim();
  const stat = document.querySelector("[data-visitor-stat]");
  const count = document.querySelector("[data-visitor-count]");
  if (!code || !stat || !count) return;

  const tracker = document.createElement("script");
  tracker.async = true;
  tracker.src = "https://gc.zgo.at/count.js";
  tracker.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  document.body.appendChild(tracker);

  fetch(`https://${code}.goatcounter.com/counter/TOTAL.json`)
    .then((response) => {
      if (!response.ok) throw new Error("Contador indisponível");
      return response.json();
    })
    .then((data) => {
      count.textContent = data.count;
      stat.hidden = false;
    })
    .catch(() => {});
}

initDataCanvas();
initVisitorCounter();