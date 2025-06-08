// utils/parseImageData.ts
export function parseImageFilename(filename: string) {
  const [rawTitle, year, material, size, priceWithExt] = filename.split('_');
  const title = rawTitle.replace(/\+/g, ' ');
  const materialFormatted = material.replace(/\+/g, ' ');
  const sizeFormatted = size.replace(/\+/g, ' ');
  const price = priceWithExt.replace(/\+/g, ' ').replace(/\.\w+$/, '');

  return {
    title,
    year,
    material: materialFormatted,
    size: sizeFormatted,
    price,
    filename,
  };
}
