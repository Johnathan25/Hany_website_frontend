import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false, // <-- لمنع إرسال طلبات الاتصال المستمرة لحين تشغيل السيرفر
});