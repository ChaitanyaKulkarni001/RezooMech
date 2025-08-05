import { useState } from "react";

const ContactForm = ({ onSave }) => {
  const [contact, setContact] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    country: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", contact);
    onSave(contact)
  };
  const handleBack = () => {
    onBack();
  };
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          How can employers get in touch with you?
        </h2>
        <p className="text-gray-600 mb-6">
          For your resume header, include (at minimum) your name and email so employers can contact you.
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="fullName" 
            placeholder="Full Name" 
            value={contact.fullName} 
            onChange={handleChange} 
            className="p-3 border rounded-md" 
            required
          />
          <input 
            type="text" 
            name="city" 
            placeholder="City" 
            value={contact.city} 
            onChange={handleChange} 
            className="p-3 border rounded-md"
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={contact.email} 
            onChange={handleChange} 
            className="p-3 border rounded-md" 
            required
          />
          <input 
            type="text" 
            name="country" 
            placeholder="Country" 
            value={contact.country} 
            onChange={handleChange} 
            className="p-3 border rounded-md"
          />
          <input 
            type="text" 
            name="phone" 
            placeholder="Phone Number" 
            value={contact.phone} 
            onChange={handleChange} 
            className="p-3 border rounded-md col-span-2"
          />
          <div className="col-span-2 flex justify-between mt-4">
          <button type="button" onClick={handleBack} className="text-purple-600">Back</button>
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md">
              Next: Work Experience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
