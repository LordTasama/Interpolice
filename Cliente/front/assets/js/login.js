(function () {
  if (localStorage.length == 0) {
    localStorage.setItem("token", JSON.stringify({ token: "abc" }));
  }
  fetch("http://localhost:3000/user/list", {
    headers: {
      Authorization: JSON.parse(localStorage.getItem("token")).token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.Codigo) {
        const btnLogin = document.querySelector("#btnLogin");
        async function getOnlyOne(email, pass) {
          try {
            const response = await fetch(
              "http://localhost:3000/user/login/" + email + "/" + md5(pass)
            );

            if (!response.ok) {
              throw new Error("Error al obtener los datos");
            }
            const datos = await response.json();
            if (datos.length == 1) {
              return true;
            } else {
              return false;
            }
          } catch (error) {
            console.error("Hubo un error al obtener los datos:", error);
            throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
          }
        }

        async function genToken(email, pass) {
          try {
            const response = await fetch("http://localhost:3000/token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: email,
                password: pass,
              }),
            });

            return JSON.stringify(await response.json());
          } catch (error) {
            console.error("Hubo un error al obtener los datos:", error);
            throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
          }
        }

        btnLogin.addEventListener("click", async () => {
          const userEmail = document.querySelector("#inputEmail");
          const inputPassword = document.querySelector("#inputPassword");
          if (userEmail.value != "" && inputPassword.value != "") {
            if (await getOnlyOne(userEmail.value, inputPassword.value)) {
              localStorage.setItem(
                "token",
                await genToken(userEmail.value, inputPassword.value)
              );
              location.href = "../../index.html";
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Correo o contraseña incorrecta",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Verifica si hay campos vacíos",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      } else {
        location.href = "../../index.html";
      }
    });
})();
