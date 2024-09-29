package pe.edu.cibertec.ws_websocket.chat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import pe.edu.cibertec.ws_websocket.chat.model.MensajeChat;

@Controller
public class ChatController {

    @MessageMapping("/chat.enviarMensaje")
    @SendTo("/topic/public")
    public MensajeChat enviarMensaje(
            @Payload MensajeChat mensaje){
        return mensaje;
    }

    @MessageMapping("/chat.agregarUsuario")
    @SendTo("/topic/public")
    public MensajeChat agregarUsuario(
            @Payload MensajeChat mensaje,
            SimpMessageHeaderAccessor headerAccessor
    ){
        headerAccessor.getSessionAttributes()
                .put("usuario", mensaje.getUsuario());
        return mensaje;
    }



}
