const systemFilter = document.querySelector("#system-filter");
const tableSearch = document.querySelector("#table-search");
const tableCards = [...document.querySelectorAll(".table-card")];
const emptyState = document.querySelector("#empty-state");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

function filterTables() {
  const selectedSystem = systemFilter.value;
  const searchTerm = tableSearch.value.trim().toLocaleLowerCase("pt-BR");
  let visibleCount = 0;

  for (const card of tableCards) {
    const matchesSystem = selectedSystem === "todos" || card.dataset.system === selectedSystem;
    const matchesSearch = card.dataset.search.includes(searchTerm);
    const isVisible = matchesSystem && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  }

  emptyState.hidden = visibleCount > 0;
}

systemFilter.addEventListener("change", filterTables);
tableSearch.addEventListener("input", filterTables);

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  }
});
