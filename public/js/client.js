const socket = io("http://localhost:3000");

socket = io.listen(process.env.PORT);

const form = document.getElementById('sendmsg');

const msgInp = document.getElementById('msgInp');

const chatArea = document.querySelector(".chat-area");

const name = prompt("Enter your name to start chatting:");

var audioRecieve = new Audio('notif-receive.mp3');
var audioJoin = new Audio('notif-join.mp3');
var audioLeft = new Audio('notif-left.mp3');

const append = (message, type, position)=>{
    const newJoinee = document.createElement('div');
    newJoinee.innerText = message;
    newJoinee.classList.add(type);
    newJoinee.classList.add(position);
    chatArea.append(newJoinee);

    if(position == 'left'){
        audioRecieve.play();
    }

    if(position == 'newJoinee'){
        audioJoin.play();
    }

    if(position == 'member-logout'){
        audioLeft.play();
    }

    chatArea.scrollTop = chatArea.scrollHeight;

}

socket.emit('new-member-logon', name);

socket.on('member-logon', name =>{

    const welcomeMsgArray = [
        `${name} has been connected!`,
        `${name} just landed!`,
        `${name} just arrrived!`,
        `${name} slid into the server!`,
        `${name} is finally here!`,
        `${name} broke in here!`
    ]
    
    const randomWelcomeMsg = welcomeMsgArray[Math.floor(Math.random()*welcomeMsgArray.length)];    

    append(randomWelcomeMsg, 'new-joinee', 'new-joinee');
})

socket.on('msg-receive', data =>{
    append(`${data.name}: ${data.message}`, 'text', 'left');
})

socket.on('member-logout', name =>{

    const disconnectMsgArray = [
        `${name} got disconnected`,
        `${name} left the chat`,
        `${name} left the conversation`,
        `${name} is no more... in the chat`,
        `Pheww! ${name} finally left!`,
        `You finally got rid of ${name}!`
    ]

    const randomDisconnectMsg = disconnectMsgArray[Math.floor(Math.random()*disconnectMsgArray.length)];

    append(randomDisconnectMsg, 'member-logout', 'member-logout');
})

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const message = msgInp.value;
    append(`You: ${message}`, 'text', 'right');
    socket.emit('msg-send', message);
    document.getElementById('msgInp').value = '';
})