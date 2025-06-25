import Review from '../models/review.js';
import User from '../models/user.js';

export const addReview = async (req, res) => {
  try {
    const { to, from, rating, comment } = req.body;
    const review = new Review({ to, from, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

export const getReviewsForMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ to: id })
      .populate('from', 'username')
      .sort({ createdAt: -1 });
    const avgRating = reviews.length
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
    res.status(200).json({ reviews, avgRating });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};