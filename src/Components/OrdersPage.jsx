import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customerName: "Alice Smith",
      date: "2025-06-10",
      total: 99.99,
      status: "Pending",
      items: [
        { name: "Product A", quantity: 2, price: 29.99 },
        { name: "Product B", quantity: 1, price: 40.01 },
      ],
      shippingAddress: "123 Main St, Cityville, 12345",
    },
    {
      id: "ORD002",
      customerName: "Bob Johnson",
      date: "2025-06-12",
      total: 149.5,
      status: "Shipped",
      items: [{ name: "Product C", quantity: 1, price: 149.5 }],
      shippingAddress: "456 Oak Ave, Townsville, 67890",
    },
    {
      id: "ORD003",
      customerName: "Carol White",
      date: "2025-06-14",
      total: 75.0,
      status: "Delivered",
      items: [{ name: "Product D", quantity: 3, price: 25.0 }],
      shippingAddress: "789 Pine Rd, Villagetown, 11223",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer />
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-10">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 font-semibold">Order ID</th>
                  <th className="px-4 py-2 font-semibold">Customer</th>
                  <th className="px-4 py-2 font-semibold">Date</th>
                  <th className="px-4 py-2 font-semibold">Total</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.customerName}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="px-4 py-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded font-semibold"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              Order Details - {selectedOrder.id}
            </h3>
            <div className="mb-4">
              <p>
                <strong>Customer:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong>Date:</strong> {selectedOrder.date}
              </p>
              <p>
                <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Items</h4>
              <ul className="list-disc pl-5">
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - Quantity: {item.quantity} - Price: $
                    {item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Shipping Address</h4>
              <p>{selectedOrder.shippingAddress}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeOrderDetails}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
