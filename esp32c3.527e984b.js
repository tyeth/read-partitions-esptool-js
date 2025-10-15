
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

      var $parcel$global = globalThis;
    var parcelRequire = $parcel$global["parcelRequire477f"];
var parcelRegister = parcelRequire.register;
parcelRegister("lLOEg", function(module, exports) {

$parcel$export(module.exports, "ESP32C3ROM", () => $fd95467b45c09b43$export$d17dfcbab3a5ba52);

var $9BsXL = parcelRequire("9BsXL");
class $fd95467b45c09b43$export$d17dfcbab3a5ba52 extends (0, $9BsXL.ESP32ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-C3";
        this.IMAGE_CHIP_ID = 5;
        this.EFUSE_BASE = 0x60008800;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.UART_CLKDIV_REG = 0x3ff40014;
        this.UART_CLKDIV_MASK = 0xfffff;
        this.UART_DATE_REG_ADDR = 0x6000007c;
        this.FLASH_WRITE_SIZE = 0x400;
        this.BOOTLOADER_FLASH_OFFSET = 0;
        this.SPI_REG_BASE = 0x60002000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.IROM_MAP_START = 0x42000000;
        this.IROM_MAP_END = 0x42800000;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x3c000000,
                0x3c800000,
                "DROM"
            ],
            [
                0x3fc80000,
                0x3fce0000,
                "DRAM"
            ],
            [
                0x3fc88000,
                0x3fd00000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x3ff00000,
                0x3ff20000,
                "DROM_MASK"
            ],
            [
                0x40000000,
                0x40060000,
                "IROM_MASK"
            ],
            [
                0x42000000,
                0x42800000,
                "IROM"
            ],
            [
                0x4037c000,
                0x403e0000,
                "IRAM"
            ],
            [
                0x50000000,
                0x50002000,
                "RTC_IRAM"
            ],
            [
                0x50000000,
                0x50002000,
                "RTC_DRAM"
            ],
            [
                0x600fe000,
                0x60100000,
                "MEM_INTERNAL2"
            ]
        ];
    }
    async getPkgVersion(loader) {
        const numWord = 3;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const word3 = await loader.readReg(addr);
        const pkgVersion = word3 >> 21 & 0x07;
        return pkgVersion;
    }
    async getChipRevision(loader) {
        const block1Addr = this.EFUSE_BASE + 0x044;
        const numWord = 3;
        const pos = 18;
        const addr = block1Addr + 4 * numWord;
        const ret = (await loader.readReg(addr) & 0x7 << pos) >> pos;
        return ret;
    }
    async getMinorChipVersion(loader) {
        const hiNumWord = 5;
        const hiAddr = this.EFUSE_BASE + 0x044 + 4 * hiNumWord;
        const hi = await loader.readReg(hiAddr) >> 23 & 0x01;
        const lowNumWord = 3;
        const lowAddr = this.EFUSE_BASE + 0x044 + 4 * lowNumWord;
        const low = await loader.readReg(lowAddr) >> 18 & 0x07;
        return (hi << 3) + low;
    }
    async getMajorChipVersion(loader) {
        const numWord = 5;
        const addr = this.EFUSE_BASE + 0x044 + 4 * numWord;
        return await loader.readReg(addr) >> 24 & 0x03;
    }
    async getChipDescription(loader) {
        const chipDesc = {
            0: "ESP32-C3 (QFN32)",
            1: "ESP8685 (QFN28)",
            2: "ESP32-C3 AZ (QFN32)",
            3: "ESP8686 (QFN24)"
        };
        const chipIndex = await this.getPkgVersion(loader);
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${chipDesc[chipIndex] || "Unknown ESP32-C3"} (revision v${majorRev}.${minorRev})`;
    }
    async getFlashCap(loader) {
        const numWord = 3;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const flashCap = registerValue >> 27 & 0x07;
        return flashCap;
    }
    async getFlashVendor(loader) {
        const numWord = 4;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const vendorId = registerValue >> 0 & 0x07;
        const vendorMap = {
            1: "XMC",
            2: "GD",
            3: "FM",
            4: "TT",
            5: "ZBIT"
        };
        return vendorMap[vendorId] || "";
    }
    async getChipFeatures(loader) {
        const features = [
            "Wi-Fi",
            "BLE"
        ];
        const flashMap = {
            0: null,
            1: "Embedded Flash 4MB",
            2: "Embedded Flash 2MB",
            3: "Embedded Flash 1MB",
            4: "Embedded Flash 8MB"
        };
        const flashCap = await this.getFlashCap(loader);
        const flashVendor = await this.getFlashVendor(loader);
        const flash = flashMap[flashCap];
        const flashDescription = flash !== undefined ? flash : "Unknown Embedded Flash";
        if (flash !== null) features.push(`${flashDescription} (${flashVendor})`);
        return features;
    }
    async getCrystalFreq(loader) {
        return 40;
    }
    _d2h(d) {
        const h = (+d).toString(16);
        return h.length === 1 ? "0" + h : h;
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    getEraseSize(offset, size) {
        return size;
    }
}

});


//# sourceMappingURL=esp32c3.527e984b.js.map
