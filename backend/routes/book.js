const express = require('express');
const auth = require('../middleware/auth'); // Middleware d'authentification
const multer = require('../middleware/multer-config'); // Middleware pour la gestion des fichiers
const router = express.Router(); // Création du routeur Express

// Importation des fonctions du contrôleur de livre
const { getAllBook, getBestBooks, getOneBook, createBook, modifyBook, deleteBook, createRatingBook } = require('../controllers/book');

// Route pour obtenir les livres avec la meilleure note
router.get('/bestrating', getBestBooks);
// Route pour obtenir un livre par son ID
router.get('/:id', getOneBook);
// Route pour obtenir tous les livres
router.get('/', getAllBook);
// Route pour créer un nouveau livre (avec authentification et gestion des fichiers)
router.post('/', auth, multer, createBook);
// Route pour modifier un livre existant (avec authentification et gestion des fichiers)
router.put('/:id', auth, multer, modifyBook);
// Route pour supprimer un livre (avec authentification)
router.delete('/:id', auth, deleteBook);
// Route pour ajouter une note à un livre (avec authentification)
router.post('/:id/rating', auth, createRatingBook);

// Exportation du routeur pour l'utiliser dans l'application principale
module.exports = router;
