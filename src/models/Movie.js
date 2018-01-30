import mongoose from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);

const schema = new mongoose.Schema({
    movieId: {
        required: true,
        type: Number,
    },
    title: {
        required: true,
        type: String
    },
    overview: {
        required: true,
        type: String
    },
    poster_path: {
        type: String,
        required: true
    },
    vote_average: {
        required: true,
        type: String
    },

    userId: {
        required: true,
        type: Number
    }

})


schema.plugin(autoIncrement.plugin, "Movie");

export default mongoose.model("Movie", schema)