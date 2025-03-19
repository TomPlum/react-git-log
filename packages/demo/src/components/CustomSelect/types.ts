import { ReactNode } from 'react'

export interface CustomSelectProps {
  value: string;
  className?: string;
  onChange: (value: string) => void;
  options: { label: ReactNode; value: string }[];
}