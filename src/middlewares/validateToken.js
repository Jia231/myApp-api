import jwt from 'jsonwebtoken';
import User from '../models/User';

/*
[ 'user=%7B%22user%22%3A%7B%22email%22%3A%22test%40test.com%22%2C%22name%22%3A%22Jia%20Ming%20Liou%22%2C%22id%22%3A0%2C%22access_token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiSmlhIE1pbmcgTGlvdSIsImlkIjowLCJpYXQiOjE1MjA5OTgzNzAsImV4cCI6MTUyMTAwMTk3MH0.-rNGfUB_siWvxGAEERbIbCJwakxryYHxQDwkabKmifk%22%2C%22refresh_token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiSmlhIE1pbmcgTGlvdSIsImlkIjowLCJpYXQiOjE1MjA5OTgzNzAsImV4cCI6MTUyMTYwMzE3MH0.iNNyIqvCWhlyT8onBLbvTDgyWzrFCQRtvLSDKotGBu4%22%7D%7D; Max-Age=900; Path=/; Expires=Wed, 14 Mar 2018 03:47:50 GMT' ]
*/

function validateToken(req, res, next) {

    //const { token } = req.body;
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        if (req.cookies) {
            const body = req.cookies;
            const { user } = req.cookies;
            const data = JSON.parse(user);
            const { access_token } = data.user;
            try {
                const decodedToken = jwt.verify(access_token, process.env.JWT_SECRET)
                req.body.token = access_token;
                User.findOne({ access_token: access_token }).then(user => {
                    next();
                })

            } catch (err) {
                /*
                //this would return unauthorized status
                const error = err.message;
                res.status(401).json({ errors: error });
                */
                if (err.message == 'invalid signature') {
                    res.status(401).json({ errors: err.message });
                }
                else if (err.message == 'jwt expired') {
                    const { refresh_token } = data.user;
                    User.findOne({ refresh_token: refresh_token }).then(user => {
                        if (user) {
                            const foundUser = user.toAuthJSON();
                            const newData = {
                                "access_token": foundUser.access_token,
                                "refresh_token": foundUser.refresh_token
                            }
                            User.findOneAndUpdate({ refresh_token: refresh_token },
                                newData, { upsert: true, new: true }, function (err, doc) {
                                    if (err) {
                                        return res.send(500, { error: err });
                                    }
                                    const validUser = JSON.stringify({ user: doc.recordToJSON() })
                                    res.cookie('user', validUser, { maxAge: 900000, httpOnly: false })
                                    req.body.token = doc.access_token;
                                    next();
                                });
                        }
                        else {
                            res.status(401).json({ errors: "Invalid refresh token" })
                        }
                    })
                }
            }
        }
        else {
            res.status(401).json({ errors: "Invalid credentials" })
        }
    }

}

export default validateToken;

