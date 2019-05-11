
function initParse(){
  Parse.initialize("xCSF2BGDE8YVj7Hwt4qD0wvJuCiRJQxbWSVvcLRe", "j2uZtirsMwXxLkgxEuhpvww7ph6FEI2Tsih2fuYX");
  Parse.serverURL = "https://parseapi.back4app.com/";
}

function liveQuery(){
  liveQuery = new Parse.LiveQueryClient({
  applicationId: 'xCSF2BGDE8YVj7Hwt4qD0wvJuCiRJQxbWSVvcLRe',
  serverURL: 'wss://' + 'alertasperu.back4app.io',
  javascriptKey: 'j2uZtirsMwXxLkgxEuhpvww7ph6FEI2Tsih2fuYX',
  masterKey: 'u2FbjSQxI9MsLVzJKnyq5l7yH393e3gNumEZpKA9'
  });
  liveQuery.open();
}
