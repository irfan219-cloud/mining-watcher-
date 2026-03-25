import * as THREE from "three";

/**
 * Small procedural texture for the terrain (no external assets).
 * Uses HSL strings (no hex) to stay consistent with the design system guidance.
 */
export function createTerrainTexture(size = 512): THREE.Texture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Base gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "hsl(28 38% 14%)");
  grad.addColorStop(0.5, "hsl(32 42% 20%)");
  grad.addColorStop(1, "hsl(24 35% 10%)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Fine noise
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 28; // subtle grain
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
    // alpha stays
  }
  ctx.putImageData(imageData, 0, 0);

  // Soft contour-ish lines (adds perceived detail)
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "hsl(35 20% 85%)";
  ctx.lineWidth = 1;
  const step = Math.max(10, Math.floor(size / 40));
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.sin(y * 0.08) * step) / 3);
    ctx.bezierCurveTo(
      size * 0.3,
      y + (Math.cos(y * 0.06) * step) / 3,
      size * 0.6,
      y + (Math.sin(y * 0.05) * step) / 3,
      size,
      y + (Math.cos(y * 0.07) * step) / 3
    );
    ctx.stroke();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 8;

  // three@0.170 uses `colorSpace`.
  texture.colorSpace = THREE.SRGBColorSpace;

  texture.needsUpdate = true;
  return texture;
}
