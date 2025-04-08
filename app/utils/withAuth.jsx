import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent, requiredRole = null) => {
  return (props) => {
    const { user, loggedIn, checkAuthStatus } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false); // ✅ Track if redirection is happening

    useEffect(() => {
      const fetchUser = async () => {
        await checkAuthStatus();
        setLoading(false);
      };

      if (!loggedIn) {
        fetchUser();
      } else {
        setLoading(false);
      }
    }, [loggedIn, checkAuthStatus]);

    useEffect(() => {
      if (!loading && !redirecting) {
        if (!loggedIn) {
          setRedirecting(true);
          router.replace("/login"); // ✅ Use `replace` instead of `push`
        } else if (requiredRole && user?.role !== requiredRole) {
          setRedirecting(true);
          router.replace(user?.role === "admin" ? "/admin/dashboard" : "/users/dashboard");
        }
      }
    }, [loggedIn, user, router, loading, redirecting]);

    if (loading || redirecting) {
      return <p className="text-center mt-10">Redirecting...</p>; // ✅ Show loading instead of blank screen
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
