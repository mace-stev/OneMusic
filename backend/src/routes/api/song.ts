import { NextFunction, Request, Response } from 'express';
import { AuthReq } from "../../typings/express";

import { handleValidationErrors } from '../../utils/validation';
const { check } = require('express-validator');


const { Op, WhereOptions } = require('sequelize')


import db from '../../db/models'
import { errors } from '../../typings/errors';
import { NoResourceError } from '../../errors/customErrors';
import { nextTick } from 'process';
import { WhereOptions } from 'sequelize';

const { Playlist, Image, Song, PlaylistSong } = db


const router = require('express').Router();






router.get('/songs', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const { title, artist } = req.query as Record<
            string,
            string | undefined
        >;

        const where: WhereOptions = {};
        if (title) {
            where.title = { [Op.iLike]: `%${String(title)}%` };
        }
        if (artist) {
            where.artist = { [Op.iLike]: `%${String(artist)}%` };
        }

        const songs = await Song.findAll({
            where,
            include: {
                model: Image,
            },

        });
        if ((title || artist) && songs.length === 0) {
            return res.status(404).json({ message: 'No songs found matching your search.' });
        }

        res.json(songs)
    }
    catch (err) {
        next(err)
    }
})
router.get('/songs/:id', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const songId = req.params.id
        const song = await Song.findOne({
            where: {
                id: songId
            },
            include: {
                model: Image
            }
        });
        res.json(song)
    }
    catch (err) {
        next(err)
    }
})
router.post('/songs', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            artist,
            playlistId,
            previewId
        } = req.body



        const song = await Song.create({
            title,
            artist,
            playlistId,
            previewId
        })
     
        res.status(200).json({
            id: song.id,
            title: title,
            artist: artist,
            previewId: previewId
        })


    } catch (error) {
        next(error);
    }
})


router.put('/songs/:id', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            artist,
            playlistId,
            previewId
        } = req.body
        const songId = req.params.id


        const song = await Song.findOne({
            where: {
                id: songId,
                playlistId: playlistId
            }
        })
        if (!song) throw new NoResourceError("No song found with that id", 404);
        await song.update({
            title,
            artist,
            previewId
        });
        res.status(200).json({
            id: songId,
            title: title,
            artist: artist,
            previewId: previewId
        })


    } catch (error) {
        next(error);
    }
})









router.delete('/songs/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playlistId } = req.body
        const songId = req.params.id;
        const song = await PlaylistSong.findOne({
            where: {
                songId: songId,
                playlistId: playlistId
            }
        })
        if (!song) {
            return res.status(404).json({ message: "Song couldn't be found" });
        }
        await song.destroy();
        return res.status(200).json({ message: "Successfully deleted from playlist" });

    } catch (error) {
        next(error);
    }
})




export = router;
