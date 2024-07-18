import styles from './searchIcon.module.css';
import searchIcon from '../../assets/magnifyIcon.png';

const SearchIcon = () => {

    return (
        <img id={styles.searchIcon} src={searchIcon} />
    )
}

export default SearchIcon;