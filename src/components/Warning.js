import { Alert } from "react-bootstrap";

function Warning(props) {
    if (props.isWarning){
        return (
            <Alert variant="danger" style={{height:"50px"}}>
                No solution found
            </Alert>
        );
    }
    else {
        return (
            <div style={{height: "66px"}}></div>
        );
    }
    
}

export default Warning;