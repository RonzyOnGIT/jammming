import Song from '../../presentational/song/Song';
import styles from './songs.module.css';
import { useState } from 'react';

const Songs = ({ songsList, isLoading }) => {

    return (
        <>
            <div className={styles.songsContainer}>
                {songsList.map(song => <Song name={song.name} artist={song.artists} key={song.id} preview={song.preview_url} />)}
            </div>
        </>
    )
}

export default Songs;