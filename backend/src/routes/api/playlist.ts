import { NextFunction, Request, Response } from 'express';
import { AuthReq } from "../../typings/express";

import { handleValidationErrors } from '../../utils/validation';
const { check } = require('express-validator');


const { Op } = require('sequelize')


import db from '../../db/models'
import { errors } from '../../typings/errors';
import { NoResourceError } from '../../errors/customErrors';
import { nextTick } from 'process';

const { Playlist, Image, Song } = db


const router = require('express').Router();






router.get('/playlist', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const playlists = await Playlist.findAll({
            include: {
                model: Image,
            },
            where: {
                ownerId: req.user.id
            }
        });
        res.json(playlists)
    }
    catch (err) {
        next(err)
    }
})
router.post('/playlist', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const {
            name,
            previewId
        } = req.body



        const playlist = await Playlist.create({
            name,
            previewId
        })
     
        res.status(200).json({
            id: playlist.id,
            name: name,
            previewId: previewId
        })


    } catch (error) {
        next(error);
    }
})
router.get('/playlist/:id', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const playlistId = req.params.id
        const playlist = await Playlist.findOne({
            where: {
                id: playlistId,
                ownerId: req.user.id
            },
            include: [
                { model: Image },
                {
                    model: Song,
                    through: { attributes: [] },
                    include: [{ model: Image }],
                }
            ]
        });
        res.json(playlist)
    }
    catch (err) {
        next(err)
    }
})

router.put('/playlist/:id', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const playlistId = req.params.id;
        const {
            name,
            previewId
        } = req.body


        const playlist = await Playlist.findOne({
            where:{
                id:playlistId,
                ownerId: req.user.id
            }})
        if (!playlist) throw new NoResourceError("No playlist found with that id", 404);
        await playlist.update({
            name,
            previewId
        });
        res.status(200).json({
            id: playlistId,
            name: name,
            previewId: previewId
        })


    } catch (error) {
        next(error);
    }
})









router.delete('/playlist/:id', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const playlistId = req.params.id;
        const playlist = await Playlist.findOne({
            where:{
                id:playlistId,
                ownerId: req.user.id
            }})
        if (!playlist) {
            return res.status(404).json({ message: "Playlist couldn't be found" });
        }
        await playlist.destroy();
        return res.status(200).json({ message: "Successfully deleted" });

    } catch (error) {
        next(error);
    }
})




export = router;
