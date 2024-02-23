// Función para que no haya interferencias entre los dos archivos js
(function () {
  // DataTable
  let dataTable;

  const dataTableOptions = {
    //scrollX: "2000px",
    destroy: true,
    lengthMenu: [5, 10, 15, 50, 100, 250, 500],
    columnDefs: [
      { className: "start", targets: [0, 1, 2, 3, 4, 5, 7] },
      { orderable: false, targets: [6, 7] },
      { searchable: false, targets: [6, 7] },
      //{ width: "50%", targets: [0] }
    ],
    pageLength: 5,
    destroy: true,
    language: {
      lengthMenu: "Mostrar _MENU_ antecedentes por página",
      zeroRecords: "Ningún antecedente encontrado",
      info: "Mostrando _START_ a _END_ antecedentes de _TOTAL_ ",
      infoEmpty: "Ningún antecedente encontrado",
      infoFiltered: "(filtrados desde _MAX_ antecedentes totales)",
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
  const tableHistory = document.querySelector("#tableHistory");
  let idEditDelete = -1;
  let description = "";
  let date = "";
  let note = "";
  let id_citizen = -1;

  async function getOnlyOne(id) {
    try {
      const response = await fetch("http://localhost:3000/citizen/find/" + id, {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("token")).token,
          "Content-Type": "application/json",
        },
      });
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

  async function getData() {
    try {
      const response = await fetch("http://localhost:3000/history/list", {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("token")).token,
          "Content-Type": "application/json",
        },
      });
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
      tableHistory.innerHTML = "";
      const campos = ["id", "description", "date", "note", "id_citizen"];
      for (i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        let column;
        for (j = 0; j < campos.length; j++) {
          column = document.createElement("td");

          column.textContent = data[i][campos[j]];

          if (j == 2) {
            column.textContent = data[i][campos[j]].substring(0, 10);
          } else if (j == 4) {
            let dataOnlyOne = await getOnlyOne(data[i].id_citizen);

            column = document.createElement("td");
            column.textContent =
              dataOnlyOne[0].name + " " + dataOnlyOne[0].lastname;
            row.appendChild(column);
            column = document.createElement("td");
            column.textContent = data[i][campos[j]];
            row.appendChild(column);
            column = document.createElement("td");
            column.innerHTML = `<a
             href="#editHistoryModal"
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
               href="#deleteHistoryModal"
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
          }
          row.appendChild(column);
        }
        tableHistory.appendChild(row);
      }
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

  function addEventTable() {
    for (let i = 0; i < tableHistory.rows.length; i++) {
      tableHistory.rows[i].cells[6].addEventListener("click", () => {
        idEditDelete = tableHistory.rows[i].cells[0].innerHTML;
        description = tableHistory.rows[i].cells[1].innerHTML;
        date = tableHistory.rows[i].cells[2].innerHTML;
        note = tableHistory.rows[i].cells[3].innerHTML;
        id_citizen = tableHistory.rows[i].cells[5].innerHTML;

        const editDescription = document.querySelector("#editDescription");
        const editDate = document.querySelector("#editDate");
        const editNote = document.querySelector("#editNote");
        const editIdcitizen = document.querySelector("#editIdcitizen");

        editDescription.value = description;
        editDate.value = date;
        editNote.value = note;
        editIdcitizen.value = id_citizen;
      });
      tableHistory.rows[i].cells[7].addEventListener("click", () => {
        idEditDelete = tableHistory.rows[i].cells[0].innerHTML;
      });
    }
  }

  loadTable();
  const deleteHistory = document.querySelector("#deleteHistory");
  const editHistory = document.querySelector("#editHistory");
  const postHistory = document.querySelector("#postHistory");

  deleteHistory.addEventListener("click", () => {
    fetch("http://localhost:3000/history/delete/" + idEditDelete, {
      method: "DELETE",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("token")).token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Codigo) {
          Swal.fire({
            position: "center",
            icon: "error",
            title:
              "La sesión expiró o algo ocurrió... Intenta iniciar sesión de nuevo",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            location.href = "auth-login-basic.html";
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Antecedente eliminado correctamente",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            location.href = "./table-history.html";
          });
        }
      });
  });

  editHistory.addEventListener("click", () => {
    const editDescription = document.querySelector("#editDescription");
    const editDate = document.querySelector("#editDate");
    const editNote = document.querySelector("#editNote");
    const editIdcitizen = document.querySelector("#editIdcitizen");

    if (
      editDescription.value != "" &&
      editDate.value != "" &&
      editNote.value != "" &&
      editIdcitizen.value != ""
    ) {
      fetch("http://localhost:3000/history/update/" + idEditDelete, {
        method: "PUT",
        headers: {
          Authorization: JSON.parse(localStorage.getItem("token")).token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: editDescription.value,
          date: editDate.value,
          note: editNote.value,
          id_citizen: editIdcitizen.value,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.Codigo) {
            Swal.fire({
              position: "center",
              icon: "error",
              title:
                "La sesión expiró o algo ocurrió... Intenta iniciar sesión de nuevo",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              location.href = "auth-login-basic.html";
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Antecedente editado correctamente",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              location.href = "./table-history.html";
            });
          }
        });
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

  postHistory.addEventListener("click", () => {
    const postDescription = document.querySelector("#postDescription");
    const postDate = document.querySelector("#postDate");
    const postNote = document.querySelector("#postNote");
    const postIdcitizen = document.querySelector("#postIdcitizen");
    if (
      postDescription.value != "" &&
      postDate.value != "" &&
      postNote.value != "" &&
      postIdcitizen.value != ""
    ) {
      fetch("http://localhost:3000/history/create/", {
        method: "POST",
        headers: {
          Authorization: JSON.parse(localStorage.getItem("token")).token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: postDescription.value,
          date: postDate.value,
          note: postNote.value,
          id_citizen: postIdcitizen.value,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.Codigo) {
            Swal.fire({
              position: "center",
              icon: "error",
              title:
                "La sesión expiró o algo ocurrió... Intenta iniciar sesión de nuevo",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              location.href = "auth-login-basic.html";
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Antecedente agregado correctamente",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              location.href = "./table-history.html";
            });
          }
        });
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
})();
