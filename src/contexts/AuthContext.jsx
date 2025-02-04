import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCollection } from "@/integrations/mongodb/client";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Check session storage for user data
      const session = sessionStorage.getItem('user');
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const collection = await getCollection("profiles");
      const user = await collection.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      // In a real app, you should hash passwords and compare hashes
      if (user.password !== password) {
        throw new Error("Invalid password");
      }

      // Store user data in session storage
      const userData = {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      };
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      navigate("/dashboard");
      return { user: userData };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      sessionStorage.removeItem('user');
      setUser(null);
      navigate("/auth");
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error signing out",
      });
    }
  };

  const value = {
    user,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};