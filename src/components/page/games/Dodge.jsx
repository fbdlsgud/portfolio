import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getBestScore, saveLeaderboardRecord, getLeaderboard } from './scoreManager';

// Assets
import flyImgSrc from '../../../assets/games/jump/elizabeth-fly.png';
import deadImgSrc from '../../../assets/games/jump/elizabeth-dead.png';
import bgSpaceSrc from '../../../assets/games/jump/bg-space.png';
import milkImgSrc from '../../../assets/games/jump/strawberry-milk.png';

// Constants
const PLAYER_SIZE = 55;
const BULLET_SIZE = 16;
const ITEM_SIZE = 30;
const INITIAL_HEARTS = 3;
const INVINCIBLE_TIME = 2000;
const FEVER_TIME = 5000; // Strawberry Milk effect

function Dodge() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const stateRef = useRef('idle'); // idle, playing, gameover
  
  // Game Refs
  const playerPosRef = useRef({ x: 170, y: 350 });
  const playerVelRef = useRef({ x: 0, y: 0 });
  const playerHeartsRef = useRef(INITIAL_HEARTS);
  const invincibleUntilRef = useRef(0);
  const isFeverRef = useRef(false);
  const bulletsRef = useRef([]);
  const itemsRef = useRef([]);
  const scoreRef = useRef(0);
  const lastScoreTimeRef = useRef(0);
  const keysRef = useRef({});

  // Image Objects
  const [imagesReady, setImagesReady] = useState(false);
  const bgImg = useRef(new Image());
  const pImg = useRef(new Image());
  const dImg = useRef(new Image());
  const mImg = useRef(new Image());

  // React State
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(INITIAL_HEARTS);
  const [bestScore, setBestScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ w: 390, h: 700 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const showRecordsRef = useRef(false);
  const [showInitialsInput, setShowInitialsInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initialize & Asset Loading
  useEffect(() => {
    const updateSize = () => {
      const w = Math.min(window.innerWidth, 430);
      const h = Math.min(window.innerHeight, 700);
      setCanvasSize({ w, h });
      if (stateRef.current === 'idle') {
        playerPosRef.current = { x: w / 2 - PLAYER_SIZE / 2, y: h / 2 - PLAYER_SIZE / 2 };
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded === 4) setImagesReady(true);
    };
    bgImg.current.src = bgSpaceSrc; bgImg.current.onload = onLoad;
    pImg.current.src = flyImgSrc; pImg.current.onload = onLoad;
    dImg.current.src = deadImgSrc; dImg.current.onload = onLoad;
    mImg.current.src = milkImgSrc; mImg.current.onload = onLoad;

    setBestScore(getBestScore('dodge'));
    getLeaderboard('dodge').then(setLeaderboard);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 2. Control
  useEffect(() => {
    const kd = (e) => { 
      keysRef.current[e.code] = true; 
      // Space to start/restart
      if (e.code === 'Space') {
        if (stateRef.current === 'idle') {
          e.preventDefault();
          handleStart();
        } else if (stateRef.current === 'gameover') {
          e.preventDefault();
          handleRetry();
        }
      }
    };
    const ku = (e) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [imagesReady]); // Re-bind if imagesReady changes to ensure handleStart works with latest state if needed, though handleStart is stable. Actually, no deps needed if handleStart is stable. Let's add it for safety.

  // 3. Game Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const { width: w, height: h } = canvas;
      const state = stateRef.current;
      const now = Date.now();

      // --- UPDATE ---
      if (state === 'playing') {
        const friction = 0.82;
        const accel = 1.0;
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) playerVelRef.current.x -= accel;
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) playerVelRef.current.x += accel;
        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) playerVelRef.current.y -= accel;
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) playerVelRef.current.y += accel;

        playerVelRef.current.x *= friction;
        playerVelRef.current.y *= friction;
        playerPosRef.current.x += playerVelRef.current.x;
        playerPosRef.current.y += playerVelRef.current.y;

        playerPosRef.current.x = Math.max(0, Math.min(w - PLAYER_SIZE, playerPosRef.current.x));
        playerPosRef.current.y = Math.max(0, Math.min(h - PLAYER_SIZE, playerPosRef.current.y));

        if (now - lastScoreTimeRef.current >= 1000) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          lastScoreTimeRef.current = now;
        }

        // Bullets Spawn
        if (Math.random() < 0.045 + Math.min(scoreRef.current / 400, 0.07)) {
          const side = Math.floor(Math.random() * 4);
          let bx, by, bvx, bvy;
          const bspeed = 2.5 + Math.min(scoreRef.current / 25, 4.5);
          if (side === 0) { bx = Math.random() * w; by = -20; bvx = (Math.random()-0.5)*3; bvy = bspeed; }
          else if (side === 1) { bx = w+20; by = Math.random() * h; bvx = -bspeed; bvy = (Math.random()-0.5)*3; }
          else if (side === 2) { bx = Math.random() * w; by = h+20; bvx = (Math.random()-0.5)*3; bvy = -bspeed; }
          else { bx = -20; by = Math.random() * h; bvx = bspeed; bvy = (Math.random()-0.5)*3; }
          bulletsRef.current.push({ x: bx, y: by, vx: bvx, vy: bvy });
        }

        // Items Spawn
        if (Math.random() < 0.0005) { // 0.05% 드롭률 (매우 희귀)
          const side = Math.floor(Math.random() * 4);
          let ix, iy, ivx, ivy;
          if (side === 0) { ix = Math.random() * w; iy = -30; ivx = (Math.random()-0.5)*2; ivy = 2; }
          else if (side === 1) { ix = w+30; iy = Math.random() * h; ivx = -2; ivy = (Math.random()-0.5)*2; }
          else if (side === 2) { ix = Math.random() * w; iy = h+30; ivx = (Math.random()-0.5)*2; ivy = -2; }
          else { ix = -30; iy = Math.random() * h; ivx = 2; ivy = (Math.random()-0.5)*2; }
          itemsRef.current.push({ x: ix, y: iy, vx: ivx, vy: ivy });
        }

        // Bullets Update & Hitbox
        const invincible = now < invincibleUntilRef.current;
        bulletsRef.current = bulletsRef.current.filter(b => {
          b.x += b.vx; b.y += b.vy;
          if (!invincible) {
            const dx = (b.x + BULLET_SIZE/2) - (playerPosRef.current.x + PLAYER_SIZE/2);
            const dy = (b.y + BULLET_SIZE/2) - (playerPosRef.current.y + PLAYER_SIZE/2);
            if (Math.sqrt(dx*dx + dy*dy) < (PLAYER_SIZE/2.2)) {
              playerHeartsRef.current -= 1;
              setHearts(playerHeartsRef.current);
              invincibleUntilRef.current = now + INVINCIBLE_TIME;
              isFeverRef.current = false; // Hit invincibility is not fever
              if (playerHeartsRef.current <= 0) {
                stateRef.current = 'gameover'; setGameState('gameover');
                // Check for new best & rank
                const currentBest = getBestScore('dodge');
                if (scoreRef.current > currentBest) setBestScore(scoreRef.current);
                
                getLeaderboard('dodge').then(data => {
                  setLeaderboard(data);
                  const isTop10 = data.length < 10 || scoreRef.current > data[data.length - 1].score;
                  if (isTop10) setShowInitialsInput(true);
                });
              }
              return false;
            }
          }
          return b.x > -50 && b.x < w+50 && b.y > -50 && b.y < h+50;
        });

        // Items Update & Hitbox
        itemsRef.current = itemsRef.current.filter(it => {
          it.x += it.vx; it.y += it.vy;
          const dx = (it.x + 15) - (playerPosRef.current.x + PLAYER_SIZE/2);
          const dy = (it.y + 15) - (playerPosRef.current.y + PLAYER_SIZE/2);
          if (Math.sqrt(dx*dx + dy*dy) < (PLAYER_SIZE/2 + 10)) {
            invincibleUntilRef.current = now + FEVER_TIME;
            isFeverRef.current = true; // Item invincibility is fever
            return false;
          }
          return it.x > -100 && it.x < w+100 && it.y > -100 && it.y < h+100;
        });
      }

      // --- DRAW ---
      ctx.clearRect(0, 0, w, h);

      // 1. BG
      if (bgImg.current.complete && bgImg.current.naturalWidth !== 0) {
        ctx.drawImage(bgImg.current, 0, 0, w, h);
      } else {
        ctx.fillStyle = '#0a0a20'; ctx.fillRect(0, 0, w, h);
      }

      // 2. Character
      const isInv = now < invincibleUntilRef.current;
      const fever = isInv && isFeverRef.current;
      const remainingInv = invincibleUntilRef.current - now;
      const visible = !isInv || Math.floor(now / 150) % 2 === 0;

      if (visible) {
        const x = playerPosRef.current.x;
        const y = playerPosRef.current.y;
        if (fever) {
          // Pulse the circle for better "fever" feel
          const pulse = Math.sin(now / 100) * 5;
          const alpha = remainingInv < 1000 ? (remainingInv / 1000) : 1; // Fade out in last 1s
          ctx.shadowBlur = 15 + pulse; 
          ctx.shadowColor = `rgba(255, 128, 171, ${alpha})`;
          ctx.beginPath(); ctx.arc(x + PLAYER_SIZE/2, y + PLAYER_SIZE/2, (PLAYER_SIZE/1.5) + pulse/2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 128, 171, ${0.7 * alpha})`; 
          ctx.lineWidth = 4; ctx.stroke(); ctx.shadowBlur = 0;
        }
        const charImg = state === 'gameover' ? dImg.current : pImg.current;
        if (charImg.complete && charImg.naturalWidth !== 0) {
          ctx.drawImage(charImg, x, y, PLAYER_SIZE, PLAYER_SIZE);
        } else {
          ctx.fillStyle = '#FFF'; ctx.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
        }
      }

      // 3. Bullets
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      bulletsRef.current.forEach(b => {
        ctx.fillStyle = '#FF3D00'; // Deeper Red
        ctx.strokeStyle = '#000000'; // Black stroke for better contrast
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(b.x + BULLET_SIZE/2, b.y + BULLET_SIZE/2, BULLET_SIZE/2, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // 4. Items (Strawberry Milk)
      itemsRef.current.forEach(it => {
        const img = mImg.current;
        if (img.complete && img.naturalWidth !== 0) {
          ctx.drawImage(img, it.x, it.y, ITEM_SIZE, ITEM_SIZE + 5);
        } else {
          // Fallback
          ctx.fillStyle = '#FF4081';
          ctx.fillRect(it.x + 5, it.y + 10, 20, 20);
        }
        
        ctx.shadowBlur = 10; ctx.shadowColor = '#FF80AB';
        ctx.strokeStyle = '#FF80AB'; ctx.lineWidth = 1;
        ctx.strokeRect(it.x, it.y, 30, 35); ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bestScore]);

  const handleStart = () => {
    if (showRecordsRef.current) return;
    const { width: w, height: h } = canvasRef.current;
    playerPosRef.current = { x: w / 2 - PLAYER_SIZE / 2, y: h / 2 - PLAYER_SIZE / 2 };
    playerVelRef.current = { x: 0, y: 0 };
    playerHeartsRef.current = INITIAL_HEARTS;
    invincibleUntilRef.current = 0;
    isFeverRef.current = false;
    bulletsRef.current = [];
    itemsRef.current = [];
    scoreRef.current = 0;
    lastScoreTimeRef.current = Date.now();
    setHearts(INITIAL_HEARTS); setScore(0);
    stateRef.current = 'playing'; setGameState('playing');
  };

  const handleRetry = () => {
    stateRef.current = 'idle';
    setGameState('idle');
  };

  const handleTouchMove = (e) => {
    if (stateRef.current !== 'playing') return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const tx = touch.clientX - rect.left - PLAYER_SIZE / 2;
    const ty = touch.clientY - rect.top - PLAYER_SIZE / 2;
    playerPosRef.current.x += (tx - playerPosRef.current.x) * 0.35;
    playerPosRef.current.y += (ty - playerPosRef.current.y) * 0.35;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: canvasSize.w, height: canvasSize.h, background: '#0a0a20' }}>
        <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h} onTouchMove={handleTouchMove} style={{ display: 'block', touchAction: 'none' }} />
        {gameState === 'playing' && (
          <div style={{ position: 'absolute', top: 20, left: 0, right: 0, padding: '0 20px', display: 'flex', justifyContent: 'space-between', zIndex: 10, pointerEvents: 'none' }}>
            <div style={{ fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF', textShadow: '2px 2px 0 #000' }}>{score}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[...Array(INITIAL_HEARTS)].map((_, i) => (
                <span key={i} style={{ fontSize: 22, opacity: i < hearts ? 1 : 0.2 }}>❤️</span>
              ))}
            </div>
          </div>
        )}
        {gameState === 'idle' && (
          <StartScreen onStart={handleStart} bestScore={bestScore} onShowRecords={() => { showRecordsRef.current = true; setShowRecords(true); }} showRecords={showRecords} onCloseRecords={() => { showRecordsRef.current = false; setShowRecords(false); }} leaderboard={leaderboard} />
        )}
        {gameState === 'gameover' && (
          <GameOverScreen score={score} bestScore={bestScore} onRetry={handleRetry} />
        )}

        {showRecords && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 1000 }} 
               onClick={() => { showRecordsRef.current = false; setShowRecords(false); }}>
            <div style={{ background: '#FFF', borderRadius: 20, padding: '24px', width: '85%', maxWidth: 300, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              <div style={{ fontFamily: '"Press Start 2P"', fontSize: 14, color: '#311b92', marginBottom: 20 }}>GLOBAL RECORDS</div>
              <div style={{ maxHeight: 250, overflowY: 'auto', marginBottom: 20 }}>
                {leaderboard.length > 0 ? leaderboard.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 13 }}>
                    <span style={{ color: '#888' }}>{i + 1}. {rec.initials}</span>
                    <span style={{ fontWeight: 'bold' }}>{rec.score} pt</span>
                  </div>
                )) : <div style={{ color: '#888', fontSize: 12 }}>No records yet</div>}
              </div>
              <button onClick={() => { showRecordsRef.current = false; setShowRecords(false); }} style={{ padding: '10px 20px', background: '#311b92', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}>CLOSE</button>
            </div>
          </div>
        )}

        {showInitialsInput && (
          <InitialsInput 
            score={score} 
            isSubmitting={isSubmitting}
            onSubmit={async (initials) => {
              setIsSubmitting(true);
              try {
                await saveLeaderboardRecord(initials, score, 'dodge');
                const newData = await getLeaderboard('dodge');
                setLeaderboard(newData);
                setShowInitialsInput(false);
              } catch (e) {
                alert('Failed to save score');
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

function StartScreen({ onStart, bestScore, onShowRecords, leaderboard, showRecords, onCloseRecords }) {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 500); return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'all', background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: 'rgba(255,255,255,0.95)', border: '4px solid #311b92', borderRadius: 20, padding: '30px', textAlign: 'center', boxShadow: '0 8px 0 #311b92, 0 20px 50px rgba(0,0,0,0.5)', maxWidth: 320, width: '85%' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: '"Press Start 2P"', fontSize: 10, color: '#673ab7', marginBottom: 6 }}>COSMIC MISSION</div>
        <div style={{ fontFamily: '"Press Start 2P"', fontSize: 22, color: '#311b92', marginBottom: 4 }}>DUCK</div>
        <div style={{ fontFamily: '"Press Start 2P"', fontSize: 28, color: '#e53935', marginBottom: 20 }}>DODGE!</div>
        <div style={{ marginBottom: 18 }}><img src={flyImgSrc} style={{ width: 90 }} alt="Duck" /></div>
        <div style={{ fontSize: 13, color: '#444', marginBottom: 18, background: '#f3e5f5', padding: '12px', borderRadius: 12, lineHeight: 1.6 }}>🚀 <b>WASD / 화살표</b> 이동<br />📱 <b>화면 드래그</b> 조작<br />🥛 <b>딸기우유</b> 자석/무적!<br />💥 폭탄을 최대한 피하세요!</div>
        {bestScore > 0 && <div style={{ fontSize: 11, color: '#E65100', marginBottom: 14, fontFamily: '"Press Start 2P"' }}>🏆 BEST: {bestScore}</div>}
        
        {leaderboard.length > 0 && (
          <button onClick={onShowRecords} style={{ marginBottom: 14, padding: '8px 16px', background: '#4CAF50', color: '#FFF', border: 'none', borderRadius: 8, fontFamily: '"Press Start 2P"', fontSize: 10, cursor: 'pointer' }}>📊 글로벌 랭킹</button>
        )}

        <button onClick={onStart} style={{ fontFamily: '"Press Start 2P"', fontSize: 11, background: '#673ab7', color: '#FFF', border: 'none', borderRadius: 10, padding: '15px 30px', cursor: 'pointer', opacity: blink ? 1 : 0.8, width: '100%', boxShadow: '0 4px 0 #311b92' }}>▶ MISSION START</button>
      </div>
    </div>
  );
}

function GameOverScreen({ score, bestScore, onRetry }) {
  const [showTip, setShowTip] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText('3333-06-8147746'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { alert('3333-06-8147746'); }
  };
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 10 }}>
      <div style={{ background: '#FFF', border: '5px solid #311b92', borderRadius: 20, padding: '30px', textAlign: 'center', width: '85%', maxWidth: 320 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: '"Press Start 2P"', color: '#e53935', fontSize: 18, marginBottom: 20 }}>MISSION FAILED</div>
        <img src={deadImgSrc} style={{ width: 75, marginBottom: 20 }} alt="Elizabeth Dead" />
        <div style={{ background: '#f8f9fa', padding: '15px 20px', borderRadius: 15, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8, fontFamily: '"Press Start 2P"' }}>SCORE</div>
          <div style={{ fontSize: 36, fontWeight: '900' }}>{score}</div>
        </div>
        {!showTip ? (
          <button onClick={() => setShowTip(true)} style={{ width: '100%', padding: '12px', background: '#fff9c4', border: '2px solid #fbc02d', borderRadius: 12, marginBottom: 12, fontSize: 13 }}>🍯 개발자 꿀팁 보기</button>
        ) : (
          <div style={{ background: '#fff9c4', padding: '15px', borderRadius: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 12, marginBottom: 10 }}>입금하면 실력이 오른다는 소문이...☕️</div>
            <button onClick={handleCopy} style={{ width: '100%', padding: '10px', background: '#FFF', border: '2px solid #fbc02d', borderRadius: 8, fontSize: 12 }}>{copied ? '✅ 복사 완료!' : '🏦 카뱅 3333-06-8147746'}</button>
          </div>
        )}
        <button onClick={onRetry} style={{ width: '100%', padding: '15px', background: '#311b92', color: '#FFF', border: 'none', borderRadius: 12, fontWeight: '900', cursor: 'pointer' }}>GO TO HOME</button>
      </div>
    </div>
  );
}

function InitialsInput({ score, onSubmit, isSubmitting }) {
  const [initials, setInitials] = useState('');
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', zIndex: 2000 }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '4px solid #311b92', width: '85%', maxWidth: 300 }}>
        <div style={{ fontFamily: '"Press Start 2P"', fontSize: 16, color: '#311b92', marginBottom: 15 }}>NEW RECORD!</div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>전역 랭커에 등극하셨습니다!<br/>이니셜을 입력해주세요.</div>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '15px', marginBottom: 20, fontSize: 24, fontWeight: 'bold' }}>{score} pt</div>
        <input 
          autoFocus
          maxLength={3}
          value={initials}
          onChange={e => setInitials(e.target.value.toUpperCase())}
          placeholder="AAA"
          style={{ width: '100%', textAlign: 'center', fontSize: 32, padding: '10px', border: '3px solid #eee', borderRadius: 12, marginBottom: 20, textTransform: 'uppercase', outline: 'none', borderBottomColor: '#311b92' }}
        />
        <button 
          disabled={initials.length < 2 || isSubmitting}
          onClick={() => onSubmit(initials)}
          style={{ width: '100%', padding: '15px', background: initials.length < 2 ? '#ccc' : '#311b92', color: '#FFF', border: 'none', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}
        >
          {isSubmitting ? 'SAVING...' : 'REGISTER'}
        </button>
      </div>
    </div>
  );
}

export default Dodge;
