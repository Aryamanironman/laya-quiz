import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';

const GradientBg: React.FC = () => (
  <AbsoluteFill style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)' }} />
);

/* ── Title ── */
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `scale(${scale})`, opacity, textAlign: 'center' }}>
        <h1 style={{
          fontSize: 120, fontWeight: 900,
          background: 'linear-gradient(90deg, #ff6b35, #ffaa00, #00ff88)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontFamily: 'system-ui, sans-serif', margin: 0,
        }}>LayaQuiz</h1>
        <p style={{ fontSize: 36, color: '#888', fontFamily: 'system-ui, sans-serif', marginTop: 16 }}>
          AI-Powered Adaptive Trivia
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ── Features row ── */
const Feature: React.FC<{ icon: string; title: string; delay: number }> = ({ icon, title, delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(frame - delay, [0, 20], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, textAlign: 'center', padding: '0 40px' }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 28, color: 'white', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>{title}</div>
    </div>
  );
};

const Features: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ display: 'flex', gap: 80 }}>
      <Feature icon="🧠" title="AI-Picked Questions" delay={0} />
      <Feature icon="🔥" title="Streak Combos" delay={15} />
      <Feature icon="⚡" title="Speed Bonus" delay={30} />
    </div>
  </AbsoluteFill>
);

/* ── Reusable question card ── */
const DIFF_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  easy:   { bg: '#1a3a1a', text: '#4ade80', border: '#22c55e' },
  medium: { bg: '#3a3a1a', text: '#facc15', border: '#eab308' },
  hard:   { bg: '#3a1a1a', text: '#f87171', border: '#ef4444' },
};

const QuizCard: React.FC<{
  category: string; difficulty: string; question: string; options: string[];
  correctIdx: number; showResult: boolean; streak: number; score: number;
  explanation?: string; questionNum?: number;
}> = ({ category, difficulty, question, options, correctIdx, showResult, streak, score, explanation, questionNum }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const dc = DIFF_COLORS[difficulty] || DIFF_COLORS.medium;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        transform: `scale(${scale})`, opacity,
        background: '#1a1a2e', borderRadius: 24, padding: '36px 56px',
        maxWidth: 850, width: '90%', border: '1px solid #333',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ background: '#1a2a3a', color: '#60a5fa', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontFamily: 'system-ui', textTransform: 'uppercase' as const }}>{category.replace('_', ' ')}</span>
            <span style={{ background: dc.bg, color: dc.text, padding: '4px 14px', borderRadius: 20, fontSize: 13, fontFamily: 'system-ui', textTransform: 'uppercase' as const }}>{difficulty}</span>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {streak >= 3 && <span style={{ fontSize: 22 }}>🔥</span>}
            {streak > 0 && <span style={{ color: '#ff6b35', fontWeight: 700, fontSize: 18, fontFamily: 'system-ui' }}>×{streak}</span>}
            <span style={{ color: '#00ff88', fontWeight: 700, fontSize: 22, fontFamily: 'system-ui' }}>{score}</span>
            {questionNum && <span style={{ color: '#555', fontSize: 14, fontFamily: 'system-ui' }}>Q{questionNum}/10</span>}
          </div>
        </div>
        <h2 style={{ color: 'white', fontSize: 30, fontFamily: 'system-ui', marginBottom: 22, lineHeight: 1.4 }}>{question}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {options.map((opt, i) => {
            let bg = '#374151';
            if (showResult) {
              bg = i === correctIdx ? '#166534' : '#1f2937';
            }
            return (
              <div key={i} style={{
                padding: '14px 22px', borderRadius: 12, background: bg,
                color: 'white', fontSize: 20, fontFamily: 'system-ui',
                border: showResult && i === correctIdx ? `2px solid ${dc.border}` : '2px solid transparent',
              }}>
                {String.fromCharCode(65 + i)}. {opt}
              </div>
            );
          })}
        </div>
        {showResult && explanation && (
          <div style={{ marginTop: 18, padding: '12px 18px', background: '#0f172a', borderRadius: 12, color: '#94a3b8', fontSize: 17, fontFamily: 'system-ui' }}>
            💡 {explanation}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ── Score popup ── */
const ScorePopup: React.FC<{ text: string; color: string; subtext: string }> = ({ text, color, subtext }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame, fps: 30, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center' }}>
        <div style={{ fontSize: 52, color, fontWeight: 800, fontFamily: 'system-ui' }}>{text}</div>
        <div style={{ fontSize: 24, color: '#ff6b35', marginTop: 12, fontFamily: 'system-ui' }}>{subtext}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ── Adaptive explanation ── */
const AdaptiveExplain: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame, fps: 30, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        opacity, transform: `scale(${scale})`, background: '#1a1a2e', borderRadius: 24, padding: '40px 60px',
        maxWidth: 800, border: '1px solid #333', textAlign: 'center',
      }}>
        <h2 style={{ color: 'white', fontSize: 36, fontFamily: 'system-ui', marginBottom: 28 }}>🧠 How Laya Adapts</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 50, marginBottom: 30 }}>
          {[
            { icon: '✅', label: 'Correct', color: '#00ff88', desc: 'Questions get harder' },
            { icon: '❌', label: 'Wrong', color: '#f87171', desc: 'Questions get easier' },
            { icon: '⚡', label: 'Fast', color: '#ffaa00', desc: 'Bonus points' },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ color: item.color, fontSize: 20, fontWeight: 600, fontFamily: 'system-ui' }}>{item.label}</div>
              <div style={{ color: '#888', fontSize: 15, fontFamily: 'system-ui', marginTop: 4 }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#666', fontSize: 18, fontFamily: 'system-ui' }}>
          Laya (421M param AI) picks each question based on your entire answer history
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ── Score reveal ── */
const ScoreReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scoreScale = spring({ frame, fps, config: { damping: 8, stiffness: 100 } });
  const score = Math.min(Math.round(interpolate(frame, [0, 60], [0, 2450], { extrapolateRight: 'clamp' })), 2450);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 140, fontWeight: 900, color: '#00ff88', fontFamily: 'system-ui',
          transform: `scale(${scoreScale})`, textShadow: '0 0 40px rgba(0,255,136,0.3)',
        }}>{score}</div>
        <div style={{ fontSize: 32, color: '#666', fontFamily: 'system-ui', marginTop: 8 }}>POINTS</div>
      </div>
    </AbsoluteFill>
  );
};

