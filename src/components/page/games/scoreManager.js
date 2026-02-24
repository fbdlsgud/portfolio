/**
 * scoreManager.js
 * 게임 점수를 localStorage에 저장하고 관리하는 유틸리티
 */

const STORAGE_KEY = 'elizabeth-game-records';
const BEST_SCORE_KEY = 'elizabeth-best';
const MAX_RECORDS = 20;

/**
 * 게임 점수 기록 저장
 */
export function saveGameRecord(score) {
  try {
    const records = getGameRecords();
    const now = new Date();
    
    const newRecord = {
      score,
      timestamp: now.getTime(),
      date: now.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '-').slice(0, 10),
      time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    records.unshift(newRecord);
    
    if (records.length > MAX_RECORDS) {
      records.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    const bestScore = getBestScore();
    if (score > bestScore) {
      localStorage.setItem(BEST_SCORE_KEY, String(score));
    }
  } catch (e) {
    console.error('Failed to save game record:', e);
  }
}

/**
 * 모든 게임 기록 조회
 */
export function getGameRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load game records:', e);
    return [];
  }
}

/**
 * 최고 점수 조회
 */
export function getBestScore() {
  try {
    const score = localStorage.getItem(BEST_SCORE_KEY);
    return score ? parseInt(score, 10) : 0;
  } catch (e) {
    console.error('Failed to load best score:', e);
    return 0;
  }
}

/**
 * 최근 N개 기록 조회
 */
export function getRecentRecords(count = 5) {
  return getGameRecords().slice(0, count);
}

/**
 * 평균 점수 계산
 */
export function getAverageScore() {
  const records = getGameRecords();
  if (records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.score, 0);
  return Math.round(sum / records.length);
}

/**
 * 총 플레이 횟수
 */
export function getTotalGames() {
  return getGameRecords().length;
}

/**
 * 통계 조회
 */
export function getGameStats() {
  const best = getBestScore();
  const avg = getAverageScore();
  const total = getTotalGames();
  const recent = getRecentRecords(5);

  return { best, avg, total, recent };
}

/**
 * 모든 기록 삭제 (초기화)
 */
export function clearAllRecords() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BEST_SCORE_KEY);
  } catch (e) {
    console.error('Failed to clear records:', e);
  }
}
