// getImageBlurred.js (CommonJS file)
async function getImageBlurred(src) {
  try {
    const { getPlaiceholder } = await import("plaiceholder");

    const buffer = await fetch(src).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (err) {
    console.error("Error in getImageBlurred:", err);
    return null;
  }
}

export { getImageBlurred };
