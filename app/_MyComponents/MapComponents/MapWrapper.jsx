"use client"
import { useState } from "react";
import MapView from "./MapView";
function MapWrapper({ imageCard, Location, sideField, year, yearRange, paramLoc  }) {
   return (
       <MapView paramLoc={paramLoc}  year={year} yearRange={yearRange} Location={Location} imageCard={imageCard} sideField={sideField} />
    )
}

export default MapWrapper
