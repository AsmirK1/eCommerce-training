interface DashboardStatsProps {
  data: {
    storeName: string;
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    conversionRate: string;
    recentOrders: any[];
    products: any[];
  };
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      name: 'Total Revenue',
      value: `$${data.totalRevenue.toFixed(2)}`,
      change: '+4.75%',
      changeType: 'positive'
    },
    {
      name: 'Total Orders',
      value: data.totalOrders.toString(),
      change: '+2.02%',
      changeType: 'positive'
    },
    {
      name: 'Total Products',
      value: data.totalProducts.toString(),
      change: '+5.45%',
      changeType: 'positive'
    },
    {
      name: 'Conversion Rate',
      value: `${data.conversionRate}%`,
      change: '+1.32%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{stat.name}</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-blue-600">
                  {stat.value}
                </div>
                <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0 ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </div>
              </dd>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {data.recentOrders.slice(0, 5).map((order) => (
                <li key={order.orderId} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">#{order.orderId.slice(-4)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Order {order.orderId}</div>
                        <div className="text-sm text-gray-500">${order.total.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
              {data.recentOrders.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">
                  No recent orders
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {data.products.slice(0, 5).map((product) => (
                <li key={product.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-8 w-8 object-cover rounded" />
                        ) : (
                          <span className="text-gray-400 text-xs">📦</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">${product.price.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">
                        {product.quantity} in stock
                      </span>
                    </div>
                  </div>
                </li>
              ))}
              {data.products.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">
                  No products yet
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}