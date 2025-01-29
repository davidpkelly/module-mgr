import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import NavBar from "../components/NavBar";
import HomePage from "../components/HomePage";
import Footer from "../components/Footer";

import { useAuth } from "../auth";

import "./index.css";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/main' });
    }
  },
  component: IndexPage,
});

function IndexPage() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout??')) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: '/' })
        })
      })
    }
  }

  return (
    <>
      <NavBar isAuthenticated={auth.isAuthenticated} handleLogout={handleLogout}/>
      <HomePage />
      <Footer />
    </>
  );
}
