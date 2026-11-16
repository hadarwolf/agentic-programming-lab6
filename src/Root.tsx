import { Composition } from "remotion";
import { Main, totalFrames } from "./Main";
import { Scene3FirstCheck } from "./scenes/Scene3FirstCheck";
import { TestClip } from "./TestClip";
import { FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Main" component={Main} durationInFrames={totalFrames()} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* Single-scene previews for fast iteration */}
      <Composition id="Scene3" component={Scene3FirstCheck} durationInFrames={10 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="TestClip" component={TestClip} durationInFrames={5 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
    </>
  );
};
