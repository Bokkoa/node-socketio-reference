

// Html

const lblDesk = document.querySelector('h1');
const btnAttend = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendings = document.querySelector('#lblPendings');



const searchParams = new URLSearchParams( window.location.search );


if( !searchParams.has('desk')){
    window.location = 'index.html';
    throw new Error('The desktop  must be send');
}


const desk = searchParams.get('desk');
lblDesk.innerText = desk;

divAlert.style.display = 'none';

const socket = io();



socket.on('connect', () => {
    btnAttend.disabled = false;
});

socket.on('disconnect', () => {
    btnAttend.disabled = true;
});

socket.on('pending-tickets', ( pendingTickets ) => {

    if(pendingTickets === 0){
        lblPendings.style.display = 'none';
    }else{
        lblPendings.style.display = '';
        lblPendings.innerText = pendingTickets;
    }
})


btnAttend.addEventListener( 'click', () => {

    socket.emit('attend-ticket', { desk }, ({ok, ticket, msg}) => {

        // notify changes in the last4

        if(!ok){
            lblTicket.innerText = 'Nobody';
            return divAlert.style.display = '';
        }

        lblTicket.innerText = `Ticket ${ticket.number}`;



    });

});