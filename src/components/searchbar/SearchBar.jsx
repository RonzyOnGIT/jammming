import styles from './searchBar.module.css';
import { useState } from 'react';
import SearchIcon from './SearchIcon';

const SearchBar = ({ handleSubmit }) => {

    const [songName, setSongName] = useState('');

    const handleChange = ({ target }) => {
        setSongName(target.value);
    }

    const onSubmitForm = (e) => {
        e.preventDefault();
        handleSubmit(songName);
        setSongName('');
    }

    return (
        <>
            <form className={styles.formWrapper} onSubmit={onSubmitForm}>
                <input id={styles.searchInput} value={songName} placeholder='Enter Song' onChange={handleChange}></input>
                {songName ? <SearchIcon /> : <></>}
            </form>
        </>
    )
}

export default SearchBar;