import "./AllTimeData.css"
import {useSelector} from "react-redux";

const AllTimeData = () => {
    const {items} = useSelector((state) => state.products)


    return (
        <div className="main">
            <h3>Tempo Todo</h3>
            <div className="info">
                <div className="title">Users</div>
                <div className="data">200</div>
            </div>
            <div className="info">
                <div className="title">Products</div>
                <div className="data">{items.length}</div>
            </div>
            <div className="info">
                <div className="title">Orders</div>
                <div className="data">200</div>
            </div>
            <div className="info">
                <div className="title">Earning</div>
                <div className="data">200</div>
            </div>
        </div>
    )
}

export default AllTimeData;