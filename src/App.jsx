import styles from './app.module.css';

import Navbar from './components/navbar/Navbar';
import SearchBar from './components/searchbar/SearchBar';
import Button from './components/button/Button';
import Songs from './components/containers/songs/Songs';
import Playlists from './components/containers/playlists/Playlists';
import Input from './components/input/Input';
import Toast from './components/toast/Toast';

import { fetchSongs, createNewPlaylist, exchangeToken, logout } from './utils/utils';
import { useEffect, useState } from 'react';

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currToken, setCurrToken] = useState(null);
    const [songs, setSongs] = useState([]);
    const [playlistSongs, setPlaylistSongs] = useState(new Map());
    const [playlistName, setPlaylistName] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [toastStatus, setToastStatus] = useState("");
    const [userId, setUserId] = useState(-1);

    const spotifyLogin = async () => {

        let loginUrl;

        try {

            const body = {
                method: 'GET',
                credentials: 'include'
            };

            const response = await fetch("http://localhost:8080/api/login", body);

            if (!response.ok) {
                throw new Error(`error! status: ${response.status}`);
            }

            const data = await response.json();
            loginUrl = data.url;
            window.location.href = loginUrl;

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        let timer;

        // user logged in, so now have to make a fetch request in the backend to retrieve token and start timer
        if (code) {
            async function exchange() {
                const { success, userId, expireTime } = await exchangeToken(code);

                if (success) {
                    setIsAuthenticated(true);
                    setUserId(userId);

                    const nowSeconds = Math.floor(Date.now() / 1000); // get current time in seconds
                    const remainingTime = expireTime - nowSeconds; // subtract from expiring time the amount of time that has elapsed since being logged in
                    const safeRemainingTime = Math.max(remainingTime, 0); // if for whatever case nowSeconds is greater which means there was some huge delay or bug
                    timer = setTimeout(() => {
                        (async () => {
                            const success = await logout(userId);

                            // if not success, logout already handles printing to console
                            if (success) {
                                setCurrToken(null);
                                setIsAuthenticated(false);
                            } else {
                                console.log("fail to logout");
                            }
                        })();
                    }, safeRemainingTime * 1000);
                    window.history.replaceState({}, document.title, window.location.pathname);
                } else {
                    console.log("Token exchange failed");
                }
            }
            exchange();
        } else {
            return;
        }

        return () => {
            clearTimeout(timer);
        }

    }, [])

    const handleSubmit = async (song) => {{
        if (!song) {
            console.log('no song inputted');
            return;
        }
        const tracks = await fetchSongs(song, userId);
        setSongs(tracks);
    }}


    const removeSongFromPlaylist = (id) => {
        setPlaylistSongs(prevPlaylist => {
            const newMap = new Map(prevPlaylist);
            newMap.delete(id);
            return newMap;
        })
    }

    const addSongToPlaylist = (songName, artist, id, uri) => {

        const newSong = {
            name: songName,
            artist: artist,
            id: id,
            uri: uri
        }

        setPlaylistSongs(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(id, newSong);
            return newMap;
        })

    }

    const handlePlaylistNameChange = (e) => {
        const { value } = e.target;
        setPlaylistName(value);
    }

    const clearPlaylists = () => {
        setPlaylistSongs(new Map());
        setPlaylistName('');
    }

    const handleCreatePlaylist = async () => {

        if (!playlistName) {
            console.log('empty name');
            return;
        }

        const response = await createNewPlaylist(playlistName, playlistSongs, userId);

        setToastStatus(response ? "success" : "fail");
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 3000);

        clearPlaylists();
    }

    return (
        <>
        <Navbar />
        {showToast && <Toast status={toastStatus} show={showToast} />}
        <div className={`${styles.mainWrapper} ${isAuthenticated ? '' : styles.login}`}>
            {isAuthenticated 
                ?
                <>
                    <SearchBar handleSubmit={handleSubmit} />
                    <div className={styles.contentWrapper}>
                        <div className={styles.contentContainer} id={styles.contentContainerLeft}>
                            <h2>Results</h2>
                            {songs.length > 0 && <Songs songsList={songs} addSongToPlaylist={addSongToPlaylist} removeFromPlaylist={removeSongFromPlaylist} playlistSongs={playlistSongs} />}
                        </div>
                        <div className={styles.contentContainer} id={styles.contentContainerRight}>
                            <h2>Create A Playlist</h2>
                            <Input playlistName={playlistName} handlePlaylistNameChange={handlePlaylistNameChange} handleCreatePlaylist={handleCreatePlaylist} currToken={currToken} playlistSongs={playlistSongs} />
                            {playlistSongs.size > 0 && <Playlists playlistSongs={playlistSongs} removeFromPlaylist={removeSongFromPlaylist} playlistName={playlistName} />}
                            {playlistSongs.size > 0 && <Button text='Save To Playlist' marginAmount='1.5rem' paddingTopBottom='0.2rem' paddingSides='0.5rem' playlistName={playlistName} handleClick={handleCreatePlaylist} />}
                        </div>
                    </div>
                </>
                :   
                    <div className={styles.loginContainer}>
                        <Button text={'Login To Spotify'} marginAmount='0' paddingTopBottom='0.3rem' paddingSides='1rem' handleClick={spotifyLogin}/>
                    </div>
            }

        </div>
        </>
    )
}

export default App;