export interface IExchange {
  signUp: (name: string, email: string) => Promise<void>;
}
export enum claimStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED"
}
