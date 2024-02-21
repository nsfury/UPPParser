export class BinaryReader {
  constructor(buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }

  checkOffsetAndMove(byteSize) {
    if (this.offset + byteSize > this.buffer.length) {
      throw new Error("Attempt to read beyond buffer length");
    }
    const oldOffset = this.offset;
    this.offset += byteSize;
    return oldOffset;
  }

  seekRelative(byteSize) {
    this.offset += byteSize;
  }

  readInt32() {
    const offset = this.checkOffsetAndMove(4);
    return this.buffer.readInt32LE(offset);
  }

  readUInt8() {
    const offset = this.checkOffsetAndMove(1);
    return this.buffer.readUInt8(offset);
  }

  readFloat() {
    const offset = this.checkOffsetAndMove(4);
    return this.buffer.readFloatLE(offset);
  }

  readUtf8String(byteLength) {
    const offset = this.checkOffsetAndMove(byteLength);
    return this.buffer.toString("utf8", offset, offset + byteLength);
  }
}
