import styles from './input.module.css';

const Input = ({ handlePlaylistNameChange, playlistName }) => {

    return (
        <>
            <form className={styles.form}>
                <input type='text' id={styles.inputBox} value={playlistName} onChange={handlePlaylistNameChange}></input>
            </form>
        </>
    )
}

export default Input;