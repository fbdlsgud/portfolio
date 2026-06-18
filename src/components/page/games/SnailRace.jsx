import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SnailRace.module.css';

const MAX_RACERS = 7;

const SNAILS = [
  { id: 'red', label: '1번', color: '#ef4444', accent: '#fee2e2' },
  { id: 'blue', label: '2번', color: '#3b82f6', accent: '#dbeafe' },
  { id: 'green', label: '3번', color: '#22c55e', accent: '#dcfce7' },
  { id: 'yellow', label: '4번', color: '#eab308', accent: '#fef3c7' },
  { id: 'purple', label: '5번', color: '#a855f7', accent: '#f3e8ff' },
  { id: 'pink', label: '6번', color: '#ec4899', accent: '#fce7f3' },
  { id: 'teal', label: '7번', color: '#14b8a6', accent: '#ccfbf1' },
];

const DEFAULT_NAMES = ['네모', '민트', '두부', '치즈', '보라', '분홍', '터보'];
const DISTANCE_MARKS = [0, 25, 50, 75, 100];
const FINISH_OFFSET_PX = 104;

const makeEmptyProgress = (racers) =>
  racers.reduce((acc, racer) => {
    acc[racer.id] = 0;
    return acc;
  }, {});

function createEntrants(count, names) {
  return SNAILS.slice(0, count).map((snail, index) => ({
    ...snail,
    lane: index + 1,
    name: names[index]?.trim() || snail.label,
  }));
}

function getOrdinal(order, id) {
  const index = order.indexOf(id);
  return index >= 0 ? index + 1 : null;
}

function getRaceLead(sortedRacers, racerId) {
  if (!sortedRacers.length) return false;
  return sortedRacers[0].id === racerId;
}

