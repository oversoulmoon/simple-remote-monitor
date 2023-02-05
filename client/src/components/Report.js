import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CardRegular from "../ui/CardRegular";
import NetworkReport from "./NetworkReport";
import classes from "./Report.module.css";
import {
  Chart as Chartjs,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

Chartjs.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
/**
 *
 * @param {{hostname: string, architecture: string, platform: string,uptime: string,cpu:string,memory: string,network: string,date: string}} props
 */
function Report(props) {
  const port = 5782;
  const INTERVAL = 2000;
  var [status, setStatus] = useState(null);

  useEffect(() => {
    const socket = io.connect(props.IP + ":" + port);
    // const socket = io.connect("http://localhost:5782");

    socket.emit("get_init");
    socket.on("send_data", (data) => {
      socket.close();
      setStatus(data);
      getStatus(data);
    });
    socket.on("error", () => {});
  });

  function getStatus(data) {
    const socket = io.connect(props.IP + ":" + port);
    // const socket = io.connect("http://localhost:5782");
    socket.emit("get_status", data);
    socket.on("send_data", (data) => {
      setStatus(data);
      setTimeout(() => {
        getStatus(data);
      }, INTERVAL);
      socket.close();
    });
  }
  function generateMemoryData(memory) {
    var used = (memory.used / 1024).toFixed(1);
    var free = (memory.total / 1024 - memory.used / 1024).toFixed(1);
    return {
      labels: ["Used", "Free"],
      datasets: [
        {
          label: "GB",
          data: [used, free],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    };
  }

  function generateCPUData(cpu, idx) {
    var labels = cpu.usage.map(() => {
      return "";
    });
    if (idx === 0) {
      console.log(
        labels.map((data, index) => {
          var load = cpu.usage[index];
          return load.user + load.sys;
        })
      );
    }
    return {
      labels: labels,
      datasets: [
        {
          label: `Core ${idx}`,
          data: labels.map((data, index) => {
            var load = cpu.usage[index];
            return load.user + load.sys;
          }),
          borderWidth: 5,
          fill:true,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  }

  if (status === null) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div>
      <div className={classes.grid}>
        <CardRegular className={classes.topRow}>
          <div>
            <h1>{status.hostname}</h1>
            <b>Architecture:</b> {status.architecture}
            <br />
            <b>Platform:</b> {status.platform}
            <br />
            <b>Up Time:</b> {status.uptime} seconds
            <br />
          </div>
          <Pie
            data={generateMemoryData(status.memory)}
            options={{
              maintainAspectRatio: true,
              responsive: true,
            }}
          />
        </CardRegular>
        <CardRegular>
          {status.network.map((data, idx) => {
            return <NetworkReport key={idx} {...data} />;
          })}
        </CardRegular>
        <div className={classes.bigInfo}>
          <b>{status.cpu[0].model}</b>
          <br/>
          <div className={classes.cpuStats}>
            {status.cpu.map((proc, idx) => {
              return (
                <Line
                  key={idx}
                  options={{
                    responsive: true,
                    animation: {
                      duration: 0,
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales:{
                      y:{
                        min: 0,
                        max:100,
                        stepSize:10,
                        display:false
                      }
                    }
                  }}
                  data={generateCPUData(proc, idx)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
