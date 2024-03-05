const getFrequencyRange = (data: Uint8Array, [low, high]: [number, number]) => {
  const nyquist = 48000 / 2;
  const lowIndex = Math.round((low / nyquist) * data.length);
  const highIndex = Math.round((high / nyquist) * data.length);

  let total = 0;
  let numFrequencies = 0;

  for (let i = lowIndex; i <= highIndex; i++) {
    total += data[i];
    numFrequencies += 1;
  }
  
  return total / numFrequencies / 255;
};

export { getFrequencyRange };
