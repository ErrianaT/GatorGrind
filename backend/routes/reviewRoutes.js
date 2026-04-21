const express = require("express");
const Review = require("../models/Review");
const Business = require("../models/Business");
const User = require("../models/User");

const router = express.Router();

async function updateBusinessRating(businessId) {
  const reviews = await Review.find({ business: businessId });
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  await Business.findByIdAndUpdate(businessId, { rating: average });
}

router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ business: req.params.id })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

router.post("/:id/reviews", async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const businessId = req.params.id;

    const business = await Business.findById(businessId);
    const user = await User.findById(userId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const existingReview = await Review.findOne({
      business: businessId,
      user: userId,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment || "";
      await existingReview.save();
    } else {
      await Review.create({
        business: businessId,
        user: userId,
        rating,
        comment: comment || "",
      });
    }

    await updateBusinessRating(businessId);

    res.status(201).json({ message: "Review saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting review" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate("business", "business_name category address")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user reviews" });
  }
});

router.put("/:reviewId", async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const { reviewId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to edit this review" });
    }

    review.rating = rating;
    review.comment = comment || "";
    await review.save();

    await updateBusinessRating(review.business);

    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating review" });
  }
});

router.delete("/:reviewId", async (req, res) => {
  try {
    const { userId } = req.body;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    const businessId = review.business;
    await review.deleteOne();

    await updateBusinessRating(businessId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting review" });
  }
});

module.exports = router;
