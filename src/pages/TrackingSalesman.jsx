import React, { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import { Icon } from "@iconify/react";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import { getApi } from "../config/configAxios";
import { toast } from "react-toastify";
import { Search } from "@mui/icons-material";
import { formatDate, formatTime } from "../utils/Date";

const TrackingSalesman = () => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infowindowShown, setInfowindowShown] = useState(false);
  const [salesman, setSalesman] = useState([]);
  const [salesmanLocation, setSalesmanLocation] = useState([]);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const updateLocationRef = useRef(true);

  
  const toggleInfoWindow = () =>
    setInfowindowShown((previousState) => !previousState);

  const closeInfoWindow = () => setInfowindowShown(false);

  const fetchSalesman = async () => {
    try {
      const response = await getApi("users");
      const validSalesmen = response?.data?.users.filter(
        (item) => item.latitude !== null && item.longitude !== null
      );
      setSalesman(validSalesmen);
      setSalesmanLocation(validSalesmen);
      
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    }
  };

  const updateLocation = async () => {
    // if (updateLocationRef.current) {
      fetchSalesman();
      
    // } else {
    //   try {
    //     const response = await getApi(`users/${value.id}`);
    //     const updatedUser = response?.data;
    //     console.log(updatedUser);
    //     // if (updatedUser.latitude !== null && updatedUser.longitude !== null) {
    //     //   setSalesmanLocation([updatedUser]);
    //     // }
    //   } catch (error) {
    //     console.error("Error fetching updated location:", error);
    //   }
    // }
  };

  useEffect(() => {
    fetchSalesman();
    const intervalId = setInterval(updateLocation, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLocation = () => {
    updateLocationRef.current = false;
    const filteredSalesman = salesman.filter(
      (item) => item.latitude && item.longitude && item.id === value.id
    );
    setSalesmanLocation(filteredSalesman);
  };

  return (
    <AdminLayout title={"Where is the salesmen?"}>
      {/* <Grid item xs={12} md={4}>
        <Box display={"flex"} mb={2}>
          <Autocomplete
            size="small"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="select salesmen"
            options={salesman}
            getOptionLabel={(option) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="select" />}
          />

          <div>
            <Button
              onClick={() => {
                handleLocation();
              }}
              sx={{
                textTransform: "capitalize",
                ml: 2,
              }}
              variant="contained"
              color="primary"
            >
              <Search sx={{ color: "f3f3f3", pr: 1 }} />
              Search
            </Button>
          </div>
        </Box>
      </Grid> */}
      <div style={{ height: "70vh", width: "100%" }}>
        <APIProvider apiKey={"AIzaSyBdcuJ6KdW5ZTT5x914iziur87UANrHf0k"}>
          <Map
            zoom={12}
            mapId={"AIzaSyBdcuJ6KdW5ZTT5x914iziur87UANrHf0k"}
            center={
              salesmanLocation?.length === 1
                ? {
                    lat: parseFloat(salesmanLocation[0].latitude),
                    lng: parseFloat(salesmanLocation[0].longitude),
                  }
                : { lat: 3.0557691, lng: 101.5091893 }
            }
          >
            {salesmanLocation?.map((item) => {
              const latitude = parseFloat(item?.latitude);
              const longitude = parseFloat(item?.longitude);

              if (!isNaN(latitude) && !isNaN(longitude)) {
                return (
                  <AdvancedMarker
                    key={item.id}
                    ref={markerRef}
                    position={{
                      lat: latitude,
                      lng: longitude,
                    }}
                    onClick={toggleInfoWindow}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          padding: "5px",
                          background: "#fff",
                          borderRadius: "6px",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          <b> {item?.name}</b>
                        </p>
                        <span>
                          <b>Last moved: </b>
                          {formatTime(item?.updated_at)}
                          <p
                            style={{
                              margin: 0,
                            }}
                          >
                            {formatDate(item?.updated_at)}
                          </p>
                        </span>
                      </div>
                      <span>
                        <Icon
                          style={{ fontSize: "40px" }}
                          icon={"noto-v1:man-walking-light-skin-tone"}
                        />
                      </span>
                    </div>
                  </AdvancedMarker>
                );
              } else {
                return null;
              }
            })}
          </Map>
        </APIProvider>
      </div>
    </AdminLayout>
  );
};

export default TrackingSalesman;
