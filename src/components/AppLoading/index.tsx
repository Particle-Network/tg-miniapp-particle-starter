import logo from "@/assets/logo-text.png";
import Image from "next/image";

export const AppLoading = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="absolute flex h-screen w-screen flex-col items-center justify-center gap-4">
      <Image src={logo} alt="logo"></Image>
      {children}
    </div>
  );
};
