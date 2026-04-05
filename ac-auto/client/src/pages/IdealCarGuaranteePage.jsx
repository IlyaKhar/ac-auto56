import { IdealCarGuaranteeSection } from "../components/IdealCarGuaranteeSection.jsx";

/** Отдельный URL /page/idealnyy-avtomobil-s-garantiey — тот же блок + «На главную». */
export default function IdealCarGuaranteePage() {
  return (
    <div className="bg-white">
      <IdealCarGuaranteeSection asStandalonePage />
    </div>
  );
}
