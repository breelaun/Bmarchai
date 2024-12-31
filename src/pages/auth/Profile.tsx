import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/profile/ProfileHeader";
import type { ProfileData } from "@/components/profile/types";

const sportCategories = [
  "Archery", "Badminton", "Baseball", "Basketball", "Ballet", "Billiards", "Bobsleigh", "Boxing", "Bowling", "Bullfighting",
  "Canoeing", "Cheerleading", "Chess", "Cricket", "Cycling", "Dancing", "Diving", "Equestrian", "Fencing", "Figure-skating",
  "Fishing", "Football", "Golf", "Gymnastics", "Handball", "Hang-gliding", "Hiking", "Hockey", "Horse-racing", "Ice-hockey",
  "Ice-skating", "Judo", "Karate", "Kayaking", "Kickboxing", "Lacrosse", "Marathon", "Motorsport", "Mountain-biking",
  "Netball", "Orienteering", "Paddleboarding", "Paintball", "Paragliding", "Parkour", "Polo", "Powerlifting", "Racquetball",
  "Rallying", "Rappelling", "Rodeo", "Rowing", "Rugby", "Running", "Sailing", "Scuba-diving", "Shooting", "Skateboarding",
  "Skiing", "Skydiving", "Snowboarding", "Soccer", "Softball", "Speed-skating", "Squash", "Sumo", "Surfing", "Swimming",
  "Synchronized-swimming", "Table-tennis", "Taekwondo", "Tennis", "Track", "Triathlon", "Ultimate-Frisbee", "Volleyball",
  "Wakeboarding", "Walking", "Water-polo", "Weightlifting", "Windsurfing", "Wrestling", "Yoga", "Zorbing"
];

const fitnessCategories = [
  "Adaptability", "Aerobic", "Agility", "Allergen", "Anaerobic", "Ankleweights", "Antioxidants", "Apparel", "Arch",
  "Athletics", "Accessories", "Adaptation", "AI", "AI-coach", "Balance", "Barbells", "Bands", "Biochemistry", "Biomechanics",
  "Biohacking", "Boardgames", "Breathing", "Calories", "Camping", "Cardio", "Cables", "Cadence", "Calisthenics", "Circuit",
  "Clarity", "Climbing", "Comfort", "Connection", "Coordination", "Core", "Cooking", "Cognitive", "CrossFit", "Creativity",
  "Custom", "Dance", "Detoxification", "Digestion", "Distance", "Discipline", "Drop", "Durability", "Efficiency",
  "Elite-sport", "Elliptical", "Endurance", "Endorphins", "Energy", "Empathy", "Ergonomics", "EVA", "Exercise", "Excursion",
  "Fermentation", "Fitness", "Flight", "Flexibility", "Flexion", "Focus", "Foam", "Fats", "Freedom", "Functionality",
  "Functional", "Gardening", "Glide", "Grip", "Hiking", "Hormones", "Harness", "Helmets", "Hydration", "Hydrationpacks",
  "Hypertrophy", "Immunity", "Intention", "Keto", "Kinetics", "Languages", "Lacing", "Leadership", "Longevity",
  "Macronutrients", "Mats", "Mentality", "Metabolism", "Momentum", "Minimalism", "Mindfulness", "Motivation", "Mobility",
  "Motion", "Mountaineering", "Music", "Nutrients", "Organic", "Outsole", "Overtraining", "Padding", "Paleo", "Pilates",
  "Planning", "Positivity", "Posture", "Performance", "Physiology", "Portion", "Prebiotics", "Productivity", "Probiotics",
  "Protein", "Purpose", "Recovery", "Reflection", "Repetition", "Resilience", "Resistance", "Routine", "Seasonal",
  "Self-discipline", "Simplicity", "Speedbags", "Spikes", "Stamina", "Streaming", "Strength", "Sustainability", "Swimwear",
  "Tights", "Time-management", "Treadmill", "Travel", "Urban", "Vision", "Vibrancy", "VO2max", "Wearables", "Wellness",
  "Wholefoods"
];

const allCategories = [...new Set([...sportCategories, ...fitnessCategories])].sort();

const Profile = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [session?.user?.id, navigate, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {profile && (
        <>
          <ProfileHeader profile={profile} />
          
          <div className="container max-w-7xl mx-auto py-8 px-4">
            <div className="flex justify-end mb-8">
              <Button variant="default" onClick={() => navigate("/blogs/new")}>
                Create A Blog
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;