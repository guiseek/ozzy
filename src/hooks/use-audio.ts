import { Audio, AudioListener, AudioLoader, AudioAnalyser } from "three";

interface AudioResponse {
  audio: Audio;
  analyser: AudioAnalyser;
}

const useAudio = (url: string, fftSize: number) => {
  const audioListener = new AudioListener();
  const audio = new Audio(audioListener);
  const audioLoader = new AudioLoader();

  return new Promise<AudioResponse>((resolve) => {
    audioLoader.loadAsync(url).then((buffer) => {
      audio.setBuffer(buffer);
      audio.setLoop(true);
      audio.setVolume(0.5);
      audio.play();

      const analyser = new AudioAnalyser(audio, fftSize);

      resolve({ audio, analyser });
    });
  });
};

export { useAudio };
