import { ProductCard } from "../components/ProductCard.jsx";
import { Header } from "../components/Header.jsx";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { productsApi } from "../api/auth.js";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import styles from "../styles/Home.module.css";
import { debounce } from "lodash";

export function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();

    const debouncedSearch = useRef(
        debounce((term) => {
            setSearchTerm(term);
            setPage(1);
        }, 500)
    ).current;

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const loadProducts = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
        try {
            const limit = 10;
            const skip = (page - 1) * limit;
            let res;

            if (searchTerm) {
                res = await productsApi.search(searchTerm, limit, skip);
            } else {
                res = await productsApi.getAll(`?limit=${limit}&skip=${skip}`);
            }

            setProducts(prev => 
                page === 1 
                    ? res.data.products 
                    : [...prev, ...res.data.products]
            );

            setHasMore(res.data.products.length === limit);

            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
    }, [page, searchTerm, loading]);

    useEffect(() => {
        loadProducts();
    }, [page, searchTerm, loadProducts]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.pageYOffset >=
                document.documentElement.scrollHeight - 200 &&
                !loading &&
                hasMore &&
                !searchTerm
            ) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore, searchTerm]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        debouncedSearch(value);
    };

    return (
        <div className={styles.homeContainer}>
            <Header />

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search product titles..."
                    value={searchInput}
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
            {!hasMore && !loading && products.length > 0 && (
                <p className={styles.endMessage}>
                    {searchTerm ? "End of search results" : "You've reached the end of products"}
                </p>
            )}
            {!loading && products.length === 0 && (
                <p className={styles.endMessage}>
                    {searchTerm ? "No products found matching your search" : "No products available"}
                </p>
            )}
        </div>
    );
}