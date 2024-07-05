export function getArchitecture(): number {
  const float32 = new Float32Array(1);
  const uint8 = new Uint8Array(float32.buffer);
  float32[0] = Infinity;
  float32[0] -= float32[0];

  return uint8[3];
}
