import { useState } from "react";
import {useDispatch} from "react-redux";
import "./CreateProduct.css";
import { productsCreate } from "../../../features/productSlice";

const CreateProduct = () => {
  const [productImg, setProductImg] = useState("");

  const [name,setName] = useState("");
  const [desc,setDesc] = useState("");
  const [price,setPrice] = useState("");
  const [brand,setBrand] = useState("");

  const dispatch = useDispatch();

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
      };
    } else {
      setProductImg("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(productsCreate({
        name,
        brand,
        desc,
        price,
        img: productImg
    }));
  };

  return (
    <div className="CreateProduct">
      <div className="StyledForm" >
        <h3>Create a product</h3>
        <input
          type="file"
          accept="image/"
          onChange={handleProductImageUpload}
        />
        <select required onChange={(e) => setBrand(e.target.value)}>
            <option value="Selecione a marca">Selecione a marca</option>
            <option value="Iphone">Iphone</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="other">Outro</option>
        </select>
        <input type="text" required placeholder="Nome" onChange={(e) => setName(e.target.value)}/>
        <input type="text" required placeholder="Preço" onChange={(e) => setPrice(e.target.value)}/>
        <input type="text" required placeholder="Descrição" onChange={(e) => setDesc(e.target.value)}/>
        <button className="PrimaryButton" type="submit" onClick={handleSubmit}>Submit</button>
      </div>

      <div className="Image-Preview">
        {productImg ? (
          <img src={productImg} alt="image-product"></img>
        ) : (
          <p>Imagem Preview aqui!!</p>
        )}
      </div>
    </div>
  );
};

export default CreateProduct;
