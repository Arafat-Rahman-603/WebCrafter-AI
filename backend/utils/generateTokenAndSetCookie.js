import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // sameSite must be "none" for cross-origin requests between
    // Vercel (frontend) and Render (backend) — different domains
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,          // always true — Render & Vercel both use HTTPS
        sameSite: "none",      // required for cross-site cookie delivery
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
};
