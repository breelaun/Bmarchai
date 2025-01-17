import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import ReactCrop, { type Crop } from 'react-image-crop';
import { toast } from "sonner";
import VendorProfileDisplay from "@/components/vendors/VendorProfileDisplay";
import VendorStore from "@/components/vendors/VendorStore";
import { supabase } from "@/integrations/supabase/client";
import { BannerData } from "@/components/types/vendor-setup";
import 'react-image-crop/dist/ReactCrop.css';

interface FileUploadOptions {
  upsert?: boolean;
  onProgress?: (progress: { loaded: number; total: number }) => void;
}

const VendorProfile = () => {
  const { id } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const isProfileRoute = id === "profile";
  
  // States for banner management
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (isProfileRoute && !session) {
      navigate("/auth/login");
    }
  }, [isProfileRoute, session, navigate]);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { data: vendorProfile, isLoading, refetch } = useQuery({
    queryKey: ['vendorProfile', id, session?.user?.id],
    queryFn: async () => {
      let userId = id;
      
      if (isProfileRoute) {
        if (!session?.user?.id) {
          throw new Error("No authenticated user found");
        }
        userId = session.user.id;
      }

      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*, banner_data')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching vendor profile:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id && (!isProfileRoute || !!session)
  });

  const handleFileSelect = (file: File) => {
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error("File must be an image or video");
        return;
      }

      setBannerFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsEditingBanner(true);
      
      // Reset crop and position
      setCrop(undefined);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleBannerUpload = async () => {
    if (!session?.user?.id || !bannerFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = bannerFile.name.split('.').pop();
      const fileName = `${session.user.id}-banner-${Date.now()}.${fileExt}`;
      const filePath = `vendor-banners/${fileName}`;

      const uploadOptions: FileUploadOptions = {
        upsert: true,
        onProgress: (progress) => {
          const percentage = (progress.loaded / progress.total) * 100;
          setUploadProgress(Math.round(percentage));
        }
      };

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, bannerFile, uploadOptions);

      if (uploadError) {
        throw new Error('Error uploading banner');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      const bannerData: BannerData = {
        type: bannerFile.type.startsWith('video/') ? 'video' : 'image',
        url: publicUrl,
        position,
        crop: crop ? {
          x: crop.x,
          y: crop.y,
          width: crop.width,
          height: crop.height,
          unit: crop.unit
        } : undefined
      };

      const { error: updateError } = await supabase
        .from('vendor_profiles')
        .update({
          banner_data: bannerData
        })
        .eq('id', session.user.id);

      if (updateError) {
        throw new Error('Error updating banner data');
      }

      toast.success("Banner updated successfully");
      refetch();
      cleanup();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const cleanup = () => {
    setIsEditingBanner(false);
    setBannerFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    setCrop(undefined);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse event handlers for banner positioning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditingBanner) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isProfileRoute && !session) {
    return null;
  }

  const defaultVendorData: VendorProfileData = {
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    aboutMe: "Welcome to my vendor profile!",
    enableReviews: true,
    enableFeatured: true,
  };

  const vendorData = vendorProfile ? {
    socialLinks: vendorProfile.social_links ? {
      facebook: (vendorProfile.social_links as any)?.facebook || "",
      instagram: (vendorProfile.social_links as any)?.instagram || "",
      twitter: (vendorProfile.social_links as any)?.twitter || "",
    } : defaultVendorData.socialLinks,
    aboutMe: vendorProfile.business_description || defaultVendorData.aboutMe,
    enableReviews: true,
    enableFeatured: true,
    banner: vendorProfile.banner_data,
  } : defaultVendorData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Banner Section */}
        <div 
          className="relative h-[300px] rounded-lg overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {isEditingBanner && previewUrl ? (
            bannerFile?.type.startsWith('image/') ? (
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                className="h-full"
              >
                <img
                  src={previewUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                />
              </ReactCrop>
            ) : (
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                autoPlay
                muted
                loop
              />
            )
          ) : vendorData.banner ? (
            vendorData.banner.type === 'video' ? (
              <video
                src={vendorData.banner.url}
                className="w-full h-full object-cover"
                style={vendorData.banner.position && {
                  transform: `translate(${vendorData.banner.position.x}px, ${vendorData.banner.position.y}px)`
                }}
                autoPlay
                muted
                loop
              />
            ) : (
              <img
                src={vendorData.banner.url}
                alt="Vendor Banner"
                className="w-full h-full object-cover"
                style={vendorData.banner.position && {
                  transform: `translate(${vendorData.banner.position.x}px, ${vendorData.banner.position.y}px)`
                }}
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No banner uploaded</span>
            </div>
          )}
          
          {/* Banner Edit Controls */}
          {isProfileRoute && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              {isEditingBanner ? (
                <>
                  <button
                    onClick={handleBannerUpload}
                    disabled={isUploading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isUploading ? `Uploading ${uploadProgress}%` : 'Save'}
                  </button>
                  <button
                    onClick={cleanup}
                    disabled={isUploading}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    }}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
                  >
                    Change Banner
                  </label>
                </>
              )}
            </div>
          )}

          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg">
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2">{uploadProgress}% Uploaded</p>
              </div>
            </div>
          )}
        </div>

        <VendorProfileDisplay vendorData={vendorData} />
        <VendorStore vendorId={id} />
      </div>
    </div>
  );
};

export default VendorProfile;
