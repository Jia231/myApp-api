import express from 'express';
import Movie from '../models/Movie';
import mongoose from 'mongoose';

const router = express.Router();

router.post("/", (req, res) => {
    //
    const data = req.body.movie;
    console.log(data)
    Movie.findOne({ userId: data.userId, movieId: data.movieId })
        .then(movie => {
            console.log(movie)
            if (movie == null) {
                const newMovie = new Movie({ ...req.body.movie })
                console.log(newMovie)
                return newMovie.save()
                    .then(() => res.json({ message: "Movie stored successfully" }))
                    .catch(err => res.status(400).json({ errors: { global: err } }))
            }
            else
                return res.status(400)
                    .json({ errors: { global: "Movie is already in your collection" } })
        })
})

export default router;

/*
res.json({ message: movie })
            if(!!movie)res.status(400)
            .json({ errors: { global: "Movie is already in your collection" } }))
    movie.save()
        .then(() => res.json({ message: "Movie stored successfully" }))
        .catch(err => res.status(400).json({ errors: { global: err } }))*/