export default function SnailRace() {
  const [playerCount, setPlayerCount] = useState(3);
  const [penaltyMode, setPenaltyMode] = useState('first');
  const [names, setNames] = useState(DEFAULT_NAMES);
  const [raceState, setRaceState] = useState('idle');
  const [visualProgress, setVisualProgress] = useState({});
  const [finishOrder, setFinishOrder] = useState([]);
  const [raceClock, setRaceClock] = useState(0);

  const entrants = useMemo(() => createEntrants(playerCount, names), [playerCount, names]);
  const runnersRef = useRef([]);
  const finishOrderRef = useRef([]);
  const visualProgressRef = useRef({});
  const animationRef = useRef(0);
  const lastFrameRef = useRef(0);
  const raceStartRef = useRef(0);

  const cancelRaceLoop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
  }, []);

  const resetRace = useCallback(() => {
    cancelRaceLoop();
    finishOrderRef.current = [];
    runnersRef.current = [];
    lastFrameRef.current = 0;
    raceStartRef.current = 0;
    visualProgressRef.current = {};
    setFinishOrder([]);
    setVisualProgress(makeEmptyProgress(entrants));
    setRaceClock(0);
    setRaceState('idle');
  }, [cancelRaceLoop, entrants]);

  useEffect(() => {
    setVisualProgress(makeEmptyProgress(entrants));
    setFinishOrder([]);
    finishOrderRef.current = [];
    visualProgressRef.current = {};
  }, [entrants]);

  useEffect(() => () => cancelRaceLoop(), [cancelRaceLoop]);

  const updateName = (index, value) => {
    setNames((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const startRace = useCallback(() => {
    cancelRaceLoop();

    const now = performance.now();
    finishOrderRef.current = [];
    visualProgressRef.current = makeEmptyProgress(entrants);
    lastFrameRef.current = now;
    raceStartRef.current = now;
    runnersRef.current = entrants.map((entrant, index) => ({
      ...entrant,
      progress: 0,
      finished: false,
      baseSpeed: 0.075 + Math.random() * 0.035 + index * 0.003,
      boost: 0,
      phase: Math.random() * Math.PI * 2,
      nextBurstAt: now + 420 + Math.random() * 1200,
      slowUntil: 0,
    }));

    setVisualProgress(makeEmptyProgress(entrants));
    setRaceClock(0);
    setFinishOrder([]);
    setRaceState('racing');

    const tick = (timestamp) => {
      const runners = runnersRef.current;
      const delta = Math.min(42, timestamp - lastFrameRef.current);
      const frameScale = Math.max(0.55, delta / 16.67);
      const nextVisualProgress = {};

      lastFrameRef.current = timestamp;
      setRaceClock((timestamp - raceStartRef.current) / 1000);

      runners.forEach((runner) => {
        if (!runner.finished) {
          if (timestamp >= runner.nextBurstAt) {
            runner.boost = 0.024 + Math.random() * 0.09;
            runner.nextBurstAt = timestamp + 520 + Math.random() * 1500;

            if (Math.random() < 0.22) {
              runner.slowUntil = timestamp + 260 + Math.random() * 760;
            }
          }

          runner.boost *= Math.pow(0.955, frameScale);

          const fatigue = timestamp < runner.slowUntil ? 0.46 : 1;
          const wobble = Math.sin(timestamp / 260 + runner.phase) * 0.012;
          const luck = (Math.random() - 0.47) * 0.012;
          const step = Math.max(0.024, runner.baseSpeed + runner.boost + wobble + luck);

          runner.progress += step * fatigue * frameScale;

          if (runner.progress >= 100) {
            runner.progress = 100;
            runner.finished = true;
            finishOrderRef.current = [...finishOrderRef.current, runner.id];
          }
        }

        const currentVisual = visualProgressRef.current[runner.id] || 0;
        const smoothing = Math.min(0.22, 0.095 * frameScale);
        const nextVisual =
          runner.progress >= 100 && currentVisual > 99.3
            ? 100
            : currentVisual + (runner.progress - currentVisual) * smoothing;
        nextVisualProgress[runner.id] = Math.min(100, nextVisual);
      });

      visualProgressRef.current = nextVisualProgress;
      setVisualProgress(nextVisualProgress);
      setFinishOrder([...finishOrderRef.current]);

      const allTargetFinished = finishOrderRef.current.length >= runners.length;
      const allVisuallyFinished =
        allTargetFinished && runners.every((runner) => nextVisualProgress[runner.id] >= 99.8);

      if (allVisuallyFinished) {
        const finalProgress = runners.reduce((acc, runner) => {
          acc[runner.id] = 100;
          return acc;
        }, {});
        visualProgressRef.current = finalProgress;
        setVisualProgress(finalProgress);
        setRaceState('finished');
        animationRef.current = 0;
        return;
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
  }, [cancelRaceLoop, entrants]);

  const sortedByProgress = useMemo(() => {
    return [...entrants].sort((a, b) => (visualProgress[b.id] || 0) - (visualProgress[a.id] || 0));
  }, [entrants, visualProgress]);

  const firstFinisher = finishOrder[0] ? entrants.find((entrant) => entrant.id === finishOrder[0]) : null;
  const lastFinisher =
    finishOrder.length === entrants.length
      ? entrants.find((entrant) => entrant.id === finishOrder[finishOrder.length - 1])
      : null;
  const caughtRunner = penaltyMode === 'first' ? firstFinisher : lastFinisher;
  const isLocked = raceState === 'racing';
  const raceClockLabel = raceClock > 0 ? `${raceClock.toFixed(1)}s` : '0.0s';

  return (
    <main className={styles.scene}>
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.treeLine} aria-hidden="true" />

      <section className={styles.gameShell} aria-label="달팽이 내기 레이스">
        <div className={styles.topActions}>
          <Link to="/games" className={styles.backLink}>
            게임 목록
          </Link>
          <button type="button" className={styles.resetButton} onClick={resetRace} disabled={isLocked}>
            설정 초기화
          </button>
        </div>

        <header className={styles.signWrap}>
          <span className={`${styles.chain} ${styles.chainLeft}`} aria-hidden="true" />
          <span className={`${styles.chain} ${styles.chainRight}`} aria-hidden="true" />
          <div className={styles.sign}>
            <span className={styles.signKicker}>BETTING RACE</span>
            <h1>달팽이 내기 레이스</h1>
            <p>{raceState === 'racing' ? '느려도 방심 금지. 마지막 코너에서 뒤집힙니다.' : '친구 이름을 넣고 걸릴 조건을 정한 뒤 출발하세요.'}</p>
          </div>
        </header>

        <div className={styles.controlDeck} aria-label="레이스 설정">
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>인원</span>
            <div className={styles.segmented} role="group" aria-label="참가 인원 선택">
              {Array.from({ length: MAX_RACERS }, (_, index) => index + 1).map((count) => (
                <button
                  type="button"
                  key={count}
                  className={count === playerCount ? styles.segmentActive : styles.segment}
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
            <span className={styles.controlLabel}>걸릴 조건</span>
            <div className={styles.modeSwitch} role="group" aria-label="벌칙 조건 선택">
              <button
                type="button"
                className={penaltyMode === 'first' ? styles.modeActive : styles.modeButton}
                onClick={() => setPenaltyMode('first')}
                disabled={isLocked}
                aria-pressed={penaltyMode === 'first'}
              >
                가장 먼저 도착
              </button>
              <button
                type="button"
                className={penaltyMode === 'last' ? styles.modeActive : styles.modeButton}
                onClick={() => setPenaltyMode('last')}
                disabled={isLocked}
                aria-pressed={penaltyMode === 'last'}
              >
                가장 늦게 도착
              </button>
            </div>
          </div>

          <button type="button" className={styles.startButton} onClick={startRace} disabled={isLocked}>
            {raceState === 'racing' ? '경주 중' : raceState === 'finished' ? '다시 출발' : '출발'}
          </button>
        </div>

        <div className={`${styles.statusBoard} ${raceState === 'racing' ? styles.statusBoardRacing : ''}`} aria-live="polite">
          <div className={styles.rankSlots}>
            {[0, 1, 2].map((slot) => {
              const runner = finishOrder[slot] ? entrants.find((entrant) => entrant.id === finishOrder[slot]) : null;
              return (
                <div key={slot} className={styles.rankSlot}>
                  <span>{slot + 1}위</span>
                  <strong style={runner ? { color: runner.color } : undefined}>{runner ? runner.name : '?'}</strong>
                </div>
              );
            })}
          </div>
          <div className={styles.liveCallout}>
            {raceState === 'finished' && caughtRunner ? (
              <>
                <span>걸린 사람</span>
                <strong style={{ color: caughtRunner.color }}>{caughtRunner.name}</strong>
                <small>{penaltyMode === 'first' ? '제일 먼저 들어왔습니다.' : '제일 늦게 들어왔습니다.'}</small>
              </>
            ) : raceState === 'racing' ? (
              <>
                <span>현재 선두</span>
                <strong style={{ color: sortedByProgress[0]?.color }}>{sortedByProgress[0]?.name}</strong>
                <small>{penaltyMode === 'last' ? '꼴등 판정은 모두 들어온 뒤 확정됩니다.' : '1등이 들어오면 바로 후보가 보입니다.'}</small>
              </>
            ) : (
              <>
                <span>대기 중</span>
                <strong>{penaltyMode === 'first' ? '1등 벌칙' : '꼴등 벌칙'}</strong>
                <small>달팽이는 매번 랜덤 속도로 달립니다.</small>
              </>
            )}
          </div>
        </div>

        <div className={`${styles.raceTrack} ${raceState === 'racing' ? styles.raceTrackRunning : ''}`} aria-label="달팽이 경주 트랙">
          <div className={styles.raceInfoStrip} aria-label="레이스 현황">
            <span>TIME {raceClockLabel}</span>
            <strong>{raceState === 'idle' ? '출발 대기' : `${sortedByProgress[0]?.name} 선두`}</strong>
            <span>{penaltyMode === 'first' ? '1등 벌칙' : '꼴등 벌칙'}</span>
          </div>

          {entrants.map((entrant, index) => {
            const rank = getOrdinal(finishOrder, entrant.id);
            const isCaught = raceState === 'finished' && caughtRunner?.id === entrant.id;
            const laneVisualProgress = Math.min(100, Math.max(0, visualProgress[entrant.id] || 0));
            const runnerOffset = (laneVisualProgress / 100) * FINISH_OFFSET_PX;
            const runnerX = `calc(${laneVisualProgress}% - ${runnerOffset}px)`;
            const isLeader = raceState === 'racing' && getRaceLead(sortedByProgress, entrant.id);
            const hasFinished = Boolean(rank);

            return (
              <div
                key={entrant.id}
                className={[
                  styles.lane,
                  isCaught ? styles.caughtLane : '',
                  isLeader ? styles.leaderLane : '',
                  hasFinished ? styles.finishedLane : '',
                ].filter(Boolean).join(' ')}
              >
                <div className={styles.laneMeta}>
                  <span className={styles.laneNumber}>{entrant.lane}</span>
                  <input
                    aria-label={`${entrant.lane}번 달팽이 이름`}
                    value={names[index]}
                    maxLength={8}
                    onChange={(event) => updateName(index, event.target.value)}
                    disabled={isLocked}
                    className={styles.nameInput}
                    style={{ borderColor: entrant.color }}
                  />
                </div>

                <div className={styles.trackViewport}>
                  <span className={styles.startDust} aria-hidden="true" />
                  <span className={styles.finishGate} aria-hidden="true">GOAL</span>
                  {DISTANCE_MARKS.map((mark) => (
                    <span
                      key={mark}
                      className={styles.distanceMark}
                      style={{ left: `${mark}%` }}
                      aria-hidden="true"
                    >
                      {mark === 100 ? 'FIN' : ''}
                    </span>
                  ))}

                  <div
                    className={styles.trackLine}
                    style={{
                      '--lane-progress': `${laneVisualProgress}%`,
                      '--runner-x': runnerX,
                    }}
                  >
                    <span className={styles.progressWake} aria-hidden="true" />
                    <span className={styles.slimeTrail} aria-hidden="true" />
                    <div
                      className={[
                        styles.snailRunner,
                        raceState === 'racing' ? styles.snailMoving : '',
                        hasFinished ? styles.snailFinished : '',
                      ].filter(Boolean).join(' ')}
                      style={{ '--runner-color': entrant.color }}
                    >
                      <SnailSprite color={entrant.color} accent={entrant.accent} label={entrant.label} moving={raceState === 'racing'} />
                    </div>
                    <span className={styles.finishFlag} aria-hidden="true" />
                  </div>
                </div>

                <div className={styles.laneResult} style={rank ? { borderColor: entrant.color, color: entrant.color } : undefined}>
                  {rank ? `${rank}위` : raceState === 'racing' ? `${Math.round(laneVisualProgress)}%` : '대기'}
                </div>
              </div>
            );
          })}
        </div>

        {raceState === 'finished' && caughtRunner && (
          <section className={styles.resultPanel} aria-live="assertive">
            <span className={styles.resultEyebrow}>{penaltyMode === 'first' ? '가장 먼저 도착' : '가장 늦게 도착'}</span>
            <h2 style={{ color: caughtRunner.color }}>{caughtRunner.name}</h2>
            <p>{caughtRunner.name} 님이 이번 판에 걸렸습니다. 결과가 마음에 안 들면 다시 달리면 됩니다.</p>
            <div className={styles.resultActions}>
              <button type="button" className={styles.startButton} onClick={startRace}>
                다시 달리기
              </button>
              <button type="button" className={styles.secondaryButton} onClick={resetRace}>
                설정으로 돌아가기
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function SnailSprite({ color, accent, label, moving }) {
  return (
    <div className={`${styles.snail} ${moving ? styles.snailPulse : ''}`} aria-hidden="true">
      <span className={styles.snailBody} style={{ backgroundColor: accent }} />
      <span className={styles.snailHead} style={{ backgroundColor: accent }} />
      <span className={styles.shell} style={{ backgroundColor: color }}>
        <span>{label}</span>
      </span>
      <span className={`${styles.eye} ${styles.eyeLeft}`} />
      <span className={`${styles.eye} ${styles.eyeRight}`} />
    </div>
  );
}
