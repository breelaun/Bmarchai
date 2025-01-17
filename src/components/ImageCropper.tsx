import ReactCrop from 'react-image-crop';

// ... other imports

function ImageCropper() {
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
  const [image, setImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoaded = (image) => {
    // You can do something with the image dimensions here
  };

  const onCropComplete = (crop) => {
    makeClientCrop(crop); // Assume this function exists to get the cropped image
  };

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const uploadToSupabase = async (blob) => {
    const file = new File([blob], "cropped_image.png", { type: "image/png" });
    const { data, error } = await supabase.storage.from('bucket-name').upload(`path/${file.name}`, file);
    
    if (error) {
      console.error('Upload error:', error);
    } else {
      console.log('File uploaded successfully:', data);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {image && (
        <ReactCrop 
          src={image}
          crop={crop}
          onChange={onCropChange}
          onComplete={onCropComplete}
          onImageLoaded={onImageLoaded}
        />
      )}
      {croppedImageUrl && <img src={croppedImageUrl} alt="Cropped preview" />}
      <button onClick={() => uploadToSupabase(croppedImageUrl)}>Upload Cropped Image</button>
    </div>
  );
}
