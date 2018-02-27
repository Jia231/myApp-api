import express from 'express';
import Token from '../models/Token';

const router = express.Router();

router.post('/', (req, res) => {
    const { credentials } = req.body;
    console.log(credentials)
})

export default router;