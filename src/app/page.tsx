import { layoffs } from "@/lib/data";
import LayoffTracker from "@/components/LayoffTracker";

export default function Home() {
  return <LayoffTracker initialData={layoffs} />;
}
