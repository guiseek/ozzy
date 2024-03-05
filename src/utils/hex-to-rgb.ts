const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) throw new Error(`Invalid hex color`);

  const [, R, G, B] = result;
  
  const r = parseInt(R, 16) / 255;
  const g = parseInt(G, 16) / 255;
  const b = parseInt(B, 16) / 255;

  return { r, g, b };
};

export { hexToRgb };
