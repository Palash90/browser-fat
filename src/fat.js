class FileSystem {
  constructor(diskSize, blockSize) {
      this.disk = new Array(diskSize).fill(false); // Simulated hard disk (array of booleans)
      this.blockSize = blockSize; // Each block contains `blockSize` bits
      this.fat = new Array(diskSize / blockSize).fill(-1); // FAT table to manage linked blocks
      this.files = {}; // File storage: fileName -> start block
  }

  // Encode string into boolean array
  _encodeStringToBoolArray(content) {
      let boolArray = [];
      for (let i = 0; i < content.length; i++) {
          let charCode = content.charCodeAt(i);
          for (let j = 7; j >= 0; j--) {
              boolArray.push((charCode & (1 << j)) !== 0);
          }
      }
      return boolArray;
  }

  // Decode boolean array back into string
  _decodeBoolArrayToString(boolArray) {
      let chars = [];
      for (let i = 0; i < boolArray.length; i += 8) {
          let charCode = 0;
          for (let j = 0; j < 8; j++) {
              charCode = (charCode << 1) | (boolArray[i + j] ? 1 : 0);
          }
          chars.push(String.fromCharCode(charCode));
      }
      return chars.join('');
  }

  // Allocate blocks for a file
  _allocateBlocks(content) {
      const boolArray = this._encodeStringToBoolArray(content);
      const blockCount = Math.ceil(boolArray.length / this.blockSize);

      let allocatedBlocks = [];
      for (let i = 0; i < this.fat.length && allocatedBlocks.length < blockCount; i++) {
          if (this.fat[i] === -1) {
              allocatedBlocks.push(i);
          }
      }

      if (allocatedBlocks.length < blockCount) {
          throw new Error("Disk is full. Cannot allocate more space.");
      }

      // Link allocated blocks in FAT
      for (let i = 0; i < allocatedBlocks.length - 1; i++) {
          this.fat[allocatedBlocks[i]] = allocatedBlocks[i + 1];
      }
      this.fat[allocatedBlocks[allocatedBlocks.length - 1]] = -1; // End of file

      // Write data to disk
      for (let i = 0; i < boolArray.length; i++) {
          this.disk[allocatedBlocks[Math.floor(i / this.blockSize)] * this.blockSize + (i % this.blockSize)] = boolArray[i];
      }

      return allocatedBlocks[0]; // Return the start block
  }

  // Create a file with content
  createFile(fileName, content) {
      if (this.files[fileName]) {
          throw new Error("File already exists.");
      }
      const startBlock = this._allocateBlocks(content);
      this.files[fileName] = { startBlock, size: content.length };
      return this.disk.slice();
  }

  // Read a file
  readFile(fileName) {
      if (!this.files[fileName]) {
          throw new Error("File not found.");
      }
      let boolArray = [];
      let currentBlock = this.files[fileName].startBlock;

      while (currentBlock !== -1) {
          for (let i = 0; i < this.blockSize; i++) {
              boolArray.push(this.disk[currentBlock * this.blockSize + i]);
          }
          currentBlock = this.fat[currentBlock];
      }

      return this._decodeBoolArrayToString(boolArray);
  }

  // Delete a file
  deleteFile(fileName) {
      if (!this.files[fileName]) {
          throw new Error("File not found.");
      }

      let currentBlock = this.files[fileName].startBlock;
      while (currentBlock !== -1) {
          let nextBlock = this.fat[currentBlock];
          this.fat[currentBlock] = -1; // Free the block
          for (let i = 0; i < this.blockSize; i++) {
              this.disk[currentBlock * this.blockSize + i] = false; // Clear disk data
          }
          currentBlock = nextBlock;
      }

      delete this.files[fileName]; // Remove file from the system
      return this.disk.slice();
  }

  // Update a file
  updateFile(fileName, newContent) {
      this.deleteFile(fileName); // Clear the old content
      const startBlock = this._allocateBlocks(newContent); // Allocate new space
      this.files[fileName] = { startBlock, size: newContent.length };
      return this.disk.slice();
  }

  // List all files
  listFiles() {
      return Object.keys(this.files).join(" ");
  }
}

/*
// Example usage:
const fs = new FileSystem(256, 8); // 256 bits total with 8-bit blocks
console.log(fs.createFile("example.txt", "Hello World!")); // Create a file
console.log(fs.readFile("example.txt")); // Read a file
console.log(fs.updateFile("example.txt", "Updated content!")); // Update the file
console.log(fs.createFile("example1.txt", "Hello Heavenrld!")); // Create another file
console.log(fs.readFile("example1.txt")); // Read a file
console.log(fs.deleteFile("example.txt")); // Delete the file
console.log(fs.listFiles()); // List all files
*/

export default FileSystem
