import { NextFunction, Request, Response } from 'express';
import { AuthReq } from "../../typings/express";

import { handleValidationErrors } from '../../utils/validation';
const { check } = require('express-validator');


const { Op } = require('sequelize')


import db from '../../db/models'
import { errors } from '../../typings/errors';
import { NoResourceError } from '../../errors/customErrors';
import { nextTick } from 'process';

const {  Image } = db


const router = require('express').Router();


router.get('/images', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const images = await Image.findAll({});
        res.json(images)
    }
    catch (err) {
        next(err)
    }
})
router.post('/images', async (req: AuthReq, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'url is required' });

    const oldImage = await Image.findOne({ where: { url } });
    if (oldImage) {
      return res.status(200).json({ id: oldImage.id, url: oldImage.url }); 
    }

    const image = await Image.create({ url });
    return res.status(201).json({ id: image.id, url: image.url });         
  } catch (error) {
    return next(error);
  }
});
router.get('/images/:id', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const imageId = req.params.id
        const image = await Image.findByPk(imageId)
        if (!image) throw new NoResourceError("No image found with that id", 404);
        res.json(image)
    }
    catch (err) {
        next(err)
    }
})

router.put('/images/:id', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const imageId = req.params.id;
        const {
            url
        } = req.body


        const image = await Image.findByPk(imageId)
        if (!image) throw new NoResourceError("No image found with that id", 404);
        await Image.update({
            url
        });
        res.status(200).json({
            id: image.id,
            url: url
        })


    } catch (error) {
        next(error);
    }
})









router.delete('/images/:id', async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const imageId = req.params.id;
        const image = await Image.findByPk(imageId)
        if (!image) {
            return res.status(404).json({ message: "Playlist couldn't be found" });
        }
        await image.destroy();
        return res.status(200).json({ message: "Successfully deleted" });

    } catch (error) {
        next(error);
    }
})




export = router;
