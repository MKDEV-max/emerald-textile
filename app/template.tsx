/** Спокойный переход между страницами: fade 300 мс. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
