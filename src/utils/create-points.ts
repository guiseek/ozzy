import {
  Points,
  BufferGeometry,
  BufferAttribute,
  type ShaderMaterial,
} from "three";
import { hexToRgb } from "./hex-to-rgb";

const createPoints = (imageData: ImageData, material: ShaderMaterial) => {
  const geometry = new BufferGeometry();

  const vertices = [];
  const colors = [];

  const colorsPerFace = ["#111111", "#0afcfc", "#222222", "#05baba", "#ffffff"];

  const indexes: number[] = [];

  let count = 0;
  const step = 3;

  for (let y = 0, height = imageData.height; y < height; y += step) {
    for (let x = 0, width = imageData.width; x < width; x += step) {
      // let index = (count) * 4 * step;
      const index = (x + y * width) * 4;
      indexes.push(index);

      const gray =
        (imageData.data[index] +
          imageData.data[index + 1] +
          imageData.data[index + 2]) /
        3;
      const z = gray < 300 ? gray : 10000;

      vertices.push(x - imageData.width / 2, -y + imageData.height / 2, z);

      const colorIndex = Math.floor(Math.random() * colorsPerFace.length);
      const rgbColor = hexToRgb(colorsPerFace[colorIndex]);
      colors.push(rgbColor.r, rgbColor.g, rgbColor.b);

      count++;
    }
  }

  const verticesArray = new Float32Array(vertices);
  geometry.setAttribute("position", new BufferAttribute(verticesArray, 3));

  const colorsArray = new Float32Array(colors);
  geometry.setAttribute("color", new BufferAttribute(colorsArray, 3));

  const points = new Points(geometry, material);

  return { indexes, points };
};

export { createPoints };
