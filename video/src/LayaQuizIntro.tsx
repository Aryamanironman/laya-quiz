import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';

const GradientBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)',
    }}
  />
);

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #ff6b35, #ffaa00, #00ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'system-ui, sans-serif',
            margin: 0,
          }}
        >
          LayaQuiz
        </h1>
        <p
          style={{
            fontSize: 36,
            color: '#888',
            fontFamily: 'system-ui, sans-serif',
            marginTop: 16,
          }}
        >
          AI-Powered Adaptive Trivia
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Feature: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(frame - delay, [0, 20], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: 'center',
        padding: '0 40px',
      }}
    >
      <div style={{ fontSize: 64, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 28, color: 'white', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>{title}</div>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 80 }}>
        <Feature icon="🧠" title="AI-Picked Questions" delay={0} />
        <Feature icon="🔥" title="Streak Combos" delay={15} />
        <Feature icon="⚡" title="Speed Bonus" delay={30} />
      </div>
    </AbsoluteFill>
  );
};

const QuestionDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const options = ['Mars', 'Venus', 'Jupiter', 'Saturn'];
  const selectedIdx = 0;
  const showResult = frame > 60;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          background: '#1a1a2e',
          borderRadius: 24,
          padding: '40px 60px',
          maxWidth: 800,
          width: '100%',
          border: '1px solid #333',
        }}
      >
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <span style={{ background: '#1a3a1a', color: '#4ade80', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontFamily: 'system-ui' }}>SCIENCE</span>
          <span style={{ background: '#3a1a1a', color: '#f87171', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontFamily: 'system-ui' }}>HARD</span>
        </div>
        <h2 style={{ color: 'white', fontSize: 32, fontFamily: 'system-ui', marginBottom: 24 }}>
          What planet is known as the Red Planet?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {options.map((opt, i) => (
            <div
              key={i}
              style={{
                padding: '16px 24px',
                borderRadius: 12,
                background: showResult
                  ? i === selectedIdx
                    ? '#166534'
                    : i === 1
                    ? '#991b1b'
                    : '#1f2937'
                  : '#374151',
                color: 'white',
                fontSize: 22,
                fontFamily: 'system-ui',
                border: showResult && i === selectedIdx ? '2px solid #22c55e' : '2px solid transparent',
              }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </div>
          ))}
        </div>
        {showResult && (
          <div style={{ marginTop: 20, padding: '12px 20px', background: '#0f172a', borderRadius: 12, color: '#94a3b8', fontSize: 18, fontFamily: 'system-ui' }}>
            💡 Mars appears red due to iron oxide on its surface.
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const ScoreReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scoreScale = spring({ frame, fps, config: { damping: 8, stiffness: 100 } });
  const score = Math.min(Math.round(interpolate(frame, [0, 60], [0, 2450], { extrapolateRight: 'clamp' })), 2450);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            color: '#00ff88',
            fontFamily: 'system-ui',
            transform: `scale(${scoreScale})`,
            textShadow: '0 0 40px rgba(0,255,136,0.3)',
          }}
        >
          {score}
        </div>
        <div style={{ fontSize: 32, color: '#666', fontFamily: 'system-ui', marginTop: 8 }}>POINTS</div>
      </div>
    </AbsoluteFill>
  );
};

const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 10 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', opacity, transform: `scale(${scale})` }}>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: 'white',
            fontFamily: 'system-ui',
            marginBottom: 24,
          }}
        >
          Play Now
        </h1>
        <div
          style={{
            fontSize: 28,
            color: '#ff6b35',
            fontFamily: 'system-ui',
            padding: '16px 48px',
            border: '3px solid #ff6b35',
            borderRadius: 16,
            display: 'inline-block',
          }}
        >
          aryamanironman.github.io/laya-quiz
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LayaQuizIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBg />
      <Sequence from={0} durationInFrames={60}>
        <Title />
      </Sequence>
      <Sequence from={60} durationInFrames={80}>
        <Features />
      </Sequence>
      <Sequence from={140} durationInFrames={80}>
        <QuestionDemo />
      </Sequence>
      <Sequence from={220} durationInFrames={40}>
        <ScoreReveal />
      </Sequence>
      <Sequence from={260} durationInFrames={40}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
