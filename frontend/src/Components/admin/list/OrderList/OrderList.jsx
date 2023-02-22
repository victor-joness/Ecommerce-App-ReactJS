import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./OrderList.css";
import { ordersFetch, ordersUpdate } from "../../../../features/ordersSlice";
import moment from "moment";

export default function OrderList() {
  const { list } = useSelector((state) => state.orders);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(ordersFetch());
  }, [dispatch]);

  const handleOrderDispatch = (id) => {
    dispatch(ordersUpdate({id,delivery_status:"dispatched"}));
  }

  const handleOrderDelivered = (id) => {
    dispatch(ordersUpdate({id,delivery_status:"delivered"}));
  }

  const rows =
    list &&
    list.map((order) => {
      return {
        id: order._id,
        cName: order.shipping.name,
        amount: (order.total / 100)?.toLocaleString(),
        dStatus: order.delivery_status,
        date: moment(order.createdAt).fromNow(),
      };
    });

  //   description: "This column has a value getter and is not sortable.", poderia colocar isso tbm
  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "cName",
      headerName: "Name",
      width: 150,
    },
    { field: "amount", headerName: "Amount($)", width: 100 },
    {
      field: "dStatus",
      headerName: "Delivery status",
      width: 110,
      renderCell: (params) => {
        return (
          <div className="">
            {params.row.dStatus === "pending" ? (
              <div className="pending">Pending</div>
            ) : params.row.dStatus === "dispatched" ? (
              <div className="dispatched">dispatched</div>
            ) : params.row.dStatus === "delivered" ? (
              <div className="delivered">delivered</div>
            ) : (
              "Error"
            )}
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",

      sortable: false,
      width: 220,
      renderCell: (params) => {
        return (
          <div className="actions">
            <button onClick={() => handleOrderDispatch(params.row.id)} className="dispatchedBTN">Dispatch</button>
            <button onClick={() => handleOrderDelivered(params.row.id)} className="deliveredBTN">Deliver</button>
            <button onClick={() => navigate(`/order/${params.row.id}`)} className="view">View</button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}
