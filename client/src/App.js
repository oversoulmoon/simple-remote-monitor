import io from "socket.io-client";
import { useState } from "react";
import { useEffect } from "react";
import ReportList from "./components/ReportList";

const INTERVAL = 30000;

function App() {
  var [clients, setClients] = useState(null);
  const socket = io.connect("http://localhost:5000");
  function scanNetwork(){
    socket.emit("get_clients");
    socket.on("clients", (data) => {
      setClients(JSON.parse(data));
    });
    console.log("Scanned Network");
  };
  useEffect(() => {
    scanNetwork();
    const interval = setInterval(() => {
      scanNetwork();
    }, INTERVAL);
    return () => clearInterval(interval);
  });

  return (
    <div className="App">
      {clients !== null ? <ReportList {...clients}/> : null}
    </div>
  );
}

export default App;
