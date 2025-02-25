import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FaClock, FaUtensils, FaCheck, FaConciergeBell, FaFileInvoiceDollar, FaCheckCircle } from "react-icons/fa";
import { Order, cancelOrder } from "@/redux/features/orderSlice";
import Swal from "sweetalert2";

interface OrderCardProps {
  order: Order;
}

const MyOrderCard = ({ order }: OrderCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const updatedOrder = useSelector((state: RootState) =>
    state.order.orders.find((o) => o.id === order.id)
  );

  const currentOrder = updatedOrder || order;

  const subTotal = currentOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0;
  const total = subTotal - discount;
  const statuses = ["Pending", "Cooking", "Ready", "Served", "Billed", "Completed"];
  const statusIcons = [
    <FaClock key="pending" />,
    <FaUtensils key="cooking" />,
    <FaCheck key="ready" />,
    <FaConciergeBell key="served" />,
    <FaFileInvoiceDollar key="billed" />,
    <FaCheckCircle key="completed" />
  ];

  // Determine the current status index using the up-to-date status
  const currentStatusIndex = statuses.indexOf(currentOrder.status);

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        // Dispatch the thunk and wait for it to complete
        await dispatch(cancelOrder(currentOrder.id)).unwrap();
        await Swal.fire("Order cancelled successfully!", "", "success");
      } catch (error) {
        await Swal.fire("Failed to cancel order", "", "error");
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white text-black border-2 border-black rounded-lg shadow-md p-4 mb-4">
      {/* Items */}
      {currentOrder.items.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center mb-2 mt-2">
          <div>
            <span className="font-bold text-black text-2xl">{item.quantity} * </span>
            <span className="font-bold text-black text-xl">{item.name}</span>
            {item.portion && (
              <span className="text-sm text-gray-600"> {item.portion}</span>
            )}
          </div>
          <div>
            <span className="font-semibold">
              {item.price * item.quantity} LKR
            </span>
          </div>
        </div>
      ))}

      {/* Subtotal, Discount, Total */}
      <div className="mt-3 border-t pt-2 border-gray-300">
        <div className="flex justify-between mb-1">
          <span>Sub Total:</span>
          <span>{subTotal}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Discount:</span>
          <span>{discount}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>{total}</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center mt-4 w-full">
        {statuses.map((status, index) => {
          const isActive = index <= currentStatusIndex;
          return (
            <div key={status} className="flex flex-col items-center flex-1">
              {/* Icon + Connecting Line */}
              <div className="flex items-center w-full">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {statusIcons[index]}
                </div>
                {/* Show line if it's not the last status */}
                {index !== statuses.length - 1 && (
                  <div
                    className={`flex-1 h-1 ${
                      index < currentStatusIndex ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
              {/* Status Label */}
              <span className="text-xs mt-1 text-center">{status}</span>
            </div>
          );
        })}
      </div>

      {/* Cancel Button (only show if status is "Pending") */}
      {currentOrder.status.toLowerCase() === "pending" && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrderCard;
