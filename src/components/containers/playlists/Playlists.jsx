import styles from './playList.module.css';

import Song from '../../presentational/song/Song';

const Playlists = ({ playlistSongs, removeFromPlaylist }) => {

    return (
        <>
            <div className={styles.playlistSongs}>
                {playlistSongs.map((playlistSong, index) => <Song artist={playlistSong.artist} index={index} name={playlistSong.name} key={index} isSongInPlaylist={true} removeSongFromPlaylist={removeFromPlaylist} id={playlistSong.id} />)}
            </div>
        </>
    )
}

export default Playlists;