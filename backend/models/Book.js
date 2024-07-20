const mongoose = require("mongoose");

// Définition du schéma de livre pour Mongoose
const bookSchema = mongoose.Schema({
    // ID de l'utilisateur qui a ajouté le livre
    userId : { type: String, required: true },
    // Titre du livre
    title: { type: String, required: true },
    // Auteur du livre
    author : { type: String, required: true },
    // URL de l'image du livre
    imageUrl : { type: String, required: true },
    // Année de publication du livre
    year: { type: Number, required: true },
    // Genre du livre
    genre: { type: String, required: true },
    // Tableau de notes données par les utilisateurs
    ratings: [{
        // ID de l'utilisateur qui a donné la note
        userId: { type: String, required: true },
        // Note donnée par l'utilisateur (de 0 à 5)
        grade: { type: Number, required: true, min: 0, max: 5 }
    }],
    // Note moyenne du livre (de 0 à 5)
    averageRating: { type: Number, default: 0, required: true, min: 0, max: 5 }
});

// Création du modèle Book à partir du schéma bookSchema
const Book = mongoose.model('Book', bookSchema);

// Exportation du modèle Book
module.exports = Book;
