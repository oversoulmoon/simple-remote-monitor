import CardRegular from "../ui/CardRegular";
import classes from "./NetworkReport.module.css";
function NetworkReport(props) {
  console.log(props);
  function convertUnits(bytes) {
    var prefix = ["B", "kB", "MB", "GB", "TB", "PB", "EB"];
    var index = 0;
    while (bytes > 1024) {
      bytes = (bytes / 1024).toFixed(2);
      index++;
    }
    return bytes + " " + prefix[index];
  }
  return (
    <div className={classes.container}>
      <b>{props.name}:</b>
        <CardRegular>
          <b className={classes.up}>&#8639;</b>
          {convertUnits(props.totalUsage.RX)} | {convertUnits(props.usage.RX)}/s{" "}
          <b className={classes.down}>&#8642;</b>
          {convertUnits(props.totalUsage.TX)} | {convertUnits(props.usage.TX)}/s
        </CardRegular>

        {props.IPv4.map((data, idx) => {
          return (
            <CardRegular key={idx}>
              IPv4: {data.IP} @ {data.MAC}
            </CardRegular>
          );
        })}
        {props.IPv6.map((data, idx) => {
          return (
            <CardRegular key={idx}>
              IPv6: {data.IP} @ {data.MAC}
            </CardRegular>
          );
        })}
    </div>
  );
}
export default NetworkReport;
