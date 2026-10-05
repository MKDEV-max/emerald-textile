import { LoadingState } from "@/components/ui";

export default function Loading() {
  return (
    <div className="container" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <LoadingState label="Загружаем…" />
    </div>
  );
}
