import { Atom, OperationType } from "./operations";
/**
 * @description The debit object
 * @export
 */
export type Credit = Atom & {
  readonly operation: OperationType.CREDIT
};
