const mongoose = require("mongoose");
const { CronJob } = require("cron");

const reserveSchema = new mongoose.Schema(
  {
    touristSpot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TouristSpot",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Reserve = mongoose.model("Reserve", reserveSchema);

const job = new CronJob("0 0 * * *", async () => {
  const reserves = await Reserve.find({ paid: false });

  for (const reserve of reserves) {
    if (new Date() > reserve.endDate) {
      await Reserve.findByIdAndDelete(reserve._id);
    }
  }
});

job.start();

module.exports = Reserve;
