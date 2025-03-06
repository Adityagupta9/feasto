import React, { useState } from "react";
import axios from "axios";
import HamburgerMenu from "./HamburgerMenu"; 
import "../styles/CreateItem.css"; // Ensure this CSS file exists

const CreateItem = () => {
const baseURL = import.meta.env.REACT_APP_BASEURL;  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    tag: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const tags = [
    "North Indian", 
    "Chinese", 
    "Salad", 
    "Mughlai", 
    "Biryani", 
    "Seafood", 
    "Beverages", 
    "Desserts"
  ]; // Options for tag dropdown
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    if (!formData.name || !formData.description || !formData.price || !formData.tag) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }
  
    const itemData = new FormData();
    itemData.append("name", formData.name);
    itemData.append("description", formData.description);
    itemData.append("price", formData.price);
    itemData.append("tag", formData.tag);
    if (formData.image) {
        itemData.append("photo", formData.image); 
    }
  
    // 🔹 Get token from localStorage (or context)
    const token = localStorage.getItem("token"); // Ensure token is stored during login
    if (!token) {
      console.error("❌ No token found! User is not authenticated.");
      setMessage("Unauthorized: Please log in first.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(`${baseURL}/food/create`, itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` // ✅ Include token here
        },
      });
  
      console.log("✅ Response:", response.data);
      setMessage(response.data.message);
      setFormData({ name: "", description: "", price: "", tag: "", image: null });
    } catch (error) {
      console.error("❌ Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="create-item-container">
        <HamburgerMenu/>
      <h2>Create New Food Item</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="create-item-form">
        <label>Item Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Tag</label>
        <select name="tag" value={formData.tag} onChange={handleChange} required>
          <option value="" disabled>Select a tag</option>
          {tags.map((tag, index) => (
            <option key={index} value={tag}>{tag}</option>
          ))}
        </select>

        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Item"}</button>
      </form>
    </div>
  );
};

export default CreateItem;
