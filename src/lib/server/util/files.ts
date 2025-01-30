import fs from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

export async function writeFile(path: fs.PathLike, data: File): Promise<void> {
	const writeStream = fs.createWriteStream(path);
	const readStream = Readable.from([await data.bytes()]);
	await finished(readStream.pipe(writeStream));
}
