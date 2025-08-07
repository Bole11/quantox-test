import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

export const ProductCard = ({ product }) => {

    return (
        <Link 
            to={`/products/${product.id}`}
            className={styles.productCard}
        >
            <img 
                loading="lazy"
                src={product.thumbnail} 
                alt={product.title}
                className={styles.productImage} 
            />
            <div className={styles.productInfo}>
                <h3>{product.title}</h3>
                <p>${product.price}</p>
            </div>
        </Link>
    )
};