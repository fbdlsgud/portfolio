import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ObstacleRace.module.css';

const MAX_PLAYERS = 7;
const RUNNER_WIDTH = 72;
const FINISH_AT = 100;
const OBSTACLES = [
  { id: 'brick-1', position: 14, type: 'block' },
  { id: 'pipe-1', position: 27, type: 'pipe' },
  { id: 'brick-2', position: 39, type: 'block' },
  { id: 'spike-1', position: 52, type: 'spike' },
  { id: 'pipe-2', position: 66, type: 'pipe' },
  { id: 'brick-3', position: 79, type: 'block' },
  { id: 'spike-2', position: 90, type: 'spike' },
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
    progress: 0,
    speed: 7.4 + Math.random() * 2.2 + index * 0.18,
    jumpChance: 0.66 + Math.random() * 0.2,
    obstacleIndex: 0,
    state: 'run',
    stunUntil: 0,
    jumpUntil: 0,
    jumpStart: 0,
    stunCount: 0,
    finishedAt: null,
    lastEvent: '출발 대기',
    jumpLift: 0,
  }));
}

function emptyRunners(entrants) {
  return entrants.map((entrant) => ({
    ...entrant,
    progress: 0,
    jumpChance: 0.75,
    state: 'idle',
    stunCount: 0,
    lastEvent: '출발 대기',
    jumpLift: 0,
    finishedAt: null,
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

export default function ObstacleRace() {
  const [playerCount, setPlayerCount] = useState(4);
  const [names, setNames] = useState(DEFAULT_NAMES);
  const [penaltyMode, setPenaltyMode] = useState('stuns');
  const [raceState, setRaceState] = useState('idle');
  const [runners, setRunners] = useState(() => emptyRunners(makeEntrants(4, DEFAULT_NAMES)));
  const [finishOrder, setFinishOrder] = useState([]);
  const [raceClock, setRaceClock] = useState(0);

  const entrants = useMemo(() => makeEntrants(playerCount, names), [playerCount, names]);
  const runnersRef = useRef(runners);
  const finishOrderRef = useRef([]);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const raceStartRef = useRef(0);

  useEffect(() => {
    if (raceState === 'idle') {
      const idleRunners = emptyRunners(entrants);
      runnersRef.current = idleRunners;
      setRunners(idleRunners);
      setFinishOrder([]);
      finishOrderRef.current = [];
      setRaceClock(0);
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
    lastFrameRef.current = 0;
    raceStartRef.current = 0;
    setRunners(idleRunners);
    setFinishOrder([]);
    setRaceClock(0);
    setRaceState('idle');
  }, [cancelLoop, entrants]);

  const startRace = useCallback(() => {
    cancelLoop();

    const now = performance.now();
    const nextRunners = makeInitialRunners(entrants);
    runnersRef.current = nextRunners;
    finishOrderRef.current = [];
    lastFrameRef.current = now;
    raceStartRef.current = now;
    setRunners(nextRunners);
    setFinishOrder([]);
    setRaceClock(0);
    setRaceState('racing');

    const tick = (timestamp) => {
      const deltaMs = Math.min(48, timestamp - lastFrameRef.current);
      const deltaSeconds = deltaMs / 1000;
      lastFrameRef.current = timestamp;

      const next = runnersRef.current.map((runner) => {
        if (runner.finishedAt) {
          return { ...runner, state: 'finish', progress: FINISH_AT, jumpLift: 0 };
        }

        let progress = runner.progress;
        let state = runner.state;
        let stunUntil = runner.stunUntil;
        let jumpUntil = runner.jumpUntil;
        let jumpStart = runner.jumpStart;
        let stunCount = runner.stunCount;
        let obstacleIndex = runner.obstacleIndex;
        let lastEvent = runner.lastEvent;
        let jumpLift = 0;

        if (timestamp < stunUntil) {
          state = 'stun';
          progress += runner.speed * 0.12 * deltaSeconds;
        } else {
          const jumping = timestamp < jumpUntil;
          state = jumping ? 'jump' : 'run';

          if (jumping) {
            const jumpRatio = Math.min(1, Math.max(0, (timestamp - jumpStart) / Math.max(1, jumpUntil - jumpStart)));
            jumpLift = Math.sin(jumpRatio * Math.PI) * 34;
          }

          progress += runner.speed * (jumping ? 1.08 : 1) * deltaSeconds;

          const obstacle = OBSTACLES[obstacleIndex];
          if (obstacle && progress >= obstacle.position - 1.3) {
            const success = Math.random() < runner.jumpChance;
            if (success) {
              state = 'jump';
              jumpStart = timestamp;
              jumpUntil = timestamp + 620;
              lastEvent = `${Math.round(obstacle.position)}% 점프 성공`;
              progress += 0.65;
            } else {
              state = 'stun';
              stunUntil = timestamp + 820 + Math.random() * 520;
              stunCount += 1;
              lastEvent = `${Math.round(obstacle.position)}% 장애물 충돌`;
              progress = Math.max(0, progress - 0.9);
            }
            obstacleIndex += 1;
          }
        }

        let finishedAt = runner.finishedAt;
        if (progress >= FINISH_AT) {
          progress = FINISH_AT;
          state = 'finish';
          lastEvent = '골인';
          finishedAt = timestamp;
          if (!finishOrderRef.current.includes(runner.id)) {
            finishOrderRef.current = [...finishOrderRef.current, runner.id];
          }
        }

        return {
          ...runner,
          progress,
          state,
          stunUntil,
          jumpUntil,
          jumpStart,
          stunCount,
          obstacleIndex,
          lastEvent,
          jumpLift,
          finishedAt,
        };
      });

      runnersRef.current = next;
      setRunners(next);
      setFinishOrder([...finishOrderRef.current]);
      setRaceClock((timestamp - raceStartRef.current) / 1000);

      if (finishOrderRef.current.length >= next.length) {
        setRaceState('finished');
        rafRef.current = 0;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [cancelLoop, entrants]);

  const sortedRunners = useMemo(() => {
    return [...runners].sort((a, b) => b.progress - a.progress);
  }, [runners]);

  const caughtRunner = raceState === 'finished' ? getCaughtRunner(penaltyMode, finishOrder, runners) : null;
  const leader = sortedRunners[0];
  const isLocked = raceState === 'racing';

  return (
    <main className={styles.page}>
      <div className={styles.clouds} aria-hidden="true" />
      <section className={styles.shell} aria-label="점프 장애물 내기 레이스">
        <div className={styles.topBar}>
          <Link to="/games" className={styles.backLink}>게임 목록</Link>
          <div className={styles.titleBlock}>
            <span>PARTY RUNNER</span>
            <h1>점프 장애물 레이스</h1>
          </div>
          <button type="button" className={styles.resetButton} onClick={resetRace} disabled={isLocked}>
            리셋
          </button>
        </div>

        <div className={styles.setupPanel} aria-label="레이스 설정">
          <div className={styles.controlGroup}>
            <span className={styles.label}>참가 인원</span>
            <div className={styles.countGrid} role="group" aria-label="참가 인원 선택">
              {Array.from({ length: MAX_PLAYERS }, (_, index) => index + 1).map((count) => (
                <button
                  key={count}
                  type="button"
                  className={count === playerCount ? styles.countActive : styles.countButton}
                  onClick={() => setPlayerCount(count)}
                  disabled={isLocked}
                  aria-pressed={count === playerCount}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.label}>벌칙 조건</span>
            <div className={styles.modeGrid} role="group" aria-label="벌칙 조건 선택">
              {[
                ['stuns', '스턴 최다'],
                ['first', '1등'],
                ['last', '꼴등'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={penaltyMode === value ? styles.modeActive : styles.modeButton}
                  onClick={() => setPenaltyMode(value)}
                  disabled={isLocked}
                  aria-pressed={penaltyMode === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className={styles.startButton} onClick={startRace} disabled={isLocked}>
            {raceState === 'racing' ? '레이스 중' : raceState === 'finished' ? '다시 달리기' : '출발'}
          </button>
        </div>

        <div className={styles.nameGrid} aria-label="참가자 이름">
          {entrants.map((entrant, index) => (
            <label key={entrant.id} className={styles.nameSlot} style={{ '--runner-color': entrant.color }}>
              <span>{entrant.lane}P</span>
              <input
                value={names[index]}
                maxLength={8}
                onChange={(event) => updateName(index, event.target.value)}
                disabled={isLocked}
                aria-label={`${entrant.lane}번 참가자 이름`}
              />
            </label>
          ))}
        </div>

        <section className={styles.scoreboard} aria-live="polite">
          <div>
            <span>TIME</span>
            <strong>{formatTime(raceClock)}</strong>
          </div>
          <div>
            <span>LEADER</span>
            <strong style={leader ? { color: leader.color } : undefined}>{leader?.name || '대기'}</strong>
          </div>
          <div>
            <span>RULE</span>
            <strong>{penaltyMode === 'stuns' ? '스턴 최다' : penaltyMode === 'first' ? '1등' : '꼴등'}</strong>
          </div>
        </section>

        <section className={`${styles.stage} ${raceState === 'racing' ? styles.stageRunning : ''}`} aria-label="횡스크롤 레이스 맵">
          <div className={styles.stageBackdrop} aria-hidden="true">
            <span className={styles.hillOne} />
            <span className={styles.hillTwo} />
            <span className={styles.castle} />
          </div>

          <div className={styles.courseHud}>
            <span>START</span>
            <span>OBSTACLE ZONE</span>
            <span>GOAL</span>
          </div>

          <div className={styles.lanes}>
            {runners.map((runner) => {
              const rank = finishOrder.indexOf(runner.id) + 1;
              const runnerOffset = (runner.progress / 100) * RUNNER_WIDTH;
              const runnerX = `calc(${runner.progress}% - ${runnerOffset}px)`;
              const isLeader = raceState === 'racing' && leader?.id === runner.id;
              const isCaught = caughtRunner?.id === runner.id;

              return (
                <div
                  key={runner.id}
                  className={[
                    styles.lane,
                    isLeader ? styles.leaderLane : '',
                    isCaught ? styles.caughtLane : '',
                  ].filter(Boolean).join(' ')}
                  style={{ '--runner-color': runner.color, '--runner-cap': runner.cap }}
                >
                  <div className={styles.laneLabel}>
                    <strong>{runner.name}</strong>
                    <span>{rank ? `${rank}위` : `${Math.round(runner.progress)}%`}</span>
                  </div>

                  <div className={styles.track}>
                    <div className={styles.progressLine} style={{ width: `${runner.progress}%` }} />
                    {OBSTACLES.map((obstacle) => (
                      <span
                        key={obstacle.id}
                        className={`${styles.obstacle} ${styles[obstacle.type]}`}
                        style={{ left: `${obstacle.position}%` }}
                        aria-hidden="true"
                      />
                    ))}
                    <span className={styles.finishFlag} aria-hidden="true" />
                    <div
                      className={[
                        styles.runner,
                        styles[`runner-${runner.state}`],
                      ].join(' ')}
                      style={{
                        '--runner-x': runnerX,
                        '--runner-y': `-${runner.jumpLift}px`,
                      }}
                    >
                      <span className={styles.runnerBody}>
                        <span className={styles.runnerFace} />
                      </span>
                      <span className={styles.runnerFeet} />
                      {runner.state === 'stun' && <span className={styles.stunStars} aria-hidden="true">STUN</span>}
                    </div>
                  </div>

                  <div className={styles.laneStats}>
                    <span>스턴 {runner.stunCount}</span>
                    <small>{runner.lastEvent}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {raceState === 'finished' && caughtRunner && (
          <section className={styles.resultPanel} aria-live="assertive">
            <div>
              <span className={styles.resultKicker}>걸린 사람</span>
              <h2 style={{ color: caughtRunner.color }}>{caughtRunner.name}</h2>
              <p>
                {penaltyMode === 'stuns'
                  ? `스턴 ${caughtRunner.stunCount}회로 가장 많이 막혔습니다.`
                  : penaltyMode === 'first'
                    ? '가장 먼저 도착했습니다.'
                    : '가장 늦게 도착했습니다.'}
              </p>
            </div>
            <ol className={styles.rankList}>
              {finishOrder.map((id, index) => {
                const runner = runners.find((item) => item.id === id);
                return runner ? (
                  <li key={id}>
                    <span>{index + 1}위</span>
                    <strong style={{ color: runner.color }}>{runner.name}</strong>
                    <small>스턴 {runner.stunCount}</small>
                  </li>
                ) : null;
              })}
            </ol>
            <button type="button" className={styles.startButton} onClick={startRace}>
              한 판 더
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
