import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { USER_IMG_UPLOAD_LIMIT } from "../constants";
import { ExpressError } from "../utils/ExpressError";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, _) => {
    if (req.files && req.files.length > USER_IMG_UPLOAD_LIMIT) {
      throw new ExpressError(
        `Sorry! You can only upload ${USER_IMG_UPLOAD_LIMIT} images!`,
        400
      );
    }

    return {
      folder: "YelpCamp",
      allowed_formats: ["jpeg", "png", "jpg"],
    };
  },
});

export { cloudinary };
