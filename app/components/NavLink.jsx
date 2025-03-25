import Link from "next/link";

export default function NavLink({ href, pathname, children, onClick }) {
  const isActive = pathname === href;

  const isButton = !href; // Check if it's a button (logout)

  return isButton ? (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded transition duration-300 ease-in-out bg-red-500 text-white hover:bg-red-600"
    >
      {children}
    </button>
  ) : (
    <Link
      href={href}
      className={`px-3 py-2 rounded transition duration-300 ease-in-out ${isActive ? "bg-blue-500 text-white font-bold" : "hover:text-blue-500"
        }`}
    >
      {children}
    </Link>
  );
}
