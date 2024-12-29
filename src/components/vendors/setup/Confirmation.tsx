import { Button } from "@/components/ui/button";

interface ConfirmationProps {
  onLaunch: () => void;
}

const Confirmation = ({ onLaunch }: ConfirmationProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-heading font-semibold">Ready to Launch!</h2>
    <p className="text-muted-foreground">
      Your vendor profile is ready to go. You can always return to your profile settings to make changes anytime.
    </p>
    <div className="flex gap-4">
      <Button onClick={onLaunch} className="w-full">Launch Your Store</Button>
    </div>
  </div>
);

export default Confirmation;