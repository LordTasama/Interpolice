(function () {
  // DataTable
  let dataTable;

  const dataTableOptions = {
    //scrollX: "2000px",
    destroy: true,
    lengthMenu: [5, 10, 15, 50, 100, 250, 500],
    columnDefs: [
      { className: "start", targets: [0, 1, 2, 3, 4, 5, 7, 8] },
      { className: "centered", targets: [6] },
      { orderable: false, targets: [4, 5, 6, 7, 8] },
      { searchable: false, targets: [7, 8] },
      //{ width: "50%", targets: [0] }
    ],
    pageLength: 5,
    destroy: true,
    language: {
      lengthMenu: "Mostrar _MENU_ usuarios por página",
      zeroRecords: "Ningún usuario encontrado",
      info: "Mostrando _START_ a _END_ usuarios de _TOTAL_ ",
      infoEmpty: "Ningún usuario encontrado",
      infoFiltered: "(filtrados desde _MAX_ usuarios totales)",
      search: "Buscar:",
      loadingRecords: "Cargando...",
      paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior",
      },
    },
  };

  const tableUsers = document.querySelector("#tableUsers");
  // const tableHistory = document.querySelector("#tableHistory");
  let idEditDelete = -1;
  let namee = "";
  let lastname = "";
  let rank = "";
  let email = "";
  let password = "";
  let photo = "";

  async function getOnlyOne(id, pass) {
    try {
      const response = await fetch("http://localhost:3000/user/find/" + id);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const datos = await response.json();
      console.log(datos[0].password);
      if (datos[0].password == pass) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Hubo un error al obtener los datos:", error);
      throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
    }
  }

  async function getData() {
    try {
      const response = await fetch("http://localhost:3000/user/list");
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const datos = await response.json();

      return datos;
    } catch (error) {
      console.error("Hubo un error al obtener los datos:", error);
      throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
    }
  }

  async function tableDownload() {
    try {
      // Esperar a que los datos estén disponibles antes de continuar
      const data = await getData();
      tableUsers.innerHTML = "";
      const campos = [
        "id",
        "name",
        "lastname",
        "rank",
        "email",
        "password",
        "photo",
      ];
      data.forEach((user) => {
        let row = document.createElement("tr");
        let column;

        campos.forEach((info) => {
          column = document.createElement("td");
          column.textContent = user[info];

          if (info == "rank") {
            column.textContent =
              user.rank == 1
                ? "Commander"
                : user.rank == 2
                ? "Major"
                : user.rank == 3
                ? "Inspector"
                : user.rank == 4
                ? "Official"
                : "Police";
          }

          row.appendChild(column);
        });
        column = document.createElement("td");
        column.innerHTML = `  <a
        href="#editUserModal"
        class="edit"
        data-bs-toggle="modal">
        <i class="material-icons"
          data-bs-toggle="tooltip"
          title="Edit"
          >&#xE254;</i>
          </a>`;

        row.appendChild(column);
        column = document.createElement("td");
        column.innerHTML = `
        <a
          href="#deleteUserModal"
          class="delete"
          data-bs-toggle="modal"
          ><i
            class="material-icons"
            data-bs-toggle="tooltip"
            title="Delete"
            >&#xE872;</i
          ></a
        >`;
        row.appendChild(column);
        tableUsers.appendChild(row);
      });
      return true;
    } catch (error) {
      // Manejar errores
      console.error("Ocurrió un error:", error);
      return false;
    }
  }

  async function loadTable() {
    if (await tableDownload()) {
      dataTable = $("#dataTable").DataTable(dataTableOptions);
      dataTable.on("draw.dt", () => {
        addEventTable();
      });
      dataTableIsInitialized = true;
      addEventTable();
    }
  }

  loadTable();

  function addEventTable() {
    for (let i = 0; i < tableUsers.rows.length; i++) {
      tableUsers.rows[i].cells[7].addEventListener("click", () => {
        idEditDelete = tableUsers.rows[i].cells[0].innerHTML;
        namee = tableUsers.rows[i].cells[1].innerHTML;
        lastname = tableUsers.rows[i].cells[2].innerHTML;
        rank = tableUsers.rows[i].cells[3].innerHTML;
        email = tableUsers.rows[i].cells[4].innerHTML;
        password = tableUsers.rows[i].cells[5].innerHTML;
        photo =
          tableUsers.rows[i].cells[6].innerHTML == null
            ? tableUsers.rows[i].cells[7].innerHTML == undefined
            : "";

        const editName = document.querySelector("#editName");
        const editLastname = document.querySelector("#editLastname");
        const editRank = document.querySelector("#editRank");
        const editEmail = document.querySelector("#editEmail");
        const editPassword = document.querySelector("#editPassword");
        const editPhoto = document.querySelector("#editPhoto");
        editName.value = namee;
        editLastname.value = lastname;
        editRank.value = rank;
        editEmail.value = email;
        editPassword.value = password;
        editPhoto.value = photo;
        editRank.selectedIndex =
          rank == "Commander"
            ? 0
            : rank == "Major"
            ? 1
            : rank == "Inspector"
            ? 2
            : rank == "Official"
            ? 3
            : 4;
      });
      tableUsers.rows[i].cells[8].addEventListener("click", () => {
        idEditDelete = tableUsers.rows[i].cells[0].innerHTML;
      });
    }
  }

  const deleteUser = document.querySelector("#deleteUser");
  const editUser = document.querySelector("#editUser");
  const postUser = document.querySelector("#postUser");

  deleteUser.addEventListener("click", () => {
    fetch("http://localhost:3000/user/delete/" + idEditDelete, {
      method: "DELETE",
    });

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Usuario eliminado correctamente",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      location.href = "./table-user.html";
    });
  });

  editUser.addEventListener("click", async () => {
    const editName = document.querySelector("#editName");
    const editLastname = document.querySelector("#editLastname");
    const editRank = document.querySelector("#editRank");
    const editEmail = document.querySelector("#editEmail");
    const editPassword = document.querySelector("#editPassword");

    const editPhoto = document.querySelector("#editPhoto");
    if (
      editName.value != "" &&
      editLastname.value != "" &&
      editEmail.value != "" &&
      editPassword.value != ""
    ) {
      if (!(await getOnlyOne(idEditDelete, editPassword.value))) {
        let hash = md5(editPassword.value);
        if (editEmail.value.includes("@") && editEmail.value.includes(".")) {
          fetch("http://localhost:3000/user/update/" + idEditDelete, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: editName.value,
              lastname: editLastname.value,
              rank: editRank.value,
              email: editEmail.value,
              password: hash,
              photo: editPhoto.value,
            }),
          });
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuario actualizado correctamente",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            location.href = "./table-user.html";
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Correo electrónico no válido",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        if (editEmail.value.includes("@") && editEmail.value.includes(".")) {
          fetch("http://localhost:3000/user/update/" + idEditDelete, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: editName.value,
              lastname: editLastname.value,
              rank: editRank.value,
              email: editEmail.value,
              password: editPassword.value,
              photo: editPhoto.value,
            }),
          });
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuario actualizado correctamente",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            location.href = "./table-user.html";
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Correo electrónico no válido",
            showConfirmButton: false,
            timer: 1500,
          });
        }
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

  postUser.addEventListener("click", () => {
    const postName = document.querySelector("#postName");
    const postLastname = document.querySelector("#postLastname");
    const postRank = document.querySelector("#postRank");
    const postEmail = document.querySelector("#postEmail");
    const postPassword = document.querySelector("#postPassword");
    const postPhoto = document.querySelector("#postPhoto");
    if (
      postName.value != "" &&
      postLastname.value != "" &&
      postEmail.value != "" &&
      postPassword.value != ""
    ) {
      if (postEmail.value.includes("@") && postEmail.value.includes(".")) {
        fetch("http://localhost:3000/user/create/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: postName.value,
            lastname: postLastname.value,
            rank: postRank.value,
            email: postEmail.value,
            password: postPassword.value,
            photo: postPhoto.value,
          }),
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario registrado correctamente",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          location.href = "./table-user.html";
        });
        postName.value = "";
        postLastname.value = "";
        postRank.selectedIndex = 0;
        postEmail.value = "";
        postPassword.value = "";
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Correo electrónico no válido",
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

  document.querySelector("#showPassPost").addEventListener("click", () => {
    let postPassword = document.querySelector("#postPassword");

    postPassword.type = postPassword.type == "text" ? "password" : "text";
  });
  document.querySelector("#showPassEdit").addEventListener("click", () => {
    let editPassword = document.querySelector("#editPassword");

    editPassword.type = editPassword.type == "text" ? "password" : "text";
  });

  document.querySelector("#clearInputPost").addEventListener("click", () => {
    const postPassword = document.querySelector("#postPassword");
    postPassword.value = "";
  });
  document.querySelector("#clearInputEdit").addEventListener("click", () => {
    const editPassword = document.querySelector("#editPassword");
    editPassword.value = "";
  });
})();
