/**
 * Host half of the account balance bundle.
 *
 * It registers nothing: the balance is read by the Client half through the
 * existing `account` Remote namespace (`ctx.remote.account.getBalance`), which
 * the Host exposes without ever handing browser code an account credential.
 * The Client module therefore owns all rendering and polling.
 */
export function apply() {}
