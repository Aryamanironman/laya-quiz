import { Composition } from 'remotion';
import { LayaQuizIntro } from './LayaQuizIntro';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LayaQuizIntro"
        component={LayaQuizIntro}
        durationInFrames={960}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
