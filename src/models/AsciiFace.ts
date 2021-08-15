export enum PixelSize {
  eightPixels = "eight-pixels",
  tenPixels = "ten-pixels",
  twelvePixels = "twelve-pixels",
  sixteenPixels = "sixteen-pixels",
  twentyPixels = "twenty-pixels",
  twentySixPixels = "twenty-six-pixels",
  thrityTwoPixels = "thrity-two-pixels",
}

export const pixelSizes = [
  PixelSize.eightPixels,
  PixelSize.tenPixels,
  PixelSize.twelvePixels,
  PixelSize.sixteenPixels,
  PixelSize.twentyPixels,
  PixelSize.twentySixPixels,
  PixelSize.thrityTwoPixels,
];

export const pixelSizeLabel: { [key in PixelSize]: string } = {
  "eight-pixels": "8px",
  "ten-pixels": "10px",
  "twelve-pixels": "12px",
  "sixteen-pixels": "16px",
  "twenty-pixels": "20px",
  "twenty-six-pixels": "26px",
  "thrity-two-pixels": "32px",
};

export type AsciiFace = {
  id: string;
  face: string;
  size: PixelSize;
  priceInCents: number;
  dateAdded: string;
};
