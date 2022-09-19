import { IClaim } from "./iclaim";
import { useClaimsStore } from "../context/ClaimsStore";
import { claimsLocalStorage } from "../utils/local-storage"; //"../../../utils/local-storage";
import { ClaimTypeConstants } from "../constants/common";

export class Birthday<Date> implements IClaim {
  mnemonic;
  title;
  description;

  private claim;

  constructor() {
    this.mnemonic = "dob";
    this.title = "Date of Birth";
    this.description = "Users date of birth";
  }

  public async load(): Promise<boolean> {
    const claims = await claimsLocalStorage.get();
    this.claim = claims?.find(
      (claim) => claim.type === ClaimTypeConstants.BirthCredential
    );

    return true;
  }

  public async save(): Promise<void> {
    // todo
  }

  public async verify(): Promise<void> {
    //
  }
}
