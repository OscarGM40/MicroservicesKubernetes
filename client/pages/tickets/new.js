import { useState } from "react";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  // si estoy en el componente estoy en el front y no hay problema
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (data) => console.log(data),
  });

  const onBlur = () => {
    const value = parseFloat(price);
    // si es un string
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div className="container">
      <h1>Create New Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            // min="0.01" ya lo controla el backend
            step="0.01"
            className="form-control"
            id="price"
            placeholder="Enter price"
            onBlur={onBlur}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Create Ticket</button>
      </form>
    </div>
  );
};

export default NewTicket;
