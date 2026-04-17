import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [predictionStatus, setPredictionStatus] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
    api.get("/recommendations", { params: { productId: id } }).then((res) => setRecommendations(res.data));
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
      <h2>{product.name}</h2>
      <p className="mutedText">{product.description}</p>
      <p>
        <strong>Category:</strong> {product.category}
      </p>
      <p className="price">Current price: ${product.price}</p>
      <button className="btn btnPrimary" onClick={getPrediction}>
        Predict Next Price
      </button>
      {predictionStatus && <p className="mutedText">{predictionStatus}</p>}
      {prediction && <p className="notice">Predicted next price: ${prediction.predictedPrice}</p>}

      <h3>Recommended Products</h3>
      {recommendations.length ? (
        <div className="grid">
          {recommendations.map((item) => (
            <div className="card" key={item._id}>
              <strong>{item.name}</strong>
              <p className="price">${item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mutedText">No recommendations yet.</p>
      )}
    </section>
  );
}

export default ProductDetailPage;
