const multer = require('multer');

// Définit les types MIME autorisés et leurs extensions de fichier correspondantes
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// Utilise le stockage en mémoire pour multer
const storage = multer.memoryStorage();

// Filtre les fichiers selon leur type MIME
const fileFilter = (req, file, cb) => {
  // Vérifie si le type MIME du fichier est autorisé
  if (MIME_TYPES[file.mimetype]) {
    // Accepte le fichier
    cb(null, true);
  } else {
    // Refuse le fichier avec une erreur
    cb(new Error('Le type du fichier est incorrect'), false);
  }
};

// Configure multer avec le stockage en mémoire et le filtre de type de fichier
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
}).single('image');

// Exporte le middleware multer configuré
module.exports = upload;
