import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically sign in as superadmin for development
    const devSignIn = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "superadmin@quickmeds.com",
        password: "superadmin123",
      });

      if (error) {
        console.error("Dev login error:", error);
      }

      // Redirect to dashboard regardless of login status
      navigate("/dashboard");
    };

    devSignIn();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default Auth;