const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {

    // On init
    socket.emit('last-ticket', ticketControl.last);
    socket.emit('current-status', ticketControl.last4);
    socket.emit('pending-tickets', ticketControl.tickets.length);

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id );
    });

    socket.on('next-ticket', ( payload, callback ) => {
        
        const next = ticketControl.next();

        callback( next );

        // notify new ticket
        socket.emit('pending-tickets', ticketControl.tickets.length);

    });

    socket.on('attend-ticket', ({ desk }, callback) => {



        if(!desk){
            return callback({
                ok: false,
                msg: 'The desk must be send'
            });
        }

        const ticket = ticketControl.atendingTicket(desk);

        // to all
        socket.broadcast.emit('current-status', ticketControl.last4);
        socket.emit('pending-tickets', ticketControl.tickets.length);
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length);

        if(!ticket){
            return callback({
                ok: false,
                msg: 'Theres no ticket left'
            });
        } 

        return callback({
            ok: true,
            ticket
        });
    });

}



module.exports = {
    socketController
}

