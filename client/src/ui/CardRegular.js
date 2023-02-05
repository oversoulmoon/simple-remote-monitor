import classes from "./CardRegular.module.css";

function CardRegular(props){
    return <div className={`${classes.card} ${props.className}`}>
        {props.children}
    </div>
}
export default CardRegular;