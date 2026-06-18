import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Games.module.css';

const GAMES = [
  {
    id: "duck-jump",
    title: "Duck Jump",
    description: "오리가 대나무 파이프 사이를 무사히 통과할 수 있게 도와주세요! 최고 점수에 도전해보세요.",
    tags: ["Arcade", "Canvas", "Gintama"],
    badge: "New",
    icon: "🎮",
    href: "/jump",
  },
  {
    id: "duck-dodge",
    title: "Duck Dodge",
    description: "우주 공간에서 쏟아지는 탄막을 피하세요! 오리의 생존 본능을 보여줄 때입니다 (Cosmic Edition).",
    tags: ["Arcade", "Dodging", "Cosmic"],
    badge: "New",
    icon: "🚀",
    href: "/dodge",
  },
];

const Games = () => {
  return (
    <div className={`${styles.gamesContainer} fade-in`}>
      <div className={styles.gamesContent}>
        {/* Intro Section */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <span>🕹️</span> Play Zone
          </h2>
          <p className={styles.sectionDesc}>
            React와 Canvas를 이용해 만든 미니 게임들입니다. 
            심심할 때 한 번씩 즐겨보세요!
          </p>

          <div className={styles.grid}>
            {GAMES.map((game) => (
              <Link key={game.id} to={game.href} className={styles.gameItem}>
                <div className={styles.gameHeader}>
                  <span className={styles.gameIcon}>{game.icon}</span>
                  {game.badge && <span className={styles.badge}>{game.badge}</span>}
                </div>

                <h3 className={styles.gameTitle}>{game.title}</h3>
                <p className={styles.gameDesc}>{game.description}</p>

                <div className={styles.tagContainer}>
                  {game.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>

                <div className={styles.playBtn}>
                  Play Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}

            {/* Placeholder card */}
            <div className={styles.placeholder}>
              <span style={{ fontSize: '30px', marginBottom: '10px' }}>⏳</span>
              <p>준비 중...</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Games;
