import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EditVendorProfileButtonProps {
  className?: string;
}

export function EditVendorProfileButton({ className }: EditVendorProfileButtonProps) {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/vendor/edit-profile');
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleEditProfile}
      className={className}
    >
      <Edit2 className="h-4 w-4 mr-2" />
      Edit Vendor Profile
    </Button>
  );
}