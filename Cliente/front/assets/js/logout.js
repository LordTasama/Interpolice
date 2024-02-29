(function () {
  if (localStorage.length == 0) {
    localStorage.setItem("token", JSON.stringify({ token: "abc" }));
  }
  fetch("http://localhost:3000/user/login", {
    headers: {
      Authorization: JSON.parse(localStorage.getItem("token")).token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.respuesta) {
        document
          .getElementById("closeSession")
          .addEventListener("click", () => {
            localStorage.setItem(
              "token",
              JSON.stringify({ token: "No-token" })
            );
          });
      } else {
        location.href = "./front/html/auth-login-basic.html";
      }
    });
})();
