import styles from './button.module.css';


const Button = ({ text, marginAmount, paddingTopBottom, paddingSides, handleClick }) => {

    const customStyles = {
        margin: marginAmount,
        paddingTop: paddingTopBottom,
        paddingBottom: paddingTopBottom,
        paddingLeft: paddingSides,
        paddingRight: paddingSides
    };

    return (
        <button style={customStyles} className={styles.customButton} onClick={handleClick}>{text}</button>
    )
}

export default Button;