
var editor;
var usersArray = []
var usersArrayTable = []

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
  //initTableWithData();
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
    } );
}
