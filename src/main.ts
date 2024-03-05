import {
  Clock,
  Color,
  Scene,
  WebGLRenderer,
  ShaderMaterial,
  AdditiveBlending,
} from "three";
import { createPoints, getFrequencyRange, getImageData } from "./utils";
import fragmentShader from "./shader/fragment-shader.frag?raw";
import vertexShader from "./shader/vertex-shader.vert?raw";
import { useAudio, useCamera, useVideo } from "./hooks";
import "./style.css";

type Range = [number, number];
type RangeMap = Record<string, Range>;

const uniforms = {
  time: { type: "f", value: 0.0 },
  size: { type: "f", value: 10.0 },
};

const frequency: RangeMap = {
  bass: [20, 140],
  lowMid: [140, 400],
  mid: [400, 2600],
  highMid: [2600, 5200],
  treble: [5200, 14000],
};

const main = async () => {
  const scene = new Scene();
  const clock = new Clock();
  scene.background = new Color(0x000000);
  const renderer = new WebGLRenderer();
  container.append(renderer.domElement);

  const camera = useCamera();
  const video = await useVideo();
  const { audio, analyser } = await useAudio("my-little-man.mp3", 2048);

  document.body.onclick = () => {
    if (audio.isPlaying) audio.pause();
    else audio.play();
  };

  const canvas = document.createElement("canvas");
  const ctxOpts: CanvasRenderingContext2DSettings = {
    willReadFrequently: true,
  };
  const ctx = canvas.getContext("2d", ctxOpts);

  if (!ctx) throw new Error("Get context error");

  let imageData: ImageData;

  imageData = getImageData(ctx, video, false);

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const { indexes, points } = createPoints(imageData, material);

  scene.add(camera, points);

  const draw = (t: number) => {
    clock.getDelta();

    uniforms.time.value += 0.5;

    // would be an array with a size of half of fftSize.
    const data = analyser.getFrequencyData();

    const r = getFrequencyRange(data, frequency.bass);
    const g = getFrequencyRange(data, frequency.mid);
    const b = getFrequencyRange(data, frequency.treble);

    // video
    if (points) {
      const useCache = parseInt(t.toString()) % 2 === 0; // To reduce CPU usage.

      imageData = getImageData(ctx, video, useCache, imageData);

      let count = 0;

      const { position } = points.geometry.attributes;

      for (let i = 0, length = position.array.length; i < length; i += 3) {
        let index = indexes[count];

        let gray =
          (imageData.data[index] +
            imageData.data[index + 1] +
            imageData.data[index + 2]) /
          3;

        let threshold = 300;

        if (gray < threshold) {
          if (gray < threshold / 3) {
            position.array[i + 2] = gray * r * 5;
          } else if (gray < threshold / 2) {
            position.array[i + 2] = gray * g * 5;
          } else {
            position.array[i + 2] = gray * b * 5;
          }
        } else {
          position.array[i + 2] = 10000;
        }

        count++;
      }

      uniforms.size.value = ((r + g + b) / 3) * 35 + 5;

      position.needsUpdate = true;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(draw);
  };

  draw(0);

  const onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  window.addEventListener("resize", onResize);
  onResize();

  document.body.removeEventListener("click", main);
};

document.body.addEventListener("click", main);
