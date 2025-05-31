import { getTimerRecords } from "@/app/api/lib/db/timerRecord";
import { getSkills } from "@/app/api/lib/db/skill";
import { StatsManager } from "./StatsManager";
import { TimerRecord } from "@/types/pomodoro";

export default async function StatsManagerRSC() {
  // const rawTimerRecords = await getTimerRecords();
  // const skills = await getSkills();
  const [skills, rawTimerRecords] = await Promise.all([
    getSkills(),
    getTimerRecords(),
  ]);
  const timerRecords = rawTimerRecords.map((record) => ({
    ...record,
    startTime: record?.startTime?.toISOString(),
    endTime: record?.endTime?.toISOString(),
  })) as TimerRecord[];
  return (
    <StatsManager initialSkills={skills} initialTimerRecords={timerRecords} />
  );
}
