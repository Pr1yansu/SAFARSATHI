const request = require("supertest");
const express = require("express");
const aiRoutes = require("../routes/aiRoutes");

const app = express();
app.use(express.json());
app.use("/api/v1/ai", aiRoutes);

describe("AI Itinerary Generator", () => {
  it("should return a 400 error if destination or days are missing", async () => {
    const res = await request(app)
      .post("/api/v1/ai/itinerary")
      .send({ budget: "luxury" });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Destination and days are required");
  });

  it("should successfully generate an itinerary (mock or real)", async () => {
    const res = await request(app)
      .post("/api/v1/ai/itinerary")
      .send({ destination: "Paris", days: 3 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(typeof res.body.data).toBe("string");
  });
});
