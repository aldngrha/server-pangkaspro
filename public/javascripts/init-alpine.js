document.addEventListener("alpine:init", () => {
  // Stores variable globally
  Alpine.store("sidebar", {
    openMenu: false,
  });
});
