export interface IClaim {
  mnemonic: string;
  title: string;
  description: string;
  load(): Promise<boolean>;
  save(): Promise<void>;
  verify(): Promise<void>;
}