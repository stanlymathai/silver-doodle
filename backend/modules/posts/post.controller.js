const DB = require("../../config/db");
const COLLECTION = "posts";

const objectId = require("mongodb").ObjectId;

module.exports = {
  getPosts: async (req, res) => {
    let db = DB.getDB();
    db.collection(COLLECTION)
      .find(
        {},
        {
          sort: [["createdAt", "desc"]],
        }
      )
      .project({ createdAt: 0, updatedAt: 0 })
      .skip(Number(req.params.offset))
      .limit(Number(req.params.limit))
      .toArray((error, result) => {
        if (error) {
          res.status(400).send("Error fetching posts!");
        } else res.json(result);
      });
  },
  getPostById: async (req, res) => {
    let db = DB.getDB();
    let findQuery = { _id: objectId(req.params.id) };
    db.collection(COLLECTION).findOne(findQuery, (error, result) => {
      if (error) {
        res.status(400).send("Error finding post!");
      } else res.json(result);
    });
  },
  addPost: async (req, res) => {
    let db = DB.getDB();
    let payload = {
      title: req.body.title,
      description: req.body.description,
      createdAt: new Date(),
    };
    db.collection(COLLECTION).insertOne(payload, (error, result) => {
      if (error) {
        res.status(400).send("Error adding post!");
      } else res.json(result);
    });
  },
  updatePost: async (req, res) => {
    let db = DB.getDB();
    let findQuery = { _id: objectId(req.body.id) };
    let payload = {
      title: req.body.title,
      description: req.body.description,
      updatedAt: new Date(),
    };

    db.collection(COLLECTION).updateOne(
      findQuery,
      { $set: payload },
      (error, result) => {
        if (error) {
          res.status(400).send("Error updating post!");
        } else res.json(result);
      }
    );
  },
  deletePost: async (req, res) => {
    let db = DB.getDB();
    let findQuery = { _id: objectId(req.params.id) };

    db.collection(COLLECTION).deleteOne(findQuery, (error, result) => {
      if (error) {
        res.status(400).send("Error deleting post!");
      } else res.json(result);
    });
  },
  postCount: async (req, res) => {
    let db = DB.getDB();
    let count = await db.collection(COLLECTION).find({}).count();
    if (!count) return res.status(400).send("Error fetching post count");
    res.json(count);
  },
};
