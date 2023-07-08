const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room");

let roomName;

room.hidden = true;

function showRoom(msg) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName}방`;
  const nicknameForm = room.querySelector("#nickname");
  const msgForm = room.querySelector("#msg");
  nicknameForm.addEventListener("submit", handleNicknameSubmit);
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
  const input = room.querySelector("#nickname input");
  const value = input.value;
  socket.emit("nickname", value);
  input.value = "";
}

function handleMsgSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_msg", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} just joined the room.`);
});

socket.on("bye", (user) => {
  addMessage(`${user} just left the room.`);
});

socket.on("new_msg", addMessage);
