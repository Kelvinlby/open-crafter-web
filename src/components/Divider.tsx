export function Divider({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      style={{
        alignSelf: 'stretch',
        ...(vertical
          ? { width: 1, minHeight: '100%' }
          : { height: 1, width: '100%', margin: '8px 0' }),
        background: 'var(--md-sys-color-outline-variant)',
        flexShrink: 0,
      }}
    />
  );
}
