const express = require("express");
const fs = require("fs");
const multer = require("multer");

const upload = multer({ dest: "public" });

// Modelos
const { Brand } = require("../models/Brand.js");

const router = express.Router();

// CRUD: READ

// Routes middleware for params
router.get("/", async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      req.query.page = page;
      req.query.limit = limit;
      next();
    } else {
      res.status(400).json({ error: "Params page or limit are not valid" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const brands = await Brand.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Num total de elementos
    const totalElements = await Brand.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: brands,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const brand = await Brand.findById(id);
    if (brand) {
      res.json(brand);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: Operación custom, no es CRUD
router.get("/name/:name", async (req, res, next) => {
  const brandName = req.params.name;

  try {
    const brand = await Brand.find({ name: new RegExp("^" + brandName.toLowerCase(), "i") });
    if (brand?.length) {
      res.json(brand);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
router.post("/", async (req, res, next) => {
  try {
    const brand = new Brand(req.body);
    const createdBrand = await brand.save();
    return res.status(201).json(createdBrand);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const brandDeleted = await Brand.findByIdAndDelete(id);
    if (brandDeleted) {
      res.json(brandDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const brandUpdated = await Brand.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (brandUpdated) {
      res.json(brandUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.post("/logo-upload", upload.single("logo"), async (req, res, next) => {
  try {
    // Rename the brand
    const originalName = req.file.originalname;
    const path = req.file.path;
    const newPath = path + "_" + originalName;
    fs.renameSync(path, newPath);

    // searching the brand
    const brandId = req.body.brandId;
    const brand = await Brand.findById(brandId);

    if (brand) {
      brand.logoImage = newPath;
      await brand.save();
      res.json(brand);
      console.log("Marca modificada con éxito!");
    } else {
      fs.unlinkSync(newPath);
      res.status(404).send("Brand not found!");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { brandRouter: router };
