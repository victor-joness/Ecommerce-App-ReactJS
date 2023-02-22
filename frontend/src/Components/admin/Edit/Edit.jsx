import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./Edit.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productsUpdate } from "../../../features/productSlice";

export default function Edit({ prodId }) {
  const [open, setOpen] = useState(false);

  const { items, editStatus} = useSelector((state) => state.products);

  const [currentProduct, setCurrentProduct] = useState({});
  const [previewImg, setPreviewImg] = useState("");
  const [productImg, setProductImg] = useState("");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);

    let selectedProd = items.filter((item) => item._id === prodId);

    selectedProd = selectedProd[0];

    setCurrentProduct(selectedProd);
    setPreviewImg(selectedProd.img.url);
    setProductImg("");
    setBrand(selectedProd.brand);
    setName(selectedProd.name);
    setDesc(selectedProd.desc);
    setPrice(selectedProd.price);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    TransformFile(file);
  };

  //pegando a imagem e transformando em base64
  //lembrando que em base 64 podemos passar para uma tag img e ele renderizar
  const TransformFile = (file) => {
    const render = new FileReader();

    if (file) {
      render.readAsDataURL(file);
      render.onloadend = () => {
        setProductImg(render.result);
        setPreviewImg(render.result);
      };
    } else {
      setProductImg("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      productsUpdate({
        productImg,
        product: {
          ...currentProduct,
          name: name,
          brand: brand,
          price: price,
          desc: desc,
        },
      })
    );
  };

  return (
    <div>
      <div className="edit" variant="outlined" onClick={handleClickOpen}>
        Editar
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogContent>
          <div className="CreateProduct">
            <div className="StyledForm">
              <h3>Create a product</h3>
              <input
                type="file"
                accept="image/"
                onChange={handleProductImageUpload}
              />
              <select
                value={brand}
                required
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="Selecione a marca">Selecione a marca</option>
                <option value="Iphone">Iphone</option>
                <option value="Samsung">Samsung</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="other">Outro</option>
              </select>
              <input
                type="text"
                required
                placeholder="Nome"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <input
                type="text"
                required
                placeholder="Preço"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
              <input
                type="text"
                required
                placeholder="Descrição"
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
              />
              <button
                className="PrimaryButton"
                type="submit"
                onClick={handleSubmit}
              >
                {editStatus === "pending" ? "Submitting" : "Submit"}
              </button>
            </div>

            <div className="Image-Preview">
              {previewImg ? (
                <img src={previewImg} alt="image-product"></img>
              ) : (
                <p>Imagem Preview aqui!!</p>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
