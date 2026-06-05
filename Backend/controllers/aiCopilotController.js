//  RAG + OpenAI embeddings + citations

const OpenAI = require("openai");
const Listing = require("../models/Listing");
const AiFeedback = require("../models/AiFeedback");
const { asyncHandler } = require("../middleware/errorHandler");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Get embedding vector for a text
const getEmbedding = async (text) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 2000),
  });
  return response.data[0].embedding;
};

// Cosine similarity between two vectors
const cosineSim = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return magA && magB ? dot / (magA * magB) : 0;
};

// Retrieve top-k relevant listings via vector similarity
const retrieveRelevantListings = async (
  queryEmbedding,
  filters = {},
  topK = 5,
) => {
  const query = { isActive: true, ...filters };
  const listings = await Listing.find(query).select("+embedding").limit(100);

  const scored = listings
    .filter((l) => l.embedding && l.embedding.length > 0)
    .map((l) => ({ listing: l, score: cosineSim(queryEmbedding, l.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
};

// Build context string from retrieved listings for RAG
const buildContext = (scoredListings) => {
  return scoredListings
    .map(({ listing: l, score }, i) => {
      const base = `[${i + 1}] ${l.type.toUpperCase()}: "${l.title}" — ${l.address.area}, Bangalore`;
      const price = `Price: ₹${l.price.amount}/${l.price.unit}`;
      const rating = `Rating: ${l.rating}/5 (${l.reviewCount} reviews)`;
      const desc = l.description.slice(0, 300);

      let extra = "";
      if (l.type === "pg" && l.pgDetails) {
        extra = `Room: ${l.pgDetails.roomType || "N/A"}, Gender: ${l.pgDetails.gender || "all"}, Amenities: ${(l.pgDetails.amenities || []).slice(0, 5).join(", ")}`;
      } else if (l.type === "tiffin" && l.tiffinDetails) {
        extra = `Diet: ${l.tiffinDetails.dietType || "N/A"}, Meals/day: ${l.tiffinDetails.mealsPerDay || "N/A"}, Delivery: ${l.tiffinDetails.deliveryAvailable ? "Yes" : "No"}`;
      } else if (l.type === "cook" && l.cookDetails) {
        extra = `Experience: ${l.cookDetails.experience || "?"} yrs, Specializations: ${(l.cookDetails.specializations || []).join(", ")}`;
      }

      return `${base}\n${price} | ${rating}\n${extra}\n${desc}`;
    })
    .join("\n\n---\n\n");
};

// @route POST /api/ai/query
exports.queryCopilot = asyncHandler(async (req, res) => {
  const { query, sessionId, filters = {} } = req.body;

  if (!query || query.trim().length < 3) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a meaningful query." });
  }

  // If OpenAI key not set, use keyword fallback
  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY === "sk-your_openai_api_key_here"
  ) {
    return handleKeywordFallback(query, req, res);
  }

  let queryEmbedding, scoredListings, confidence;

  try {
    // Step 1: Embed the query
    queryEmbedding = await getEmbedding(query);

    // Step 2: Vector search
    scoredListings = await retrieveRelevantListings(queryEmbedding, filters, 5);
    confidence = scoredListings.length > 0 ? scoredListings[0].score : 0;

    // Step 3: If low confidence, expand search without filters
    if (confidence < 0.3 && Object.keys(filters).length > 0) {
      scoredListings = await retrieveRelevantListings(queryEmbedding, {}, 5);
      confidence = scoredListings.length > 0 ? scoredListings[0].score : 0;
    }
  } catch (embeddingError) {
    console.error("Embedding error:", embeddingError.message);
    return handleKeywordFallback(query, req, res);
  }

  // Step 4: Low confidence fallback message
  const usedFallback = confidence < 0.25;
  if (usedFallback || scoredListings.length === 0) {
    const feedback = await AiFeedback.create({
      query,
      response: "Low confidence fallback triggered",
      usedFallback: true,
      confidence,
      user: req.user?._id,
      sessionId,
    });
    return res.json({
      success: true,
      answer:
        'I couldn\'t find listings closely matching your query. Try being more specific — for example: "Affordable PG for women in Koramangala with WiFi" or "Veg tiffin near Whitefield".',
      citations: [],
      confidence,
      usedFallback: true,
      feedbackId: feedback._id,
    });
  }

  // Step 5: Build RAG context and call LLM
  const context = buildContext(scoredListings);
  const citationIds = scoredListings.map((s) => s.listing._id);

  const systemPrompt = `You are the AI Copilot for "Bangalore Bachelor Directory" — a platform helping bachelors in Bangalore find PG accommodations, tiffin services, and cooks.

Answer the user's query based ONLY on the provided listing data. Be helpful, concise, and specific. 
- Mention listing names and areas naturally
- Use ₹ for prices
- Reference listing numbers [1], [2] etc. for citations
- If asking about multiple options, compare them helpfully
- Keep responses under 200 words
- If the data doesn't fully answer the query, say so honestly`;

  const userMessage = `User Query: "${query}"

Relevant Listings:
${context}

Please answer the user's query based on these listings. Cite by listing number [1], [2] etc.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 400,
    temperature: 0.7,
  });

  const answer = completion.choices[0].message.content;

  // Step 6: Log feedback record
  const feedback = await AiFeedback.create({
    query,
    response: answer,
    citations: citationIds,
    confidence,
    usedFallback: false,
    user: req.user?._id,
    sessionId,
  });

  // Step 7: Prepare citation objects (clean, no embeddings)
  const citations = scoredListings.map(({ listing: l, score }) => ({
    _id: l._id,
    title: l.title,
    type: l.type,
    area: l.address.area,
    price: l.price,
    rating: l.rating,
    score: Math.round(score * 100) / 100,
    image: l.images?.[0]?.url || null,
  }));

  res.json({
    success: true,
    answer,
    citations,
    confidence,
    usedFallback: false,
    feedbackId: feedback._id,
  });
});

// Keyword-based fallback when no embeddings exist
const handleKeywordFallback = async (query, req, res) => {
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const typeMatch = keywords.find((w) => ["pg", "tiffin", "cook"].includes(w));
  const filter = { isActive: true };
  if (typeMatch) filter.type = typeMatch;

  const listings = await Listing.find({
    ...filter,
    $or: [
      { title: { $regex: keywords.join("|"), $options: "i" } },
      { description: { $regex: keywords.join("|"), $options: "i" } },
      { "address.area": { $regex: keywords.join("|"), $options: "i" } },
      { tags: { $in: keywords } },
    ],
  })
    .limit(5)
    .select("-embedding");

  const citations = listings.map((l) => ({
    _id: l._id,
    title: l.title,
    type: l.type,
    area: l.address.area,
    price: l.price,
    rating: l.rating,
    image: l.images?.[0]?.url || null,
  }));

  const answer =
    listings.length > 0
      ? `Based on keyword search, I found ${listings.length} listing(s) that might match "${query}". Here are the results. For smarter AI-powered search, make sure the OpenAI API key is configured.`
      : `No listings found for "${query}". Try different keywords or browse all listings.`;

  res.json({
    success: true,
    answer,
    citations,
    confidence: 0.5,
    usedFallback: true,
    feedbackId: null,
  });
};

// @route POST /api/ai/feedback/:feedbackId
exports.submitFeedback = asyncHandler(async (req, res) => {
  const { wasHelpful } = req.body;
  const feedback = await AiFeedback.findByIdAndUpdate(
    req.params.feedbackId,
    { wasHelpful },
    { new: true },
  );
  if (!feedback)
    return res
      .status(404)
      .json({ success: false, message: "Feedback record not found" });
  res.json({ success: true, message: "Feedback recorded. Thank you!" });
});

// @route POST /api/ai/generate-embedding/:listingId  (admin only, generates embedding for a listing)
exports.generateListingEmbedding = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.listingId);
  if (!listing)
    return res
      .status(404)
      .json({ success: false, message: "Listing not found" });

  const text = [
    listing.type,
    listing.title,
    listing.description,
    listing.address.area,
    listing.address.city,
    listing.tags?.join(" "),
    listing.pgDetails?.amenities?.join(" "),
    listing.tiffinDetails?.cuisineType?.join(" "),
    listing.cookDetails?.specializations?.join(" "),
  ]
    .filter(Boolean)
    .join(" ");

  const embedding = await getEmbedding(text);
  listing.embedding = embedding;
  await listing.save();

  res.json({ success: true, message: "Embedding generated successfully" });
});

// @route POST /api/ai/generate-all-embeddings  (admin only)
exports.generateAllEmbeddings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ isActive: true });
  let count = 0;

  for (const listing of listings) {
    try {
      const text = [
        listing.type,
        listing.title,
        listing.description,
        listing.address.area,
        listing.tags?.join(" "),
      ]
        .filter(Boolean)
        .join(" ");
      listing.embedding = await getEmbedding(text);
      await listing.save();
      count++;
      await new Promise((r) => setTimeout(r, 200)); // rate limit delay
    } catch (e) {
      console.error(`Failed for listing ${listing._id}:`, e.message);
    }
  }

  res.json({
    success: true,
    message: `Embeddings generated for ${count}/${listings.length} listings`,
  });
});
