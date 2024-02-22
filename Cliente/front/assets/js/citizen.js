(function () {
// DataTable
const dataTableOptions = {
  lengthMenu: [5,10,15,50,100,250,500],
  columnDefs: [
    { className: "start", targets: [0, 1, 2, 3, 4, 5,7] },
    { orderable: false, targets: [4,6,7]},
    { searchable: false, targets: [6,7] },
  ],
  pageLength: 5,
  destroy: true,
  language: {
    lengthMenu: "Mostrar _MENU_ ciudadanos por página",
    zeroRecords: "Ningún ciudadano encontrado",
    info: "Mostrando _START_ a _END_ ciudadanos de _TOTAL_ ",
    infoEmpty: "Ningún ciudadano encontrado",
    infoFiltered: "(filtrados desde _MAX_ ciudadanos totales)",
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

const tableCitizens = document.querySelector("#tableCitizens");
// const tableHistory = document.querySelector("#tableHistory");
let idEditDelete = -1;
let namee = "";
let lastname = "";
let nickname = "";
let email = "";
let type = "";


async function getData() {
    try {
      const response = await fetch('http://localhost:3000/citizen/list');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const datos = await response.json();
 
      return datos;
    } catch (error) {
      console.error('Hubo un error al obtener los datos:', error);
      throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
    }
  }



async function tableDownload() {
  
    try {
      // Esperar a que los datos estén disponibles antes de continuar
      const data = await getData();
      tableCitizens.innerHTML = "";
      const campos = ["id","name","lastname","nickname","email","type"];
      data.forEach((user) => {
        let row = document.createElement("tr");
        let column;
        campos.forEach((info) => {
          column = document.createElement("td");
          column.textContent = user[info];
  
          if (info == "type") {
            column.textContent =
              user.type == 1
                ? "Humano"
                : user.type == 2
                ? "Grunt"
                : user.type == 3
                ? "Androide"
                : "Jackal";    
          }
        
          row.appendChild(column);
        });
          column = document.createElement("td");
          column.innerHTML = `  <a
          href="#editCitizenModal"
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
            href="#deleteCitizenModal"
            class="delete"
            data-bs-toggle="modal"
            ><i
              class="material-icons"
              data-bs-toggle="tooltip"
              title="Delete"
              >&#xE872;</i
            ></a
          >`;
          row.appendChild(column)
          tableCitizens.appendChild(row);
     
      });
        return true;
    } catch (error) {
      // Manejar errores
      console.error('Ocurrió un error:', error);
      return false;
    }

  }

async function loadTable(){
    if (await tableDownload()){

      dataTable = $("#dataTable").DataTable(dataTableOptions);
      dataTable.on("draw.dt",()=>{
      addEventTable();
      });
      dataTableIsInitialized = true;
      addEventTable();
    }
}
  



function addEventTable() {
  for (let i=0;i<tableCitizens.rows.length;i++){
    tableCitizens.rows[i].cells[6].addEventListener("click",()=>{
        idEditDelete = tableCitizens.rows[i].cells[0].innerHTML;
        namee = tableCitizens.rows[i].cells[1].innerHTML;
        lastname = tableCitizens.rows[i].cells[2].innerHTML;
        nickname = tableCitizens.rows[i].cells[3].innerHTML;
        email = tableCitizens.rows[i].cells[4].innerHTML;
        type = tableCitizens.rows[i].cells[5].innerHTML;

      
        const editName = document.querySelector("#editName");
        const editLastname = document.querySelector("#editLastname");
        const editNickname = document.querySelector("#editNickname");
        const editEmail = document.querySelector("#editEmail");
        const editSelectType = document.querySelector("#editSelectType");

        editName.value = namee;
        editLastname.value = lastname;
        editNickname.value = nickname;
        editEmail.value = email;
        editSelectType.selectedIndex = type == "Humano"
        ? 0
        : type == "Grunt"
        ? 1
        : type == "Androide"
        ? 2
        : 3;
    });
    tableCitizens.rows[i].cells[7].addEventListener("click",()=>{
        idEditDelete = tableCitizens.rows[i].cells[0].innerHTML;
     
    });
}
}

loadTable();

const deleteCitizen = document.querySelector("#deleteCitizen");
const editCitizen = document.querySelector("#editCitizen");
const postCitizen = document.querySelector("#postCitizen");


deleteCitizen.addEventListener("click",()=>{
    fetch("http://localhost:3000/citizen/delete/"+idEditDelete,{
        method: "DELETE"
    })
    
    Swal.fire({
        position:"center",
        icon: "success",
        title: "Ciudadano eliminado correctamente",
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
        location.href = "./table-citizen.html";
      });
})

editCitizen.addEventListener("click",()=>{
    const editName = document.querySelector("#editName");
    const editLastname = document.querySelector("#editLastname");
    const editNickname = document.querySelector("#editNickname");
    const editEmail = document.querySelector("#editEmail");
    const editSelectType = document.querySelector("#editSelectType");
    if (editName.value != "" && editLastname.value != "" && editNickname.value != "" && editEmail.value != "")
    {
    if (editEmail.value.includes("@") && editEmail.value.includes(".")) {
    fetch("http://localhost:3000/citizen/update/"+idEditDelete,{
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: editName.value,lastname: editLastname.value,nickname:editNickname.value,email:editEmail.value,type:editSelectType.value})
    });
    Swal.fire({
        position:"center",
        icon: "success",
        title: "Ciudadano actualizado correctamente",
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
        location.href = "./table-citizen.html";
       });
}
else{
    Swal.fire({
        position:"center",
        icon: "error",
        title: "Correo electrónico no válido",
        showConfirmButton: false,
        timer: 1500
      });
}
}
    else{
        Swal.fire({
            position:"center",
            icon: "error",
            title: "Verifica si hay campos vacíos",
            showConfirmButton: false,
            timer: 1500
          });
    }

})

postCitizen.addEventListener("click",()=>{
    const postName = document.querySelector("#postName");
    const postLastname = document.querySelector("#postLastname");
    const postNickname = document.querySelector("#postNickname");
    const postEmail = document.querySelector("#postEmail");
    const postSelectType = document.querySelector("#postSelectType");

    if (postName.value != "" && postLastname.value != "" && postNickname.value != "" && postEmail.value != "")
    {
    if (postEmail.value.includes("@") && postEmail.value.includes(".")) {
        fetch("http://localhost:3000/citizen/create/",{
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name: postName.value,lastname: postLastname.value,nickname:postNickname.value,email:postEmail.value,type:postSelectType.value})
        });
        Swal.fire({
            position:"center",
            icon: "success",
            title: "Ciudadano registrado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(()=>{
           location.href = "./table-citizen.html";
           });
      }
      else{
        Swal.fire({
            position:"center",
            icon: "error",
            title: "Correo electrónico no válido",
            showConfirmButton: false,
            timer: 1500
          })
      }
    }
    else{
        Swal.fire({
            position:"center",
            icon: "error",
            title: "Verifica si hay campos vacíos",
            showConfirmButton: false,
            timer: 1500
          });
    }
})
})();