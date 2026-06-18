import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ObstacleRace.module.css';

const MAX_PLAYERS = 7;
const COURSE_LENGTH = 2680;
const START_X = 72;
const FINISH_X = 2440;
const DEFAULT_STAGE_WIDTH = 980;
const LANE_START_Y = 112;
const LANE_GAP = 96;
const JUMP_DURATION = 760;
const JUMP_HEIGHT = 42;
const OBSTACLE_TRIGGER_DISTANCE = 96;

const OBSTACLES = [
  { id: 'brick-1', x: 360, type: 'block', label: '벽돌' },
  { id: 'pipe-1', x: 610, type: 'pipe', label: '파이프' },
  { id: 'gap-1', x: 850, type: 'gap', label: '구덩이' },
  { id: 'spike-1', x: 1120, type: 'spike', label: '가시' },
  { id: 'brick-2', x: 1390, type: 'block', label: '벽돌' },
  { id: 'pipe-2', x: 1665, type: 'pipe', label: '파이프' },
  { id: 'spike-2', x: 1970, type: 'spike', label: '가시' },
  { id: 'pipe-3', x: 2220, type: 'pipe', label: '파이프' },
];

const RUNNER_COLORS = [
  { color: '#ef4444', cap: '#fecaca' },
  { color: '#2563eb', cap: '#bfdbfe' },
  { color: '#16a34a', cap: '#bbf7d0' },
  { color: '#eab308', cap: '#fef08a' },
  { color: '#9333ea', cap: '#e9d5ff' },
  { color: '#db2777', cap: '#fbcfe8' },
  { color: '#0891b2', cap: '#a5f3fc' },
];

const DEFAULT_NAMES = ['레드', '블루', '그린', '옐로', '퍼플', '핑크', '민트'];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getLaneY(index) {
  return LANE_START_Y + index * LANE_GAP;
}

function makeEntrants(count, names) {
  return Array.from({ length: count }, (_, index) => ({
    id: `runner-${index + 1}`,
    lane: index + 1,
    name: names[index]?.trim() || DEFAULT_NAMES[index],
    ...RUNNER_COLORS[index],
  }));
}

function makeInitialRunners(entrants) {
  return entrants.map((entrant, index) => ({
    ...entrant,
    x: START_X - index * 7,
    speed: 182 + Math.random() * 42 + index * 4,
    jumpChance: 0.64 + Math.random() * 0.22,
    obstacleIndex: 0,
    state: 'run',
    stunUntil: 0,
    jumpUntil: 0,
    jumpStart: 0,
    stunCount: 0,
    finishedAt: null,
    lastEvent: '출발',
    jumpLift: 0,
    impactUntil: 0,
  }));
}

function emptyRunners(entrants) {
  return entrants.map((entrant, index) => ({
    ...entrant,
    x: START_X - index * 7,
    jumpChance: 0.75,
    obstacleIndex: 0,
    state: 'idle',
    stunUntil: 0,
    jumpUntil: 0,
    jumpStart: 0,
    stunCount: 0,
    finishedAt: null,
    lastEvent: '출발 대기',
    jumpLift: 0,
    impactUntil: 0,
  }));
}

function getCaughtRunner(mode, finishOrder, runners) {
  if (!runners.length) return null;
  if (mode === 'first') {
    return finishOrder[0] ? runners.find((runner) => runner.id === finishOrder[0]) : null;
  }
  if (mode === 'last') {
    const lastId = finishOrder[finishOrder.length - 1];
    return lastId ? runners.find((runner) => runner.id === lastId) : null;
  }

  return [...runners].sort((a, b) => {
    if (b.stunCount !== a.stunCount) return b.stunCount - a.stunCount;
    const aOrder = finishOrder.indexOf(a.id);
    const bOrder = finishOrder.indexOf(b.id);
    return bOrder - aOrder;
  })[0];
}

function formatTime(seconds) {
  return seconds > 0 ? `${seconds.toFixed(1)}s` : '0.0s';
}

function getProgress(runner) {
  return clamp((runner.x / FINISH_X) * 100, 0, 100);
}

