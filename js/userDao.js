
var test;
var editor;
var usersArray = []
var usersArrayTable = []
var telefonoDelete = "";

var userTable = function(nombre, localidad, direccion, telefono, email, estatus ) {
  this.nombre = nombre
  this.localidad = localidad
  this.direccion = direccion
  this.telefono = telefono
  this.email = email
  this.estatus = estatus
}

$(function() {
  initParse();
  getUsers();

  $("#btnEliminarUsuario").click(function(){
    if (telefonoDelete != "") {
      deleteUsuario(telefonoDelete)
    }else{
      PNotify.error({
          text: "Usuario no encontrado"
      })
    }
  });

  $("#btnAgregarUsuario").click(function() {
    $("#userModalAgregar").modal("show");
  });

  $("#btnAgregar").click(function() {
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

  });

});

function getUsers(){
  const Usuario = Parse.Object.extend('Usuario');
  const query = new Parse.Query(Usuario);
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

  var i;
  for (i = 0 ; i < array.length; i++){
    usersArrayTable.push(new userTable(array[i].nombreCompleto, array[i].localidad, array[i].direccion, array[i].telefono, array[i].email, array[i].activo))
  }

  if (usersArrayTable != null && usersArrayTable.length > 0) {
    var table = $('#example').DataTable( {
          data: usersArrayTable,
          columns: [
              { data: "nombre" },
              { data: "localidad" },
              { data: "direccion" },
              { data: "telefono" },
              { data: "email" },
              { data: "estatus"}
          ],
      } );
  }

  events(table);
}

function events(table){
  $('#example tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        console.log(data.telefono);
        telefonoDelete = data.telefono;
        $("#userModal").modal("show");
    } );
}

function deleteUsuario(telefono){

  const Usuario = Parse.Object.extend('Usuario');
  const query = new Parse.Query(Usuario);
    query.equalTo('telefono', telefono).first().then((object) => {
      object.destroy().then((response) => {
        //if (typeof document !== 'undefined') document.write(`Deleted Notificacion: ${JSON.stringify(response)}`);
            PNotify.success({
              text: "Se elimino el usuario: correctamente"
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
            /*PNotify.error({
              text: "Error al eliminar la alerta: "+idUnique
            });*/
        });
    });

    $('#userModal').modal('toggle');
}


function createUsuario(nombre, telefono, email, password){

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
}
