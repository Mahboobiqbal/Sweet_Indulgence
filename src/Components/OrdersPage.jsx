import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchUserProfile();
    fetchOrders();
  }, [currentPage]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view orders');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.user.role);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view orders');
        return;
      }

      let url = `http://localhost:5000/api/orders?page=${currentPage}&limit=${ordersPerPage}`;
      
      // If user is a supplier, get their store orders
      if (userRole === 'supplier') {
        // First get the supplier's store
        const storeResponse = await fetch('http://localhost:5000/api/stores/check', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (storeResponse.ok) {
          const storeData = await storeResponse.json();
          if (storeData.hasStore && storeData.store) {
            url = `http://localhost:5000/api/orders/store/${storeData.store.store_id}?page=${currentPage}&limit=${ordersPerPage}`;
          }
        }
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.order_id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data.order);
      } else {
        toast.error('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
    }
  };

  const openOrderDetails = (order) => {
    fetchOrderDetails(order.order_id);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3756b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-20">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {userRole === 'supplier' ? 'Store Orders' : 'My Orders'}
            </h2>
            <div className="text-sm text-gray-600">
              Total: {orders.length} orders
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {userRole === 'supplier' 
                  ? "You haven't received any orders yet." 
                  : "You haven't placed any orders yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-3 font-semibold text-gray-700">Order ID</th>
                      {userRole === 'supplier' && (
                        <th className="px-4 py-3 font-semibold text-gray-700">Customer</th>
                      )}
                      <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Total</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Payment</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.order_id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm">
                          {order.order_id.substring(0, 8)}...
                        </td>
                        {userRole === 'supplier' && (
                          <td className="px-4 py-3">
                            {order.customer_name || 'Customer'}
                          </td>
                        )}
                        <td className="px-4 py-3">
                          {formatDate(order.date_created)}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-4 py-3">
                          {userRole === 'supplier' ? (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                              className="px-3 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d3756b] text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.payment_status)}`}>
                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="px-4 py-2 bg-gradient-to-r from-[#d3756b] to-[#c25d52] text-white hover:from-[#c25d52] hover:to-[#b54842] rounded font-semibold text-sm transition duration-200"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded ${
                          currentPage === page
                            ? 'bg-[#d3756b] text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Order Details - {selectedOrder.order_id.substring(0, 8)}...
              </h3>
              <button
                onClick={closeOrderDetails}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-3 text-gray-700">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.date_created)}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </p>
                  <p><strong>Payment Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.payment_status)}`}>
                      {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                    </span>
                  </p>
                  {selectedOrder.payment_method && (
                    <p><strong>Payment Method:</strong> {selectedOrder.payment_method}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-gray-700">Shipping Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Address:</strong> {selectedOrder.shipping_address}</p>
                  <p><strong>City:</strong> {selectedOrder.shipping_city}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shipping_phone}</p>
                </div>
              </div>
            </div>

            {selectedOrder.order_notes && (
              <div className="mb-6">
                <h4 className="font-medium mb-2 text-gray-700">Order Notes</h4>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.order_notes}</p>
              </div>
            )}

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-700">Items Ordered</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-3 py-2 text-left">Product</th>
                        <th className="border border-gray-200 px-3 py-2 text-center">Quantity</th>
                        <th className="border border-gray-200 px-3 py-2 text-right">Unit Price</th>
                        <th className="border border-gray-200 px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-200 px-3 py-2">{item.product_name || item.name}</td>
                          <td className="border border-gray-200 px-3 py-2 text-center">{item.quantity}</td>
                          <td className="border border-gray-200 px-3 py-2 text-right">
                            {formatCurrency(item.unit_price || item.price)}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right font-medium">
                            {formatCurrency(item.total_price || (item.quantity * (item.unit_price || item.price)))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  {selectedOrder.loyalty_points_used > 0 && (
                    <p>Loyalty Points Used: {selectedOrder.loyalty_points_used}</p>
                  )}
                  {selectedOrder.loyalty_points_earned > 0 && (
                    <p>Loyalty Points Earned: {selectedOrder.loyalty_points_earned}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total: {formatCurrency(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeOrderDetails}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded font-semibold transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;