import { ProductCard } from "../components/ProductCard.jsx";
import { Header } from "../components/Header.jsx";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { productsApi } from "../api/auth.js";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import styles from "../styles/Home.module.css";
import { debounce } from "lodash";

export function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();
    const loadingRef = useRef(false);

    const debouncedSearch = debounce((value) => {
        if (value !== searchInput) {
            setPage(1);
            setProducts([]);
            setSearchInput(value);
        }
    }, 500);

    useEffect(() => {
        const fetchProducts = async () => {
            if (loadingRef.current) return;
            
            loadingRef.current = true;
            setLoading(true);
            
            try {
                const limit = 10;
                const skip = (page - 1) * limit;
                let res;
                let filtered = [];

                if (searchInput.trim()) {
                    res = await productsApi.search(searchInput, limit, skip);
                    filtered = res.data.products.filter((product => product.title.toLowerCase().includes(searchInput.toLocaleLowerCase())));
                } else {
                    res = await productsApi.getAll(limit, skip);
                }

                !searchInput ? 
                setProducts(prev => [...prev, ...res.data.products]) :
                setProducts(prev => [...prev, ...filtered]);

                setHasMore(res.data.products.length === limit);
                
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                loadingRef.current = false;
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, searchInput]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                !loadingRef.current &&
                hasMore
            ) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        debouncedSearch(value);
    };

    return (
        <div className={styles.homeContainer}>
            <Header />

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search product titles..."
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.productsGrid}>
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            {loading && <LoadingSpinner />}
            {!hasMore && products.length > 0 && (
                <p className={styles.endMessage}>
                    No more products to load
                </p>
            )}
            {!loading && products.length === 0 && (
                <p className={styles.endMessage}>
                    {searchInput ? "No products found" : "Loading products..."}
                </p>
            )}
        </div>
    );
}