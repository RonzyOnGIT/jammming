import styles from './app.module.css';

import Navbar from './components/navbar/Navbar';
import SearchBar from './components/searchbar/SearchBar';
import Button from './components/button/Button';
import { redirectToSpotifyAuth, handleRedirectFromSpotify, fetchSongs } from './utils/utils';
import { useEffect, useState } from 'react';


// TO DO:  refreshes on page cause to have to re-login
const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currToken, setCurrToken] = useState(null);

    useEffect(() => {
        // for first run, function will return null so either return a token or empty {}
        const { token = null, expiresIn = null} = handleRedirectFromSpotify() || {};
        if (token) {
            localStorage.setItem('currentToken', token);
            setIsAuthenticated(true);
            setCurrToken(token);
        }

    }, [])

    const logout = () => {
        localStorage.removeItem('spotifyAuthState');
        localStorage.removeItem('currentToken');
        setCurrToken(null);
        setIsAuthenticated(false);
    }

    const handleSubmit = (song) => {{
        if (!song) {
            console.log('no song inputted');
            return;
        }
        fetchSongs(song, currToken);
    }}

    return (
        <>
        <Navbar />
        <div className={`${styles.mainWrapper} ${isAuthenticated ? '' : styles.login}`}>
            {isAuthenticated 
                ?
                <>
                    <SearchBar handleSubmit={handleSubmit} />
                    <div className={styles.contentWrapper}>
                        <div className={styles.contentContainer} id={styles.contentContainerLeft}>
                            <h2>Results</h2>
                        </div>
                        <div className={styles.contentContainer} id={styles.contentContainerRight}>
                            <h2>Create A Playlist</h2>
                        </div>
                    </div>
                    {/* {isAuthenticated && <Button text='Logout' handleClick={logout} />} */}
                </>
                :   
                    <div className={styles.loginContainer}>
                        <Button text={'Login To Spotify'} handleClick={redirectToSpotifyAuth}/>
                    </div>
            }

        </div>
        </>
    )
}

export default App;