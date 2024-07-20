const express = require('express');
const router = express.Router(); // Création du routeur Express

const userCtrl = require('../controllers/user'); // Importation des fonctions du contrôleur utilisateur

// Route pour l'inscription d'un nouvel utilisateur
router.post('/signup', userCtrl.signup);
// Route pour la connexion d'un utilisateur existant
router.post('/login', userCtrl.login);

// Exportation du routeur pour l'utiliser dans l'application principale
module.exports = router;
