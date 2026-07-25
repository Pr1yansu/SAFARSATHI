const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.generateItinerary = async (req, res, next) => {
  try {
    const { destination, days, budget, interests } = req.body;

    if (!destination || !days) {
      return res.status(400).json({
        success: false,
        message: "Destination and days are required",
      });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key-for-dev");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert travel planner. Create a detailed ${days}-day itinerary for a trip to ${destination}. 
    Budget: ${budget || "flexible"}.
    Interests: ${interests || "general sightseeing, food, and culture"}.
    Provide the response in Markdown format. Be highly engaging and format it beautifully.`;

    let itinerary = "";

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "mock-key-for-dev") {
      itinerary = `# Mock Itinerary for ${destination}\n\n**Day 1**: Arrival & Explore ${destination}.\n\n*Note: Please add a valid GEMINI_API_KEY to your .env to see real AI results!*`;
    } else {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        itinerary = response.text();
      } catch (genError) {
        console.error("Gemini API Error:", genError.message);
        itinerary = `# Mock Itinerary for ${destination} (Fallback)\n\n**Day 1**: Arrival & Explore.\n\n*Note: The Gemini API request failed. This is a fallback mock itinerary.*`;
      }
    }

    res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    next(error);
  }
};
