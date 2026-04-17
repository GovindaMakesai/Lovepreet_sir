import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1000&q=80";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationLoading, setRecommendationLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [predictionStatus, setPredictionStatus] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
    setRecommendationLoading(true);
    api
      .get("/recommendations", { params: { productId: id } })
      .then((res) => setRecommendations(res.data))
      .finally(() => setRecommendationLoading(false));
  }, [id]);

  const getPrediction = async () => {
    setPredictionStatus("Predicting...");
    try {
      const response = await api.post("/price-predict", { productId: id });
      setPrediction(response.data);
      setPredictionStatus("Prediction ready");
    } catch (error) {
      setPredictionStatus("Login required for price prediction");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <section className="pageSection">
      <div className="detailLayout">
        <div className="card detailImageCard">
          <img
            className="detailImage"
            src={product.image || FALLBACK_IMAGE}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>
        <div className="card detailInfoCard">
          <h2>{product.name}</h2>
          <p className="mutedText">{product.description}</p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p className="price">Current price: ${product.price}</p>
          <p className="mutedText">Stock available: {product.stock ?? 0}</p>
          <button className="btn btnPrimary" onClick={getPrediction}>
            Predict Next Price
          </button>
          {predictionStatus && <p className="mutedText">{predictionStatus}</p>}
          {prediction && (
            <div className="notice">
              <p>
                <strong>AI Price Prediction:</strong> Next estimated price is $
                {prediction.predictedPrice}
              </p>
              <p className="tinyText">
                Calculated from this product&apos;s historical prices using a simple linear trend.
              </p>
            </div>
          )}
        </div>
      </div>

      <h3>AI Recommended Products</h3>
      <p className="mutedText">These are selected because they are similar (same category).</p>
      {recommendationLoading ? (
        <div className="card recommendationStateCard">
          <p className="mutedText">Finding the best matches for this product...</p>
        </div>
      ) : recommendations.length ? (
        <div className="grid">
          {recommendations.map((item) => (
            <div className="card" key={item._id}>
              <img
                className="productImage"
                src={item.image || FALLBACK_IMAGE}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <strong>{item.name}</strong>
              <p className="price">${item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card recommendationStateCard">
          <p>We could not find similar items right now.</p>
          <p className="mutedText">Try another product or refresh recommendations.</p>
        </div>
      )}
    </section>
  );
}

export default ProductDetailPage;
