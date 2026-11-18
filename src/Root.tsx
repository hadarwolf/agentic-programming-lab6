import { Composition } from "remotion";
import { Main, sceneFrames, totalFrames } from "./Main";
import { Scene0Title } from "./scenes/Scene0Title";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Sorted } from "./scenes/Scene2Sorted";
import { Scene3FirstCheck } from "./scenes/Scene3FirstCheck";
import { Scene4Repeat } from "./scenes/Scene4Repeat";
import { Scene5WhyFast } from "./scenes/Scene5WhyFast";
import { Scene6Recap } from "./scenes/Scene6Recap";
import { TestClip } from "./TestClip";
import { FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Main" component={Main} durationInFrames={totalFrames()} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* Single-scene previews for fast iteration */}
      <Composition id="Title" component={Scene0Title} durationInFrames={sceneFrames("title", 2.6)} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene1" component={Scene1Hook} durationInFrames={sceneFrames("scene1", 9.5)} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene2" component={Scene2Sorted} durationInFrames={sceneFrames("scene2", 8)} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene3" component={Scene3FirstCheck} durationInFrames={10 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene4" component={Scene4Repeat} durationInFrames={12 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene5" component={Scene5WhyFast} durationInFrames={sceneFrames("scene5", 10.5)} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Scene6" component={Scene6Recap} durationInFrames={sceneFrames("scene6", 11)} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="TestClip" component={TestClip} durationInFrames={5 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
    </>
  );
};
