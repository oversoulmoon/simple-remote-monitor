
import Card from "../ui/Card";
import Report from "./Report";
import classes from "./ReportList.module.css"
/**
 *
 * @param {[Object, Object]} props
 */

function ReportList(props) {
  return (
    <section className={classes.grid}>
      {props.clients.map((client, idx) => {
        return (
          <Card key ={idx}>
            <Report IP={client} />
            </Card>
        );
      })}
    </section>
  );
}
export default ReportList;
