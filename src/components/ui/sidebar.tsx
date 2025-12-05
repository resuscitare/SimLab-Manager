interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  children?: React.ReactNode;  // Suporte a children
}

// Resto do código do componente...