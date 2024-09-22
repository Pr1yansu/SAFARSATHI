const TouristSpots = require("../models/tourists-spots.model");
const Countries = require("world-countries");
const { uploadImage } = require("../utils/image.utils");
const { formatValidationErrors } = require("../utils/error");
const { faker } = require("@faker-js/faker");
const categoryModel = require("../models/category.model");
const User = require("../models/user.model");
const Reservation = require("../models/reserve.model");
const { sendMail } = require("../utils/mail.utils");
const path = require("path");
const { promises: fs } = require("fs");
const logger = require("../utils/logger.utils");

const verifyTourTemplate = async (touristSpot, user) => {
  try {
    const templatePath = path.join(__dirname, "../templates/verify-tour.html");

    const touristSpotName = touristSpot.name;
    const touristSpotId = touristSpot._id;
    const spotImage = touristSpot.image.secure_url;
    const verificationDate = new Date().toLocaleDateString();
    const verifiedBy = user.name;

    const html = await fs.readFile(templatePath, "utf-8");
    return html
      .replace(/{{ touristSpotName }}/g, touristSpotName)
      .replace(/{{ touristSpotId }}/g, touristSpotId)
      .replace(/{{ verificationDate }}/g, verificationDate)
      .replace(/{{ verifiedBy }}/g, verifiedBy)
      .replace(/{{ spotImage }}/g, spotImage);
  } catch (error) {
    logger.error("Error reading verify tour template:", error);
    throw new Error("Failed to load email template");
  }
};

const verificationRequestTemplate = async (touristSpot, user) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/verification-request.html"
    );

    const touristSpotName = touristSpot.name;
    const touristSpotId = touristSpot._id;
    const spotImage = touristSpot.image.secure_url;
    const requestDate = new Date().toLocaleDateString();
    const requestedBy = user.name;

    const html = await fs.readFile(templatePath, "utf-8");
    return html
      .replace(/{{ touristSpotName }}/g, touristSpotName)
      .replace(/{{ touristSpotId }}/g, touristSpotId)
      .replace(/{{ requestDate }}/g, requestDate)
      .replace(/{{ requestedBy }}/g, requestedBy)
      .replace(/{{ spotImage }}/g, spotImage);
  } catch (error) {
    logger.error("Error reading verification request template:", error);
    throw new Error("Failed to load email template");
  }
};

exports.createTouristSpot = async (req, res) => {
  try {
    const {
      name,
      category,
      location,
      amenities,
      moreInfo,
      description,
      price,
      address,
    } = req.body;
    const { image } = req.files;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { secure_url, public_id, error } = await uploadImage(
      image.tempFilePath
    );

    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to upload image" });
    }

    const parsedLocation = JSON.parse(location);
    const parsedAmenities = JSON.parse(amenities);
    const parsedMoreInfo = JSON.parse(moreInfo);

    const touristSpot = await TouristSpots.create({
      category,
      name,
      image: { secure_url, public_id },
      description,
      info: parsedMoreInfo,
      address,
      price,
      amenities: parsedAmenities,
      location: parsedLocation,
      host: req.user._id,
    });

    return res.status(201).json({
      touristSpot,
      message: "Tourist spot created successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const formattedErrors = formatValidationErrors(error);
      return res.status(400).json({ errors: formattedErrors });
    }
    return res.status(500).json({ message: "Failed to create tourist spot" });
  }
};

exports.verifyTouristSpot = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const touristSpot = await TouristSpots.findById(id).populate("host");

    if (!touristSpot) {
      return res.status(404).json({ message: "Tourist spot not found" });
    }

    touristSpot.verified = verified;

    await touristSpot.save();

    const updatedBy = req.user.id;

    const user = await User.findById(updatedBy);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (touristSpot.verified) {
      const html = await verifyTourTemplate(touristSpot, user);

      await sendMail(
        touristSpot.host.email,
        "Tourist Spot Verified",
        "Your tourist spot has been verified",
        html
      );

      return res.status(200).json({
        touristSpot,
        message: "Tourist spot verified successfully",
      });
    }

    return res.status(200).json({
      touristSpot,
      message: "Tourist spot verification removed",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed to verify tourist spot" });
  }
};

exports.getTouristSpots = async (req, res) => {
  try {
    const {
      category,
      location,
      price,
      guests,
      rooms,
      adults,
      children,
      infants,
      page = 1,
      limit = 10,
      checkin,
      checkout,
    } = req.query;

    const query = {};
    if (category) query.category = category;

    if (location) {
      const [latitude, longitude] = location.split(",").map(Number);

      query.location = {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], 10 / 6378.1],
        },
      };
    }
    if (price) query.price = { $lte: price };
    if (guests) query["info.guests"] = { $gte: guests };
    if (rooms) query["info.rooms"] = { $gte: rooms };
    if (adults) query["info.adults"] = { $gte: adults };
    if (children) query["info.children"] = { $gte: children };
    if (infants) query["info.infants"] = { $gte: infants };

    if (checkin && checkout) {
      const reservedSpotIds = await Reservation.find({
        $or: [
          {
            startDate: { $lte: checkout },
            endDate: { $gte: checkin },
          },
        ],
      }).distinct("touristSpot");

      query._id = { $nin: reservedSpotIds };
    }

    const total = await TouristSpots.countDocuments(query);

    let touristSpots = await TouristSpots.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * limit)
      .populate("category")
      .populate("host");

    return res.status(200).json({ touristSpots, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get tourist spots" });
  }
};

