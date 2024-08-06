"use client";

import { SettingsIcon, WalletIcon } from "@/assets/icons";
import { useAppContext } from "@/context"; // Only used for connectError
import { copyTextToClipboard, shortString } from "@/utils";
import {
  Button,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
} from "@nextui-org/react";

import { useMiniApp, useViewport } from "@telegram-apps/sdk-react";
import { blo, type Address } from "blo";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

// Custom components
import { AppLoading } from "../AppLoading"; // Loading screen
import EVMDemo from "../EVMDemo"; // Actual application
import Footer from "../Footer";

// Particle imports
import {
  useAuthCore,
  useConnect,
  useEthereum,
  useUserInfo,
} from "@particle-network/auth-core-modal";
import { SmartAccount } from "@particle-network/aa";
import { BaseSepolia, EthereumSepolia } from "@particle-network/chains";

/**
 * Page Component
 *
 * This component manages the main user interface.
 * It includes wallet management, tab navigation, and connection status handling.
 */
export const Page = () => {
  // Hooks and Context
  const { connectionStatus } = useConnect();
  const { chainInfo, provider } = useEthereum();
  const { userInfo } = useUserInfo();
  const { openWallet, openAccountAndSecurity } = useAuthCore();

  // Fetch connectError from context
  const { connectError } = useAppContext();

  // Local State Management
  const [selected, setSelected] = useState<string>("evm");
  const [address, setAddress] = useState<string>("evm");
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);

  // Telegram SDK Hooks
  const viewport = useViewport();
  const miniApp = useMiniApp();

  // Initialize Smart Account in this component
  // Pass the smart account in the other components that need it
  useEffect(() => {
    if (provider) {
      try {
        const smartAccountInstance = new SmartAccount(provider, {
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
          clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
          appId: process.env.NEXT_PUBLIC_APP_ID as string,
          aaOptions: {
            accountContracts: {
              SIMPLE: [
                {
                  version: "2.0.0",
                  chainIds: [EthereumSepolia.id, BaseSepolia.id],
                },
              ],
            },
          },
        });
        setSmartAccount(smartAccountInstance);
      } catch (error) {
        console.error("Failed to initialize smart account:", error);
      }
    }
  }, [provider]);

  // Effect to Expand Viewport
  useEffect(() => {
    if (viewport) {
      viewport.expand();
    }
  }, [viewport]);

  // Fetch Smart Wallet Address
  useEffect(() => {
    const fetchAddress = async () => {
      if (smartAccount) {
        try {
          const smartWalletAddress = await smartAccount.getAddress();
          setAddress(smartWalletAddress);
        } catch (error) {
          console.error("Failed to fetch smart wallet address:", error);
        }
      }
    };

    fetchAddress();
  }, [smartAccount, address]);

  /**
   * Copies the provided text to the clipboard.
   *
   * @param {string} text - The text to be copied.
   */
  const copyText = useCallback((text: string) => {
    copyTextToClipboard(text);
  }, []);

  /**
   * Opens the wallet interface with specified options.
   */
  const handleOpenWallet = useCallback(() => {
    openWallet({
      windowSize: "large",
      topMenuType: "close",
    });
  }, [openWallet]);

  /**
   * Handles user actions from the settings menu.
   *
   * @param {string | number} key - The key representing the selected action.
   */
  const handleAction = useCallback(
    (key: string | number) => {
      if (key === "logout") {
        handleLogout();
      } else if (key === "account-security") {
        openAccountAndSecurity();
      }
    },
    [openAccountAndSecurity]
  );

  /**
   * Logs out the user and closes the mini app.
   */
  const handleLogout = useCallback(() => {
    localStorage.clear();
    miniApp.close();
  }, [miniApp]);

  // Renders loading screen and errors if the user is not connected
  if (connectionStatus !== "connected") {
    return (
      <AppLoading>
        {!connectError && (
          <div className="text-gray-400">Connecting Wallet...</div>
        )}
        {connectError?.message && (
          <div className="px-4 text-center text-danger">
            {connectError.message}
          </div>
        )}
        {connectError?.extra && typeof connectError?.extra === "string" && (
          <div className="px-4 text-center text-danger">
            {connectError.extra}
          </div>
        )}
        {connectError && (
          <Button color="danger" onClick={() => miniApp.close()}>
            Close
          </Button>
        )}
        <Footer />
      </AppLoading>
    );
  }

  // Main User Interface
  return (
    <div className="relative box-border flex h-full w-full flex-col items-center bg-[#181A1B] px-4 pb-10 pt-4 text-white">
      <div className="absolute right-4 top-4 flex gap-3">
        <Button
          isIconOnly
          aria-label="Wallet"
          className="rounded-full bg-gradient-to-r from-[#4F44D5] to-[#8B5CF6] shadow-lg hover:from-[#8B5CF6] hover:to-[#4F44D5] text-slate-300"
          onClick={handleOpenWallet}
        >
          <WalletIcon />
        </Button>
        <Popover placement="bottom-end" showArrow={true}>
          <PopoverTrigger>
            <Button
              isIconOnly
              aria-label="Settings"
              className="rounded-full bg-gradient-to-r from-[#4F44D5] to-[#8B5CF6] shadow-lg hover:from-[#8B5CF6] hover:to-[#4F44D5] text-slate-300"
            >
              <SettingsIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-[#242526] text-gray-200">
            <Listbox aria-label="Actions" onAction={handleAction}>
              <ListboxItem
                key="account-security"
                color="default"
                className="text-gray-300 hover:text-white"
              >
                Account And Security
              </ListboxItem>
              <ListboxItem
                key="logout"
                className="text-danger hover:text-red-700"
                color="danger"
              >
                Logout
              </ListboxItem>
            </Listbox>
          </PopoverContent>
        </Popover>
      </div>

      <Image
        className="mt-8 h-20 w-20 rounded-full border-4 border-[#242526]"
        src={
          userInfo?.avatar ||
          blo(
            (address || "0xe8fc0baE43aA264064199dd494d0f6630E692e73") as Address
          )
        }
        width={80}
        height={80}
        alt={address || "address"}
        placeholder="blur"
        blurDataURL={blo(
          (address || "0xe8fc0baE43aA264064199dd494d0f6630E692e73") as Address
        )}
        unoptimized
      />

      {smartAccount && (
        <div
          className="mt-4 cursor-pointer text-base font-semibold text-[#8B5CF6] underline"
          onClick={() => copyText(address!)}
        >
          {shortString(address)}
        </div>
      )}

      <Tabs
        fullWidth
        size="md"
        aria-label="Tabs chains"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
        className="mt-4 w-full text-gray-300"
        color="primary"
        variant="underlined"
        classNames={{
          panel: "w-full h-full overflow-y-auto bg-[#242526] rounded-lg p-4",
          tab: "text-gray-400 hover:text-white",
        }}
      >
        <Tab
          key="evm"
          title={
            <div className="flex items-center space-x-2 font-bold text-white">
              <Image
                className="h-6 w-6 rounded-full border-4 border-[#242526]"
                src={chainInfo.icon}
                width={10}
                height={10}
                alt={"Chain Icon"}
                placeholder="blur"
                blurDataURL={blo(
                  (address ||
                    "0xe8fc0baE43aA264064199dd494d0f6630E692e73") as Address
                )}
                unoptimized
              />
              <span>{chainInfo.fullname}</span>
            </div>
          }
        >
          <EVMDemo smartAccount={smartAccount} />
        </Tab>
      </Tabs>
      <Footer />
    </div>
  );
};
