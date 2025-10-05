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

interface MapViewProps {
  selectedType?: string; // "NDVI" ou "AOD"
}

export const MapView: React.FC<MapViewProps> = ({ selectedType }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const ndviLayerRef = useRef<ImageLayer<any> | null>(null);
  const aodLayerRef = useRef<ImageLayer<any> | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const extent: [number, number, number, number] = [
      -46.826929972940356,
      -24.00972175630451,
      -46.3642976016188,
      -23.35619738710756
    ];

    const baseLayer = new TileLayer({
      source: new OSM()
    });

    const ndviLayer = new ImageLayer({
      source: new ImageStatic({
        url: "/NDVI_SP_RGB_2024_3_TRANSP.png",
        imageExtent: extent,
        projection: "EPSG:4326",
        interpolate: true
      }),
      opacity: 0.8,
      visible: selectedType === "NDVI"
    });

    const aodLayer = new ImageLayer({
      source: new ImageStatic({
        url: "/AOD_SP_RGB_2024_TRANSP.png",
        imageExtent: extent,
        projection: "EPSG:4326",
        interpolate: true
      }),
      opacity: 0.8,
      visible: selectedType === "AOD"
    });

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

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, ndviLayer, aodLayer, districtLayer],
      view: new View({
        projection: "EPSG:3857",
        center: fromLonLat(getCenter(extent)),
        zoom: 9
      })
    });

    mapInstance.current = map;
    ndviLayerRef.current = ndviLayer;
    aodLayerRef.current = aodLayer;

    // Tooltip
    const tooltip = document.createElement("div");
    tooltip.id = "district-tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.padding = "6px 10px";
    tooltip.style.background = "rgba(0, 0, 0, 0.75)";
    tooltip.style.color = "white";
    tooltip.style.borderRadius = "6px";
    tooltip.style.font = '12px "Segoe UI", Arial, sans-serif';
    tooltip.style.pointerEvents = "none";
    tooltip.style.transition = "opacity 0.2s";
    tooltip.style.opacity = "0";
    mapRef.current.appendChild(tooltip);

// 🔍 Atualiza tooltip no hover
    map.on("pointermove", (evt) => {
    const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f as Feature);

    if (feature) {
        const nome = feature.get("nm_distrit");
        tooltip.innerText = nome;
        tooltip.style.opacity = "1";

        // 📍 Posição precisa do mouse (corrige deslocamento mesmo em layouts com padding/scroll)
        const mouseEvent = evt.originalEvent as MouseEvent;
        const containerRect = mapRef.current?.getBoundingClientRect();

        if (containerRect) {
        tooltip.style.left = `${mouseEvent.pageX - containerRect.left + 10}px`;
        tooltip.style.top = `${mouseEvent.pageY - containerRect.top + 10}px`;
        }
    } else {
        tooltip.style.opacity = "0";
    }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // 🔄 Atualiza visibilidade quando `selectedType` muda
    useEffect(() => {
        if (!mapInstance.current) return;
        ndviLayerRef.current?.setVisible(selectedType === "NDVI");
        aodLayerRef.current?.setVisible(selectedType === "AOD");
    }, [selectedType]);


  return <div id="map" ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

