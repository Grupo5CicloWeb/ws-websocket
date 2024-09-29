$(document).ready(function(){
    var paginaUsuario = $("#username-page");
    var paginaChat = $("#chat-page");
    var formularioUsuario = $("#usernameForm");
    var formularioMensaje = $("#messageForm");
    var areaMensajes = $("#messageArea");
    var conectando = $(".connecting");
    var stompClient = null;
    var usuario = null;
    formularioUsuario.on("submit", conectarUsuario);


    function enviarMensajes(event){
        console.log("Ingresa")
        var contenido = $("#message").val().trim();
        if(contenido && stompClient){
            var chatMensaje = {
                usuario: usuario,
                contenido: contenido,
                tipo: "CHAT"
            };
            stompClient.send("/app/chat.enviarMensaje",
            {}, JSON.stringify(chatMensaje));
            $("#message").val("");
        }
        event.preventDefault();
    }

    function conectarUsuario(event){
        usuario = $("#name").val().trim();
        if(usuario){
            paginaUsuario.addClass("d-none");
            paginaChat.removeClass("d-none");
            var socket = new SockJS("/websocket");
            stompClient = Stomp.over(socket)
            stompClient.connect({}, conectarSocket, errorSocket);
        }
        event.preventDefault();
    }
    function conectarSocket(){
        stompClient.subscribe("/topic/public", mensajeRecibido);
        stompClient.send("/app/chat.agregarUsuario",
                {},
                JSON.stringify({usuario: usuario, tipo: "UNIR"})
                );
        conectando.addClass('d-none');
    }
    function mensajeRecibido(mensaje){
        var mensajeUsuario = JSON.parse(mensaje.body);
        var elementoMensaje = $("<li>").addClass("list-group-item");
        if(mensajeUsuario.tipo === "UNIR"){
            elementoMensaje.addClass("event-message")
                .text(mensajeUsuario.usuario + " se ha unido a la sala");

        } else if(mensajeUsuario.tipo === "SALIR"){
            elementoMensaje.addClass("event-message")
                        .text(mensajeUsuario.usuario +
                        " ha salido de la sala");
        } else{
            var usuarioElement = $("<strong>")
                .text(mensajeUsuario.usuario);
            var textoElement = $("<span>")
                .text(mensajeUsuario.contenido);
            elementoMensaje.append(usuarioElement)
            .append(": ").append(textoElement);
        }
        areaMensajes.append(elementoMensaje);
        areaMensajes.scrollTop(areaMensajes[0].scrollHeight);
    }
    function errorSocket(){
        conectando.text("Error al conectarse al websocket");
        conectando.css("color", "red");
    }
    formularioMensaje.on("submit", enviarMensajes);
});