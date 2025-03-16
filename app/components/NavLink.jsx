import Link from 'next/link';
export default function NavLink({ href, pathname, children, onClick }) {
  const isActive = pathname === href;

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  }
  return (
    <Link
      href={href || '#'}
      onClick={handleClick}
      className={`px-3 py-2 rounded ${isActive
        ? "bg-blue-500 text-white"
        : "hover:text-blue-500"
        }`}
    >
      {children}
    </Link>
  )
}
