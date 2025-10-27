export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white text-gray-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} E-Commerce. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#" className="hover:text-gray-900 transition-colors">Homepage</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Products</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Cart</a>
        </div>
      </div>
    </footer>
  );
}
