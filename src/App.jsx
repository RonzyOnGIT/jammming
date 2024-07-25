import styles from './app.module.css';

import Navbar from './components/navbar/Navbar';
import SearchBar from './components/searchbar/SearchBar';
import Button from './components/button/Button';
import Songs from './components/containers/songs/Songs';
import Playlists from './components/containers/playlists/Playlists'

import { redirectToSpotifyAuth, handleRedirectFromSpotify, fetchSongs } from './utils/utils';
import { useEffect, useState } from 'react';


const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currToken, setCurrToken] = useState(null);
    const [songs, setSongs] = useState([]);
    const [playlistSongs, setPlaylistSongs] = useState(new Map());

    

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

    const handleSubmit = async (song) => {{
        if (!song) {
            console.log('no song inputted');
            return;
        }
        const tracks = await fetchSongs(song, currToken);
        // console.log(tracks);
        setSongs(tracks);
    }}

    const removeSongFromPlaylist = (id) => {
        setPlaylistSongs(prevPlaylist => {
            const newMap = new Map(prevPlaylist);
            newMap.delete(id);
            return newMap;
        })
    }

    const addSongToPlaylist = (songName, artist, id) => {

        const newSong = {
            name: songName,
            artist: artist,
            id: id
        }

        setPlaylistSongs(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(id, newSong);
            return newMap;
        })

    }

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
                            {songs.length > 0 && <Songs songsList={songs} addSongToPlaylist={addSongToPlaylist} removeFromPlaylist={removeSongFromPlaylist} playlistSongs={playlistSongs} />}
                        </div>
                        <div className={styles.contentContainer} id={styles.contentContainerRight}>
                            <h2>Create A Playlist</h2>
                            {playlistSongs.size > 0 && <Playlists playlistSongs={playlistSongs} removeFromPlaylist={removeSongFromPlaylist} />}
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