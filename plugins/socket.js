import io from "socket.io-client";

export default ({ store }, inject) => {
  const socket = io(process.env.SOCKET_URL || "http://localhost:5000");

  socket.on("connect", () => {
    console.log("🔌 Connected to socket server");

   
  });


  inject("socket", socket);
};
