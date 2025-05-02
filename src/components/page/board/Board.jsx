import styles from "./Board.module.css"

function Board() {
    return (
                <div className={styles.boardContainer}>
                    <div className={`${styles.boardLeft} fade-in`}>
                        <p className={styles.title}>Board</p>
                        <p className={styles.subTitle}>코멘트를 달아주세요!</p>
                    </div>
                    <div className={`${styles.boardRight} fade-right`}>

                    </div>
                </div>
    )
}


export default Board;