import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Search.module.css';
import searchIcon from '../../assets/pic/search.svg';
import {
    searchStores,
    getFavorites,
    addFavorite,
    deleteFavorite
} from '../../apis/storeSearchApi';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const keywordParam = searchParams.get('keyword') || '';

    // UI State
    const [keyword, setKeyword] = useState(keywordParam);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Favorites State: Map<UniqueKey, FavoriteID>
    // UniqueKey logic: item.link || (item.storeName + item.address)
    const [favoriteIds, setFavoriteIds] = useState(new Map());

    useEffect(() => {
        setKeyword(keywordParam);
    }, [keywordParam]);

    // Initial Load: Favorites
    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const favs = await getFavorites();
            // favs is Array of object. We need to map them to find them by content.
            // Assumption: Store items have same fields as Favorite items.
            const newMap = new Map();
            if (Array.isArray(favs)) {
                favs.forEach(fav => {
                    const key = fav.link || `${fav.storeName}-${fav.address}`;
                    if (fav.id || fav.favoriteId) {
                        newMap.set(key, fav.id || fav.favoriteId);
                    }
                });
            }
            setFavoriteIds(newMap);
        } catch (err) {
            console.error("Failed to load favorites", err);
        }
    };

    // Search Logic
    useEffect(() => {
        const term = keywordParam.trim();
        if (!term) {
            setResults([]);
            setError('');
            return;
        }

        let isCanceled = false;
        setLoading(true);
        setError('');

        searchStores(term)
            .then((data) => {
                if (!isCanceled) {
                    setResults(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => {
                if (!isCanceled) {
                    setError(err?.message || '검색 중 오류가 발생했습니다.');
                }
            })
            .finally(() => {
                if (!isCanceled) setLoading(false);
            });

        return () => {
            isCanceled = true;
        };
    }, [keywordParam]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const term = keyword.trim();
        if (!term) return;
        setSearchParams({ keyword: term });
    };

    const handleToggleFavorite = async (e, store) => {
        e.preventDefault();
        e.stopPropagation();

        const key = store.link || `${store.storeName}-${store.address}`;
        const existingId = favoriteIds.get(key);

        if (existingId) {
            // Delete
            try {
                await deleteFavorite(existingId);
                setFavoriteIds(prev => {
                    const next = new Map(prev);
                    next.delete(key);
                    return next;
                });
            } catch (err) {
                console.error("Failed to delete favorite", err);
                alert("즐겨찾기 삭제 실패");
            }
        } else {
            // Add
            try {
                const response = await addFavorite(store);
                // Response should contain the new ID
                const newId = response?.id || response?.favoriteId;
                if (newId) {
                    setFavoriteIds(prev => {
                        const next = new Map(prev);
                        next.set(key, newId);
                        return next;
                    });
                } else {
                    // Fallback reload if no ID returned
                    fetchFavorites();
                }
            } catch (err) {
                console.error("Failed to add favorite", err);
                alert("즐겨찾기 추가 실패: " + (err.message || "오류"));
            }
        }
    };

    const hasQuery = keywordParam.trim().length > 0;
    const statusMessage = !hasQuery
        ? '원하는 여행지를 검색해 보세요.'
        : loading
            ? '검색 중입니다...'
            : error
                ? error
                : results.length === 0
                    ? '검색 결과가 없습니다.'
                    : '';

    return (
        <div className={styles.page}>
            <form className={styles.searchBar} onSubmit={handleSubmit}>
                <button type="submit" className={styles.searchButton} aria-label="검색">
                    <img src={searchIcon} alt="" className={styles.searchIcon} />
                </button>
                <input
                    type="search"
                    className={styles.searchInput}
                    placeholder="여행지 검색하기"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
            </form>

            {statusMessage && (
                <p className={`${styles.helperText} ${error ? styles.errorText : ''}`}>{statusMessage}</p>
            )}

            {!error && !loading && results.length > 0 && (
                <div className={styles.results}>
                    {results.map((store, index) => {
                        const key = store.link || `${store.storeName}-${store.address}`;
                        const isFav = favoriteIds.has(key);

                        const CardContent = (
                            <>
                                <div className={styles.thumbnail}>
                                    {store.imageUrl ? (
                                        <img
                                            src={store.imageUrl}
                                            alt={`${store.storeName} 이미지`}
                                            className={styles.thumbnailImage}
                                        />
                                    ) : (
                                        <div className={styles.thumbnailPlaceholder}>이미지 준비 중</div>
                                    )}
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.storeName}>{store.storeName}</h3>
                                        {store.rating && (
                                            <span className={styles.ratingBadge}>★ {store.rating}</span>
                                        )}
                                    </div>
                                    {store.category && <p className={styles.category}>{store.category}</p>}
                                    {store.address && <p className={styles.address}>{store.address}</p>}
                                    {store.reviewCount && (
                                        <p className={styles.reviewCount}>{store.reviewCount}개의 리뷰</p>
                                    )}
                                </div>
                                <button
                                    className={styles.favoriteButton}
                                    onClick={(e) => handleToggleFavorite(e, store)}
                                    aria-label={isFav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                                >
                                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M16.1 1.9C14.1 -0.1 11.1 -0.1 9.1 1.9L9 2L8.9 1.9C6.9 -0.1 3.9 -0.1 1.9 1.9C-0.6 4.4 -0.6 8.4 1.9 10.9L9 16L16.1 10.9C18.6 8.4 18.6 4.4 16.1 1.9Z"
                                            fill={isFav ? "#FF3C01" : "none"}
                                            stroke={isFav ? "#FF3C01" : "#FF3C01"}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </>
                        );

                        return store.link ? (
                            <a
                                key={index}
                                className={styles.resultCard}
                                href={store.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {CardContent}
                            </a>
                        ) : (
                            <div key={index} className={styles.resultCard} role="article">
                                {CardContent}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Search;