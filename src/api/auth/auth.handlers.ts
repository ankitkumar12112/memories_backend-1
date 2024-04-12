import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

import { ParamsWithId } from '../../interfaces/ParamsWithId';
import {AuthWithId, Auths, Auth } from './auth.model';

export async function findAll(req: Request, res: Response<AuthWithId[]>, next: NextFunction) {
  try {
    const result = await Auths.find().toArray();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function createOne(req: Request<{}, AuthWithId, Auth>, res: Response<AuthWithId>, next: NextFunction) {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Hash the password before inserting into the database
    const hashedPassword = await bcrypt.hash(password, 10); // Using saltRounds = 10

    const insertResult = await Auths.insertOne({
      firstname,
      lastname,
      email,
      password: hashedPassword, // Store hashed password in the database
    });

    if (!insertResult.acknowledged) throw new Error('Error inserting Auth.');

    // Ensure password type matches Auth model definition
    const responseWithPassword: AuthWithId = {
      _id: insertResult.insertedId,
      firstname,
      lastname,
      email,
      password: hashedPassword,
    };

    res.status(201);
    res.json(responseWithPassword);
  } catch (error) {
    next(error);
  }
}

export async function findOne(req: Request<ParamsWithId, AuthWithId, {}>, res: Response<AuthWithId>, next: NextFunction) {
  try {
    const result = await Auths.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`Auth with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(req: Request<ParamsWithId, AuthWithId, Auth>, res: Response<AuthWithId>, next: NextFunction) {
  try {
    const result = await Auths.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    if (!result) {
      res.status(404);
      throw new Error(`Auth with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    const result = await Auths.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`Auth with id "${req.params.id}" not found.`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function deleteAll(req: Request, res: Response<{}>, next: NextFunction) {
  try {
    const result = await Auths.deleteMany({});
    if (!result) {
      res.status(404);
      throw new Error('Auth not found.');
    }
    res.json(`${result?.deletedCount} records of Auth have been deleted`);
  } catch (error) {
    next(error);
  }
}