export default function ObstacleRace() {
  const [playerCount, setPlayerCount] = useState(4);
  const [names, setNames] = useState(DEFAULT_NAMES);
  const [penaltyMode, setPenaltyMode] = useState('stuns');
  const [raceState, setRaceState] = useState('idle');
  const [runners, setRunners] = useState(() => emptyRunners(makeEntrants(4, DEFAULT_NAMES)));
  const [finishOrder, setFinishOrder] = useState([]);
  const [raceClock, setRaceClock] = useState(0);
  const [stageWidth, setStageWidth] = useState(DEFAULT_STAGE_WIDTH);
  const [cameraX, setCameraX] = useState(0);

  const entrants = useMemo(() => makeEntrants(playerCount, names), [playerCount, names]);
  const runnersRef = useRef(runners);
  const finishOrderRef = useRef([]);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const raceStartRef = useRef(0);
  const cameraRef = useRef(0);
  const stageRef = useRef(null);

  useEffect(() => {
    const node = stageRef.current;
    const updateStageWidth = () => {
      setStageWidth(node?.clientWidth || DEFAULT_STAGE_WIDTH);
    };

    updateStageWidth();

    if (!node) return undefined;

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateStageWidth);
      return () => window.removeEventListener('resize', updateStageWidth);
    }

    const observer = new ResizeObserver(updateStageWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (raceState === 'idle') {
      const idleRunners = emptyRunners(entrants);
      runnersRef.current = idleRunners;
      finishOrderRef.current = [];
      cameraRef.current = 0;
      setRunners(idleRunners);
      setFinishOrder([]);
      setRaceClock(0);
      setCameraX(0);
    }
  }, [entrants, raceState]);

  const cancelLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  useEffect(() => () => cancelLoop(), [cancelLoop]);

  const updateName = (index, value) => {
    setNames((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const resetRace = useCallback(() => {
    cancelLoop();
    const idleRunners = emptyRunners(entrants);
    runnersRef.current = idleRunners;
    finishOrderRef.current = [];
    cameraRef.current = 0;
    lastFrameRef.current = 0;
    raceStartRef.current = 0;
    setRunners(idleRunners);
    setFinishOrder([]);
    setRaceClock(0);
    setCameraX(0);
    setRaceState('idle');
  }, [cancelLoop, entrants]);

  const startRace = useCallback(() => {
    cancelLoop();

    const now = performance.now();
    const nextRunners = makeInitialRunners(entrants);
    runnersRef.current = nextRunners;
    finishOrderRef.current = [];
    cameraRef.current = 0;
    lastFrameRef.current = now;
    raceStartRef.current = now;
    setRunners(nextRunners);
    setFinishOrder([]);
    setRaceClock(0);
    setCameraX(0);
    setRaceState('racing');

    const tick = (timestamp) => {
      const deltaMs = Math.min(48, timestamp - lastFrameRef.current);
      const deltaSeconds = deltaMs / 1000;
      lastFrameRef.current = timestamp;

      const next = runnersRef.current.map((runner) => {
        if (runner.finishedAt) {
          return { ...runner, state: 'finish', x: FINISH_X, jumpLift: 0 };
        }

        let x = runner.x;
        let state = runner.state;
        let stunUntil = runner.stunUntil;
        let jumpUntil = runner.jumpUntil;
        let jumpStart = runner.jumpStart;
        let stunCount = runner.stunCount;
        let obstacleIndex = runner.obstacleIndex;
        let lastEvent = runner.lastEvent;
        let jumpLift = 0;
        let impactUntil = runner.impactUntil;

        if (timestamp < stunUntil) {
          state = 'stun';
          x += runner.speed * 0.12 * deltaSeconds;
        } else {
          const jumping = timestamp < jumpUntil;
          state = jumping ? 'jump' : 'run';

          if (jumping) {
            const jumpRatio = clamp((timestamp - jumpStart) / Math.max(1, jumpUntil - jumpStart), 0, 1);
            jumpLift = Math.sin(jumpRatio * Math.PI) * JUMP_HEIGHT;
            x += runner.speed * 1.08 * deltaSeconds;
          } else {
            x += runner.speed * deltaSeconds;
          }

          const obstacle = OBSTACLES[obstacleIndex];
          if (obstacle && x >= obstacle.x - OBSTACLE_TRIGGER_DISTANCE) {
            const success = Math.random() < runner.jumpChance;
            if (success) {
              state = 'jump';
              jumpStart = timestamp;
              jumpUntil = timestamp + JUMP_DURATION;
              lastEvent = `${obstacle.label} 점프`;
              x += 10;
            } else {
              state = 'stun';
              stunUntil = timestamp + 920 + Math.random() * 660;
              stunCount += 1;
              impactUntil = timestamp + 430;
              lastEvent = `${obstacle.label} 충돌`;
              x = Math.max(START_X, x - 24);
            }
            obstacleIndex += 1;
          }
        }

        let finishedAt = runner.finishedAt;
        if (x >= FINISH_X) {
          x = FINISH_X;
          state = 'finish';
          lastEvent = '골인';
          jumpLift = 0;
          finishedAt = timestamp;
          if (!finishOrderRef.current.includes(runner.id)) {
            finishOrderRef.current = [...finishOrderRef.current, runner.id];
          }
        }

        return {
          ...runner,
          x,
          state,
          stunUntil,
          jumpUntil,
          jumpStart,
          stunCount,
          obstacleIndex,
          lastEvent,
          jumpLift,
          impactUntil,
          finishedAt,
        };
      });

      const leaderX = Math.max(...next.map((runner) => runner.x));
      const maxCamera = Math.max(0, COURSE_LENGTH - stageWidth);
      const desiredCamera = clamp(leaderX - stageWidth * 0.42, 0, maxCamera);
      const easedCamera = cameraRef.current + (desiredCamera - cameraRef.current) * 0.18;
      cameraRef.current = Math.abs(easedCamera - desiredCamera) < 0.5 ? desiredCamera : easedCamera;

      runnersRef.current = next;
      setRunners(next);
      setFinishOrder([...finishOrderRef.current]);
      setRaceClock((timestamp - raceStartRef.current) / 1000);
      setCameraX(cameraRef.current);

      if (finishOrderRef.current.length >= next.length) {
        setRaceState('finished');
        rafRef.current = 0;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [cancelLoop, entrants, stageWidth]);

  const sortedRunners = useMemo(() => {
    return [...runners].sort((a, b) => {
      const aOrder = finishOrder.indexOf(a.id);
      const bOrder = finishOrder.indexOf(b.id);
      if (aOrder !== -1 || bOrder !== -1) {
        if (aOrder === -1) return 1;
        if (bOrder === -1) return -1;
        return aOrder - bOrder;
      }
      return b.x - a.x;
    });
  }, [finishOrder, runners]);

  const resultRunner = raceState === 'finished' ? getCaughtRunner(penaltyMode, finishOrder, runners) : null;
  const leader = sortedRunners[0];
  const worldHeight = LANE_START_Y + (entrants.length - 1) * LANE_GAP + 160;
  const leaderProgress = leader ? Math.round(getProgress(leader)) : 0;
  const leaderDistance = raceState === 'idle' || !leader ? 0 : Math.round(clamp(leader.x, 0, FINISH_X));
  const finishLabel = penaltyMode === 'first' ? '1등 걸림' : penaltyMode === 'last' ? '꼴찌 걸림' : '충돌왕 걸림';

  const obstacleClassMap = {
    block: styles.obstacleBlock,
    pipe: styles.obstaclePipe,
    gap: styles.obstacleGap,
    spike: styles.obstacleSpike,
  };

  const stateClassMap = {
    idle: styles.runnerIdle,
    run: styles.runnerRun,
    jump: styles.runnerJump,
    stun: styles.runnerStun,
    finish: styles.runnerFinish,
  };

  return (
    <div className={styles.page}>
      <div className={styles.clouds} aria-hidden="true" />
      <main className={styles.shell}>
        <div className={styles.topBar}>
          <Link className={styles.backLink} to="/games">
            게임 목록
          </Link>
          <section className={styles.titleBlock}>
            <span>PARTY BET</span>
            <h1>점프 장애물 레이스</h1>
          </section>
          <button className={styles.resetButton} type="button" onClick={resetRace} disabled={raceState === 'racing'}>
            리셋
          </button>
        </div>

        <section className={styles.setupPanel}>
          <div className={styles.controlGroup}>
            <span className={styles.label}>참가 인원</span>
            <div className={styles.countGrid}>
              {Array.from({ length: MAX_PLAYERS }, (_, index) => {
                const count = index + 1;
                return (
                  <button
                    key={count}
                    type="button"
                    className={count === playerCount ? styles.countActive : styles.countButton}
                    onClick={() => setPlayerCount(count)}
                    disabled={raceState === 'racing'}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.label}>걸리는 조건</span>
            <div className={styles.modeGrid}>
              {[
                ['stuns', '충돌왕'],
                ['first', '1등'],
                ['last', '꼴찌'],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  className={penaltyMode === mode ? styles.modeActive : styles.modeButton}
                  onClick={() => setPenaltyMode(mode)}
                  disabled={raceState === 'racing'}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button className={styles.startButton} type="button" onClick={startRace} disabled={raceState === 'racing'}>
            {raceState === 'racing' ? '레이스 중' : 'START'}
          </button>
        </section>

        <section className={styles.nameGrid} aria-label="참가자 이름">
          {entrants.map((entrant, index) => (
            <label key={entrant.id} className={styles.nameSlot} style={{ '--runner-color': entrant.color }}>
              <span>{entrant.lane}P</span>
              <input
                value={names[index]}
                maxLength={6}
                onChange={(event) => updateName(index, event.target.value)}
                disabled={raceState === 'racing'}
                aria-label={`${entrant.lane}번 참가자 이름`}
              />
            </label>
          ))}
        </section>

        <section className={styles.scoreboard} aria-live="polite">
          <div>
            <span>선두</span>
            <strong>{leader ? `${leader.name} ${leaderProgress}%` : '대기'}</strong>
          </div>
          <div>
            <span>기록</span>
            <strong>{formatTime(raceClock)}</strong>
          </div>
          <div>
            <span>조건</span>
            <strong>{finishLabel}</strong>
          </div>
        </section>

        <section className={styles.worldCard}>
          <div className={styles.viewportTop}>
            <span>{raceState === 'finished' ? 'FINISH' : raceState === 'racing' ? 'RUN' : 'READY'}</span>
            <div className={styles.stageMeter} aria-hidden="true">
              <i style={{ width: `${leaderProgress}%` }} />
            </div>
            <strong>{leaderDistance}m / {FINISH_X}m</strong>
          </div>

          <div
            ref={stageRef}
            className={styles.worldViewport}
            style={{ '--world-height': `${worldHeight}px` }}
            aria-label="장애물 레이스 트랙"
          >
            <div className={styles.stageVignette} aria-hidden="true" />
            <div className={styles.parallaxClouds} aria-hidden="true" />
            {raceState === 'idle' && <div className={styles.readyOverlay}>READY</div>}
            {raceState === 'finished' && resultRunner && (
              <div className={styles.finishOverlay} style={{ '--runner-color': resultRunner.color }}>
                <span>RESULT</span>
                <strong>{resultRunner.name}</strong>
              </div>
            )}
            <div
              className={styles.world}
              style={{
                width: `${COURSE_LENGTH}px`,
                height: `${worldHeight}px`,
                transform: `translate3d(${-cameraX}px, 0, 0)`,
              }}
            >
              <div className={styles.distantHills} aria-hidden="true" />
              <div className={styles.castle} style={{ transform: `translate3d(${FINISH_X + 92}px, 44px, 0)` }} aria-hidden="true" />
              <div className={styles.startGate} style={{ transform: `translate3d(${START_X - 30}px, ${LANE_START_Y - 70}px, 0)` }}>
                START
              </div>
              <div
                className={styles.finishGate}
                style={{
                  height: `${worldHeight - LANE_START_Y + 50}px`,
                  transform: `translate3d(${FINISH_X}px, ${LANE_START_Y - 78}px, 0)`,
                }}
              >
                GOAL
              </div>

              {entrants.map((entrant, index) => {
                const laneY = getLaneY(index);
                return (
                  <div
                    key={entrant.id}
                    className={styles.laneStrip}
                    style={{
                      width: `${COURSE_LENGTH}px`,
                      transform: `translate3d(0, ${laneY + 42}px, 0)`,
                    }}
                    aria-hidden="true"
                  />
                );
              })}

              {OBSTACLES.map((obstacle) => (
                <span
                  key={`${obstacle.id}-marker`}
                  className={styles.obstacleMarker}
                  style={{ transform: `translate3d(${obstacle.x + 12}px, ${LANE_START_Y - 46}px, 0)` }}
                  aria-hidden="true"
                >
                  !
                </span>
              ))}

              {entrants.flatMap((entrant, laneIndex) => {
                const laneY = getLaneY(laneIndex);
                return OBSTACLES.map((obstacle) => (
                  <span
                    key={`${entrant.id}-${obstacle.id}`}
                    className={[styles.obstacle, obstacleClassMap[obstacle.type]].join(' ')}
                    style={{
                      transform: `translate3d(${obstacle.x}px, ${laneY + 10}px, 0)`,
                    }}
                    aria-hidden="true"
                  >
                    <i />
                  </span>
                ));
              })}

              {runners.map((runner, index) => {
                const laneY = getLaneY(index);
                return (
                  <span
                    key={`${runner.id}-shadow`}
                    className={styles.runnerGroundShadow}
                    style={{
                      opacity: runner.state === 'jump' ? 0.28 : 0.54,
                      transform: `translate3d(${runner.x + 12}px, ${laneY + 47}px, 0) scaleX(${runner.state === 'jump' ? 0.72 : 1})`,
                    }}
                    aria-hidden="true"
                  />
                );
              })}

              {runners.map((runner, index) => {
                const laneY = getLaneY(index);
                const progress = getProgress(runner);
                const isImpact = runner.impactUntil > performance.now();
                return (
                  <div
                    key={runner.id}
                    className={[styles.runner, stateClassMap[runner.state]].filter(Boolean).join(' ')}
                    style={{
                      '--runner-color': runner.color,
                      '--runner-cap': runner.cap,
                      transform: `translate3d(${runner.x}px, ${laneY - runner.jumpLift}px, 0)`,
                    }}
                  >
                    <span className={styles.runnerName}>{runner.name}</span>
                    <span className={styles.runnerBubble}>
                      {runner.state === 'jump' ? 'JUMP!' : runner.state === 'stun' ? 'STUN!' : runner.state === 'finish' ? 'GOAL!' : runner.lastEvent}
                    </span>
                    {isImpact && <span className={styles.impactBurst} aria-hidden="true" />}
                    <span className={styles.runnerBody} aria-hidden="true">
                      <span className={styles.runnerCap} />
                      <span className={styles.runnerFace}>
                        <i />
                      </span>
                      <span className={styles.runnerPack}>{runner.lane}</span>
                      <span className={styles.footLeft} />
                      <span className={styles.footRight} />
                    </span>
                    <span className={styles.runnerMeter}>{Math.round(progress)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.livePanel}>
          <div className={styles.rankingPanel}>
            <span className={styles.panelTitle}>순위</span>
            {sortedRunners.map((runner, index) => (
              <div key={runner.id} className={styles.rankRow} style={{ '--runner-color': runner.color }}>
                <strong>{index + 1}</strong>
                <span>{runner.name}</span>
                <em>{runner.lastEvent}</em>
              </div>
            ))}
          </div>

          <div className={styles.statusGrid}>
            {runners.map((runner) => {
              const progress = getProgress(runner);
              return (
                <div key={runner.id} className={styles.statusCard} style={{ '--runner-color': runner.color }}>
                  <div className={styles.statusHead}>
                    <strong>{runner.name}</strong>
                    <span>{Math.round(runner.x)}m</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <div className={styles.statusMeta}>
                    <span>충돌 {runner.stunCount}</span>
                    <span>{runner.lastEvent}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {resultRunner && (
          <section className={styles.resultPanel} style={{ '--runner-color': resultRunner.color }}>
            <span>RESULT</span>
            <strong>{resultRunner.name}</strong>
            <p>
              {penaltyMode === 'stuns'
                ? `충돌 ${resultRunner.stunCount}회로 걸렸습니다.`
                : penaltyMode === 'first'
                  ? '가장 먼저 골인해서 걸렸습니다.'
                  : '가장 늦게 골인해서 걸렸습니다.'}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
