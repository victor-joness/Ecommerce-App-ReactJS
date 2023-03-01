const express = require("express");
const cloudinary = require("../utils/cloudinary");
const { Product } = require("../models/product");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

//CREATE PRODUCT
router.post("/", isAdmin, async (req, res) => {
  const { name, brand, desc, price, img } = req.body;

  try {
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img, {
        upload_preset: "online-shop2",
      });

      if (uploadedResponse) {
        const product = new Product({
          name,
          brand,
          desc,
          price,
          img: uploadedResponse,
        });

        const savedProduct = await product.save();

        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Produto não encontrado");
    }

    if (product.img.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.img.public_id
      );

      if (destroyResponse) {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);

        res.status(200).send(deleteProduct);
      }
    } else {
      console.log("Ação terminada, falha em deletar o produto");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//UPDTADE PRODUCT
router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.productImg) {
    try {
      const destroyResponse = await cloudinary.uploader.destroy(
        req.body.product.img.public_id
      );

      if (destroyResponse) {
        const uploadedResponse = await cloudinary.uploader.upload(
          req.body.productImg,
          { upload_preset: "online-shop2" }
        );
      }

      if (uploadedResponse) {
        const updateProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...req.body.product,
              img: uploadedResponse,
            },
          },
          { new: true }
        );

        res.status(200).send(updateProduct);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    try {
      const updateProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body.product },
        { new: true }
      );
      res.status(200).send(updateProduct);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
});

module.exports = router;
