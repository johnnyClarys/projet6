const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secretKey } = require('../config');

module.exports = async (req, res, next) => {
    try {
        // Récupère le token JWT de l'en-tête d'autorisation
        const token = req.headers.authorization.split(' ')[1];
        // Vérifie et décode le token JWT
        const decodedToken = jwt.verify(
            token,
            secretKey
        );
        // Récupère l'ID de l'utilisateur à partir du token décodé
        const userId = decodedToken.userID;

        // Recherche l'utilisateur par ID dans la base de données
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found. Please log in again.' });
        }

        // Vérifie l'inactivité de l'utilisateur
        const currentTime = Date.now();
        const lastActivity = user.lastActivity.getTime();
        const maxDelay = 10 * 60 * 1000; // 10 minutes
        const inactivityTime = currentTime - lastActivity;

        if (inactivityTime > maxDelay) {
            return res.status(401).json({ error: 'Session expired due to inactivity. Please log in again.' });
        }

        // Met à jour la dernière activité de l'utilisateur
        user.lastActivity = Date();
        await user.save();

        // Ajoute l'ID de l'utilisateur à l'objet de requête pour un accès ultérieur
        req.auth = {
            userId: userId
        }
        next();
    } catch (error) {
        // Gère les erreurs de token JWT
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'JWT token has expired. Please log in again.' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Error verifying JWT token. Please log in again.' });
        } else {
            res.status(401).json({ error: 'Authentication error. Please log in again.' });
        }
    }
};
