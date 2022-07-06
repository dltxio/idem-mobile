export interface IExchange {
  signUp: (name: string, email: string) => Promise<void>;
}
