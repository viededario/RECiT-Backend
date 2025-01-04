// controllers/recommendations.js

import express from "express";
import verifyToken from "../middleware/verify-token.js";
import Recommendation from "../models/recommendation.js";
const router = express.Router();

// ========== Public Routes ===========

router.get("/", async (req, res) => {
  try {
    const recommendations = await Recommendation.find({})
    .populate("author") 
    .sort({ createdAt: "desc" });
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:recommendationId", async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(
      req.params.recommendationId
    ).populate("author");
    res.status(200).json(recommendation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ========= Protected Routes =========

router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const recommendation = await Recommendation.create(req.body);
    recommendation._doc.author = req.user;
    res.status(201).json(recommendation);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/:recommendationId/like", verifyToken, async (req, res) => {
    try {
        const recommendation = await Recommendation.findById(req.params.recommendationId)
        if (!recommendation.likes.includes(req.user._id)) {
            recommendation.likes.push(req.user._id)
            recommendation.dislikes = recommendation.dislikes.filter((id) => !id.equals(req.user._id))
            await recommendation.save()
        } 
        await recommendation.populate('author')
        res.status(200).json({ recommendation });
        
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post("/:recommendationId/dislike", verifyToken, async (req, res) => {
    try {
        const recommendation = await Recommendation.findById(req.params.recommendationId)
        if (!recommendation.dislikes.includes(req.user._id)) {
            recommendation.dislikes.push(req.user._id)
            recommendation.likes = recommendation.likes.filter((id) => !id.equals(req.user._id))
            await recommendation.save()
        }
        await recommendation.populate('author')
        res.status(200).json({ recommendation });
        
    } catch (error) {
        res.status(500).json(error);
    }
})

router.put("/:recommendationId", verifyToken, async (req, res) => {
  try {
    // Find the recommendation:
    const recommendation = await Recommendation.findById(
      req.params.recommendationId
    );

    // Check permissions:
    if (!recommendation.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    //sanitazing the object by not updating the author and createdAt
    delete req.body.author;
    delete req.body.createdAt;
    // Update recommendation:
    const updatedRecommendation = await Recommendation.findByIdAndUpdate(
      recommendation,
      req.body,
      { new: true }
    );
    console.log(updatedRecommendation);

    // Append req.user to the author property:
    updatedRecommendation._doc.author = req.user;

    // Issue JSON response:
    res.status(200).json(updatedRecommendation);
  } catch (error) {
    res.status(500).json(error);
  }
});


router.delete('/:recommendationId', verifyToken, async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.recommendationId);

    if (!recommendation.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedRecommendation = await Recommendation.findByIdAndDelete(req.params.recommendationId);
    res.status(200).json(deletedRecommendation);
  } catch (error) {
    res.status(500).json(error);
  }
});


router.post('/:recommendationId/comments', verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const recommendation = await Recommendation.findById(req.params.recommendationId);
    recommendation.comments.push(req.body);
    await recommendation.save();

    // Find the newly created comment:
    const newComment = recommendation.comments[recommendation.comments.length - 1];

    newComment._doc.author = req.user;

    // Respond with the newComment:
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:recommendationId/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.recommendationId);
    const comment = recommendation.comments.id(req.params.commentId);
    comment.text = req.body.text;
    await recommendation.save();
    res.status(200).json({ message: 'Ok' });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.delete('/:recommendationId/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.recommendationId);
    recommendation.comments.remove({ _id: req.params.commentId });
    await recommendation.save();
    res.status(200).json({ message: 'Ok' });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.use(verifyToken);

export default router;
