export default function Footer() {
  return (
    <footer className="bg-[#8D493A] text-white p-6 mt-auto">
      <div className="container mx-auto text-center mt-10">
        <h2 className="text-2xl font-bold mb-4">Troscán</h2>
        <div className="flex justify-center space-x-20 text-gray-300 border-b border-white pb-4">
          <div>
            <h3 className="font-bold mb-2">Sitemap</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white font-semibold  text-xl">About</a></li>
              <li><a href="#" className="hover:text-white font-semibold text-xl">Projects</a></li>
              <li><a href="#" className="hover:text-white font-semibold text-xl">News</a></li>
              <li><a href="#" className="hover:text-white font-semibold text-xl">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Socials</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white font-semibold text-xl">Facebook</a></li>
              <li><a href="#" className="hover:text-white font-semibold text-xl">Instagram</a></li>
              <li><a href="#" className="hover:text-white font-semibold text-xl">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white font-semibold text-xl">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">More</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white font-semibold text-xl">License</a></li>
              <li><a href="#" className="hover:text-white font-semibold text-xl">Grainient</a></li>
              <li><a href="#" className="hover:text-white font-semibold text-xl">Inspirux</a></li>
              <li><a href="#" className="hover:text-white font-semibold text-xl">Store</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm">&copy; 2025, All rights reserved</p>
      </div>
    </footer>
  );
}