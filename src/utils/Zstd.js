import zstd from '@mongodb-js/zstd';
const { compressSync, decompressSync } = zstd;


export function Compression(text){
    const buffer=Buffer.from(text,'utf-8')
    return compressSync(buffer)

}

export function decompression(buffer){
    const decompressed= decompressSync(buffer)
     return decompressed.toString('utf-8'); 
}