export interface Project {
  id: string;
  num: string;
  title: string;
  category: string;
  year: string;
  tagline: string;
  badge: string;
  art: 'aura' | 'noir' | 'forme' | 'eclat';
  size: 'lg' | 'md' | 'sm' | 'wide';
}

export const PROJECTS: Project[] = [
  {
    id: 'aura',
    num: '01',
    title: 'AURA',
    category: 'Identité visuelle & expérience digitale',
    year: '2026',
    tagline: 'Une lumière organique, déclinée du digital au packaging.',
    badge: 'Projet à la une',
    art: 'aura',
    size: 'lg',
  },
  {
    id: 'noir',
    num: '02',
    title: 'NOIR',
    category: 'Direction artistique & identité de marque',
    year: '2025',
    tagline: 'Le contraste comme langage — une marque en noir et blanc.',
    badge: 'Branding',
    art: 'noir',
    size: 'md',
  },
  {
    id: 'forme',
    num: '03',
    title: 'FORME',
    category: 'Design digital & expérience interactive',
    year: '2025',
    tagline: 'Un site immersif où le mouvement guide le récit.',
    badge: 'Digital',
    art: 'forme',
    size: 'sm',
  },
  {
    id: 'eclat',
    num: '04',
    title: 'ÉCLAT',
    category: 'Campagne créative & direction artistique',
    year: '2024',
    tagline: 'Une campagne de lancement pensée comme un feu d’artifice.',
    badge: 'Campagne',
    art: 'eclat',
    size: 'wide',
  },
];
