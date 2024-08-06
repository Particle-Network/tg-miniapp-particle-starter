type Props = {
  onClick?: () => void;
};

const MenuItem = ({ children, onClick }: React.PropsWithChildren<Props>) => {
  return (
    <div
      className="flex h-10 w-4/5 cursor-pointer items-center justify-center rounded-3xl border border-gray-300 active:shadow"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default MenuItem;
