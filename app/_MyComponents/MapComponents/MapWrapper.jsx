"use client"

import MapView from "./MapView.jsx"

function MapWrapper({ imageCard, Location, sideField,param  }) {
   return (
       <MapView param={param}  Location={Location} imageCard={imageCard} sideField={sideField} />
    )
}

export default MapWrapper
