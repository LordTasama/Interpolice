(function () {
  document.getElementById("closeSession").addEventListener("click", () => {
    localStorage.setItem("token", JSON.stringify({ token: "No-token" }));
  });
})();
