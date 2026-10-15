export interface Team {
  id: number;
  name: string;
  base: string | null;
  foundedYear: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
