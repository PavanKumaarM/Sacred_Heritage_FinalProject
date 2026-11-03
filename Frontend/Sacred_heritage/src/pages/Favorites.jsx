
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  removeFavorite,
  clearFavorites,
} from "../redux/slices/favoritesSlice";

function Favorites() {
  const dispatch = useDispatch();

  const { favorites } = useSelector(
    (state) => state.favorites
  );

  return (
    <div className="favorites-page">

      <div className="page-heading">
        <p>YOUR SAVED COLLECTION</p>
        <h1>My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-message">

          <h2>No favorite products yet</h2>

          <p>Save products you love to find them here.</p>

          <Link to="/products" className="continue-shopping">
            Explore Products
          </Link>

        </div>
      ) : (
        <>
          <div className="favorites-heading">
            <p>{favorites.length} saved products</p>

            <button
              onClick={() => dispatch(clearFavorites())}
            >
              Clear Favorites
            </button>
          </div>

          <div className="product-grid">

            {favorites.map((product) => (
              <div className="favorite-card" key={product._id}>

                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image || "/product-placeholder.png"}
                    alt={product.name}
                  />

                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                </Link>

                <button
                  onClick={() =>
                    dispatch(removeFavorite(product._id))
                  }
                >
                  Remove from Favorites
                </button>

              </div>
            ))}

          </div>
        </>
      )}

    </div>
  );
}

export default Favorites;
