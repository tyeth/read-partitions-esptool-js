
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

      var $parcel$global = globalThis;
    var parcelRequire = $parcel$global["parcelRequire477f"];
var parcelRegister = parcelRequire.register;
parcelRegister("8miGt", function(module, exports) {

$parcel$export(module.exports, "ESP32C6ROM", () => $615edf11a780ff45$export$652353697ef98b38);

var $lLOEg = parcelRequire("lLOEg");
class $615edf11a780ff45$export$652353697ef98b38 extends (0, $lLOEg.ESP32C3ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-C6";
        this.IMAGE_CHIP_ID = 13;
        this.EFUSE_BASE = 0x600b0800;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
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
                0x42000000,
                0x43000000,
                "DROM"
            ],
            [
                0x40800000,
                0x40880000,
                "DRAM"
            ],
            [
                0x40800000,
                0x40880000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x4004ac00,
                0x40050000,
                "DROM_MASK"
            ],
            [
                0x40000000,
                0x4004ac00,
                "IROM_MASK"
            ],
            [
                0x42000000,
                0x43000000,
                "IROM"
            ],
            [
                0x40800000,
                0x40880000,
                "IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_IRAM"
            ],
            [
                0x50000000,
                0x50004000,
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
    async getChipDescription(loader) {
        let desc;
        const pkgVer = await this.getPkgVersion(loader);
        if (pkgVer === 0) desc = "ESP32-C6";
        else desc = "unknown ESP32-C6";
        const chipRev = await this.getChipRevision(loader);
        desc += " (revision " + chipRev + ")";
        return desc;
    }
    async getChipFeatures(loader) {
        return [
            "Wi-Fi 6",
            "BT 5",
            "IEEE802.15.4"
        ];
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


//# sourceMappingURL=esp32c6.d67cdfc4.js.map
