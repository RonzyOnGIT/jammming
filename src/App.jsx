import styles from './app.module.css';

import Navbar from './components/navbar/Navbar';
import SearchBar from './components/searchbar/SearchBar';
import Button from './components/button/Button';
import Songs from './components/containers/songs/Songs';
import Playlists from './components/containers/playlists/Playlists'

import { redirectToSpotifyAuth, handleRedirectFromSpotify, fetchSongs } from './utils/utils';
import { useEffect, useState } from 'react';


// TO DO:  
    // hover effects on play/pause button
    // add song progres on button
    // maybe refactor some of the functions in Song inside utils
    // Add input for playlist title
    // Work on functionality for making post request to put playlist on users acc
    // Do something about only having an access token for 1 hour
    // Find what to do with songs songs having a 'null' preview url
    // The login feature and app 'life cycle?' doesn't really work like if I want to connect a diff account

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currToken, setCurrToken] = useState(null);
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [playlistSongs, setPlaylistSongs] = useState([]);

    

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
        console.log(tracks);
        setSongs(tracks);
    }}

    const removeSongFromPlaylist = (id) => {
        // console.log('run');
        setPlaylistSongs(prevSongs => prevSongs.filter(song => song.id !== id));
        // console.log(playlistSongs);
    }

    // figure out how to store playlist info
    const addSongToPlaylist = (index, songName, artist, id, isInPlaylist) => {

        // if (isInPlaylist) {
        //     removeSongFromPlaylist(id);
        // }

        const newSong = {
            index: index,
            name: songName,
            artist: artist,
            id: id
        }

        setPlaylistSongs(prevPlaylist => [...prevPlaylist, newSong]);
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
                            {songs.length > 0 && <Songs songsList={songs} isLoading={isLoading} addSongToPlaylist={addSongToPlaylist} removeFromPlaylist={removeSongFromPlaylist} />}
                        </div>
                        <div className={styles.contentContainer} id={styles.contentContainerRight}>
                            <h2>Create A Playlist</h2>
                            {playlistSongs.length > 0 && <Playlists playlistSongs={playlistSongs} removeFromPlaylist={removeSongFromPlaylist} />}
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