import styles from './input.module.css';

const Input = ({ playlistName, handlePlaylistNameChange, handleCreatePlaylist, currToken, playlistSongs }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreatePlaylist(playlistName, currToken, playlistSongs);
    }

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type='text' id={styles.inputBox} value={playlistName} onChange={handlePlaylistNameChange}></input>
            </form>
        </>
    )
}

export default Input;