
var socket = io();
var messageButton = document.getElementById('sendMessage');
var voiceButton = document.getElementById('sendVoice');
var recording = 0;

messageButton.onclick = sendMessage;
voiceButton.onmousedown = sendVoice;
voiceButton.onmouseup = sendVoice;
voiceButton.onmouseout = function(){
    document.onmouseup = function(){
        if(recording==1) sendVoice();
    }
}

function formatTime(epochTime) {
    var time = new Date(epochTime);
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    return (hour + ': ' + ('0' + min).slice(-2));
}

function checkKey(e) {
    if(e.which == 13) {
        sendMessage();
    }
}

function sendMessage(){
    console.log('clicked');
    var input = document.getElementById('input');
    console.log(input.value);
    if (input.value == "") return 0;
    socket.emit('emailToServer', {
        from: 'user',
        text: input.value,
    }, function callback(message){
        console.log("Message delivered. ", message);
        input.value = null;
    });
};

function sendVoice() {
    if(!navigator.getUserMedia){
        return alert('Geolocation not supported by your browser');
    } 
    if (recording == 0) {
        recording = 1;
        voiceButton.innerText = 'Recording....';
    } else if (recording == 1) {
        recording = 0;
        voiceButton.innerText = 'Press to Record';
    }
}


socket.on('connect', function() {
    var info = window.location.search.replace('?name=', '').replace('&room=', ' ').split(' ');
    socket.emit('join', info, function(err){
        if (err){
            alert(err);
            window.location.href = '/';
        } else {
            console.log('Connected');
        };
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('emailToClient', function(email) {
    var template = document.getElementById('message-template').innerHTML;
    var list = document.getElementById('chatList');
    var wrapper = document.createElement('LI');
    wrapper.innerHTML = Mustache.render((template), {
        from: email.from,
        text: email.text,
        createdAt: formatTime(email.createdAt)
    });
    list.insertBefore(wrapper, list.childNodes[0]);
});

socket.on('geolocationToClient', function(email) {
    var template = document.getElementById('location-message-template').innerHTML;
    var list = document.getElementById('chatList');
    var wrapper = document.createElement('LI');
    wrapper.innerHTML = Mustache.render((template), {
        from: email.from,
        url: email.url,
        createdAt: formatTime(email.createdAt)
    });
    list.insertBefore(wrapper, list.childNodes[0]);
});

socket.on('updateUserList', function(list){
    var wrapper = document.createElement('OL');
    list.forEach(function(name) {
        var entry = document.createElement('LI');
        entry.innerText = `${name}`;
        wrapper.appendChild(entry);
    });
    var userList = document.getElementById('users');
    if(userList.childNodes[0]){
        userList.replaceChild(wrapper, userList.childNodes[0]);
    } else {
        userList.appendChild(wrapper);
    };    
});

