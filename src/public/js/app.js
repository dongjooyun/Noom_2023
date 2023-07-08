const socket = io();

const welcome = document.querySelector("#welcome");
const nicknameForm = welcome.querySelector("#nickname");
const roomnameForm = welcome.querySelector("#roomname");
const room = document.querySelector("#room");
const msgForm = room.querySelector("#msg");

let roomName;

room.hidden = true;

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName}방`;

  msgForm.addEventListener("submit", handleMsgSubmit);
}

function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function handleNicknameSubmit(e) {
  e.preventDefault();
  const input = nicknameForm.querySelector("input");
  const value = input.value;
  socket.emit("nickname", value);
  input.value = "";
}

function handleMsgSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_msg", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = roomnameForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

nicknameForm.addEventListener("submit", handleNicknameSubmit);
roomnameForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} just joined the room.`);
});

socket.on("bye", (user) => {
  addMessage(`${user} just left the room.`);
});

socket.on("new_msg", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
