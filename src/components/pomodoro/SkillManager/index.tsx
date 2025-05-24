import { SkillManager } from "./SkillManager";
import { getSkills } from "@/app/api/lib/db/skill";

export default async function SkillManagerRSC() {
  const skills = await getSkills();
  return <SkillManager skills={skills} />;
}
