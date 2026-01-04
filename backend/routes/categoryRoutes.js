const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) {
      filter.type = type;
    }
    const categories = await Category.find(filter).populate("handlerId");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category
router.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (req.body.name) category.name = req.body.name;
    if (req.body.type) category.type = req.body.type;
    if (req.body.fixedAmount !== undefined)
      category.fixedAmount = req.body.fixedAmount;
    if (req.body.handlerId !== undefined)
      category.handlerId = req.body.handlerId;
    if (req.body.description !== undefined)
      category.description = req.body.description;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    category.isActive = false;
    await category.save();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
