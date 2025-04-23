import userModel from "../models/userModel";
import { Request, Response } from "express";
import { Webhook } from "svix"; // Assuming you are using the svix library

// API Controller function to manage Clerk User with database
export const clerkWebhooks = async (req: Request, res: Response) => {
  try {
    // Create svix instance with clerk webhook secret.
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env");

    // Create new Svix instance with secret
    const wh = new Webhook(secret);

    // Get headers and body
    const headers = req.headers;
    const { data, type } = req.body;

    // Get Svix headers for verification
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) throw new Error("Error: Missing svix headers");

    // Switch case for different events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url || "",
          resume: ""
        };
        await userModel.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url || "",
        };
        await userModel.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await userModel.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default: {
        res.status(400).json({ error: "Unhandled event type" });
        break;
      }
    }
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errMessage });
  }
};