import styles from "./Board.module.css"

function Board() {
    return (
                <div className={styles.boardContainer}>
                    <div className={`${styles.boardLeft} fade-in`}>
                        <p className={styles.title}>Board</p>
                        <p className={styles.subTitle}>코멘트를 달아주세요!</p>
                    </div>
                    <div className={`${styles.boardRight} fade-right`}>
                        <div className={styles.boardSelect}>
                            <div>아바타</div>
                            <div>아이디</div>
                            <div>비밀번호</div>
                            <div>내용</div>
                        </div>
                        <div>
                            댓글창
                        </div>
                    </div>
                </div>
    )
}


export default Board;