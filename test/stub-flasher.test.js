import assert from "node:assert/strict";
import { test } from "node:test";
import { ESPLoader, getStubJsonByChipName } from "../lib/index.js";
import { ESP32S31ROM } from "../lib/targets/esp32s31.js";

const fakeTransport = (extra = {}) => ({
  tracing: false,
  getInfo: () => "fake transport",
  ...extra,
});

const CHIPS_WITH_STUB = [
  "ESP8266",
  "ESP32",
  "ESP32-S2",
  "ESP32-S3",
  "ESP32-S31",
  "ESP32-C2",
  "ESP32-C3",
  "ESP32-C5",
  "ESP32-C6",
  "ESP32-C61",
  "ESP32-H2",
  "ESP32-H21",
  "ESP32-H4",
  "ESP32-P4",
];

test("every chip with a published flasher stub gets one", async () => {
  for (const chip of CHIPS_WITH_STUB) {
    const stub = await getStubJsonByChipName(chip);
    assert.ok(stub, `${chip}: no stub`);
    assert.ok(stub.text.length > 0, `${chip}: empty text segment`);
    assert.equal(typeof stub.entry, "number", `${chip}: no entry`);
    assert.ok(stub.entry >= stub.text_start, `${chip}: entry below text_start`);
    assert.ok(stub.entry < stub.text_start + stub.text.length, `${chip}: entry outside text`);
  }
});

test("post-baud-change probe does not read the 0x40001000 magic register", async () => {
  const loader = new ESPLoader({ transport: fakeTransport(), baudrate: 2000000 });
  loader.chip = new ESP32S31ROM();
  const reads = [];
  loader.readReg = async (addr) => {
    reads.push(addr);
    return 0;
  };
  assert.equal(await loader.isResponsive(), true);
  assert.deepEqual(reads, [loader.chip.UART_DATE_REG_ADDR]);
  assert.notEqual(reads[0], loader.CHIP_DETECT_MAGIC_REG_ADDR);
});

test("readFlash consumes the trailing MD5 digest frame", async () => {
  const data = new Uint8Array(0x1000).fill(0xa5);
  const digest = new Uint8Array(16).fill(0x11);
  const frames = [data, digest];
  const writes = [];
  const transport = fakeTransport({
    read: async () => frames.shift(),
    write: async (pkt) => writes.push(pkt),
  });
  const loader = new ESPLoader({ transport, baudrate: 115200 });
  loader.checkCommand = async () => 0;
  const out = await loader.readFlash(0, data.length);
  assert.equal(out.length, data.length);
  assert.equal(frames.length, 0, "digest frame left unread");
  assert.equal(writes.length, 1);
});
