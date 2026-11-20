// Cloudinary can resize and compress a picture just by editing its web address.
// "f_auto" picks the best format (WebP/AVIF) for each browser, "q_auto" picks a good quality,
// "w_800" makes it 800px wide. Smaller pictures = a faster page.
export const cdn = (url, width) => {
  if (!url || !url.includes('/upload/')) return url;
  const options = `f_auto,q_auto${width ? `,w_${width}` : ''}`;
  return url.replace('/upload/', `/upload/${options}/`);
};