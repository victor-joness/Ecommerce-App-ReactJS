import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {productsDelete} from "../../../../features/productSlice";

import "./ProductList.css"
import Edit from "../../Edit/Edit";

export default function ProductList() {
  const { items } = useSelector((state) => state.products);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(productsDelete(id));

  };

  const rows =
    items &&
    items.map((item) => {
      return {
        id: item._id,
        imgUrl: item.img.url,
        pName: item.name,
        pDesc: item.desc,
        price: item.price.toLocaleString(),
      };
    });

    //   description: "This column has a value getter and is not sortable.", poderia colocar isso tbm
  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "imgUrl",
      headerName: "Image",
      width: 80,
      renderCell: (params) => {
        return (
          <div className="container">
            <img src={params.row.imgUrl} alt="" />
          </div>
        );
      },
    },
    { field: "pName", headerName: "Nome do Produto", width: 200 },
    { field: "pDesc", headerName: "Descrição do Produto", width: 200 },
    {
      field: "price",
      headerName: "Preço",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
   
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <div className="actions">
            <button onClick={() => handleDelete(params.row.id)} className="delete">Delete</button>
            <Edit prodId={params.row.id}></Edit>
            <button onClick={() => navigate(`/product/${params.row.id}`)} className="view">View</button>
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