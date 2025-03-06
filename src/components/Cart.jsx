import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";
import HamburgerMenu from "./HamburgerMenu";
import { FiTrash2 } from "react-icons/fi";
import { FaQrcode } from "react-icons/fa";
import Qrimage from "../image/qrcode.jpg" ;
import "../styles/Cart.css";

const baseURL = import.meta.env.REACT_APP_BASEURL;


const Cart = () => {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
  const [qrModal, setQrModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      setModal({ isOpen: true, title: "Error", message: "Please enter your name.", onConfirm: () => setModal({ isOpen: false }) });
      return;
    }

    const orderData = {
      customerName,
      items: cart,
      totalAmount: calculateTotal(),
      status: "Pending",
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/orders/create-order`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModal({
        isOpen: true,
        title: "Order Placed",
        message: "Your order has been placed successfully!",
        onConfirm: () => {
          localStorage.removeItem("cart");
          setCart([]);
        },
      });
    } catch (error) {
      console.error("Order Error:", error);
      setModal({ isOpen: true, title: "Error", message: "Failed to place order.", onConfirm: () => setModal({ isOpen: false }) });
    }
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <div className="cart-container">
      <HamburgerMenu />
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <p key={item._id}>{item.name} x {item.quantity}</p>
          ))}
          <h3>Total Amount: ₹{calculateTotal()}</h3>
        </>
      )}

      <input
        type="text"
        className="customer-name-input"
        placeholder="Enter customer name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <div className="cart-buttons">
        <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
        <button className="clear-cart-btn" onClick={handleClearCart}>
          <FiTrash2 /> Clear Cart
        </button>
        <button className="qr-btn" onClick={() => setQrModal(true)}>
          <FaQrcode /> QR Code
        </button>
      </div>

      <Modal {...modal} onClose={() => setModal({ isOpen: false })} />

      {qrModal && (
        <Modal
          isOpen={qrModal}
          title="Scan QR Code"
          message={<img src={Qrimage}alt="QR Code" className="qr-image" />}
          onClose={() => setQrModal(false)}
        />
      )}
    </div>
  );
};

export default Cart;
