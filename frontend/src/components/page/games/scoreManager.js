import axios from '../../../axios/axiosInstance';

const JUMP_BEST_KEY = 'duck-jump-best';
const DODGE_BEST_KEY = 'duck-dodge-best';

const getBestKey = (gameType) => gameType === 'dodge' ? DODGE_BEST_KEY : JUMP_BEST_KEY;

/**
 * 서버 리더보드 조회 (Top 10)
 */
export async function getLeaderboard(gameType = 'jump') {
  try {
    const response = await axios.get(`/leaderboard?gameType=${gameType}`);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch ${gameType} leaderboard:`, e);
    return [];
  }
}

/**
 * 서버에 점수 등록
 */
export async function saveLeaderboardRecord(initials, score, gameType = 'jump') {
  try {
    const response = await axios.post('/leaderboard', {
      initials: initials.toUpperCase().slice(0, 3),
      score,
      gameType
    });
    
    // 로컬 최고 점수 업데이트
    const currentBest = getBestScore(gameType);
    if (score > currentBest) {
      localStorage.setItem(getBestKey(gameType), String(score));
    }
    
    return response.data;
  } catch (e) {
    console.error(`Failed to save ${gameType} leaderboard record:`, e);
    throw e;
  }
}

/**
 * 로컬 최고 점수 조회
 */
export function getBestScore(gameType = 'jump') {
  try {
    const score = localStorage.getItem(getBestKey(gameType));
    return score ? parseInt(score, 10) : 0;
  } catch (e) {
    console.error(`Failed to load ${gameType} best score:`, e);
    return 0;
  }
}

/**
 * 모든 기록 삭제 (초기화) - 로컬 최고 기록만 삭제
 */
export function clearBestScore(gameType = 'jump') {
  try {
    localStorage.removeItem(getBestKey(gameType));
  } catch (e) {
    console.error(`Failed to clear ${gameType} best score:`, e);
  }
}
