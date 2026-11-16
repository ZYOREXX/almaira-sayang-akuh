import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Penggabung kelas ala shadcn/ui: menyatukan kelas bersyarat dan meredam konflik utilitas Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
