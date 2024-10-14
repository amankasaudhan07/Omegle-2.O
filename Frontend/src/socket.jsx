import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

// console.log(server);
const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    const s = io(server, { withCredentials: true });
    s.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });

    // console.log("hbhj",s);
    return s;
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };