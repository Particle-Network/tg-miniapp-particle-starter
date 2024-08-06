import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";

import { Root } from "@/components/Root";

import "normalize.css/normalize.css";
import "./_assets/globals.css";

export const metadata: Metadata = {
  title: "Your Application Title Goes Here",
  description: "Your application description goes here",
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
