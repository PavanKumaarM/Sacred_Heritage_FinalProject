
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../redux/slices/productsSlice";
import { fetchCategories } from "../redux/slices/categoriesSlice";

import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Pagination from "../components/common/Pagination";

function TempleProducts() {
  const dispatch = useDispatch();

  const { products, pagination, loading, error } = useSelector(
    (state) => state.products
  );

  const { categories } = useSelector(
    (state) => state.categories
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  // Fetch categories when page loads
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, minPrice, maxPrice, sort]);

  // Fetch products whenever filters or page change
  useEffect(() => {
    dispatch(
      fetchProducts({
        search: debouncedSearch,
        category,
        minPrice,
        maxPrice,
        sort,
        page,
        limit: 12,
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
  ]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="products-page">

      <div className="page-heading">
        <p>TRADITIONAL AND SACRED COLLECTION</p>
        <h1>Temple Products</h1>
        <span>
          Discover traditional products from India's sacred temples.
        </span>
      </div>

      <ProductFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sort={sort}
        setSort={setSort}
        categories={categories}
      />

      {loading && (
        <Loader message="Loading products..." />
      )}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() =>
            dispatch(
              fetchProducts({
                search: debouncedSearch,
                category,
                minPrice,
                maxPrice,
                sort,
                page,
                limit: 12,
              })
            )
          }
        />
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty-message">
          <h3>No products found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <p className="result-count">
            Showing {products.length} products
          </p>

          <div className="product-grid">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

          <Pagination
            currentPage={pagination?.page || page}
            totalPages={pagination?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}

    </div>
  );
}

export default TempleProducts;
