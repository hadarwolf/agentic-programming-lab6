import { Audio, Series, staticFile } from "remotion";
import durations from "./durations.json";
import { Scene0Title } from "./scenes/Scene0Title";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Sorted } from "./scenes/Scene2Sorted";
import { Scene3FirstCheck } from "./scenes/Scene3FirstCheck";
import { Scene4Repeat } from "./scenes/Scene4Repeat";
import { Scene5WhyFast } from "./scenes/Scene5WhyFast";
import { Scene6Recap } from "./scenes/Scene6Recap";
import { secondsToFrames } from "./theme";

const dur = durations as Record<string, number>;

/** Scenes in order. Add new scenes here as they are built. */
export const SCENES: { id: string; component: React.FC; fallbackSec: number }[] = [
  { id: "title", component: Scene0Title, fallbackSec: 2.6 },
  { id: "scene1", component: Scene1Hook, fallbackSec: 9.5 },
  { id: "scene2", component: Scene2Sorted, fallbackSec: 8 },
  { id: "scene3", component: Scene3FirstCheck, fallbackSec: 10 },
  { id: "scene4", component: Scene4Repeat, fallbackSec: 11 },
  { id: "scene5", component: Scene5WhyFast, fallbackSec: 10.5 },
  { id: "scene6", component: Scene6Recap, fallbackSec: 11 },
];

/** Scene length follows its narration if generated; otherwise a fallback. */
export const sceneFrames = (id: string, fallbackSec: number) =>
  secondsToFrames(Math.max(dur[id] ?? 0, fallbackSec));

export const totalFrames = () => SCENES.reduce((acc, s) => acc + sceneFrames(s.id, s.fallbackSec), 0);

export const Main: React.FC = () => (
  <Series>
    {SCENES.map(({ id, component: C, fallbackSec }) => (
      <Series.Sequence key={id} durationInFrames={sceneFrames(id, fallbackSec)}>
        {dur[id] !== undefined && <Audio src={staticFile(`audio/${id}.wav`)} />}
        <C />
      </Series.Sequence>
    ))}
  </Series>
);
