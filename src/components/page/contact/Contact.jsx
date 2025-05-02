import styles from './Contact.module.css';

function Contact() {
    return (
                <div className={styles.contactContainer}>
                    <div className={`${styles.contactLeft} fade-in`}>
                        <p className={styles.title}>Contact</p>
                        <p className={styles.subTitle}>ddd</p>
                    </div>
                    <div className={`${styles.contactRight} fade-right`}>

                    </div>
                </div>
    )
}

export default Contact;