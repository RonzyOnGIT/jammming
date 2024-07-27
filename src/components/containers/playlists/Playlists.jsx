import styles from './playList.module.css';

import Song from '../../presentational/song/Song';

const Playlists = ({ playlistSongs, removeFromPlaylist }) => {
    
    const mapArray = Array.from(playlistSongs.entries());

    return (
        <>
            <div className={styles.playlistSongs}>
                {mapArray.map(([key, value]) => (
                    <Song artist={value.artist} name={value.name} key={value.id} isSongInPlaylist={true} removeSongFromPlaylist={removeFromPlaylist} id={value.id} playlistSongs={playlistSongs} uri={value.uri} />
                ))}
            </div>
        </>
    )
}

export default Playlists;