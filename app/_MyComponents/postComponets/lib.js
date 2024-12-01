const faceDescriptors = []; 
const detectFaceInCapturedImage = async (imageBlob) => {
  console.log(imageBlob, "1");
  const img = new window.Image();
  img.src = imageBlob;

  // Ensure image has loaded before detecting
  await new Promise((resolve) => (img.onload = resolve));

  // Perform detection on the captured image
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (detection) {
    const bestMatch = faceapi.findBestMatch(
      detection.descriptor,
      faceDescriptors
    );

    if (bestMatch.label !== "unknown") {
      const newLabel = `Person_${Date.now()}`;
      addNewLabel2(newLabel, detection);
      return `New label created: ${newLabel}`;
    } else {
      return `Recognized: ${bestMatch.label}`;
    }
  }
  return "No face detected.";
};
const faceRecognizer = async () => {
  const drawResults = async () => {
    if (videoRef.current && canvasRef.current) {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const canvas = canvasRef.current;
      canvas.width = videoRef.current?.videoWidth;
      canvas.height = videoRef.current?.videoHeight;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      detections.forEach((detection) => {
        const bestMatch = faceapi.findBestMatch(
          detection.descriptor,
          faceDescriptors
        );

        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: bestMatch.toString(),
        });
        drawBox.draw(canvas);
        faceapi.draw.drawFaceExpressions(canvas, [detection]);
      });

      setDetected(detections.length > 0);
      requestAnimationFrame(drawResults);
    }
  };

  drawResults();
};

// const checkLabels = async () => {
//   const labels = ["Rachit", "Rohit", "Virat"];
//   const labeledDescriptors = await Promise.all(
//     labels.map(async (label) => {
//       const descriptions = [];
//       for (let i = 1; i <= 2; i++) {
//         const image = await faceapi
//           .fetchImage(`/labels/${label}/${i}.JPG`)
//           .catch(() => faceapi.fetchImage(`/labels/${label}/${i}.png`))
//           .catch(() => faceapi.fetchImage(`/labels/${label}/${i}.webp`));
//         const detection = await faceapi
//           .detectSingleFace(image)
//           .withFaceLandmarks()
//           .withFaceDescriptor();
//         if (detection) {
//           descriptions.push(detection.descriptor);
//         }
//       }
//       return new faceapi.LabeledFaceDescriptors(label, descriptions);
//     })
//   );
//   return labeledDescriptors;
// };
 const addNewLabel = async (label, pictureBlob) => {
   console.log(pictureBlob, "2");

   // Convert the pictureBlob (a base64 URL) to an actual Blob
   const response = await fetch(pictureBlob);
   const blob = await response.blob();

   // Convert Blob to base64 string
   const reader = new FileReader();
   reader.onload = async (e) => {
     const base64Image = e.target.result; // Base64 representation of the image

     // Create the payload with the base64 image
     const payload = {
       filePath: `/labels/${Date.now()}/${label}.png`,
       imageData: base64Image, // Set the base64 image data here
     };

     // Send the payload to your backend
     await fetch("http://localhost:2833/", {
       method: "POST",
       body: JSON.stringify(payload),
       headers: { "Content-Type": "application/json" },
     });
   };
   reader.readAsDataURL(blob);
 };