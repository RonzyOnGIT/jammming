import styles from './song.module.css';

import { useState, useEffect } from 'react';

const Song = ({ name, artist }) => {
    
    const [formattedArtists, setFormattedArtists] = useState('');

    useEffect(() => {
        if (artist.length > 1) {
            const newFormat = artist.map(singer => singer.name + ' | ');
            const removeLastSymbolFormat = newFormat.join('').slice(0, -2);
            setFormattedArtists(removeLastSymbolFormat);
        }   
    }, [])

    return (
        <>
            <div className={styles.songResultWrapper}>
                <h3>{name}</h3>
                {artist.length > 1 ? <p>{formattedArtists}</p> : <p className={styles.artist}>{artist[0].name}</p>}
            </div>
        </>
    )
}

export default Song;