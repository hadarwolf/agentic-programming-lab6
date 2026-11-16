import { Audio, Series, staticFile } from "remotion";
import durations from "./durations.json";
import { Scene3FirstCheck } from "./scenes/Scene3FirstCheck";
import { secondsToFrames } from "./theme";

const dur = durations as Record<string, number>;

/** Scenes in order. Add new scenes here as they are built. */
export const SCENES: { id: string; component: React.FC; fallbackSec: number }[] = [
  { id: "scene3", component: Scene3FirstCheck, fallbackSec: 10 },
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
