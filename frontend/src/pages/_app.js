import "@/styles/globals.css";
import { ThemeProvider } from "../components/theme/theme-provider";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useEffect } from "react";
import { setTokenFromStorage } from "../store/feature/auth/authSlice";
import { Toaster } from "@/components/ui/sonner";
import { getUserInfo } from "../store/feature/auth/authThunk";
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '@/components/custom/hook/useSocket';
import { clearAuthState } from '@/store/feature/auth/authSlice';

function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const { user, token, dataLoaded, loading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      dispatch(setTokenFromStorage(savedToken));
      // Only fetch user info if not already loaded and we don't have user data
      if (!dataLoaded.user && !user) {
        dispatch(getUserInfo());
      }
    } else {
      dispatch(clearAuthState());
    }
  }, [dispatch]); // Remove dataLoaded.user from dependencies

  // Initialize socket connection
  useSocket();

  return children;
}

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>
        <AppInitializer>
          <Component {...pageProps} />
          <Toaster />
        </AppInitializer>
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
