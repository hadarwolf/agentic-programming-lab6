import { Composition } from "remotion";
import { TestClip } from "./TestClip";
import { FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="TestClip" component={TestClip} durationInFrames={5 * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
    </>
  );
};
