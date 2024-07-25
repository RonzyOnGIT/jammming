import Song from '../../presentational/song/Song';
import styles from './songs.module.css';

const Songs = ({ songsList, isLoading, addSongToPlaylist, removeFromPlaylist }) => {

    return (
        <>
            <div className={styles.songsContainer}>
                {songsList.map((song, index) => <Song name={song.name} artist={song.artists} key={song.id} preview={song.preview_url} index={index} addSongToPlaylist={addSongToPlaylist} id={song.id} removeSongFromPlaylist={removeFromPlaylist} />)}
            </div>
        </>
    )
}

export default Songs;