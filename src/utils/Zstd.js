import zstd from '@mongodb-js/zstd';
const { compress, decompress } = zstd;

export async function Compression(text) {
  const buffer = Buffer.from(text, 'utf-8');
  const compressed = await compress(buffer);
  return Buffer.from(compressed); 
}

export async function decompression(buffer) {
  const decompressed = await decompress(buffer);
  return Buffer.from(decompressed).toString('utf-8');
}
