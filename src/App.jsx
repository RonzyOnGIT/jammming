import styles from './app.module.css';

import Navbar from './components/navbar/Navbar';
import SearchBar from './components/searchbar/SearchBar';

const App = () => {


    return (
        <div className={styles.mainWrapper}>
            <Navbar />
            <SearchBar />
            <div className={styles.contentWrapper}>
                <div className={styles.contentContainer} id={styles.contentContainerLeft}>
                    <h2>Results</h2>
                </div>
                <div className={styles.contentContainer} id={styles.contentContainerRight}>
                    <h2>Create A Playlist</h2>
                </div>
            </div>
        </div>
    )
}

export default App;