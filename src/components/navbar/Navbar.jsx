import styles from './navbar.module.css';

const Navbar = () => {

    return (
        <>
            <nav className={styles.navbar}>
                <h2 id={styles.navHeader}>Jammming</h2>
            </nav>
        </>
    )
}

export default Navbar;