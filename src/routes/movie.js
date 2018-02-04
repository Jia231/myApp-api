import express from 'express';
import Movie from '../models/Movie';
import mongoose from 'mongoose';

const router = express.Router();

router.post("/", (req, res) => {
    const data = req.body.movie;
    Movie.findOne({ userId: data.userId, movieId: data.movieId })
        .then(movie => {
            if (movie == null) {
                const newMovie = new Movie({ ...req.body.movie })
                return newMovie.save()
                    .then(() => res.json({ message: "Movie stored successfully" }))
                    .catch(err => res.status(400).json({ errors: { global: err } }))
            }
            else
                return res.status(400)
                    .json({ errors: { global: "Movie is already in your collection" } })
        })
})

router.post('/userCollection', (req, res) => {
    const data = req.body.userId;
    Movie.find({ userId: data }).then(
        movies => {
            if (movies != null) {
                return res.json({ movies: movies })
            }
            else {
                return res.json({})
            }
        }
    ).catch(err => res.status(400).json({ errors: { global: err } }))
})

router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    console.log(id, userId)
    Movie.find({ _id: id })
        .remove().exec()
        .then(() => {
            Movie.find({ userId: userId }).then(
                movies => {
                    if (movies != null) {
                        return res.json({ movies: movies })
                    }
                    else {
                        return res.json({})
                    }
                }
            ).catch(err => res.status(400).json({ errors: { global: err } }))
        })
        .catch(err => res.status(400).json({ errors: { global: err } }))
})

export default router;