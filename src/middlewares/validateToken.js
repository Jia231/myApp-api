
function validateToken(req, res, next) {
    const data = req.body;
    console.log('This is the middleware')
    console.log(data)
    next();
}

export default validateToken;