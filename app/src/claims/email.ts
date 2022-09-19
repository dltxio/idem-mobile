import { IClaim } from "./iclaim";

export class Email<T> {
  // implements IClaim
  mnemonic;
  title;
  description;

  constructor() {
    this.mnemonic = "email";
    this.title = "Email";
    this.description = "Users email address";
  }

  public async load(): Promise<boolean> {
    return false;
  }

  public async save(value: T): Promise<void> {
    // todo
  }

  public async verify(): Promise<void> {
    //
  }

  // is verifing

  //
}
