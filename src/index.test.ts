import { describe, it, expect, vi } from "vitest";
import { calculateCompositeHash, formatV2EncryptedMessage } from "./index";
import { utils } from "symbol-sdk";
import { Address } from "symbol-sdk/symbol";

// モックの作成
vi.mock("js-sha3", () => {
  return {
    sha3_256: {
      create: () => ({
        update: vi.fn(),
        hex: () => "mocked_hash_value",
      }),
    },
  };
});

describe("calculateCompositeHash", () => {
  it("正しいハッシュ値を計算する", () => {
    // モックAddressオブジェクトの作成
    const sourceAddress = {
      bytes: new Uint8Array([1, 2, 3, 4, 5]),
    } as Address;

    const targetAddress = {
      bytes: new Uint8Array([6, 7, 8, 9, 10]),
    } as Address;

    const scopedKey = BigInt(123456);
    const targetId = BigInt(789012);
    const type = 1;

    // 関数の実行
    const result = calculateCompositeHash(sourceAddress, targetAddress, scopedKey, targetId, type);

    // 結果の検証
    expect(result).toBe("mocked_hash_value");
  });
});

describe("formatV2EncryptedMessage", () => {
  it("暗号化されたメッセージを正しくフォーマットする", () => {
    // テスト用のUint8Array作成
    const encrypted = new Uint8Array([0, 1, 2, 3, 4, 5]);

    // utils.uint8ToHexのモック
    const originalUint8ToHex = utils.uint8ToHex;
    utils.uint8ToHex = vi.fn().mockReturnValue("0x010203040506");

    // 関数の実行
    const result = formatV2EncryptedMessage(encrypted as Uint8Array<ArrayBufferLike>);

    // モックを元に戻す
    utils.uint8ToHex = originalUint8ToHex;

    // 結果の検証
    expect(result).toBe("\x01010203040506");
  });

  it("16進数文字列の先頭の0xを削除する", () => {
    // テスト用のUint8Array作成
    const encrypted = new Uint8Array([10, 20, 30]);

    // utils.uint8ToHexのモック
    const originalUint8ToHex = utils.uint8ToHex;
    utils.uint8ToHex = vi.fn().mockReturnValue("0xaabbcc");

    // 関数の実行
    const result = formatV2EncryptedMessage(encrypted as Uint8Array<ArrayBufferLike>);

    // モックを元に戻す
    utils.uint8ToHex = originalUint8ToHex;

    // 結果の検証
    expect(result).toBe("\x01aabbcc");
    expect(result.substring(1)).toBe("aabbcc");
  });
});
