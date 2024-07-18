import styles from './button.module.css';


const Button = ({ text, handleClick }) => {

    return (
        <button className={styles.customButton} onClick={handleClick}>{text}</button>
    )
}

export default Button;