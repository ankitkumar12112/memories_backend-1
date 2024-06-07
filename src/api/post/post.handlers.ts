import { Response, Request, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import { config } from "../../config/firebaseConfig";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import { PostWithId, Posts, Post } from "./post.model";



//Initialize a firebase application
initializeApp(config);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();
export async function findAll(
  req: Request,
  res: Response<PostWithId[]>,
  next: NextFunction
) {
  try {
    const result = await Posts.find().toArray();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function createOne(
  req: Request<{}, PostWithId, Post>,
  res: Response<PostWithId>,
  next: NextFunction
) {
  try {
    // Validate form data
    const validatedData = Post.parse({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      title: req.body.title,
      description: req.body.description,
    });

    // Upload file to Firebase Storage

    if (req.file) {
      //create a reference in firebase
      const storageRef = ref(storage, `files/${req.file.originalname}`);
      const metadata = { contentType: req.file.mimetype };
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      const downloadURL = await getDownloadURL(snapshot.ref);
      // Add file URL to validated data
      validatedData.image = downloadURL;
    }

    // Insert post into MongoDB

    const insertResult = await Posts.insertOne(validatedData);

    if (!insertResult.acknowledged) throw new Error("Error inserting Post.");
    res.status(201);
    res.json({
      _id: insertResult.insertedId,
      ...req.body,
    });
  } catch (error) {
    next(error);
  }
}

export async function findOne(
  req: Request<ParamsWithId, PostWithId, {}>,
  res: Response<PostWithId>,
  next: NextFunction
) {
  try {
    const result = await Posts.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`Post with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(
  req: Request<ParamsWithId, PostWithId, Post>,
  res: Response<PostWithId>,
  next: NextFunction
) {
  try {
    const result = await Posts.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: req.body,
      },
      {
        returnDocument: "after",
      }
    );
    if (!result) {
      res.status(404);
      throw new Error(`Post with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(
  req: Request<ParamsWithId, {}, {}>,
  res: Response<{}>,
  next: NextFunction
) {
  try {
    const result = await Posts.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`Post with id "${req.params.id}" not found.`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function deleteAll(
  req: Request,
  res: Response<{}>,
  next: NextFunction
) {
  try {
    const result = await Posts.deleteMany({});
    if (!result) {
      res.status(404);
      throw new Error("Post not found.");
    }
    res.json(`${result?.deletedCount} records of Post have been deleted`);
  } catch (error) {
    next(error);
  }
}
