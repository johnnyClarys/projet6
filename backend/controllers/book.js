const Book = require('../models/Book');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { cleanFileName, calculateAverageRating } = require('../functions/utils');

// Fonction pour récupérer tous les livres de la base de données
exports.getAllBook = async (req, res, next) => {
    try {
        // Récupère tous les livres
        const books = await Book.find();
        // Réponse avec les livres récupérés
        res.status(200).json(books);
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(500).json({ error });
    }
};

// Fonction pour récupérer les 3 livres les mieux notés de la base de données
exports.getBestBooks = async (req, res, next) => {
    try {
        // Récupère les trois livres avec les meilleures notes
        const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
        // Réponse avec les livres récupérés
        res.status(200).json(bestBooks);
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(500).json({ error });
    }
};

// Fonction pour récupérer un livre spécifique de la base de données en fonction de son ID
exports.getOneBook = async (req, res, next) => {
    try {
        // Récupère un livre par son ID
        const book = await Book.findOne({ _id: req.params.id });

        if (!book) {
            // Réponse si le livre n'est pas trouvé
            res.status(404).json({ message: "Book not found." });
        } else {
            // Réponse avec le livre récupéré
            res.status(200).json(book);
        }
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(500).json({ error });
    }
};

// Fonction pour créer un nouveau livre dans la base de données
exports.createBook = async (req, res, next) => {
    try {
        // Parse les données du livre à partir de la requête
        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;
        delete bookObject.userId;

        // Récupère l'image du livre
        const buffer = req.file.buffer;
        const timestamp = Date.now();
        const name = cleanFileName(req.file.originalname);
        const ref = `${timestamp}-${name.split('.')[0]}.webp`;

        // Convertit et enregistre l'image en utilisant sharp
        await sharp(buffer)
            .webp({ quality: 20 })
            .toFile(path.join(__dirname, '../images', ref));

        // Crée un nouvel objet livre
        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${ref}`
        });

        // Enregistre le livre dans la base de données
        await book.save();
        // Réponse de succès
        res.status(201).json({ message: 'Book created!' });
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(500).json({ error });
    }
};

// Fonction pour modifier un livre dans la base de données
exports.modifyBook = async (req, res, next) => {
    try {
        // Prépare les données du livre à partir de la requête
        const bookObject = req.file ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body
        };

        delete bookObject.userId;

        // Récupère le livre par son ID
        const book = await Book.findOne({ _id: req.params.id });

        if (book.userId != req.auth.userId) {
            // Réponse si l'utilisateur n'est pas autorisé à modifier le livre
            return res.status(401).json({ message: 'Unauthorized.' });
        }

        // Si un nouveau fichier est téléchargé, traite et enregistre l'image
        if (req.file) {
            const buffer = req.file.buffer;
            const timestamp = Date.now();
            const name = cleanFileName(req.file.originalname);
            const ref = `${timestamp}-${name.split('.')[0]}.webp`;

            await sharp(buffer)
                .webp({ quality: 20 })
                .toFile(path.join(__dirname, '../images', ref));

            // Met à jour l'URL de l'image dans l'objet livre
            bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${ref}`;

            // Si le livre avait une image existante, la supprime
            if (book.imageUrl) {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) {
                        console.error("Error deleting file:", error);
                    }
                });
            }
        }

        // Met à jour le livre dans la base de données
        await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
        // Réponse de succès
        res.status(200).json({ message: 'Book modified!' });
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(500).json({ error });
    }
};

// Fonction pour supprimer un livre de la base de données
exports.deleteBook = async (req, res, next) => {
    try {
        // Récupère le livre par son ID
        const book = await Book.findOne({ _id: req.params.id });

        if (book.userId != req.auth.userId) {
            // Réponse si l'utilisateur n'est pas autorisé à supprimer le livre
            return res.status(401).json({ message: 'Unauthorized.' });
        }

        const filename = book.imageUrl.split('/images/')[1];
        // Supprime l'image associée au livre
        fs.unlink(`images/${filename}`, () => {
            // Supprime le livre de la base de données
            Book.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Book deleted!' }))
                .catch(error => res.status(401).json({ error }));
        });
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(500).json({ error });
    }
};

// Fonction pour ajouter une note à un livre dans la base de données
exports.createRatingBook = async (req, res, next) => {
    const userId = req.auth.userId;
    const rating = req.body.rating;
    try {
        // Récupère le livre par son ID
        const book = await Book.findOne({ _id: req.params.id });

        if (!book) {
            // Réponse si le livre n'est pas trouvé
            return res.status(404).json({ message: "Book not found." });
        }

        // Vérifie si l'utilisateur a déjà noté le livre
        const existingRating = book.ratings.find(r => r.userId === userId);
        if (existingRating) {
            // Réponse si l'utilisateur a déjà noté le livre
            return res.status(400).json({ message: "You have already rated this book." });
        }

        // Ajoute la nouvelle note
        const newRating = { userId: userId, grade: rating };

        const updatedBook = await Book.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { ratings: newRating } },
            { new: true }
        );

        // Calcule et met à jour la note moyenne du livre
        const newAverageRating = calculateAverageRating(updatedBook.ratings);
        updatedBook.averageRating = newAverageRating;
        await updatedBook.save();

        // Réponse avec le livre mis à jour
        res.status(200).json(updatedBook);
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(500).json({ error });
    }
};