/* ── CTA ── */
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 10 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', opacity, transform: `scale(${scale})` }}>
        <h1 style={{ fontSize: 72, fontWeight: 900, color: 'white', fontFamily: 'system-ui', marginBottom: 24 }}>Play Now</h1>
        <div style={{
          fontSize: 28, color: '#ff6b35', fontFamily: 'system-ui',
          padding: '16px 48px', border: '3px solid #ff6b35', borderRadius: 16, display: 'inline-block',
        }}>aryamanironman.github.io/laya-quiz</div>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════
   Main composition — 32 seconds (960 frames @ 30fps)
   Shows adaptive difficulty: easy→hard→easy based on answers
   ═══════════════════════════════════════════════════ */
export const LayaQuizIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBg />

      {/* 0-3s: Title */}
      <Sequence from={0} durationInFrames={90}>
        <Title />
      </Sequence>

      {/* 3-6s: Features */}
      <Sequence from={90} durationInFrames={90}>
        <Features />
      </Sequence>

      {/* 6-9s: Round 1 — EASY question → Correct */}
      <Sequence from={180} durationInFrames={90}>
        <QuizCard
          category="Science" difficulty="easy" questionNum={1} streak={0} score={0}
          question="What planet is known as the Red Planet?"
          options={['Venus', 'Mars', 'Jupiter', 'Saturn']}
          correctIdx={1} showResult={false}
        />
      </Sequence>
      <Sequence from={240} durationInFrames={30}>
        <QuizCard
          category="Science" difficulty="easy" questionNum={1} streak={0} score={0}
          question="What planet is known as the Red Planet?"
          options={['Venus', 'Mars', 'Jupiter', 'Saturn']}
          correctIdx={1} showResult={true}
          explanation="Mars appears red due to iron oxide on its surface."
        />
      </Sequence>

      {/* 9-10s: Correct popup → Difficulty UP */}
      <Sequence from={270} durationInFrames={45}>
        <ScorePopup text="✅ Correct! +250 pts" color="#00ff88" subtext="Difficulty increasing → Medium" />
      </Sequence>

      {/* 10.5-13.5s: Round 2 — MEDIUM question → Correct */}
      <Sequence from={315} durationInFrames={90}>
        <QuizCard
          category="History" difficulty="medium" questionNum={2} streak={1} score={250}
          question="What year did the Berlin Wall fall?"
          options={['1987', '1988', '1989', '1990']}
          correctIdx={2} showResult={false}
        />
      </Sequence>
      <Sequence from={375} durationInFrames={30}>
        <QuizCard
          category="History" difficulty="medium" questionNum={2} streak={1} score={250}
          question="What year did the Berlin Wall fall?"
          options={['1987', '1988', '1989', '1990']}
          correctIdx={2} showResult={true}
          explanation="The Berlin Wall fell on November 9, 1989."
        />
      </Sequence>

      {/* 13.5-15s: Correct popup → Difficulty UP to Hard */}
      <Sequence from={405} durationInFrames={45}>
        <ScorePopup text="✅ Correct! +500 pts (×2 streak)" color="#00ff88" subtext="Difficulty increasing → Hard 🔥" />
      </Sequence>

      {/* 15-18s: Round 3 — HARD question → Wrong */}
      <Sequence from={450} durationInFrames={90}>
        <QuizCard
          category="Science" difficulty="hard" questionNum={3} streak={2} score={750}
          question="What particle is responsible for the strong nuclear force?"
          options={['Photon', 'Gluon', 'Graviton', 'W boson']}
          correctIdx={1} showResult={false}
        />
      </Sequence>
      <Sequence from={510} durationInFrames={30}>
        <QuizCard
          category="Science" difficulty="hard" questionNum={3} streak={2} score={750}
          question="What particle is responsible for the strong nuclear force?"
          options={['Photon', 'Gluon', 'Graviton', 'W boson']}
          correctIdx={1} showResult={true}
          explanation="Gluons mediate the strong force between quarks."
        />
      </Sequence>

      {/* 18-19.5s: Wrong popup → Difficulty DOWN */}
      <Sequence from={540} durationInFrames={45}>
        <ScorePopup text="❌ Wrong! Streak lost" color="#f87171" subtext="Difficulty decreasing → Easy" />
      </Sequence>

      {/* 19.5-22.5s: Round 4 — EASY question → Correct again */}
      <Sequence from={585} durationInFrames={90}>
        <QuizCard
          category="Geography" difficulty="easy" questionNum={4} streak={0} score={750}
          question="What is the largest ocean on Earth?"
          options={['Atlantic', 'Indian', 'Arctic', 'Pacific']}
          correctIdx={3} showResult={false}
        />
      </Sequence>
      <Sequence from={645} durationInFrames={30}>
        <QuizCard
          category="Geography" difficulty="easy" questionNum={4} streak={0} score={750}
          question="What is the largest ocean on Earth?"
          options={['Atlantic', 'Indian', 'Arctic', 'Pacific']}
          correctIdx={3} showResult={true}
          explanation="The Pacific covers about 63 million sq miles."
        />
      </Sequence>

      {/* 22.5-24s: Correct → Streak restarting */}
      <Sequence from={675} durationInFrames={45}>
        <ScorePopup text="✅ Correct! +100 pts" color="#00ff88" subtext="Streak starting again! 💪" />
      </Sequence>

      {/* 24-26.5s: How Laya Adapts */}
      <Sequence from={720} durationInFrames={75}>
        <AdaptiveExplain />
      </Sequence>

      {/* 26.5-28.5s: Score reveal */}
      <Sequence from={795} durationInFrames={60}>
        <ScoreReveal />
      </Sequence>

      {/* 28.5-32s: CTA */}
      <Sequence from={855} durationInFrames={105}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
