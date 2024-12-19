import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: ['Books', 'Explore', 'Films', 'Games', 'Location', 'Movies', 'Music', 'Restaurants', 'Sports', 'Vacation', 'Other'],
      },
      content: {
        type: String,
        required: true,
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    
    { timestamps: true }
  );