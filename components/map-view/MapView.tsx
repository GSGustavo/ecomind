"use client";

import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill } from "ol/style";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { getCenter } from "ol/extent";
import Feature from "ol/Feature";
import "ol/ol.css";

export const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [isNDVIVisible, setIsNDVIVisible] = useState(true);
  const [isAODVisible, setIsAODVisible] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // 🗺️ Extent da área de São Paulo
    const extent: [number, number, number, number] = [
      -46.826929972940356,
      -24.00972175630451,
      -46.3642976016188,
      -23.35619738710756
    ];

    // 🌍 Base OSM
    const baseLayer = new TileLayer({
      source: new OSM()
    });

    // 🌿 NDVI
    const ndviLayer = new ImageLayer({
      source: new ImageStatic({
        url: "/NDVI_SP_RGB_2024_3_TRANSP.png",
        imageExtent: extent,
        projection: "EPSG:4326",
        interpolate: true
      }),
      opacity: 0.8,
      visible: true
    });

    // 🌫️ AOD
    const aodLayer = new ImageLayer({
      source: new ImageStatic({
        url: "/AOD_SP_RGB_2024_TRANSP.png",
        imageExtent: extent,
        projection: "EPSG:4326",
        interpolate: true
      }),
      opacity: 0.8,
      visible: false
    });

    // 🧭 Distritos (GeoJSON)
    const districtLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Distritos_SP_GeoJSON.geojson",
        format: new GeoJSON()
      }),
      style: new Style({
        stroke: new Stroke({ color: "#222", width: 1.2 }),
        fill: new Fill({ color: "rgba(255,255,255,0.05)" })
      })
    });

    // 🛰️ Cria o mapa
    const olMap = new Map({
      target: mapRef.current,
      layers: [baseLayer, ndviLayer, aodLayer, districtLayer],
      view: new View({
        projection: "EPSG:3857",
        center: fromLonLat(getCenter(extent)),
        zoom: 9
      })
    });

    // 🧾 Tooltip dinâmica
    const tooltip = document.createElement("div");
    tooltip.id = "district-tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.padding = "6px 10px";
    tooltip.style.background = "rgba(0, 0, 0, 0.75)";
    tooltip.style.color = "white";
    tooltip.style.borderRadius = "6px";
    tooltip.style.font = '12px "Segoe UI", Arial, sans-serif';
    tooltip.style.pointerEvents = "none";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.transition = "opacity 0.2s";
    tooltip.style.opacity = "0";
    mapRef.current.appendChild(tooltip);

    olMap.on("pointermove", (evt) => {
      const feature = olMap.forEachFeatureAtPixel(evt.pixel, (f) => f as Feature);
      if (feature) {
        const nome = feature.get("nm_distrit");
        tooltip.innerText = nome;
        tooltip.style.left = evt.pixel[0] + 10 + "px";
        tooltip.style.top = evt.pixel[1] + 10 + "px";
        tooltip.style.opacity = "1";
      } else {
        tooltip.style.opacity = "0";
      }
    });

    setMap(olMap);

    return () => {
      olMap.setTarget(undefined);
    };
  }, []);

  // 🌿 Alternar camadas
  const toggleNDVI = () => {
    if (!map) return;
    const ndvi = map.getAllLayers()[1];
    const aod = map.getAllLayers()[2];
    ndvi.setVisible(true);
    aod.setVisible(false);
    setIsNDVIVisible(true);
    setIsAODVisible(false);
  };

  const toggleAOD = () => {
    if (!map) return;
    const ndvi = map.getAllLayers()[1];
    const aod = map.getAllLayers()[2];
    ndvi.setVisible(false);
    aod.setVisible(true);
    setIsNDVIVisible(false);
    setIsAODVisible(true);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="toolbar">
        <button onClick={toggleNDVI} className={isNDVIVisible ? "active" : ""}>🌿 NDVI (Vegetação)</button>
        <button onClick={toggleAOD} className={isAODVisible ? "active" : ""}>🌫️ AOD (Poluição)</button>
      </div>
      <div id="map" ref={mapRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};
