import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Packages from "@/pages/Packages";
import PackageDetail from "@/pages/PackageDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-heading">{title}</h1>
      <p className="mt-2 text-[#5B6478] dark:text-[#9AA3BA]">This page is under construction. Check back soon!</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/:name" element={<PackageDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        
        <Route path="docs" element={<ComingSoon title="Documentation" />} />
        <Route path="categories" element={<ComingSoon title="Categories" />} />
        <Route path="community" element={<ComingSoon title="Community" />} />
        <Route path="my-packages" element={<ComingSoon title="My Packages" />} />
        <Route path="profile" element={<ComingSoon title="Profile" />} />
        <Route path="settings" element={<ComingSoon title="Settings" />} />
      </Route>
    </Routes>
  );
}