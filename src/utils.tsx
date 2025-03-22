export function dateToSeconds(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

// async load image
export async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}

export function getRandomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${hex.padStart(6, "0")}`;
}
