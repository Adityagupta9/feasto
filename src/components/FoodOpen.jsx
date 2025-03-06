import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import HamburgerMenu from "./HamburgerMenu";
import Modal from "./Modal";
import "../styles/FoodOpen.css";
import Spinner from "../components/Spinner"
import { IoMdAdd } from "react-icons/io"; 
import { MdDelete } from "react-icons/md"; 

const baseURL = import.meta.env.REACT_APP_BASEURL;


const FoodOpen = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const foodResponse = await axios.get(`${baseURL}/food/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const selectedFood = foodResponse.data.find((item) => item._id === id);
        if (!selectedFood) {
          navigate("/");
          return;
        }

        setFood(selectedFood);

        const imageResponse = await axios.get(`${baseURL}/food/photo/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });

        setImageUrl(URL.createObjectURL(imageResponse.data));
      } catch (error) {
        console.error("Error fetching food details", error);
        navigate("/dashboard");
      }
    };

    fetchFoodDetails();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [id, navigate]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item._id === food._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...food, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setModal({
      isOpen: true,
      title: "Item Added",
      message: `${quantity} ${food.name} added to cart!`,
      onConfirm: () => setModal({ isOpen: false }),
    });
  };

  const handleDelete = async () => {
    setModal({
      isOpen: true,
      title: "Confirm Deletion",
      message: `Are you sure you want to delete ${food.name}?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${baseURL}/food/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setModal({
            isOpen: true,
            title: "Deleted",
            message: `${food.name} deleted successfully!`,
            onConfirm: () => navigate("/"),
          });
        } catch (error) {
          console.error("Error deleting food item", error);
          setModal({
            isOpen: true,
            title: "Error",
            message: "Failed to delete item",
            onConfirm: () => setModal({ isOpen: false }),
          });
        }
      },
    });
  };

  if (!food) return <Spinner/>;

  return (
    <div className="food-details-container">
      <HamburgerMenu />

      

      <div className="food-details">
        <div className="food-image-container">
          <img src={imageUrl || "default-image.jpg"} alt={food.name} className="food-detail-image" />
        </div>

        <div className="food-info">
          <h2>{food.name}</h2>
          <p className="food-tag">Category: <span>{food.tag || "N/A"}</span></p>
          <p className="food-full-description">{food.description}</p>
          <p className="food-price">Price: ₹{food.price}</p>

          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <IoMdAdd className="cart-icon" /> Add Item
          </button>
          
        </div>
        <button className="delete-food-btn" onClick={handleDelete}>
        <MdDelete className="delete-icon" /> Delete Item
      </button>
      </div>
    
      <Modal {...modal} onClose={() => setModal({ isOpen: false })} />
    </div>
  );
};

export default FoodOpen;
