import './IconButton.css';

interface IconButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

export function IconButton({ onClick, title, children }: IconButtonProps) {
  return (
    <button className="icon-button" onClick={onClick} title={title}>
      {children}
    </button>
  );
}
