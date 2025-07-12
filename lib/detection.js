 const detectFaceInCapturedImage = async (imageBlob) => {
    const img = new window.Image();
    img.src = imageBlob;
    await new Promise((resolve) => (img.onload = resolve));

    const faceInfo = await checkLabels();
    const hasValidDescriptors = faceInfo.length > 0;
    const faceMatcher = hasValidDescriptors
      ? new faceapi.FaceMatcher(faceInfo)
      : null;

    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();

    const results = await Promise.all(
      detections.map(async (detect) => {
        if (detect) {
          console.log(detect);

          let bestMatch;
          if (faceMatcher) {
            bestMatch = faceMatcher.findBestMatch(detect.descriptor);
          }

          if (!bestMatch || bestMatch.label === "unknown") {
            const newLabelName = `Person_${Date.now()}`;
            const faceDescriptor = Array.from(detect.descriptor);

            const data = {
              label: newLabelName,
              descriptors: [faceDescriptor],
            };

            const doc = await addNewLabel(data);
            console.log(doc, "reas check");
            return doc;
          } else {
            console.log("detect known", bestMatch);
            try {
              const labelResponse = await fetch(
                `http://localhost:2833/labels/${bestMatch._label}`
              );
              if (!labelResponse.ok) {
                console.error("Error fetching label:", labelResponse.statusText);
                return;
              }
              const labelData = await labelResponse.json();
              console.log(labelData, "labelData");
              const id = labelData[0]._id;
              console.log(id);
              return id;
            } catch (error) {
              console.error("Error fetching label data:", error);
              return "Error fetching label data";
            }
          }
        }
        return "No face detected.";
      })
    );

    console.log(results); // Log all face recognition results
    return results;
  };

