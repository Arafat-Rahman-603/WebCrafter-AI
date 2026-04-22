import { Website } from "../model/website.model.js";
import User from "../model/user.model.js";
import { generateWebsiteCode, fixWebsiteCode } from "../lib/openrouter.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Generate a brand-new website ──────────────────────────────────────────────
export const generateWebsite = async (req, res) => {
  try {
    const { prompt, theme, type } = req.body;
    const userId = req.userId;

    if (!prompt || !theme || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.credits !== undefined && user.credits < 1) {
      return res.status(403).json({ success: false, message: "Insufficient credits" });
    }
    
    const userWebsitesCount = await Website.countDocuments({ user: userId });

    // if (userWebsitesCount >= 3 && user.plan !== "Enterprise" || user.plan !== "Pro") {
    //   return res.status(403).json({ success: false, message: "Maximum number of websites reached" });
    // }

we
    const generatedHtml = await generateWebsiteCode(prompt, theme, type);

    const slug =
      prompt.slice(0, 15).replace(/\s+/g, "-").toLowerCase() + "-" + Date.now();
    const title = `${type} - ${theme} Theme`;

    const newWebsite = new Website({
      user: userId,
      title,
      letestCode: generatedHtml,
      slug,
      conversation: [
        { role: "user",      content: prompt },
        { role: "assistant", content: "Generated initial website markup." },
      ],
    });

    await newWebsite.save();

    if (user.credits !== undefined) {
      user.credits -= 1;
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: "Website generated successfully",
      website: newWebsite,
    });
  } catch (err) {
    console.error("Error generating website:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during generation",
      error: err.message,
    });
  }
};

// ── Get all websites for the logged-in user ───────────────────────────────────
export const getUserWebsites = async (req, res) => {
  try {
    const websites = await Website.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, websites });
  } catch (err) {
    console.error("Error fetching websites:", err);
    return res.status(500).json({ success: false, message: "Server error fetching websites" });
  }
};

// ── Get a single website by ID ────────────────────────────────────────────────
export const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({ _id: req.params.id, user: req.userId });
    if (!website) return res.status(404).json({ success: false, message: "Website not found" });
    return res.status(200).json({ success: true, website });
  } catch (err) {
    console.error("Error fetching website:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Get a single website by slug (public, no auth) ────────────────────────────
export const getWebsiteBySlug = async (req, res) => {
  try {
    const website = await Website.findOne({ slug: req.params.slug, deploy: true });
    if (!website) {
      return res.status(404).json({ success: false, message: "Website not found or not deployed" });
    }
    return res.status(200).json({ success: true, website });
  } catch (err) {
    console.error("Error fetching website by slug:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── AI Chat Fix — costs 10 credits ───────────────────────────────────────────
export const fixWebsite = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ success: false, message: "Fix message is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.credits !== undefined && user.credits < 10) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits. Chat fix costs 10 credits.",
      });
    }

    const website = await Website.findOne({ _id: req.params.id, user: userId });
    if (!website) return res.status(404).json({ success: false, message: "Website not found" });

    // Call AI with history + current code + fix request
    const updatedCode = await fixWebsiteCode(
      website.conversation,
      message,
      website.letestCode,
    );

    // Append messages to conversation
    website.conversation.push({ role: "user",      content: message });
    website.conversation.push({ role: "assistant", content: "Applied your requested changes." });
    website.letestCode = updatedCode;
    await website.save();

    // Deduct 10 credits
    if (user.credits !== undefined) {
      user.credits -= 10;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Website updated successfully",
      updatedCode,
      conversation: website.conversation,
      credits: user.credits,
    });
  } catch (err) {
    console.error("Error fixing website:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during fix",
      error: err.message,
    });
  }
};

// ── Save manually edited code ─────────────────────────────────────────────────
export const updateWebsiteCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Code is required" });

    const website = await Website.findOne({ _id: req.params.id, user: req.userId });
    if (!website) return res.status(404).json({ success: false, message: "Website not found" });

    website.letestCode = code;
    await website.save();

    return res.status(200).json({ success: true, message: "Code saved successfully" });
  } catch (err) {
    console.error("Error saving code:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Deploy / Undeploy a website ───────────────────────────────────────────────
export const deployWebsite = async (req, res) => {
  try {
    const website = await Website.findOne({ _id: req.params.id, user: req.userId });
    if (!website) return res.status(404).json({ success: false, message: "Website not found" });

    website.deploy = !website.deploy;
    if (website.deploy) {
      website.deployUrl = `/view/${website.slug}`;
    } else {
      website.deployUrl = undefined;
    }
    await website.save();

    return res.status(200).json({
      success: true,
      message: website.deploy ? "Website deployed successfully" : "Website un-deployed",
      deploy: website.deploy,
      deployUrl: website.deployUrl || null,
    });
  } catch (err) {
    console.error("Error deploying website:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Update website title ──────────────────────────────────────────────────────
export const updateTitle = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, message: "Title required" });

    const website = await Website.findOne({ _id: req.params.id, user: req.userId });
    if (!website) return res.status(404).json({ success: false, message: "Website not found" });

    website.title = title.trim();
    await website.save();

    return res.status(200).json({ success: true, title: website.title });
  } catch (err) {
    console.error("Error updating title:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Delete a website ──────────────────────────────────────────────────────────
export const deleteWebsite = async (req, res) => {
  try {
    const website = await Website.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!website) return res.status(404).json({ success: false, message: "Website not found" });
    return res.status(200).json({ success: true, message: "Website deleted successfully" });
  } catch (err) {
    console.error("Error deleting website:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Upload & save website thumbnail screenshot ────────────────────────────────
export const updateThumbnail = async (req, res) => {
  try {
    const { thumbnail } = req.body; // base64 data URL
    if (!thumbnail) return res.status(400).json({ success: false, message: "Thumbnail data required" });

    const website = await Website.findOne({ _id: req.params.id, user: req.userId });
    if (!website) return res.status(404).json({ success: false, message: "Website not found" });

    // Upload base64 to Cloudinary
    const result = await cloudinary.uploader.upload(thumbnail, {
      folder: "webcrafter_ai/thumbnails",
      transformation: [{ width: 800, height: 500, crop: "fill", quality: "auto:good" }],
    });

    website.thumbnail = result.secure_url;
    await website.save();

    return res.status(200).json({ success: true, thumbnail: result.secure_url });
  } catch (err) {
    console.error("Error saving thumbnail:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
