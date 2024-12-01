"use client"
import { useEffect, useState } from "react";
import * as faceapi from "@vladmandic/face-api";

const useFaceApi = () => {
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/weights";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelsLoaded(true);
      } catch (error) {
        console.error("Error loading face-api models:", error);
        return error
      }
    };
    loadModels();
  }, []);

  return { isModelsLoaded, error };
};

export default useFaceApi;
