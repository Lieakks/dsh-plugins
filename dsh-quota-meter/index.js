/**
 * Host half of the Quota Meter bundle.
 *
 * Every balance read belongs to the browser half, which reaches the Host
 * account capability through the `account` Remote namespace. This entry only
 * keeps the package on the Host roster so its `dsh.client` half is served.
 */
export function apply() {}
