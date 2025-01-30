import { TrainersList } from "./TrainersList";
import { ProgressTracking } from "./ProgressTracking";
import { SessionsList } from "./SessionsList";
import { TrainerClientManager } from "./TrainerClientManager";

const TrainingDashboard = () => {
  return (
    <div className="space-y-6">
      <TrainersList />
      <TrainerClientManager />
      <ProgressTracking />
      <SessionsList />
    </div>
  );
};

export default TrainingDashboard;