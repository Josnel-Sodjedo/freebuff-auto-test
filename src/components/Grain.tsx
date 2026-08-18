/**
 * Grain de film + vignette, posés au-dessus du contenu pour
 * une matière éditoriale « cinéma ». Purement décoratifs.
 */
export default function Grain() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  );
}
