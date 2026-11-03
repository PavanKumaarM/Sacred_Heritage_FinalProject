
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProductsByTemple } from "../redux/slices/productsSlice";
import { fetchTempleById } from "../redux/slices/templesSlice";

import ProductCard from "../components/products/ProductCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function TempleSpecificProducts() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { templeProducts, loading, error } = useSelector(
    (state) => state.products
  );

  const { selectedTemple } = useSelector(
    (state) => state.temples
  );

  useEffect(() => {
    dispatch(fetchProductsByTemple(id));
    dispatch(fetchTempleById(id));
  }, [dispatch, id]);

  return (
    <div className="products-page">

      <div className="page-heading">
        <p>TEMPLE COLLECTION</p>

        <h1>
          {selectedTemple?.name || "Temple Products"}
        </h1>

        <span>
          Explore products associated with this temple.
        </span>
      </div>

      <div className="back-link">
        <Link to="/temples">← Back to Temples</Link>
      </div>

      {loading && (
        <Loader message="Loading temple products..." />
      )}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(fetchProductsByTemple(id))}
        />
      )}

      {!loading && !error && templeProducts.length === 0 && (
        <div className="empty-message">
          <h3>No products available</h3>
          <p>This temple does not have products listed yet.</p>
        </div>
      )}

      {!loading && !error && templeProducts.length > 0 && (
        <div className="product-grid">

          {templeProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default TempleSpecificProducts;
