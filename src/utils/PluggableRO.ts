export default class PluggableRO {
  private device: USBDevice | null = null;
  private readonly CP2112_VID: number = 0x10C4;
  private readonly CP2112_PID: number = 0xEA90;

  async connect(): Promise<USBDevice | null> {
      try {
          this.device = await navigator.usb.requestDevice({
              filters: [{ vendorId: this.CP2112_VID, productId: this.CP2112_PID }]
          });
          await this.device.open();
          await this.device.selectConfiguration(1);
          await this.device.claimInterface(0);
          await this._configureCP2112();
          console.log("Connected to CP2112 device.");
          return this.device;
      } catch (error) {
          console.error("Failed to initialize CP2112:", error);
          return null;
      }
  }

  private async _configureCP2112(): Promise<void> {
      if (!this.device) throw new Error("Device not connected");
      const report = new Uint8Array([
          0x06, 0x00, 0x01, 0x86, 0xA0, 0x02, 0x00, 0x00,
          0xFF, 0x00, 0xFF, 0x01, 0x00, 0x0F
      ]);
      await this.device.controlTransferOut({ requestType: 'class', recipient: 'interface', request: 0x09, value: 0x200, index: 0 }, report);
  }

  async readEEPROM(address: number, register: number, length: number): Promise<Uint8Array> {
      if (!this.device) throw new Error("Device not connected");
      let result: number[] = [];
      const chunkSize = 61;

      for (let offset = 0; offset < length; offset += chunkSize) {
          let currentChunk = Math.min(chunkSize, length - offset);
          let currentRegister = register + offset;

          await this.device.transferOut(1, new Uint8Array([0x11, address << 1, 0x00, 0x01, 0x01, currentRegister]));
          await new Promise(r => setTimeout(r, 10));
          await this.device.transferOut(1, new Uint8Array([0x12, (address << 1) | 0x01, 0x00, currentChunk]));
          await new Promise(r => setTimeout(r, 10));

          const response = await this.device.transferIn(1, currentChunk + 3);
          if (!response || !response.data) {
              throw new Error("Failed to read data from device");
          }
          result.push(...new Uint8Array(response.data.buffer).slice(3));
      }

      return new Uint8Array(result);
  }

  async writeEEPROM(address: number, register: number, data: Uint8Array): Promise<boolean> {
      if (!this.device) throw new Error("Device not connected");
      const chunkSize = 4;

      for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          const writeCmd = new Uint8Array([0x14, address << 1, chunk.length + 1, register + i, ...chunk]);
          await this.device.transferOut(1, writeCmd);
          await new Promise(r => setTimeout(r, 100));
      }
      return true;
  }

  async unlockEEPROM(password: string): Promise<boolean> {
      if (password.length !== 8) {
          throw new Error("Password must be 8 characters");
      }
      const passwordBytes = new Uint8Array(password.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      return await this.writeEEPROM(0x51, 0x7B, passwordBytes);
  }

  async writeBinToQSFP(binData: Uint8Array, password: string): Promise<boolean> {
      if (!await this.unlockEEPROM(password)) {
          console.error("Failed to unlock EEPROM");
          return false;
      }
      return await this.writeEEPROM(0x50, 0x00, binData);
  }
}