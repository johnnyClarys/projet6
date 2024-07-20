/**
 * Fonction pour calculer la note moyenne pour chaque livre lorsqu'une note est ajoutée, mise à jour ou supprimée
 * @param {Array} ratings - Tableau de notes, chaque élément contient une note et l'ID de l'utilisateur qui l'a donnée
 * @returns {number} La note moyenne calculée avec deux décimales
 */
const calculateAverageRating = (ratings) => {
    // Somme des notes
    const totalRating = ratings.reduce((acc, rating) => acc + rating.grade, 0);
    // Calcul de la moyenne
    const averageRating = totalRating / ratings.length;
    // Retourne la moyenne avec deux décimales
    return parseFloat(averageRating.toFixed(2));
};

/**
 * Fonction pour remplacer et supprimer les caractères indésirables dans le nom de fichier téléchargé
 * @param {string} str - Le nom de fichier à nettoyer
 * @returns {string} Le nom de fichier nettoyé
 */
const cleanFileName = (str) => {
    // Supprime les emojis
    str = str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
    // Remplace les caractères spéciaux
    str = str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Caractères accentués
        .replace(/[^\w\s.-]/g, "") // Pas de lettres, chiffres, espaces, tirets ou points
        .replace(/\s+/g, "") // Supprime les espaces
        .replace(/\s+/g, "_"); // Convertit les espaces en underscores
    // Limite le nom à 99 caractères
    if (str.length > 99) {
        str = str.substring(0, 99);
    }
    return str;
};

module.exports = { cleanFileName, calculateAverageRating };