exports.getTouristSpotById = async (req, res) => {
  try {
    const { id } = req.params;

    const touristSpot = await TouristSpots.findById(id)
      .populate({
        path: "category",
      })
      .populate({
        path: "reviews.user",
        select: "name email",
      });

    if (!touristSpot) {
      return res.status(404).json({ message: "Tourist spot not found" });
    }

    const host = await User.findById(touristSpot.host);

    if (!host) {
      const admin = await User.findOne({ role: "admin" });
      touristSpot.host = admin;
    }

    return res.status(200).json({ touristSpot });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get tourist spot" });
  }
};

exports.generateRandomTouristsSpots = async (value) => {
  const touristSpots = [];

  for (let i = 0; i < value; i++) {
    const randomCountry =
      Countries[Math.floor(Math.random() * Countries.length)];

    const categories = await categoryModel.find();
    const categoriesId = categories.map((category) => category._id);
    const randomCategory = faker.helpers.arrayElement(categoriesId);

    const randomLocation = {
      lat: randomCountry.latlng[0],
      lng: randomCountry.latlng[1],
      address: randomCountry.name.common,
    };

    const amenities = {
      wifi: {
        count: 0,
        icon: "AiOutlineWifi",
      },
      tv: {
        count: 0,
        icon: "RiTv2Line",
      },
      kitchen: {
        count: 0,
        icon: "MdOutlineKitchen",
      },
      ac: {
        count: 0,
        icon: "TbAirConditioning",
      },
      heating: {
        count: 0,
        icon: "IoMdBonfire",
      },
      parking: {
        count: 0,
        icon: "AiOutlineCar",
      },
    };

    const randomAmenities = {};

    for (const [key, value] of Object.entries(amenities)) {
      randomAmenities[key] = {
        count: faker.number.int({ min: 0, max: 1 }),
        icon: value.icon,
      };
    }

    const randomMoreInfo = {
      guests: faker.number.int({ min: 1, max: 10 }),
      rooms: faker.number.int({ min: 1, max: 5 }),
      adults: faker.number.int({ min: 1, max: 10 }),
      children: faker.number.int({ min: 1, max: 5 }),
      infants: faker.number.int({ min: 1, max: 3 }),
    };

    const randomPrice = faker.number.float({ min: 100, max: 1000 });

    const randomTouristSpot = {
      name: faker.location.city(),
      category: randomCategory,
      image: {
        secure_url: faker.image.urlLoremFlickr({ category: "city" }),
        public_id: faker.string.uuid(),
      },
      description: faker.lorem.paragraph(),
      info: randomMoreInfo,
      address: faker.location.streetAddress(),
      price: randomPrice,
      amenities: randomAmenities,
      location: randomLocation,
      host: "60f5b2f7b4b2f2f8f4b2f2f8",
    };

    touristSpots.push(randomTouristSpot);
  }

  await TouristSpots.create(touristSpots);
};

exports.getTouristSpotByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    const touristSpots = await TouristSpots.find({ _id: { $in: ids } });

    return res.status(200).json({ touristSpots });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get tourist spots" });
  }
};

exports.currentUserListedHomes = async (req, res) => {
  try {
    const touristSpots = await TouristSpots.find({ host: req.user._id });

    if (!touristSpots || touristSpots.length === 0) {
      return res.status(404).json({ message: "Tourist spots not found" });
    }
    return res.status(200).json({ touristSpots });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get tourist spots" });
  }
};

exports.addReview = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Please login to add a review" });
    }

    const { touristSpotId } = req.params;
    const { rating, comment } = req.body;

    const touristSpot = await TouristSpots.findById(touristSpotId);
    if (!touristSpot) {
      return res.status(404).json({ message: "Tourist spot not found" });
    }

    // Prevent duplicate reviews
    const existingReview = touristSpot.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already submitted a review" });
    }

    const review = {
      user: userId,
      rating,
      comment,
      date: new Date(),
    };

    touristSpot.reviews.push(review);
    await touristSpot.save();

    return res.status(201).json({
      touristSpot,
      message: "Review added successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add review" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId, touristSpotId } = req.params; // Assuming reviewId is in params

    const { rating, comment } = req.body;
    const touristSpot = await TouristSpots.findById(touristSpotId);
    if (!touristSpot) {
      return res.status(404).json({ message: "Tourist spot not found" });
    }

    const review = touristSpot.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is authorized to update this review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    review.rating = rating;
    review.comment = comment;

    await touristSpot.save();

    return res.status(200).json({
      touristSpot,
      message: "Review updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update review" });
  }
};

exports.getReviewByTouristSpotAndUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const { touristSpotId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Please login to get a review" });
    }

    const touristSpot = await TouristSpots.findById(touristSpotId);
    if (!touristSpot) {
      return res.status(404).json({ message: "Tourist spot not found" });
    }

    const review = touristSpot.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({ review });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get review" });
  }
};

exports.updateTouristSpot = async (req, res) => {};

exports.deleteTouristSpot = async (req, res) => {};

exports.sendVerificationRequestToAdmins = async (req, res) => {
  try {
    const { id } = req.params;

    const touristSpot = await TouristSpots.findById(id).populate("host");

    if (!touristSpot) {
      return res.status(404).json({ message: "Tourist spot not found" });
    }

    const admins = await User.find({ role: "admin" });

    if (!admins) {
      return res.status(404).json({ message: "There are no admins to verify" });
    }

    const html = await verificationRequestTemplate(touristSpot, req.user);

    for (const admin of admins) {
      await sendMail(
        admin.email,
        "Tourist Spot Verification Request",
        "A tourist spot verification request has been sent",
        html
      );
    }

    return res.status(200).json({
      message: "Verification request sent successfully",
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Failed to send verification request" });
  }
};
