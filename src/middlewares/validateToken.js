import jwt from 'jsonwebtoken';

/*{"user":{"email":"test@test.com","name":"Jia Ming Liou","id":0,
"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzd
C5jb20iLCJuYW1lIjoiSmlhIE1pbmcgTGlvdSIsImlkIjowLCJpYXQiOjE1MjAyMDA2MzAsImV4cCI6MTUyMDIwMDYzMX0.2sfbjeyPoDTZOFTNzG-wGAMKKqoEi6kiA1Ruaw6RGgM"}}*/

function validateToken(req, res, next) {

    //const { token } = req.body;
    const { user } = req.cookies;
    const data = JSON.parse(user);
    const { token } = data.user;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.body.token = token
        next();
    } catch (err) {
        const error = err.message;
        res.status(401).json({ errors: error });
    }
}

export default validateToken;