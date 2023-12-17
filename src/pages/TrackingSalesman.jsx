import React, { useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Marker,
  Pin,
} from "@vis.gl/react-google-maps";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import { Icon } from "@iconify/react";

const TrackingSalesman = () => {
  const customMarkerStyle = {
    background: "#FBBC04",
    glyphColor: "#000",
    borderColor: "#000",
  };

  const [popupOpen, setPopupOpen] = useState(false);
  console.log(popupOpen);

  return (
    <AdminLayout title={"Track salesmen"}>
      <div style={{ height: "60vh", width: "100%" }}>
        <APIProvider apiKey={"AIzaSyBdcuJ6KdW5ZTT5x914iziur87UANrHf0k"}>
          <Map
            zoom={12}
            center={{ lat: 53.54992, lng: 10.00678 }}
            mapId={"<Your custom MapId here>"}
          >
            <AdvancedMarker
              position={{ lat: 53.54492, lng: 10.01678 }}
              draggable={true}
              onClick={() => setPopupOpen(true)}
            >
              <span>
                <Icon
                  style={{ fontSize: "40px" }}
                  icon={"noto-v1:man-walking-light-skin-tone"}
                />
              </span>
            </AdvancedMarker>
            <AdvancedMarker
              position={{ lat: 53.54992, lng: 10.00678 }}
              draggable={true}
              onClick={() => setPopupOpen(true)}
            >
              <span>
                <Icon
                  style={{ fontSize: "40px" }}
                  icon={"noto-v1:man-walking-light-skin-tone"}
                />
              </span>
            </AdvancedMarker>
            {popupOpen && (
              <InfoWindow
                // onClick={() => setPopupOpen(false)}
                position={{ lat: 53.54992, lng: 10.00678 }}
              >
                Hello World!
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </AdminLayout>
  );
};

export default TrackingSalesman;
