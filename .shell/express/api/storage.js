const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
const { uploaded, getURL, removed, getFiles } = require("@service/storage");

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (
      !file.mimetype.match(/image\/\S+/) &&
      !file.mimetype.match(/video\/\S+/)
    ) {
      return callback(new Error("Format not accepted"));
    }
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 10 * 1024 * 1024) {
      return callback(new Error("Your file maximum upload. 10MB Max"));
    }
    callback(null, true);
  },
});

router.post(
  "/thumbnail",
  upload.single("thumbnail"),
  async function (req, res) {
    var userid = req.user?.id || req.session.userid;
    if (userid) {
      try {
        var path = userid + "/" + req.file.originalname;
        // path_thumbnail = old path_thumbnail
        if (req.body.path_thumbnail) {
          removed(req.body.path_thumbnail);
        }
        var buffer = await sharp(req.file.buffer).resize(560, 560).toBuffer();
        await uploaded(
          req.file,
          path,
          (err) => {
            getURL(path, (err, url) => {
              res.json({
                file: req.file,
                path: path,
                url: url,
              });
            });
          },
          buffer
        );
      } catch (err) {
        res.status(400).json({
          message: err.message,
        });
      }
    } else {
      return res.status(403).json({
        message: "You are not allowed",
      });
    }
  }
);
router.post("/avatar", upload.single("avatar"), async function (req, res) {
  var userid = req.user?.id || req.session.userid;
  if (userid) {
    if (req.body.path_avatar) {
      removed(req.body.path_avatar);
    }
    try {
      var path = userid + "/" + req.file.originalname;
      var buffer = await sharp(req.file.buffer).resize(120, 120).toBuffer();
      await uploaded(
        req.file,
        path,
        (err) => {
          getURL(path, (err, url) => {
            res.json({
              file: req.file,
              path: path,
              url: url,
              message: "Successfuly upload avatar",
            });
          });
        },
        buffer
      );
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  } else {
    return res.status(403).json({
      message: "You are not allowed",
    });
  }
});
router.post("/file", upload.single("file"), async function (req, res) {
  var userid = req.user?.id || req.session.userid;
  if (userid) {
    try {
      var path = userid + "/" + req.file.originalname;
      var buffer = null;
      await uploaded(req.file, path, (err) => {
        getURL(path, (err, url) => {
          res.json({
            file: req.file,
            path: path,
            url: url,
            message: "Successfuly upload file",
          });
        });
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  } else {
    return res.status(403).json({
      message: "You are not allowed",
    });
  }
});
router.post("/list", async function (req, res) {
  var userid = req.user?.id || req.session.userid;
  if (userid) {
    try {
      var [files] = await getFiles(userid + "/");
      res.json({
        file: files,
      });
    } catch (e) {
      res.status(400).json({
        message: e.message,
      });
    }
  } else {
    return res.status(403).json({
      message: "You are not allowed",
    });
  }
});
router.get("/link", async function (req, res) {
  try {
    getURL(req.query.path, (err, url) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      res.json({
        path: req.query.path,
        url: url,
      });
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});
router.get("/:id", async function (req, res) {
  var userid = req.user?.id || req.session.userid;
  var isAdmin = req.user?.role === "admin" || req.session.isAdmin;
  if (userid === req.params.id || isAdmin) {
    try {
      var [files, nextPageToken] = await getFiles(req.params.id + "/");
      res.json({
        file: files,
      });
    } catch (e) {
      res.status(400).json({
        message: e.message,
      });
    }
  } else {
    res.status(400).json({
      message: e.message,
    });
  }
});
router.post("/:id", async function (req, res) {
  try {
    await removed(req.body.name);
    res.json({
      message: "Successfuly delete file",
    });
  } catch (e) {
    res.status(400).json(e);
  }
});
router.delete("/:id", async function (req, res) {
  var userid = req.user?.id || req.session.userid;
  if (userid) {
    try {
      if (parseInt(req.params.id) !== userid) {
        throw Error("can't be access");
      }
      await removed(req.body.name);
      res.json({
        message: "Successfuly delete file",
      });
    } catch (e) {
      res.status(400).json({
        message: e.message,
      });
    }
  }
});

module.exports = router;
