// src/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";
import { useApp } from "../context/AppContext";

export default function useSocket() {
  const { token } = useApp();
  const initialised = useRef(false);

  useEffect(() => {
    if (token && !initialised.current) {
      connectSocket(token);
      initialised.current = true;
    }
    return () => {
      if (!token) {
        disconnectSocket();
        initialised.current = false;
      }
    };
  }, [token]);

  return getSocket;
}
