import styles from './song.module.css';

import { useState, useEffect, useRef } from 'react';

import PlayPause from '../../playPause/PlayPause';

const Song = ({ name, artist, preview }) => {
    
    const [formattedArtists, setFormattedArtists] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (artist.length > 1) {
            const newFormat = artist.map(singer => singer.name + ' | ');9
            const removeLastSymbolFormat = newFormat.join('').slice(0, -2);
            setFormattedArtists(removeLastSymbolFormat);
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

    // Fix change state whenever song is at the end
    const handleClick = () => {
        if (!isClicked && audioRef.current) {
            audioRef.current.play();
            setIsClicked(prevState => !prevState);
        } else if (isClicked && audioRef.current) {
            audioRef.current.pause();
            setIsClicked(prevState => !prevState);
        } else {
            console.log('no audio');
        }
    }

    return (
        <>
            <div className={styles.songResultWrapper}>
                <div className={styles.infoContainer}>
                    <h3>{name}</h3>
                    {artist.length > 1 ? <p className={styles.artist}>{formattedArtists}</p> : <p className={styles.artist}>{artist[0].name}</p>}
                </div>
                <div className={styles.controls}>
                    <PlayPause isClicked={isClicked} togglePlay={handleClick} />
                    <button id={styles.addToPlaylistButton}>+</button>
                </div>
                <audio ref={audioRef}><source src={preview} type="audio/mpeg"/>Your browser does not support the audio tag</audio>
            </div>
        </>
    )
}

export default Song;