import { Website } from "../model/website.model.js";
import User from "../model/user.model.js";
import { generateWebsiteCode } from "../lib/openrouter.js";

export const generateWebsite = async (req, res) => {
  try {
    const { prompt, theme, type } = req.body;
    const userId = req.userId; // From verifyToken middleware

    if (!prompt || !theme || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check credits
    if (user.credits !== undefined && user.credits <= 0) {
        return res.status(403).json({ success: false, message: "Insufficient credits" });
    }

    // Generate HTML code
    const generatedHtml = await generateWebsiteCode(prompt, theme, type);

    // Create a unique slug
    const slug = prompt.slice(0, 15).replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();
    const title = `${type} - ${theme} Theme`;

    const newWebsite = new Website({
      user: userId,
      title: title,
      letestCode: generatedHtml,
      slug: slug,
      conversation: [
        { role: "user", content: prompt },
        { role: "assistant", content: "Generated initial website markup." }
      ]
    });

    await newWebsite.save();

    // Deduct credit if credit system exists
    if (user.credits !== undefined) {
        user.credits -= 1;
        await user.save();
    }

    return res.status(201).json({
      success: true,
      message: "Website generated successfully",
      website: newWebsite
    });

  } catch (err) {
    console.error("Error generating website:", err);
    return res.status(500).json({ success: false, message: "Server error during generation", error: err.message });
  }
};

export const getUserWebsites = async (req, res) => {
  try {
    const userId = req.userId;
    const websites = await Website.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      websites,
    });
  } catch (err) {
    console.error("Error fetching websites:", err);
    return res.status(500).json({ success: false, message: "Server error fetching websites" });
  }
};
