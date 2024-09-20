const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const touristSpotSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    info: {
      guests: {
        type: Number,
        required: true,
      },
      rooms: {
        type: Number,
        required: true,
      },
      adults: {
        type: Number,
        required: true,
      },
      children: {
        type: Number,
        required: true,
      },
      infants: {
        type: Number,
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    reviews: [reviewSchema],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      address: String,
    },
    address: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    amenities: {
      type: Map,
      of: new mongoose.Schema({
        count: {
          type: Number,
          default: 0,
        },
        icon: {
          type: String,
        },
      }),
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TouristSpot", touristSpotSchema);
