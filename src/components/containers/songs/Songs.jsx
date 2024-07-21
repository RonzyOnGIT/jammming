import Song from '../../presentational/song/Song';
import styles from './songs.module.css';

const Songs = ({ songsList, isLoading }) => {

    // for (let song in songsList) {
    //     console.log(songsList[song].artists.length);
    // }

    return (
        <>
            <div className={styles.songsContainer}>
                {/* {isLoading 
                ? <p>Loading...</p> 
                : songsList.map(song => <Song name={song.name} artist={song.artists[0].name} key={song.id}/>)} */}
                {songsList.map(song => <Song name={song.name} artist={song.artists} key={song.id}/>)}
            </div>
        </>
    )
}

export default Songs;