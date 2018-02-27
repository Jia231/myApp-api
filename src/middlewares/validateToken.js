
function validateToken(req, res, next) {
    const token = req.body;
    next();
}

export default validateToken;