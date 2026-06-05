const mongoose = require("mongoose");
const Listing = require("./Listing");

const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Review title required"],
      maxlength: 100,
    },
    body: {
      type: String,
      required: [true, "Review body required"],
      maxlength: 1000,
    },
    isVerified: { type: Boolean, default: false }, // verified tenant/customer
  },
  { timestamps: true },
);

// One review per user per listing
reviewSchema.index({ listing: 1, user: 1 }, { unique: true });

// After save, recalculate listing average rating
reviewSchema.statics.calcAverageRating = async function (listingId) {
  const stats = await this.aggregate([
    { $match: { listing: listingId } },
    {
      $group: {
        _id: "$listing",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await Listing.findByIdAndUpdate(listingId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await Listing.findByIdAndUpdate(listingId, { rating: 0, reviewCount: 0 });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.listing);
});

reviewSchema.post("remove", function () {
  this.constructor.calcAverageRating(this.listing);
});

module.exports = mongoose.model("Review", reviewSchema);
