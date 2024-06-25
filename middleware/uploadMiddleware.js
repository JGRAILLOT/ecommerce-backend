const multer = require("multer");

// Configuration de Multer pour le téléchargement d'images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nom du fichier
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
