import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

/**
 * Uploads an image file to the server and returns the image URL.
 *
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise<string>} - The absolute URL of the uploaded image.
 */
const uploadImage = async (imageFile) => {
  if (!imageFile) {
    throw new Error("No image file provided for upload.");
  }

  const formData = new FormData();
  formData.append("image", imageFile); // The key name must match backend's field name

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data) {
      throw new Error("No data returned from image upload");
    }

    let imageUrl = response.data.imageUrl || response.data.url || response.data.path;

    if (!imageUrl) {
      throw new Error("No image URL returned from upload API");
    }

    // If the URL is relative (e.g., /uploads/file.jpg), prepend the API base URL
    if (!/^https?:\/\//i.test(imageUrl)) {
      imageUrl = `${process.env.REACT_APP_API_BASE_URL || ""}${imageUrl}`;
    }

    return imageUrl;
  } catch (error) {
    console.error("Error uploading the image:", error);
    throw error;
  }
};

export default uploadImage;
