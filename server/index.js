const app = require("express")();
const http = require("http").createServer(app);
const io = require('socket.io')(http);

var port = 5000;
http.listen(port, () => {
  console.log("listening on *:" + port);
});

let Users = [];

io.on('connection', function (socket) {

  socket.on('ENTER_USER', function(data) {
    Users.push({
      id : socket.id,
      nickname : data.nickname
    })
    console.log(Users);
    socket.emit('WELCOME_MESSAGE', {msg : "시흥시청 메타버스관에 오신 것을 환영합니다."})
    Users.map(user => {
      user.id !== socket.id
      ? io.to(user.id).emit('NEW_USER', {msg : `[${data.nickname}]님이 입장하셨습니다.`})
      : false
    })
  })
  socket.on('MSG', function(data){
    let nickname = Users.filter(user => user.id === socket.id)[0].nickname
    // console.log(nickname)
    io.emit('NEW_MSG', {nickname: nickname, msg: data.msg})
  })
  socket.on('disconnect', function(){
    Users.map(user=> {
      user.id === socket.id
      ? socket.broadcast.emit('OUT_USER', {msg: `${user.nickname}님이 퇴장하셨습니다.`})
      : false
    })
    Users = Users.filter(user => user.id !== socket.id)
  })
})