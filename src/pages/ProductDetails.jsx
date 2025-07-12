import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productsApi } from "../api/auth";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import styles from "../styles/ProductDetails.module.css";
import { Header } from "../components/Header.jsx";
import { BackButton } from "../components/BackButton.jsx";

export function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productsApi.getById(id)
        .then(res => {
            setProduct(res.data);
            setLoading(false);
        }).catch (error => {
            console.error("Failed to load product", error);
        });
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!product) return <div>Product not found</div>;

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.productContainer}>
                <div className={styles.imageSection}>
                    <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className={styles.mainImage}
                    />
                    <BackButton />
                </div>

                <div className={styles.detailsSection}>
                    <h1 className={styles.title}>{product.title}</h1>
                    <div className={styles.ratingContainer}>
                        <div className={styles.rating}>
                            <p>⭐ {product.rating}/5</p>
                            <span className={styles.brand}>{product.brand}</span>
                        </div>
                        <p className={styles.price}>${product.price}</p>
                    </div>
                    <p className={styles.description}>{product.description}</p>
                    
                    <div className={styles.actions}>
                        <button className={styles.addToCart}>Add to Cart</button>
                        <button className={styles.buyNow}>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
};