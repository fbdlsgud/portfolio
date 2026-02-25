/**
 * ElizabethGame.jsx
 * 
 * Design Philosophy: 일본 애니메이션 레트로 아케이드
 * - 밝고 생동감 있는 파스텔 배경 + 픽셀 레트로 폰트 (Press Start 2P)
 * - 은혼 엘리자베스 캐릭터 (흰색 몸통, 노란 부리, 사탕)
 * - 대나무 파이프 장애물, 벚꽃 하늘 배경, 파티클 효과
 * - Canvas 기반 게임 루프 (requestAnimationFrame)
 * - 모바일 터치 최적화
 * - 점수 기록 시스템 (localStorage)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getBestScore, getLeaderboard, saveLeaderboardRecord } from './scoreManager';

import flyImgSrc from '../../../assets/games/jump/elizabeth-fly.png';
import deadImgSrc from '../../../assets/games/jump/elizabeth-dead.png';
import bgImgSrc from '../../../assets/games/jump/game-bg.png';
import bgNoonSrc from '../../../assets/games/jump/bg-noon.png';
import bgEveningSrc from '../../../assets/games/jump/bg-evening.png';
import bgNightSrc from '../../../assets/games/jump/bg-night.png';

// ─── 게임 상수 ───────────────────────────────────────────────────────────────
const GRAVITY = 0.42;
const JUMP_FORCE = -9.2;
const PIPE_WIDTH = 68;
const PIPE_GAP_INITIAL = 185;
const PIPE_GAP_MIN = 130;
const PIPE_SPEED_INITIAL = 2.8;
const PIPE_SPEED_MAX = 6.5;
const PIPE_INTERVAL_INITIAL = 1900;
const PIPE_INTERVAL_MIN = 1200;
const BIRD_X_RATIO = 0.22;
const BIRD_SIZE = 50;
const GROUND_HEIGHT = 75;

// ─── 게임 상수 ───────────────────────────────────────────────────────────────

let globalAudioCtx = null;

function getAudioCtx() {
  if (!globalAudioCtx) {
    try {
      globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

function playJumpSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
  } catch {}
}

function playScoreSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.1);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.1);
    });
  } catch {}
}

function playDeathSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch {}
}

function playMilestoneSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const melody = [784, 880, 988, 1047];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.12);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.12);
    });
  } catch {}
}

const flyImg = new Image();
flyImg.crossOrigin = 'anonymous';
flyImg.src = flyImgSrc;

const deadImg = new Image();
deadImg.crossOrigin = 'anonymous';
deadImg.src = deadImgSrc;

const bgImg = new Image();
bgImg.crossOrigin = 'anonymous';
bgImg.src = bgImgSrc;

const bgNoon = new Image();
bgNoon.crossOrigin = 'anonymous';
bgNoon.src = bgNoonSrc;

const bgEvening = new Image();
bgEvening.crossOrigin = 'anonymous';
bgEvening.src = bgEveningSrc;

const bgNight = new Image();
bgNight.crossOrigin = 'anonymous';
bgNight.src = bgNightSrc;

const bgImages = [bgImg, bgNoon, bgEvening, bgNight];

export default function ElizabethGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef('idle');
  const birdYRef = useRef(0);
  const birdVelRef = useRef(0);
  const pipesRef = useRef([]);
  const particlesRef = useRef([]);
  const cloudsRef = useRef([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const frameRef = useRef(0);
  const lastPipeTimeRef = useRef(0);
  const pipeIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const deadTimerRef = useRef(0);
  const bgScrollRef = useRef(0);
  const wingTimerRef = useRef(0);
  const shakeRef = useRef(0);
  const rafRef = useRef(0);
  const canvasSizeRef = useRef({ w: 390, h: 844 });
  const lastStateChangeRef = useRef(0);

  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ w: 390, h: 844 });
  const [showRecords, setShowRecords] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showInitialsInput, setShowInitialsInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const w = Math.min(window.innerWidth, 430);
      const h = Math.min(window.innerHeight, 700);
      setCanvasSize({ w, h });
      canvasSizeRef.current = { w, h };
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const best = getBestScore();
    bestRef.current = best;
    setBestScore(best);

    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setLeaderboard(data);
    };
    fetchLeaderboard();

    const { w, h } = canvasSizeRef.current;
    cloudsRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: (i / 6) * w * 1.5,
      y: 40 + Math.random() * (h * 0.45),
      speed: 0.25 + Math.random() * 0.35,
      size: 55 + Math.random() * 65,
      opacity: 0.55 + Math.random() * 0.35,
    }));
  }, []);

  const initGame = useCallback(() => {
    const { h } = canvasSizeRef.current;
    birdYRef.current = h * 0.45;
    birdVelRef.current = 0;
    pipesRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    frameRef.current = 0;
    lastPipeTimeRef.current = 0;
    pipeIdRef.current = 0;
    deadTimerRef.current = 0;
    bgScrollRef.current = 0;
    wingTimerRef.current = 0;
    shakeRef.current = 0;
    setScore(0);
  }, []);

  const spawnScoreParticle = useCallback((x, y) => {
    const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#FFA07A'];
    for (let i = 0; i < 5; i++) {
      particlesRef.current.push({
        id: particleIdRef.current++,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3.5,
        vy: -1.5 - Math.random() * 2.5,
        life: 38,
        maxLife: 38,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 5,
        type: 'star',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
    particlesRef.current.push({
      id: particleIdRef.current++,
      x,
      y: y - 15,
      vx: 0,
      vy: -1.2,
      life: 48,
      maxLife: 48,
      color: '#FFD700',
      size: 18,
      type: 'score',
      text: '+1',
    });
  }, []);

  const spawnDeathParticles = useCallback((x, y) => {
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BD6'];
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const speed = 2.5 + Math.random() * 3.5;
      particlesRef.current.push({
        id: particleIdRef.current++,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 55,
        maxLife: 55,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 7 + Math.random() * 9,
        type: 'petal',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
      });
    }
  }, []);

  const spawnMilestoneParticles = useCallback((x, y) => {
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        id: particleIdRef.current++,
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 5,
        vy: -3 - Math.random() * 3,
        life: 60,
        maxLife: 60,
        color: '#FFD700',
        size: 10 + Math.random() * 8,
        type: 'star',
        rotation: 0,
        rotSpeed: 0.15,
      });
    }
  }, []);

  const getPipeSpeed = (s) =>
    Math.min(PIPE_SPEED_INITIAL + s * 0.12, PIPE_SPEED_MAX);

  const getPipeGap = (s) =>
    Math.max(PIPE_GAP_INITIAL - s * 1.8, PIPE_GAP_MIN);

  const getPipeInterval = (s) =>
    Math.max(PIPE_INTERVAL_INITIAL - s * 15, PIPE_INTERVAL_MIN);

  const handleDeath = useCallback(async () => {
    stateRef.current = 'dead';
    setGameState('dead');
    shakeRef.current = 18;
    playDeathSound();
    const { w } = canvasSizeRef.current;
    spawnDeathParticles(w * BIRD_X_RATIO, birdYRef.current);
    
    if (scoreRef.current > bestRef.current) {
      bestRef.current = scoreRef.current;
      setBestScore(scoreRef.current);
    }

    // 서버 탑 10 확인
    const currentLeaderboard = await getLeaderboard();
    setLeaderboard(currentLeaderboard);
    
    const isTop10 = currentLeaderboard.length < 10 || scoreRef.current > currentLeaderboard[9].score;
    
    if (isTop10 && scoreRef.current > 0) {
      setShowInitialsInput(true);
    }
  }, [spawnDeathParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (timestamp) => {
      const { w, h } = canvasSizeRef.current;
      const groundY = h - GROUND_HEIGHT;
      const birdX = w * BIRD_X_RATIO;
      const state = stateRef.current;

      if (state === 'playing') {
        bgScrollRef.current += 0.6;
        if (bgScrollRef.current > w) bgScrollRef.current = 0;
      }

      cloudsRef.current.forEach(cloud => {
        if (state === 'playing' || state === 'dead') {
          cloud.x -= cloud.speed;
          if (cloud.x < -cloud.size * 2.5) {
            cloud.x = w + cloud.size * 1.5;
            cloud.y = 40 + Math.random() * (groundY * 0.55);
          }
        }
      });

      if (state === 'playing') {
        birdVelRef.current += GRAVITY;
        birdYRef.current += birdVelRef.current;

        if (wingTimerRef.current > 0) wingTimerRef.current--;

        const pipeInterval = getPipeInterval(scoreRef.current);
        if (timestamp - lastPipeTimeRef.current > pipeInterval) {
          lastPipeTimeRef.current = timestamp;
          const gap = getPipeGap(scoreRef.current);
          const minTop = 70;
          const maxTop = groundY - gap - 70;
          const topHeight = minTop + Math.random() * (maxTop - minTop);
          pipesRef.current.push({
            id: pipeIdRef.current++,
            x: w + PIPE_WIDTH + 10,
            topHeight,
            passed: false,
          });
        }

        const speed = getPipeSpeed(scoreRef.current);
        const hitbox = BIRD_SIZE * 0.32;
        const birdLeft = birdX - hitbox;
        const birdRight = birdX + hitbox;
        const birdTop = birdYRef.current - hitbox;
        const birdBottom = birdYRef.current + hitbox;

        for (const pipe of pipesRef.current) {
          pipe.x -= speed;

          if (!pipe.passed && pipe.x + PIPE_WIDTH < birdX) {
            pipe.passed = true;
            scoreRef.current++;
            setScore(scoreRef.current);
            playScoreSound();
            spawnScoreParticle(birdX + 30, birdYRef.current);

            if (scoreRef.current % 5 === 0) {
              playMilestoneSound();
              spawnMilestoneParticles(birdX, birdYRef.current);
            }
          }

          const gap = getPipeGap(scoreRef.current);
          if (birdRight > pipe.x + 4 && birdLeft < pipe.x + PIPE_WIDTH - 4) {
            if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + gap) {
              handleDeath();
              break;
            }
          }
        }

        if (birdYRef.current + hitbox > groundY) {
          birdYRef.current = groundY - hitbox;
          handleDeath();
        }
        if (birdYRef.current - hitbox < 0) {
          birdYRef.current = hitbox;
          birdVelRef.current = 0;
        }

        pipesRef.current = pipesRef.current.filter(p => p.x > -PIPE_WIDTH - 20);
      }

      if (state === 'dead') {
        birdVelRef.current += GRAVITY * 0.6;
        const groundY2 = h - GROUND_HEIGHT;
        birdYRef.current = Math.min(birdYRef.current + birdVelRef.current, groundY2 - BIRD_SIZE * 0.4);
        deadTimerRef.current++;
        if (shakeRef.current > 0) shakeRef.current--;
        if (deadTimerRef.current > 85) {
          stateRef.current = 'gameover';
          setGameState('gameover');
        }
      }

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.type !== 'score') p.vy += 0.08;
        if (p.rotation !== undefined && p.rotSpeed !== undefined) {
          p.rotation += p.rotSpeed;
        }
        p.life--;
      });

      const shakeX = shakeRef.current > 0 ? (Math.random() - 0.5) * 7 : 0;
      const shakeY = shakeRef.current > 0 ? (Math.random() - 0.5) * 5 : 0;

      ctx.save();
      ctx.translate(shakeX, shakeY);

      const bgIdx = Math.floor(scoreRef.current / 10) % bgImages.length;
      const currentBg = bgImages[bgIdx];

      if (currentBg.complete && currentBg.naturalWidth > 0) {
        ctx.drawImage(currentBg, 0, 0, w, h);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        // 점수대에 따라 폴백 그라데이션 색상도 변경
        if (bgIdx === 0) { // 아침
          grad.addColorStop(0, '#5BB8F5');
          grad.addColorStop(1, '#8BC34A');
        } else if (bgIdx === 1) { // 낮
          grad.addColorStop(0, '#4FACFE');
          grad.addColorStop(1, '#00F2FE');
        } else if (bgIdx === 2) { // 저녁
          grad.addColorStop(0, '#FF8C00');
          grad.addColorStop(1, '#FF4500');
        } else { // 밤
          grad.addColorStop(0, '#2C3E50');
          grad.addColorStop(1, '#000000');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      cloudsRef.current.forEach(c => drawCloud(ctx, c.x, c.y, c.size, c.opacity));

      pipesRef.current.forEach(pipe => {
        const gap = getPipeGap(scoreRef.current);
        drawPipe(ctx, pipe.x, pipe.topHeight, gap, groundY);
      });

      drawGround(ctx, w, h, groundY, bgScrollRef.current);

      particlesRef.current.forEach(p => {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        if (p.type === 'score') {
          ctx.fillStyle = p.color;
          ctx.strokeStyle = 'rgba(0,0,0,0.4)';
          ctx.lineWidth = 2;
          ctx.font = `bold ${p.size}px "Press Start 2P", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.strokeText(p.text || '', p.x, p.y);
          ctx.fillText(p.text || '', p.x, p.y);
        } else if (p.type === 'star') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);
          drawStar(ctx, 0, 0, p.size, p.color);
          ctx.restore();
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      });

      drawElizabeth(ctx, birdX, birdYRef.current, birdVelRef.current, state, wingTimerRef.current);

      ctx.restore();

      if (state !== 'idle') {
        drawHUD(ctx, w, scoreRef.current, bestRef.current, state);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasSize, spawnScoreParticle, spawnDeathParticles, spawnMilestoneParticles, handleDeath]);

  const handleRestart = useCallback(() => {
    initGame();
    stateRef.current = 'idle';
    setGameState('idle');
    lastStateChangeRef.current = Date.now();
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setLeaderboard(data);
    };
    fetchLeaderboard();
  }, [initGame]);

  const handleInput = useCallback((e) => {
    e?.preventDefault();
    const state = stateRef.current;
    
    if (state === 'gameover') {
      handleRestart();
      return;
    }

    getAudioCtx();

    if (state === 'idle') {
      // 모바일 Ghost Click 방지: 리트라이 버튼 클릭 직후 바로 시작되지 않도록 400ms 지연 확인
      if (Date.now() - lastStateChangeRef.current < 400) return;

      initGame();
      stateRef.current = 'playing';
      setGameState('playing');
      birdVelRef.current = JUMP_FORCE;
      wingTimerRef.current = 10;
      playJumpSound();
      return;
    }

    if (state === 'playing') {
      birdVelRef.current = JUMP_FORCE;
      wingTimerRef.current = 10;
      playJumpSound();
    }
  }, [initGame, handleRestart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const onTouch = (e) => { e.preventDefault(); handleInput(); };
    const onMouse = (e) => { e.preventDefault(); handleInput(); };
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); handleInput(); }
    };

    if (canvas) {
      canvas.addEventListener('touchstart', onTouch, { passive: false });
      canvas.addEventListener('mousedown', onMouse);
    }
    window.addEventListener('keydown', onKey);
    return () => {
      canvas?.removeEventListener('touchstart', onTouch);
      canvas?.removeEventListener('mousedown', onMouse);
      window.removeEventListener('keydown', onKey);
    };
  }, [handleInput]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d1117',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', width: canvasSize.w, height: canvasSize.h }}>
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          style={{ display: 'block', touchAction: 'none', userSelect: 'none' }}
        />

        {gameState === 'idle' && (
          <StartScreen
            onStart={handleInput}
            bestScore={bestScore}
            onShowRecords={() => setShowRecords(true)}
            leaderboard={leaderboard}
            showRecords={showRecords}
            onCloseRecords={() => setShowRecords(false)}
          />
        )}

        {gameState === 'gameover' && !showInitialsInput && (
          <GameOverScreen score={score} bestScore={bestScore} onRestart={handleRestart} />
        )}

        {showInitialsInput && (
          <InitialsInput
            score={score}
            onSubmit={async (initials) => {
              setIsSubmitting(true);
              try {
                await saveLeaderboardRecord(initials, score);
                const newData = await getLeaderboard();
                setLeaderboard(newData);
                setShowInitialsInput(false);
              } catch (e) {
                alert('저장 실패했습니다.');
              } finally {
                setIsSubmitting(false);
              }
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

function drawElizabeth(ctx, x, y, vel, state, wingTimer) {
  const isDead = state === 'dead' || state === 'gameover';
  const img = isDead ? deadImg : flyImg;

  const rotation = isDead
    ? Math.min(Math.PI * 0.6, Math.abs(vel) * 0.06)
    : Math.max(-0.38, Math.min(0.48, vel * 0.055));

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const size = BIRD_SIZE * 1.9;

  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  } else {
    drawElizabethFallback(ctx, isDead, wingTimer);
  }

  if (!isDead && wingTimer > 5) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(size * 0.3, -size * 0.1, size * 0.25, size * 0.12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawElizabethFallback(ctx, isDead, wingTimer) {
  const s = BIRD_SIZE;

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.5, s * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const wingY = wingTimer > 0 ? -s * 0.18 : s * 0.04;
  ctx.fillStyle = '#F5F5F5';
  ctx.beginPath();
  ctx.ellipse(s * 0.4, wingY, s * 0.24, s * 0.13, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFD700';
  ctx.strokeStyle = '#CC8800';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(s * 0.38, s * 0.04, s * 0.17, s * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (isDead) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2.5;
    [[-0.12, -0.12], [0.12, -0.12]].forEach(([ex, ey]) => {
      ctx.beginPath();
      ctx.moveTo(ex * s - 4, ey * s - 4);
      ctx.lineTo(ex * s + 4, ey * s + 4);
      ctx.moveTo(ex * s + 4, ey * s - 4);
      ctx.lineTo(ex * s - 4, ey * s + 4);
      ctx.stroke();
    });
  } else {
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(-s * 0.12, -s * 0.12, 4.5, 0, Math.PI * 2);
    ctx.arc(s * 0.12, -s * 0.12, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-s * 0.09, -s * 0.15, 1.8, 0, Math.PI * 2);
    ctx.arc(s * 0.15, -s * 0.15, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#FFD700';
  ctx.strokeStyle = '#CC8800';
  ctx.lineWidth = 1.5;
  [[-0.2, 0.44], [0.2, 0.44]].forEach(([fx, fy]) => {
    ctx.beginPath();
    ctx.ellipse(fx * s, fy * s, s * 0.1, s * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}

function drawPipe(ctx, x, topHeight, gap, groundY) {
  const bottomY = topHeight + gap;
  const bottomH = groundY - bottomY;
  drawSinglePipe(ctx, x, 0, PIPE_WIDTH, topHeight, 'top');
  drawSinglePipe(ctx, x, bottomY, PIPE_WIDTH, bottomH, 'bottom');
}

function drawSinglePipe(ctx, x, y, w, h, dir) {
  if (h <= 0) return;
  const capH = 24;
  const capW = w + 14;
  const capX = x - 7;

  const grad = ctx.createLinearGradient(x, 0, x + w, 0);
  grad.addColorStop(0, '#2d7a2d');
  grad.addColorStop(0.25, '#4caf50');
  grad.addColorStop(0.55, '#66bb6a');
  grad.addColorStop(0.8, '#43a047');
  grad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(x + 5, y, 10, h);

  const capY = dir === 'top' ? y + h - capH : y;
  const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
  capGrad.addColorStop(0, '#1b5e20');
  capGrad.addColorStop(0.3, '#4caf50');
  capGrad.addColorStop(0.65, '#66bb6a');
  capGrad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = capGrad;
  ctx.fillRect(capX, capY, capW, capH);
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2;
  ctx.strokeRect(capX, capY, capW, capH);

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(capX + 5, capY, 14, capH);
}

function drawGround(ctx, w, h, groundY, scroll) {
  const grad = ctx.createLinearGradient(0, groundY, 0, h);
  grad.addColorStop(0, '#8BC34A');
  grad.addColorStop(0.12, '#7CB342');
  grad.addColorStop(0.35, '#558B2F');
  grad.addColorStop(1, '#33691E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, groundY, w, h - groundY);

  ctx.fillStyle = '#9CCC65';
  ctx.fillRect(0, groundY, w, 7);

  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  const step = 28;
  for (let i = -1; i < w / step + 2; i++) {
    const px = i * step - (scroll % step);
    ctx.fillRect(px, groundY + 1, 14, 5);
  }

  ctx.strokeStyle = '#558B2F';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 7);
  ctx.lineTo(w, groundY + 7);
  ctx.stroke();
}

function drawCloud(ctx, x, y, size, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity * 0.72;
  ctx.fillStyle = '#FFFFFF';

  const parts = [
    { dx: 0, dy: 0, r: size * 0.38 },
    { dx: size * 0.32, dy: size * 0.06, r: size * 0.28 },
    { dx: -size * 0.28, dy: size * 0.08, r: size * 0.26 },
    { dx: size * 0.14, dy: -size * 0.14, r: size * 0.22 },
    { dx: -size * 0.12, dy: -size * 0.1, r: size * 0.18 },
  ];

  ctx.globalAlpha = opacity * 0.15;
  ctx.fillStyle = '#8899BB';
  parts.forEach(p => {
    ctx.beginPath();
    ctx.arc(x + p.dx + 3, y + p.dy + 4, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = opacity * 0.72;
  ctx.fillStyle = '#FFFFFF';
  parts.forEach(p => {
    ctx.beginPath();
    ctx.arc(x + p.dx, y + p.dy, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawStar(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const ia = a + Math.PI / 5;
    const ox = Math.cos(a) * size;
    const oy = Math.sin(a) * size;
    const ix = Math.cos(ia) * (size * 0.42);
    const iy = Math.sin(ia) * (size * 0.42);
    if (i === 0) ctx.moveTo(x + ox, y + oy);
    else ctx.lineTo(x + ox, y + oy);
    ctx.lineTo(x + ix, y + iy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawHUD(ctx, w, score, best, state) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.beginPath();
  ctx.roundRect(w / 2 - 58, 14, 116, 46, 14);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 5;
  ctx.fillText(String(score), w / 2, 37);
  ctx.shadowBlur = 0;

  if (best > 0 && state !== 'playing') {
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 52, 66, 104, 24, 8);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText(`BEST: ${best}`, w / 2, 78);
  }

  if (state === 'playing' && score >= 5) {
    const level = Math.min(Math.floor(score / 5) + 1, 10);
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.roundRect(w - 80, 14, 68, 22, 6);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`LV.${level}`, w - 16, 25);
  }

  ctx.restore();
}

function StartScreen({ onStart, bestScore, onShowRecords, leaderboard, showRecords, onCloseRecords }) {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 550);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'all',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.93)',
          border: '4px solid #1b5e20',
          borderRadius: 18,
          padding: '26px 30px 22px',
          textAlign: 'center',
          boxShadow: '0 6px 0 #1b5e20, 0 10px 30px rgba(0,0,0,0.35)',
          maxWidth: 310,
          width: '82%',
          animation: 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 10,
          color: '#888',
          marginBottom: 4,
          letterSpacing: 2,
        }}>
          銀魂 PRESENTS
        </div>

        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 20,
          color: '#1b5e20',
          marginBottom: 2,
          textShadow: '2px 2px 0 rgba(0,0,0,0.15)',
          lineHeight: 1.3,
        }}>
          ELIZABETH
        </div>
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 26,
          color: '#e53935',
          marginBottom: 16,
          textShadow: '3px 3px 0 rgba(0,0,0,0.15)',
        }}>
          JUMP!
        </div>

        <div style={{
          marginBottom: 14,
          animation: 'float 2s ease-in-out infinite',
        }}>
          <img
            src={flyImgSrc}
            alt="Elizabeth"
            style={{ width: 90, height: 90, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div style={{
          fontFamily: '"Noto Sans KR", sans-serif',
          fontSize: 13,
          color: '#444',
          marginBottom: 14,
          lineHeight: 1.7,
          background: '#F1F8E9',
          borderRadius: 10,
          padding: '8px 14px',
          border: '1.5px solid #C5E1A5',
        }}>
          📱 탭하여 점프!<br />
          🎮 스페이스바도 OK<br />
          🎋 대나무를 피하세요!
        </div>

        {bestScore > 0 && (
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 9,
            color: '#E65100',
            marginBottom: 8,
            background: '#FFF3E0',
            padding: '7px 14px',
            borderRadius: 8,
            border: '2px solid #FF8F00',
            display: 'inline-block',
          }}>
            🏆 BEST: {bestScore}
          </div>
        )}

        {leaderboard.length > 0 && (
          <div style={{ marginBottom: 10, marginTop: 6 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onShowRecords(); }}
              onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); onShowRecords(); }}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 8,
                padding: '6px 12px',
                background: '#4CAF50',
                color: '#FFF',
                border: '2px solid #2E7D32',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'transform 0.1s',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              📊 글로벌 랭킹
            </button>
          </div>
        )}

        <button
          onClick={onStart}
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); onStart(); }}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            color: '#1b5e20',
            opacity: blink ? 1 : 0.2,
            transition: 'opacity 0.15s',
            marginTop: 6,
            background: 'none',
            border: '2px solid #1b5e20',
            borderRadius: 8,
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          ▶ TAP TO START
        </button>
      </div>

      {showRecords && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={onCloseRecords}
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); onCloseRecords(); }}
        >
          <div
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.95)',
              border: '4px solid #1b5e20',
              borderRadius: 14,
              padding: '20px',
              maxWidth: 280,
              width: '80%',
              maxHeight: '70vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              onClick={onCloseRecords}
              onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); onCloseRecords(); }}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'none',
                border: 'none',
                fontSize: 20,
                color: '#888',
                cursor: 'pointer',
                padding: '4px 8px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
            <div style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 12,
              color: '#1b5e20',
              marginBottom: 14,
              textAlign: 'center',
            }}>
              📊 게임 기록
            </div>

            {leaderboard.length === 0 ? (
              <div style={{
                fontFamily: '"Noto Sans KR", sans-serif',
                fontSize: 12,
                color: '#999',
                textAlign: 'center',
                padding: '20px 0',
              }}>
                기록이 없습니다
              </div>
            ) : (
              <div>
                {leaderboard.map((record, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: idx < leaderboard.length - 1 ? '1px solid #EEE' : 'none',
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 10,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ color: '#888', width: 25 }}>#{idx + 1}</span>
                      <span style={{ color: '#1b5e20', fontWeight: 'bold' }}>{record.initials}</span>
                    </div>
                    <span style={{ color: '#333' }}>
                      {record.score}
                    </span>
                  </div>
                ))}
              </div>
            )}


          </div>
        </div>
      )}
    </div>
  );
}

function GameOverScreen({ score, bestScore, onRestart }) {
  const isNewBest = score > 0 && score === bestScore;
  const [show, setShow] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText('3333-06-8147746');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = '3333-06-8147746';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.96)',
          border: '4px solid #1b5e20',
          borderRadius: 18,
          padding: '26px 32px 24px',
          textAlign: 'center',
          boxShadow: '0 6px 0 #1b5e20, 0 12px 40px rgba(0,0,0,0.4)',
          maxWidth: 300,
          width: '80%',
          animation: 'bounce-in 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        }}
      >
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 15,
          color: '#e53935',
          marginBottom: 14,
          textShadow: '2px 2px 0 rgba(0,0,0,0.15)',
        }}>
          GAME OVER
        </div>

        <div style={{ marginBottom: 14 }}>
          <img
            src={deadImgSrc}
            alt="Elizabeth Dead"
            style={{ width: 82, height: 82, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div style={{
          background: '#F8F9FA',
          border: '2px solid #E0E0E0',
          borderRadius: 12,
          padding: '12px 20px',
          marginBottom: 12,
        }}>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 9,
            color: '#999',
            marginBottom: 6,
            letterSpacing: 1,
          }}>SCORE</div>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 32,
            color: '#212121',
            lineHeight: 1,
          }}>{score}</div>
        </div>

        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 9,
          color: isNewBest ? '#E65100' : '#888',
          marginBottom: 18,
          padding: '8px 16px',
          background: isNewBest ? '#FFF3E0' : 'transparent',
          borderRadius: 8,
          border: isNewBest ? '2px solid #FF8F00' : 'none',
          display: 'inline-block',
        }}>
          {isNewBest ? '🏆 NEW BEST!' : `BEST: ${bestScore}`}
        </div>

        {!showTip ? (
          <button
            onClick={(e) => { e.stopPropagation(); setShowTip(true); }}
            onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); setShowTip(true); }}
            style={{
              display: 'block',
              width: '100%',
              background: '#FFF8E1',
              color: '#F57F17',
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: 12,
              fontWeight: 700,
              padding: '10px 20px',
              border: '2px solid #FFD54F',
              borderRadius: 10,
              cursor: 'pointer',
              marginBottom: 10,
              transition: 'transform 0.1s',
            }}
          >
            🍯 개발자 꿀팁 보기
          </button>
        ) : (
          <div
            style={{
              background: '#FFF8E1',
              border: '2px solid #FFD54F',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 10,
              animation: 'bounce-in 0.3s ease forwards',
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div style={{
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: 11,
              color: '#5D4037',
              lineHeight: 1.6,
              marginBottom: 8,
            }}>
              🎮 <b>게임 꿀팁:</b><br />
              개발자에게 커피를 사주면<br />
              실력이 오른다는 소문이...☕️
            </div>
            <button
              onClick={handleCopy}
              onTouchStart={(e) => { e.preventDefault(); handleCopy(e); }}
              style={{
                fontFamily: '"Noto Sans KR", monospace',
                fontSize: 13,
                fontWeight: 700,
                color: '#1565C0',
                background: copied ? '#E8F5E9' : '#FFF',
                border: `2px solid ${copied ? '#4CAF50' : '#90CAF9'}`,
                borderRadius: 8,
                padding: '8px 14px',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s',
                letterSpacing: 0.5,
              }}
            >
              {copied ? '✅ 복사 완료!' : '🏦 카뱅 3333-06-8147746'}
            </button>
            <div style={{
              fontFamily: '"Noto Sans KR", sans-serif',
              fontSize: 9,
              color: '#999',
              marginTop: 5,
            }}>
              탭하면 계좌번호가 복사됩니다
            </div>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onRestart(); }}
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); onRestart(); }}
          style={{
            display: 'block',
            width: '100%',
            background: '#2e7d32',
            color: '#FFFFFF',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 12,
            padding: '13px 24px',
            border: '3px solid #1b5e20',
            borderRadius: 10,
            boxShadow: '0 4px 0 #1b5e20',
            cursor: 'pointer',
            transition: 'transform 0.1s, box-shadow 0.1s',
            letterSpacing: 1,
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(3px)';
            e.currentTarget.style.boxShadow = '0 1px 0 #1b5e20';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 4px 0 #1b5e20';
          }}
        >
          ▶ RETRY
        </button>
      </div>
    </div>
  );
}

function InitialsInput({ score, onSubmit, isSubmitting }) {
  const [initials, setInitials] = useState('');

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '18px',
        textAlign: 'center',
        border: '4px solid #1b5e20',
        width: '85%',
        maxWidth: '300px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        animation: 'bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        <div style={{ 
          fontFamily: '"Press Start 2P", monospace', 
          fontSize: '14px', 
          color: '#e53935', 
          marginBottom: '20px',
          textShadow: '1px 1px 0 rgba(0,0,0,0.1)'
        }}>TOP 10!</div>
        
        <div style={{ 
          fontSize: '13px', 
          color: '#333', 
          marginBottom: '18px', 
          fontFamily: '"Noto Sans KR", sans-serif',
          lineHeight: '1.6'
        }}>
          새로운 기록을 달성했습니다!<br/>이니셜 3글자를 입력하세요.
        </div>
        
        <div style={{
          background: '#f9f9f9',
          padding: '15px',
          borderRadius: '12px',
          border: '2px dashed #C5E1A5',
          marginBottom: '20px'
        }}>
          <div style={{ fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#888', marginBottom: '8px' }}>SCORE</div>
          <div style={{ fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#1b5e20' }}>{score}</div>
        </div>

        <input
          autoFocus
          maxLength={3}
          value={initials}
          onChange={(e) => setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
          placeholder="___"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '28px',
            textAlign: 'center',
            width: '100%',
            padding: '12px',
            border: '3px solid #E0E0E0',
            borderRadius: '10px',
            marginBottom: '22px',
            textTransform: 'uppercase',
            outline: 'none',
            color: '#1b5e20',
            backgroundColor: '#fff',
            letterSpacing: '5px'
          }}
        />
        
        <button
          disabled={initials.length < 3 || isSubmitting}
          onClick={() => onSubmit(initials)}
          style={{
            width: '100%',
            padding: '14px',
            background: initials.length < 3 ? '#bdbdbd' : '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '11px',
            cursor: initials.length < 3 ? 'default' : 'pointer',
            boxShadow: initials.length < 3 ? 'none' : '0 4px 0 #1b5e20',
            transition: 'all 0.1s',
            letterSpacing: '1px'
          }}
        >
          {isSubmitting ? 'SAVING...' : 'REGISTER RANK'}
        </button>
      </div>
    </div>
  );
}
