import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";

const execFileAsync = promisify(execFile);

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const projectRoot = path.resolve(currentDirectory, "..");

const audioDirectory = path.join(
  projectRoot,
  "public",
  "audio"
);

const outputFile = path.join(
  projectRoot,
  "src",
  "data",
  "waveforms.ts"
);

const temporaryDirectory = path.join(
  projectRoot,
  ".waveform-temp"
);

const BAR_COUNT = 72;

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

async function convertToRawAudio(sourcePath, outputPath) {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static binary was not found.");
  }

  await execFileAsync(ffmpegPath, [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",

    "-i",
    sourcePath,

    // Один канал
    "-ac",
    "1",

    // Частоты 8 кГц достаточно для формы волны
    "-ar",
    "8000",

    // 32-bit float PCM
    "-f",
    "f32le",

    outputPath,
  ]);
}

function calculateWaveform(samples) {
  if (samples.length === 0) {
    throw new Error("Decoded audio contains no samples.");
  }

  const samplesPerBar = Math.max(
    1,
    Math.floor(samples.length / BAR_COUNT)
  );

  const rawBars = [];

  for (let barIndex = 0; barIndex < BAR_COUNT; barIndex++) {
    const start = barIndex * samplesPerBar;

    const end =
      barIndex === BAR_COUNT - 1
        ? samples.length
        : Math.min(start + samplesPerBar, samples.length);

    let absolutePeak = 0;
    let squareSum = 0;
    let sampleCount = 0;

    const step = Math.max(
      1,
      Math.floor((end - start) / 2400)
    );

    for (
      let sampleIndex = start;
      sampleIndex < end;
      sampleIndex += step
    ) {
      const sample = samples[sampleIndex] ?? 0;
      const amplitude = Math.abs(sample);

      absolutePeak = Math.max(absolutePeak, amplitude);
      squareSum += sample * sample;
      sampleCount++;
    }

    const rms =
      sampleCount > 0
        ? Math.sqrt(squareSum / sampleCount)
        : 0;

    /*
     * Peak подчёркивает удары,
     * RMS показывает общую энергию участка.
     */
    rawBars.push(
      absolutePeak * 0.62 +
        rms * 0.38
    );
  }

  /*
   * Лёгкое сглаживание.
   */
  const smoothedBars = rawBars.map(
    (value, index, values) => {
      const previous =
        values[index - 1] ?? value;

      const next =
        values[index + 1] ?? value;

      return (
        previous * 0.16 +
        value * 0.68 +
        next * 0.16
      );
    }
  );

  const sortedBars = [...smoothedBars].sort(
    (a, b) => a - b
  );

  /*
   * Нормализуем по 96-му процентилю,
   * чтобы единичный удар не прижал всю волну вниз.
   */
  const percentileIndex = Math.min(
    sortedBars.length - 1,
    Math.floor(sortedBars.length * 0.96)
  );

  const normalizationPoint = Math.max(
    sortedBars[percentileIndex] ?? 0,
    0.000001
  );

  const normalizedBars = smoothedBars.map((value) => {
    const normalized = clamp(
      value / normalizationPoint,
      0,
      1
    );

    /*
     * Чем больше степень, тем заметнее разница
     * между тихими и громкими участками.
     */
    return Math.pow(normalized, 1.45);
  });

  const minimum = Math.min(...normalizedBars);
  const maximum = Math.max(...normalizedBars);
  const range = Math.max(maximum - minimum, 0.000001);

  return normalizedBars.map((value) => {
    const stretched =
      (value - minimum) / range;

    /*
     * Минимум 8% — полоски не исчезают полностью.
     */
    const finalValue = clamp(
      0.08 + stretched * 0.92,
      0.08,
      1
    );

    return Number(finalValue.toFixed(3));
  });
}

async function generateWaveformForFile(fileName) {
  const sourcePath = path.join(
    audioDirectory,
    fileName
  );

  const rawPath = path.join(
    temporaryDirectory,
    `${fileName}.f32le`
  );

  await convertToRawAudio(sourcePath, rawPath);

  const rawBuffer = await fs.readFile(rawPath);

  const samples = new Float32Array(
    rawBuffer.buffer,
    rawBuffer.byteOffset,
    Math.floor(
      rawBuffer.byteLength /
        Float32Array.BYTES_PER_ELEMENT
    )
  );

  return calculateWaveform(samples);
}

async function generate() {
  await fs.mkdir(temporaryDirectory, {
    recursive: true,
  });

  await fs.mkdir(path.dirname(outputFile), {
    recursive: true,
  });

  const entries = await fs.readdir(audioDirectory, {
    withFileTypes: true,
  });

  const audioFiles = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        /\.(mp3|wav|m4a|ogg|aac)$/i.test(entry.name)
    )
    .map((entry) => entry.name)
    .sort();

  if (audioFiles.length === 0) {
    throw new Error(
      "No audio files were found in public/audio."
    );
  }

  const waveforms = {};

  for (const fileName of audioFiles) {
    console.log(`Analyzing ${fileName}...`);

    const waveform =
      await generateWaveformForFile(fileName);

    waveforms[`/audio/${fileName}`] = waveform;

    console.log(
      `  created ${waveform.length} real waveform bars`
    );
  }

  const generatedFile = `/*
 * AUTO-GENERATED FILE.
 * Run: npm run waveforms
 * Do not edit this file manually.
 */

export const WAVEFORMS: Record<
  string,
  readonly number[]
> = ${JSON.stringify(waveforms, null, 2)};
`;

  await fs.writeFile(
    outputFile,
    generatedFile,
    "utf8"
  );

  await fs.rm(temporaryDirectory, {
    recursive: true,
    force: true,
  });

  console.log("");
  console.log("Waveform generation completed.");
  console.log("Created: src/data/waveforms.ts");
}

generate().catch(async (error) => {
  await fs.rm(temporaryDirectory, {
    recursive: true,
    force: true,
  }).catch(() => undefined);

  console.error("");
  console.error("Waveform generation failed:");
  console.error(error);

  process.exitCode = 1;
});