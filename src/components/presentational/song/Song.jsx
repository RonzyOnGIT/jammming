import styles from './song.module.css';

import { useState, useEffect, useRef } from 'react';

import PlayPause from '../../playPause/PlayPause';

const Song = ({ name, artist, preview, index, addSongToPlaylist, isSongInPlaylist, id, removeSongFromPlaylist }) => {
    
    const [formattedArtists, setFormattedArtists] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const audioRef = useRef(null);

    const [alreadyClickedAdd, setAlreadyClickedAdd] = useState(false);

    useEffect(() => {
        // if song is from rendering it from playlist, 'artist' will not initially be an array because of already converted artist array into string and can ignore rest of functionality because it doesnt have a play button
        if (typeof artist === 'string') {
            setFormattedArtists(artist);
            return;
        }

        if (artist.length > 1) {
            const newFormat = artist.map(singer => singer.name + ' | ');
            const removeLastSymbolFormat = newFormat.join('').slice(0, -2);
            setFormattedArtists(removeLastSymbolFormat);
        } else {
            setFormattedArtists(artist[0].name);
        }

        const handleEnded = () => {
            setIsClicked(prev => !prev);
        }
        
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.addEventListener('ended', handleEnded);
        }

        // clean up function
        return () => {
            if (audioElement) {
                audioElement.removeEventListener('ended', handleEnded)
            }
        }

    }, [])

    const handleClick = () => {
        if (!isClicked && audioRef.current) {
            // since audio is pretty loud on default, start off quieter
            audioRef.current.volume = 0.10

            audioRef.current.play();
            setIsClicked(prevState => !prevState);
        } else if (isClicked && audioRef.current) {
            audioRef.current.pause();
            setIsClicked(prevState => !prevState);
        } else {
            console.log('no audio');
        }
    }

    // alreadyClickedAdd = true
    const handleAddOrRemoveSong = () => {
        if (isSongInPlaylist && alreadyClickedAdd) {
            console.log('first');
            removeSongFromPlaylist(id);
            setAlreadyClickedAdd(prevState => !prevState);
            return;
        } else if (isSongInPlaylist || alreadyClickedAdd) {
            setAlreadyClickedAdd(prevState => !prevState);
            console.log('second');
            removeSongFromPlaylist(id);
            return;
        }
        addSongToPlaylist(index, name, formattedArtists, id, isSongInPlaylist);
        setAlreadyClickedAdd(prev => !prev);
    }

    return (
        <>
            <div className={styles.songResultWrapper}>
                <div className={styles.infoContainer}>
                    <h3>{name}</h3>
                    <p className={styles.artist}>{formattedArtists}</p>
                </div>
                <div className={styles.controls}>
                    {!isSongInPlaylist && <PlayPause isClicked={isClicked} togglePlay={handleClick} />}
                    <button id={styles.addToPlaylistButton} onClick={handleAddOrRemoveSong}>{isSongInPlaylist ? '-' : '+'}</button>
                </div>
                <audio ref={audioRef}><source src={preview} type="audio/mpeg"/>Your browser does not support the audio tag</audio>
            </div>
        </>
    )
}

export default Song;