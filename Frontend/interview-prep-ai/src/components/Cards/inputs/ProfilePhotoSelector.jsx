import React, { useRef, useState } from 'react';
import { LuUser, LuUpload } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // update parent state
      const preview = URL.createObjectURL(file);
      if (setPreview) setPreview(preview);
      setPreviewUrl(preview);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {image ? (
        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
          <img
            src={preview || previewUrl}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full border border-dashed border-amber-500 bg-amber-50 flex items-center justify-center text-amber-500">
          <LuUser className="text-3xl" />
        </div>
      )}

      <button
        type="button"
        onClick={onChooseFile}
        className="text-sm text-amber-600 flex items-center gap-1 hover:underline"
      >
        <LuUpload /> Upload Photo
      </button>
    </div>
  );
};

export default ProfilePhotoSelector;
