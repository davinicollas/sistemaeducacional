(function () {
  function addToken(form) {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (!meta || !form || form.querySelector('input[name="_csrf"]')) return;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "_csrf";
    input.value = meta.content;
    form.appendChild(input);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("form").forEach(addToken);
  });

  document.addEventListener("submit", function (event) {
    addToken(event.target);
  }, true);

  window.addCsrfToken = addToken;
})();