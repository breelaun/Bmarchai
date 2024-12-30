import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";
import { SocialLinks } from "../types/vendor-setup";

interface AdditionalSettingsProps {
  socialLinks: SocialLinks;
  setSocialLinks: Dispatch<SetStateAction<SocialLinks>>;
  aboutMe: string;
  setAboutMe: (value: string) => void;
  enableReviews: boolean;
  setEnableReviews: (value: boolean) => void;
  enableFeatured: boolean;
  setEnableFeatured: (value: boolean) => void;
}

const AdditionalSettings = ({
  socialLinks,
  setSocialLinks,
  aboutMe,
  setAboutMe,
  enableReviews,
  setEnableReviews,
  enableFeatured,
  setEnableFeatured,
}: AdditionalSettingsProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-heading font-semibold">Additional Settings</h2>
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Social Links</h3>
        <div className="space-y-2">
          <Input
            placeholder="Facebook URL"
            value={socialLinks.facebook}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
          />
          <Input
            placeholder="Instagram URL"
            value={socialLinks.instagram}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
          />
          <Input
            placeholder="Twitter URL"
            value={socialLinks.twitter}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">About Me</h3>
        <Textarea
          placeholder="Tell us about yourself and your store..."
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enableReviews}
            onChange={(e) => setEnableReviews(e.target.checked)}
          />
          Enable Reviews Section
        </Label>
        <Label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enableFeatured}
            onChange={(e) => setEnableFeatured(e.target.checked)}
          />
          Enable Featured Products Section
        </Label>
      </div>
    </div>
  </div>
);

export default AdditionalSettings;