import axios from '../../../axios/axiosInstance';

const BEST_SCORE_KEY = 'elizabeth-best';

/**
 * 서버 리더보드 조회 (Top 10)
 */
export async function getLeaderboard() {
  try {
    const response = await axios.get('/leaderboard');
    return response.data;
  } catch (e) {
    console.error('Failed to fetch leaderboard:', e);
    return [];
  }
}

/**
 * 서버에 점수 등록
 */
export async function saveLeaderboardRecord(initials, score) {
  try {
    const response = await axios.post('/leaderboard', {
      initials: initials.toUpperCase().slice(0, 3),
      score
    });
    
    // 로컬 최고 점수 업데이트
    const currentBest = getBestScore();
    if (score > currentBest) {
      localStorage.setItem(BEST_SCORE_KEY, String(score));
    }
    
    return response.data;
  } catch (e) {
    console.error('Failed to save leaderboard record:', e);
    throw e;
  }
}

/**
 * 로컬 최고 점수 조회
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
 * 모든 기록 삭제 (초기화) - 로컬 최고 기록만 삭제
 */
export function clearBestScore() {
  try {
    localStorage.removeItem(BEST_SCORE_KEY);
  } catch (e) {
    console.error('Failed to clear best score:', e);
  }
}
