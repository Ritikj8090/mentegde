import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setUser,
  setWebsocketToken,
  setLoading,
} from "@/components/features/auth/authSlice";
import { RootState } from "@/components/store/store";
import { verifyUser } from "@/utils/auth";

const useAuth = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log("🔐 Checking authentication... In useAuth");
        dispatch(setLoading(true));

        const res = await verifyUser(); // assumes cookie-based or Bearer token auth
        console.log("✅ Authentication successful:", res);
        if (!res) {
          throw new Error("Missing authentication details in response");
        }
        // ✅ REST token (JWT)
        dispatch(
          setUser({
            user: res,
          })
        );

        // ✅ Separate WebSocket token
        dispatch(setWebsocketToken(res.websocketToken));
      } catch (error) {
        console.warn("⛔ Authentication failed:", error);
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    verifyAuth();
  }, [dispatch]);

  return { isLoading };
};

export default useAuth;
