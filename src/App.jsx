import styles from './app.module.css';

import Navbar from './components/navbar/Navbar';
import SearchBar from './components/searchbar/SearchBar';
import Button from './components/button/Button';
import Songs from './components/containers/songs/Songs';
import Playlists from './components/containers/playlists/Playlists';
import Input from './components/input/Input';

import { redirectToSpotifyAuth, handleRedirectFromSpotify, fetchSongs, createNewPlaylist, convertTimeIntoMiliseconds } from './utils/utils';
import { useEffect, useState } from 'react';


const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currToken, setCurrToken] = useState(null);
    const [songs, setSongs] = useState([]);
    const [playlistSongs, setPlaylistSongs] = useState(new Map());
    const [playlistName, setPlaylistName] = useState('');

    const logout = () => {
        localStorage.removeItem('spotifyAuthState');
        localStorage.removeItem('currentToken');
        localStorage.removeItem('timeWhenAuthenticated');
        setCurrToken(null);
        setIsAuthenticated(false);
    }

    useEffect(() => {
        let timer;

        if (localStorage.getItem('currentToken')) {
            setIsAuthenticated(true);
            setCurrToken(localStorage.getItem('currentToken'));
            const timeStart = localStorage.getItem('timeWhenAuthenticated');
            const timeNow = new Date();
            const timeNowInMili = convertTimeIntoMiliseconds(timeNow);
            const timeElapsed = timeNowInMili - timeStart;
            const newLogoutTime = 3600000 - timeElapsed;

            timer = setTimeout(() => {
                logout();
            }, newLogoutTime);
            return;
        } else {
            // for first run, function will return null so either return a token or empty {}
            const { token = null, expiresIn = null} = handleRedirectFromSpotify() || {};

            let expiresInMiliseconds;
    
            if (expiresIn) {
                expiresInMiliseconds = expiresIn * 1000;
            }
    
            if (token) {
                localStorage.setItem('currentToken', token);
                const timeWhenUserAuthenticated = new Date();
                const timeInMil = convertTimeIntoMiliseconds(timeWhenUserAuthenticated);
                localStorage.setItem('timeWhenAuthenticated', timeInMil);
                setIsAuthenticated(true);
                setCurrToken(token);
            }
    
            timer = setTimeout(() => {
                logout();
            }, expiresInMiliseconds);
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
        const tracks = await fetchSongs(song, currToken);
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

        await createNewPlaylist(playlistName, currToken, playlistSongs);

        clearPlaylists();
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
                            <Input playlistName={playlistName} handlePlaylistNameChange={handlePlaylistNameChange} handleCreatePlaylist={handleCreatePlaylist} currToken={currToken} playlistSongs={playlistSongs} />
                            {playlistSongs.size > 0 && <Playlists playlistSongs={playlistSongs} removeFromPlaylist={removeSongFromPlaylist} playlistName={playlistName} />}
                            {playlistSongs.size > 0 && <Button text='Save To Playlist' marginAmount='1.5rem' paddingTopBottom='0.2rem' paddingSides='0.5rem' playlistName={playlistName} handleClick={handleCreatePlaylist} />}
                        </div>
                    </div>
                </>
                :   
                    <div className={styles.loginContainer}>
                        <Button text={'Login To Spotify'} marginAmount='0' paddingTopBottom='0.3rem' paddingSides='1rem' handleClick={redirectToSpotifyAuth}/>
                    </div>
            }

        </div>
        </>
    )
}

export default App;