const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secretKey } = require('../config');

// Fonction pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Vérifie si l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(req.body.email);
    
    if (!isValidEmail) {
        // Réponse si l'email n'est pas valide
        return res.status(400).json({ message: 'Invalid email address.' });
    }

    // Vérifie si le mot de passe est valide
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(req.body.password);

    if (!isValidPassword) {
        // Réponse si le mot de passe n'est pas valide
        return res.status(400).json({ message: 'Password must contain at least 8 characters, including: 1 uppercase letter, 1 lowercase letter and 1 special character.'});
    }

    // Hash le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Crée un nouvel utilisateur avec le mot de passe hashé
        const user = new User({
            email: req.body.email,
            password: hash,
            createdAt: new Date(),
        });
        // Enregistre l'utilisateur dans la base de données
        user.save()
            .then(() => res.status(201).json({ message: 'User created' }))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Fonction pour la connexion d'un utilisateur
exports.login = (req, res, next) => {
    // Trouve l'utilisateur par email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                // Réponse si l'utilisateur n'est pas trouvé
                res.status(401).json({ message: 'Incorrect email/password pair.' });
            } else {
                // Compare le mot de passe fourni avec le mot de passe hashé stocké
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            // Réponse si le mot de passe est incorrect
                            res.status(401).json({ message: 'Incorrect email/password pair.' });
                        } else {
                            // Met à jour la dernière activité de l'utilisateur
                            const lastActivity = user.lastActivity = Date.now();
                            user.save()
                                .then(() => {
                                    // Réponse avec l'ID de l'utilisateur, la dernière activité et le token JWT
                                    res.status(200).json({
                                        userId: user._id,
                                        lastActivity: lastActivity,
                                        token: jwt.sign(
                                            { userID: user._id },
                                            secretKey,
                                            { expiresIn: '24h' }
                                        )
                                    });
                                })
                                .catch(error => res.status(500).json({ error: error.message }));
                        }
                    })
                    .catch(error => {
                        // Réponse en cas d'erreur de comparaison de mot de passe
                        res.status(500).json({ error });
                    });
            }
        })
        .catch(error => {
            // Réponse en cas d'erreur de recherche d'utilisateur
            res.status(500).json({ error });
        });
};
