
var editor;
var usersArray = []
var reporteArrayTable = []
var idUnique = "";

var reporteTable = function(idUnique, estatus, tiporReporte, telefono, mensaje, image) {
  this.idUnique = idUnique
  this.estatus = estatus
  this.tiporReporte = tiporReporte
  this.telefono = telefono
  this.mensaje = mensaje
  this.image = image
}

$(function() {
  initParse();
  getReportes();

  $("#btnEliminarReporte").click(function(){
    if (idUnique != "") {
      deleteReporte(idUnique)
    }else{
      PNotify.error({
          text: "Reporte no encontrado"
      })
    }
  });

  $("#btnRecargarReportes").click(function() {
    setTimeout(location.reload(), 1000);
  });

  /*$("#btnAgregar").click(function() {
    var nombreCompleto = $("#nombreCompleto").val();
    var telefono = $("#telefono").val();
    var email = $("#email").val();
    var password = $("#password").val();

    if(nombreCompleto == null || nombreCompleto == ""){
        PNotify.error({
            text: "Agrega un nombre"
        })
        return;
    }else if(telefono == null || telefono == ""){
         PNotify.error({
            text: "Agrega un telefono"
         })
        return;
    }else if(email == null || email == ""){
         PNotify.error({
            text: "Agrega un email"
         })
        return;
    }else if(password == null || password == ""){
         PNotify.error({
            text: "Agregar una contraseña"
         })
        return;
    }

    var i;
    for (i = 0 ; i < usersArrayTable.length; i++){
        var user = usersArrayTable[i];
        if(user.telefono == telefono){
            PNotify.error({
                text: "Ya existe un usuario con ese telefono, no se pueden crear dos usuarios con el mismo telefono"
            })
            return;
        }
    }

    createUsuario(nombreCompleto, telefono, email, password)

  });*/

});

function getReportes(){
  const reporte = Parse.Object.extend('Reporte');
  const query = new Parse.Query(reporte);
  query.find().then((results) => {
    //if (typeof document !== 'undefined'){
    initTableWithData(results);
    //}
  }, (error) => {
    //if (typeof document !== 'undefined'){
      //console.error('Error while fetching Notificacion', error);
      alert("Intente de nuevo mas tarde");
    //}
  });
}

function initTableWithData(users){

  var array = jQuery.parseJSON(JSON.stringify(users));
  console.log(array);
  var i;
  var imagen;
  //idUnique, estatus, tipoReporte, telefono, mensaje, image
  for (i = 0 ; i < array.length; i++){
    if (array[i].image == null || array[i].image == "") {
      //array[i].image = "SIN IMAGEN";
      imagen = "SIN IMAGEN";
    }else{
      imagen = array[i].image;
    }
    reporteArrayTable.push(new reporteTable(array[i].idUnique, array[i].estatus, array[i].tiporReporte, array[i].telefono, array[i].mensaje, imagen))
  }

  if (reporteArrayTable != null && reporteArrayTable.length > 0) {
    var table = $('#exampleReporte').DataTable( {
          data: reporteArrayTable,
          columns: [
              //{ data: "idUnique" },
              { data: "estatus" },
              { data: "tiporReporte" },
              { data: "telefono" },
              { data: "mensaje" },
              { data: "image" },
          ],
          columnDefs: [
              { targets: 4,
                render: function(data) {
                  if (data == "SIN IMAGEN") {
                    return "SIN IMAGEN";
                  }else{
                    return '<img src="data:image/png;base64, '+data+'">'
                  }
                }
              }
            ]
      } );
  }

  events(table);
}

function events(table){
  $('#exampleReporte tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        console.log(data.mensaje);
        idUnique = data.idUnique;
        $("#reporteModal").modal("show");
    } );
}

function deleteReporte(idUnique){

  const reporte = Parse.Object.extend('Reporte');
  const query = new Parse.Query(reporte);
    query.equalTo('idUnique', idUnique).first().then((object) => {
      object.destroy().then((response) => {
        //if (typeof document !== 'undefined') document.write(`Deleted Notificacion: ${JSON.stringify(response)}`);
            PNotify.success({
              text: "Se elimino el reporte correctamente"
            });
            setTimeout(location.reload(), 1000);
            /*var i;
            for (i = 0; i < markers.length; i++){
                if (markers[i].idUnique == idUnique){
                    console.log(markers[i].idUnique)
                    var mark = markers[i].m
                    mark.remove();
                    markers.splice(i, 1);
                }
            }*/
        }, (error) => {
        //if (typeof document !== 'undefined') document.write(`Error while deleting Notificacion: ${JSON.stringify(error)}`);
            PNotify.error({
              text: "Error al eliminar la el reporte: "+idUnique
            });
        });
    });

    $('#reporteModal').modal('toggle');
}


/*function createUsuario(nombre, telefono, email, password){

    const Usuario = Parse.Object.extend('Usuario');
    const myNewObject = new Usuario();

    myNewObject.set('email', email);
    myNewObject.set('telefono', telefono);
    myNewObject.set('password', password);
    myNewObject.set('activo', true);
    myNewObject.set('calleUno', '');
    myNewObject.set('direccion', '');
    myNewObject.set('localidad', '');
    myNewObject.set('nombreCompleto', nombre);
    myNewObject.set('calleDos', '');

    myNewObject.save().then(
      (result) => {

        $("#nombreCompleto").val("");
        $("#telefono").val("");
        $("#email").val("");
        $("#password").val("");

        PNotify.success({
            text: "Se creo el usuario correctamente"
        });

        setTimeout(location.reload(), 1000);

      },
      (error) => {
        //if (typeof document !== 'undefined') document.write(`Error while creating Usuario: ${JSON.stringify(error)}`);
        $("#nombreCompleto").val("");
        $("#telefono").val("");
        $("#email").val("");
        $("#password").val("");

        PNotify.error({
            text: "Error al crear el usuario"
        });
      }
    );

    $('#userModalAgregar').modal('toggle');
}*/
