import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api/config';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getSubtotal } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (productId: number, change: number) => {
    const item = cartItems.find((item) => item.product.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity + change);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getDiscountedPrice = (price: number, discount?: number) => {
    return price * (1 - (discount || 0));
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className={`flex flex-col items-center justify-center text-center py-20 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          role="status"
          aria-live="polite"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-16 w-16 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.6 8M17 13l1.6 8M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          <p className={`${darkMode ? 'text-light' : 'text-gray-800'} text-xl font-medium`}>
            Your cart is empty
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={`text-3xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
      >
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table
              className={`w-full ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-md rounded-lg overflow-hidden`}
            >
              <thead
                className={`${
                  darkMode ? 'bg-gray-700 text-light' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                    S. No.
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                    Product Image
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                    Product Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                    Unit Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                    Total
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody className={darkMode ? 'text-light' : 'text-gray-800'}>
                {cartItems.map((item, index) => {
                  const unitPrice = getDiscountedPrice(item.product.price, item.product.discount);
                  const total = unitPrice * item.quantity;

                  return (
                    <tr
                      key={item.product.productId}
                      className={`border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <td className="px-4 py-4">{index + 1}</td>
                      <td className="px-4 py-4">
                        <img
                          src={`${api.baseURL}/images/${item.product.imgName}`}
                          alt={item.product.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-4 font-medium">{item.product.name}</td>
                      <td className="px-4 py-4">{formatPrice(unitPrice)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.product.productId, -1)}
                            className={`px-3 py-1 rounded ${
                              darkMode
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-gray-200 hover:bg-gray-300'
                            } transition-colors duration-200`}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product.productId, 1)}
                            className={`px-3 py-1 rounded ${
                              darkMode
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-gray-200 hover:bg-gray-300'
                            } transition-colors duration-200`}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold">{formatPrice(total)}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => removeFromCart(item.product.productId)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          aria-label="Remove item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {cartItems.map((item, index) => {
              const unitPrice = getDiscountedPrice(item.product.price, item.product.discount);
              const total = unitPrice * item.quantity;

              return (
                <div
                  key={item.product.productId}
                  className={`${
                    darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'
                  } shadow-md rounded-lg p-4`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block px-2 py-1 text-sm font-semibold ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        } rounded`}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <img
                      src={`${api.baseURL}/images/${item.product.imgName}`}
                      alt={item.product.name}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                      <p className="text-sm mb-1">
                        Unit Price: <span className="font-medium">{formatPrice(unitPrice)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.product.productId, -1)}
                        className={`px-3 py-1 rounded ${
                          darkMode
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-200 hover:bg-gray-300'
                        } transition-colors duration-200`}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product.productId, 1)}
                        className={`px-3 py-1 rounded ${
                          darkMode
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-200 hover:bg-gray-300'
                        } transition-colors duration-200`}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-lg font-semibold">{formatPrice(total)}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => removeFromCart(item.product.productId)}
                      className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                      aria-label="Remove item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div
            className={`${
              darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'
            } shadow-md rounded-lg p-6 sticky top-4`}
          >
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(getSubtotal())}</span>
              </div>
            </div>

            <button
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 opacity-60 cursor-not-allowed"
              disabled
              aria-label="Proceed to checkout (not available)"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
