// lib/orderService.js

export const createOrder = async (orderData) => {
  try {
    console.log('Sending order to backend:', orderData);
    
    // Koristi backend URL umjesto relativnog patha
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Backend response:', result);

    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create order',
    };
  }
  
};

export const getUserOrders = async () => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Backend orders response:', result);

    return result;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch orders',
      orders: []
    };
  }
};

// Nova funkcija za dobijanje narudžbi po user ID-u
export const getOrdersByUserId = async (userId) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/orders/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Ako endpoint ne postoji, vrati sve narudžbe
      if (response.status === 404) {
        return getUserOrders();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return getUserOrders(); // Fallback na sve narudžbe
  }
};