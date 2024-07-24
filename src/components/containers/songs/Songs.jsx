import Song from '../../presentational/song/Song';
import styles from './songs.module.css';
import { useState } from 'react';

const Songs = ({ songsList, isLoading, addSongToPlaylist }) => {

    return (
        <>
            <div className={styles.songsContainer}>
                {songsList.map((song, index) => <Song name={song.name} artist={song.artists} key={song.id} preview={song.preview_url} index={index} addSongToPlaylist={addSongToPlaylist} />)}
            </div>
        </>
    )
}

export default Songs;