import { isUnauthorised } from "@/utils/isUnauthorised";

export default async function notificationPage() {
  await isUnauthorised("/signin");
  return <div>df</div>;
}
