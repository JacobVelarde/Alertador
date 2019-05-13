var map;
var array;
var liveQuery;
var subscriptionNotification;
var arrayAlerts = [];

var alerta = function(id, latitud, longitud, telefono, estatus, tipoAlerta ) {
  this.id = id
  this.latitud = latitud
  this.longitud = longitud
  this.telefono = telefono
  this.estatus = estatus
  this.tipoAlerta = tipoAlerta
}

$(function() {

    initMap();
    map.on('load', function () {
      initParse();
      getAlerts();
      liveQuery();
      initSubscriptionNotification();
    });

});

function initMap(){
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWxlcnRhZG9ycGVydSIsImEiOiJjanYwazZwNXgxa2IzM3ptZm84em83M21qIn0.kfhR7ywDyyuMxGgdmMEG3A';
  var huacho = [-77.598821, -11.097981];

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: huacho,
    zoom: 13
  });
  var nav = new mapboxgl.NavigationControl();
  map.addControl(new mapboxgl.FullscreenControl());
  map.addControl(nav, 'bottom-right');
}

function getAlerts() {
  const Notificacion = Parse.Object.extend('Notificacion');
  const query = new Parse.Query(Notificacion);
  query.find().then((results) => {
    //if (typeof document !== 'undefined'){
      alerts(results);
    //}
  }, (error) => {
    //if (typeof document !== 'undefined'){
      //console.error('Error while fetching Notificacion', error);
      alert("Intente de nuevo mas tarde");
    //}
  });
}

function alerts(respuesta) {
  array = jQuery.parseJSON(JSON.stringify(respuesta));
  var i;
  for (i = 0 ; i < array.length; i++){
    setAlert(array[i])
  }
}

function setAlert(object) {
  arrayAlerts.push(new alerta(object.idUnique, object.latitud, object.longitud, object.telefono, object.estatus, object.tipoAlerta))

  var tipoAlerta = object.tipoAlerta;
  var div = document.createElement('div');
  div.addEventListener('click', function() {
    console.log("Buscando usuario: "+object.telefono);
    searchUser(object.telefono, object.idUnique);
  });

  setMarkerWithDiv(div, object.longitud, object.latitud, object.tipoAlerta)
}

function initSubscriptionNotification(){
  var query = new Parse.Query('Notificacion');
  query.ascending('createdAt').limit(5);

  var subscription = liveQuery.subscribe(query);
  subscription.on('create', todo => {
    arrayAlerts.push(new alerta(todo.get("idUnique"), todo.get("latitud"), todo.get("longitud"), todo.get("telefono"), todo.get("estatus"), todo.get("tipoAlerta")))

    var tipoAlerta = todo.get("tipoAlerta");
    var div = document.createElement('div');
    div.addEventListener('click', function() {
      console.log("buscando usuario: "+todo.get("telefono"));
      searchUser(todo.get("telefono"), todo.get("idUnique"));
    });

    setMarkerWithDiv(div, todo.get("longitud"), todo.get("latitud"), todo.get("tipoAlerta"));

  });
}

function setMarkerWithDiv(div, longitud, latitud, tipoAlerta){

  switch (tipoAlerta) {
    case "BOMBEROS":
      div.id = 'markerBomberos';
      break;
    case "VIOLENCIA CONTRA LA MUJER":
      div.id = 'markerMujer';
      break;
    case "SEGURIDAD":
      div.id = 'markerSeguridad';
      break;
    case "AMBULANCIA":
      div.id = 'markerAmbulancia';
      break;

    default:
      div.id = 'markerMujer';
      break;
  }

  var marker = new mapboxgl.Marker(div)
  .setLngLat([longitud,latitud])
  .addTo(map);

}

function searchUser(telefono, idAlerta){
  var usuario = Parse.Object.extend("Usuario");
  var query = new Parse.Query(usuario);
  query.equalTo("telefono",telefono)
  .first().then((user) => {
    console.log(user);

    for (var i = 0; i < arrayAlerts.length; i++) {
      if (arrayAlerts[i].id == idAlerta) {
        $("#textAlerUser").text("El usuario: "+user.get("nombreCompleto")+" con telefono: "+user.get("telefono")+ " Realizo una alerta del tipo: "+arrayAlerts[i].tipoAlerta);
        $("#identificador").text(arrayAlerts[i].id);
        $("#alertModal").modal("show");
        break;
      }
    }

  }, (error) => {
    console.log(error);
  });
}
