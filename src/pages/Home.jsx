import { ProductCard } from "../components/ProductCard.jsx";
import { Header } from "../components/Header.jsx";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { productsApi } from "../api/auth.js";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import styles from "../styles/Home.module.css";

export function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();

    const loadProducts = useCallback(async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        try {
            const limit = 10;
            const skip = (page - 1) * limit;
            const res = await productsApi.getAll(`?limit=${limit}&skip=${skip}`);

            setProducts(prev => {
                const newProducts = res.data.products.filter(
                    newProduct => !prev.some(product => product.id === newProduct.id)
                );
                return [...prev, ...newProducts]
            });
            setHasMore(res.data.products.length === limit);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading]);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >= 
                document.documentElement.offSetHeight - 200 &&
                !loading &&
                hasMore
            ) {
                loadProducts();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadProducts, loading, hasMore]);


    const filteredProducts = searchTerm ? products.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())) : products;
    
    if (loading) return <LoadingSpinner />

    return (
        <div className={styles.homeContainer}>
            <Header />
            
            <div className={styles.searchContainer}>
                <input 
                    type="text" 
                    placeholder="Try searching for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.productsGrid}>
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            {loading && <LoadingSpinner />}
            {!hasMore && !loading && (
                <p className={styles.endMessage}>You've reached the end of products</p>
            )}
        </div>
    );
};