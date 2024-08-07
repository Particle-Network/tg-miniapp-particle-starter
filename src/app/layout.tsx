import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";

import { Root } from "@/components/Root";

import "normalize.css/normalize.css";
import "./_assets/globals.css";

export const metadata: Metadata = {
  title: "Particle Auth AA TG Mini-app demo",
  description:
    "Telegram Mini-app demo that integrates an EVM-compatible wallet using Account Abstraction with the Particle Network SDKs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  maximumScale: 1,
  minimumScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className="overflow-x-hidden overflow-y-scroll"
        style={{
          height: "var(--tg-viewport-height)",
        }}
      >
        <Root>{children}</Root>
      </body>
    </html>
  );
}
