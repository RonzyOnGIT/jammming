import styles from './searchBar.module.css';

const SearchBar = () => {

    return (
        <>
            <form className={styles.formWrapper}>
                <input id={styles.searchInput} placeholder='Enter Song' ></input>
            </form>
        </>
    )
}

export default SearchBar;