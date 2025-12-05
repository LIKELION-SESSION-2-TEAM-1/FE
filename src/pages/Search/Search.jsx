import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Search.module.css';
import searchIcon from '../../assets/pic/search.svg';
import { searchStores } from '../../apis/storeSearchApi';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // URL 쿼리 파라미터에서 keyword 추출 (없으면 빈 문자열)
    const keywordParam = searchParams.get('keyword') || '';

    // UI에 보여질 검색어 상태
    const [keyword, setKeyword] = useState(keywordParam);
    
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // URL 파라미터가 변경되면(예: 뒤로가기) 검색창(input) 값도 동기화
    useEffect(() => {
        setKeyword(keywordParam);
    }, [keywordParam]);

    // 실제 검색 로직 (URL 파라미터가 변경될 때마다 실행)
    useEffect(() => {
        const term = keywordParam.trim();
        
        // 검색어가 없으면 결과 초기화
        if (!term) {
            setResults([]);
            setError('');
            return;
        }

        let isCanceled = false;
        setLoading(true);
        setError('');
        
        // API 호출
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
        
        // 검색어 변경 시 URL 업데이트 -> 위 useEffect가 트리거됨
        setSearchParams({ keyword: term });
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
                        const key = store.link || `${store.storeName}-${store.address}-${index}`;
                        
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
                            </>
                        );

                        return store.link ? (
                            <a
                                key={key}
                                className={styles.resultCard}
                                href={store.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {CardContent}
                            </a>
                        ) : (
                            <div key={key} className={styles.resultCard} role="article">
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