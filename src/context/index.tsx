"use client";

import { AuthType } from "@particle-network/auth-core";
import { useConnect } from "@particle-network/auth-core-modal";
import {
  useLaunchParams,
  useMiniApp,
  usePopup,
} from "@telegram-apps/sdk-react";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

// Define the shape of the context data
type ContextValue = {
  handleError: (error: any) => void;
  connectError: any;
};

// Create the context for the app
export const AppContext = createContext<ContextValue | null>(null);

/**
 * AppProvider Component
 *
 * This component sets up the application context for managing connection errors.
 * It handles the initialization and management of connection errors within the app.
 */
export const AppProvider = ({ children }: React.PropsWithChildren) => {
  // Initialize hooks for Telegram and Particle Network
  const miniApp = useMiniApp();
  const popup = usePopup();
  const { initDataRaw } = useLaunchParams();
  const { connect, connectionStatus } = useConnect();

  // State management for connection errors
  const [connectError, setConnectError] = useState<any>();
  const initDataConnectedRef = useRef(false);

  // Function to connect using Telegram, with error handling
  const connectWithTelegram = useCallback(
    async (initData: string) => {
      try {
        await connect({
          provider: AuthType.telegram,
          thirdpartyCode: initData,
        });
      } catch (error: any) {
        setConnectError(error);
        toast.error("Create wallet error, please reload this page.");
      }
    },
    [connect]
  );

  // Effect to handle automatic connection using Telegram
  useEffect(() => {
    if (initDataRaw && connectionStatus === "disconnected" && !connectError) {
      if (initDataConnectedRef.current) {
        return;
      }
      initDataConnectedRef.current = true;
      connectWithTelegram(initDataRaw);
    }
  }, [initDataRaw, connectionStatus, connectError, connectWithTelegram]);

  // Error handling function using useCallback to memoize the function
  const handleError = useCallback(
    (error: any) => {
      console.log("handleError", error);
      if (error.error_code === 10005) {
        if (!initDataConnectedRef.current && initDataRaw) {
          connectWithTelegram(initDataRaw);
        } else {
          popup
            .open({
              title: "Invalid Token",
              message: "Please reopen this mini app.",
              buttons: [{ type: "ok", id: "close" }],
            })
            .then((id) => {
              if (id === "close") {
                miniApp.close();
              }
            })
            .catch(() => {
              // Handle any popup errors here
            });
        }
      } else {
        toast.error(error.message || "unknown error occurred");
      }
    },
    [initDataRaw, connectWithTelegram, popup, miniApp]
  );

  return (
    <AppContext.Provider
      value={{
        handleError,
        connectError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to access the AppContext
 */
export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context)
    throw Error("useAppContext must be used within an AppProvider.");
  return context;
};
