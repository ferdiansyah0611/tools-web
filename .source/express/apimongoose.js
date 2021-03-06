var router = require("express").Router();
var Model = require("yourmodel");
var { body, validationResult } = require("express-validator");
var { validate } = require("@service/auth");

const limit = 20;
const valid = {};

router.get("/", async (req, res) => {
  try {
    var page = Number(req.query.page) || 1;
    var value = await Model.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    res.json({
      data: value,
      currentPage: page,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    var value = await Model.findOne({
      _id: req.params.id,
    }).exec();
    res.json({
      data: value,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});
router.post("/", validate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }
    var data = await Model.create(req.body);
    res.json({
      message: "Successfuly added",
      input: data,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});
router.patch("/:id", validate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }
    await Model.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    res.json({
      message: "Successfuly updated",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});
router.delete("/:id", validate, async (req, res) => {
  try {
    await Model.deleteOne({
      _id: req.params.id,
    });
    res.json({
      message: "Successfuly deleted",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
