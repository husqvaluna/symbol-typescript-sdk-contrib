import { sha3_256 } from "js-sha3";
import { utils } from "symbol-sdk";
import { Address } from "symbol-sdk/symbol";

/**
 *
 * @param sourceAddress
 * @param targetAddress
 * @param scopedKey
 * @param targetId
 * @param type
 * @returns
 */
export function calculateCompositeHash(
  sourceAddress: Address,
  targetAddress: Address,
  scopedKey: bigint,
  targetId: bigint,
  type: number,
): string {
  const hasher = sha3_256.create();
  hasher.update(sourceAddress.bytes);
  hasher.update(targetAddress.bytes);
  hasher.update(utils.intToBytes(scopedKey, 8));
  hasher.update(utils.intToBytes(targetId, 8));
  hasher.update(Uint8Array.from([type]));
  return hasher.hex();
}

/**
 *
 * @param encrypted
 * @returns
 */
export function formatV2EncryptedMessage(encrypted: Uint8Array<ArrayBufferLike>): string {
  const hexString = utils.uint8ToHex(encrypted);
  return "\x01" + hexString.substring(2);
}
