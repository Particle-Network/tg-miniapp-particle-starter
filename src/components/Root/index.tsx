"use client";

import { NextUIProvider } from "@nextui-org/react";
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  SDKProvider,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from "@telegram-apps/sdk-react";
import { useEffect, type PropsWithChildren } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorPage } from "@/components/ErrorPage";
import { useDidMount } from "@/hooks/useDidMount";
import { useTelegramMock } from "@/hooks/useTelegramMock";
import { Toaster } from "sonner";
import { AppProvider } from "../../context";
import { AppLoading } from "../AppLoading";

// Import Particle Auth and related utilities
import { AuthCoreContextProvider } from "@particle-network/auth-core-modal";
import { BaseSepolia, EthereumSepolia } from "@particle-network/chains";

// Sets the environment to development if running in development mode
if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_PARTICLE_ENV === "development"
) {
  window.__PARTICLE_ENVIRONMENT__ = "development";
}

/**
 * App Component
 *
 * This component handles the main application logic, binding theme and viewport settings,
 * and configure authentication context with Particle Network.
 */
function App(props: PropsWithChildren) {
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  // Bind CSS variables for mini app styles based on theme and viewport
  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  return (
    <NextUIProvider>
      <AuthCoreContextProvider
        options={{
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
          clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
          appId: process.env.NEXT_PUBLIC_APP_ID as string,
          themeType: "dark",
          // Define UI elements for the smart account
          erc4337: {
            name: "SIMPLE",
            version: "2.0.0",
          },
          wallet: {
            themeType: "dark",
            customStyle: {
              // Locks the chain selector to IoTeX mainnet and testnet
              supportChains: [EthereumSepolia, BaseSepolia],
              dark: {
                colorAccent: "#7DD5F9",
                colorPrimary: "#21213a",
                colorOnPrimary: "#171728",
                primaryButtonBackgroundColors: ["#5ED7FF", "#E89DE7"],
                primaryIconButtonBackgroundColors: ["#5ED7FF", "#E89DE7"],
                primaryIconTextColor: "#FFFFFF",
                primaryButtonTextColor: "#0A1161",
                cancelButtonBackgroundColor: "#666666",
                backgroundColors: [
                  "#14152e",
                  [
                    ["#e6b1f766", "#e6b1f700"],
                    ["#7dd5f94d", "#7dd5f900"],
                  ],
                ],
                messageColors: ["#7DD5F9", "#ed5d51"],
                borderGlowColors: ["#7bd5f940", "#323233"],
                modalMaskBackgroundColor: "#141430b3",
              },
            },
          },
        }}
      >
        <Toaster
          /* This component displays notifications. */
          richColors
          position="top-left"
          expand={false}
          closeButton
          duration={2000}
        />
        <AppProvider>
          <div className="box-border w-screen">{props.children}</div>
        </AppProvider>
      </AuthCoreContextProvider>
    </NextUIProvider>
  );
}

/**
 * RootInner Component
 *
 * This component wraps the App component with additional logic, such as debugging tools
 * and SDK provider setup for the Telegram mini app.
 */
function RootInner({ children }: PropsWithChildren) {
  // Mock Telegram environment in development mode if needed.
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const debug = useLaunchParams().startParam === "debug";

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    // if (debug) {
    //   import('eruda').then((lib) => lib.default.init());
    // }
    import("eruda").then((lib) => lib.default.init());
  }, [debug]);

  return (
    <SDKProvider acceptCustomStyles debug={debug}>
      <App>{children}</App>
    </SDKProvider>
  );
}

/**
 * Root Component
 *
 * This component is the main entry point, handling server-side rendering constraints
 * and managing loading states.
 */
export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side
  // Rendering. That's why we are showing loader on the server side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <AppLoading>
      <div className="text-gray-400">Loading...</div>
    </AppLoading>
  );
}
