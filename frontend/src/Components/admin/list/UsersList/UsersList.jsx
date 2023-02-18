import "./UsersList.css";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usersDelete, usersFetch } from "../../../../features/usersSlice";

export default function UsersList() {
  const { list } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(usersFetch());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(usersDelete(id));
  };

  const rows =
    list &&
    list.map((user) => {
      return {
        id: user._id,
        uName: user.name,
        uEmail: user.email,
        isAdmin: user.isAdmin,
      };
    });

  //   description: "This column has a value getter and is not sortable.", poderia colocar isso tbm
  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "uName",
      headerName: "Name",
      width: 150,
    },
    { field: "uEmail", headerName: "Email", width: 200 },
    {
      field: "isAdmin",
      headerName: "Role",
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params.row.isAdmin ? (
              <div className="admin">Admin</div>
            ) : (
              <div className="customer">User</div>
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",

      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <div className="actions">
            <button
              onClick={() => handleDelete(params.row.id)}
              className="delete"
            >
              Delete
            </button>

            <button
              onClick={() => navigate(`/user/${params.row.id}`)}
              className="view"
            >
              View
            </button>
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
