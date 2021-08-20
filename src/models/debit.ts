import { Atom, OperationType } from "./operations";
/**
 * @description The debit object
 * @export
 */
export type Debit = Atom & {
  readonly operation: OperationType.DEBIT
};
