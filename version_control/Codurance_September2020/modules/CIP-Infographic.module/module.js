"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const infographic = document.querySelector(".infographic__figure");
  const observer = new IntersectionObserver(executePulseAnimation, {
    threshold: 1.0
  });

  observer.observe(infographic);

  function executePulseAnimation(entries) {
    const tooltipNumbers = document.querySelectorAll(".tooltip__number");
    const pulseKeyframes = [
      {
        boxShadow: "0 0 0 0px rgba(0, 0, 0, 0.2)"
      },
      {
        boxShadow: "0 0 0 20px rgba(0, 0, 0, 0)"
      }
    ];

    entries.forEach((entry) => {
      if (entry.intersectionRatio === 1) {
        tooltipNumbers.forEach((tooltipNumber) =>
          tooltipNumber.animate(pulseKeyframes, 2000)
        );

        observer.unobserve(infographic);
      }
    });
  }
});
