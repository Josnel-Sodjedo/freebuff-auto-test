interface EyebrowProps {
  index: string;
  label: string;
}

/** Petit label éditorial de section : ( 01 — Nom ). */
export default function Eyebrow({ index, label }: EyebrowProps) {
  return (
    <p className="eyebrow">
      <span className="eyebrow__index">( {index} )</span>
      <span className="eyebrow__line" aria-hidden="true" />
      <span>{label}</span>
    </p>
  );
}
