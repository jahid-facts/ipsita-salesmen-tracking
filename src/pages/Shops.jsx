import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import {  Autocomplete, Box, Button, Chip, Grid, IconButton, TextField } from "@mui/material";
import DataTable from "../components/DataTable/DataTable";
import { MoreHoriz } from "@mui/icons-material";
import Dropdownmenu from "../components/Dropdown/DropdownMenu";
import { getApi, postApi, putApi } from "../config/configAxios";
import CustomLoader from "../components/customLoader/CustomLoader";
import TransitionsModal from "../components/Modal";
import TransitionsModalDelete from "../components/DeleteModal";
import { ExcelFileUpload } from "../components/ExcelFileUpload";
import { toast } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { rcOptions } from "../components/RC";

const ShopsList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [shopList, setShopList] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteByRc, setOpenDeleteByRc] = useState(false);
  const [shopEdit, setShopEdit] = useState(false);
  const [shopData, setShopData] = useState({
    id: "",
    name: "",
    address: "",
    number: "",
  });

  const handleMenuOpen = (event, itemId) => {
    setAnchorEl(event.currentTarget);
    setItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchData = async () => {
    try {
      const response = await getApi("shop");
      setShopList(response.data.shop);
    } catch (error) {
      console.error("An error occurred while fetching data.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // handle action
  const handleAction = async (actionType) => {
    try {
      switch (actionType) {
        case "delete":
          Swal.fire({
            title: "Confirm Delete ?",
            text: "Are you sure you want to delete this shop?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await axios
                  .delete(
                    `${process.env.REACT_APP_API_BASE_URL}delete-shop/${itemId}`
                  )
                  .then((res) => {
                    toast.success(res.data?.message);
                  })
                  .catch((err) => {
                    toast.error("An error occurred while deleting");
                  })
                  .finally(() => {
                    fetchData();
                  });
              } catch (error) {
                Swal.fire(
                  "Error",
                  "An error occurred while delete the item.",
                  "error"
                );
              }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire("Cancelled", "The shop was not deleted.", "info");
            }
          });
          break;
          case "edit":
            try {
              await axios
                .get(`${process.env.REACT_APP_API_BASE_URL}shop/${itemId}`)
                .then((res) => {
                  setShopData(res?.data?.shop);
                  
                  setShopEdit({
                    id: res?.data?.shop.id || "",
                    name: res?.data?.shop.name || "",
                    address: res?.data?.shop.address || "",
                    number: res?.data?.shop.number || "",
                  });
                  console.log(shopData);
                  setOpenEdit(true);
                })
                .catch((err) => {
                  toast.error("An error occurred while updating status");
                });
            } catch (error) {
              Swal.fire(
                "Error",
                "An error occurred while  empty device id the shop.",
                "error"
              );
            }
  
            break;
        default:
          await putApi(`status-shop/${itemId}`, { status: actionType });
          toast.success("Shop has been updated");
      }
      fetchData();
    } catch (error) {
      console.error("An error occurred while updating status.", error);
    } finally {
      handleMenuClose();
    }
  };

  // handle on delete shop
  const handleOnDelete = async (actionType) => {
    try {
      Swal.fire({
        title: "Confirm Delete ?",
        text: "Are you sure you want to delete all shops?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios
              .delete(`${process.env.REACT_APP_API_BASE_URL}shop-on-delete`)
              .then((res) => {
                toast.success(res.data?.message);
              })
              .catch((err) => {
                toast.error("An error occurred while deleting");
              })
              .finally(() => {
                fetchData();
              });
          } catch (error) {
            Swal.fire(
              "Error",
              "An error occurred while delete the item.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "The shop was not deleted.", "info");
        }
      });
    } catch (error) {
      console.error("An error occurred while updating status.", error);
    } finally {
      handleMenuClose();
    }
  };

  const handleOnDeleteByRcOpen = async () => {
    setOpenDeleteByRc(true);
  }

  const handleOnDeleteByRc = async () => {
    setOpenDeleteByRc(false);
    try {
      Swal.fire({
        title: "Confirm Delete ?",
        text: "Are you sure you want to delete all shops?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios
              .delete(`${process.env.REACT_APP_API_BASE_URL}shop-on-delete-by-rc/${inputValue}`)
              .then((res) => {
                toast.success(res.data?.message);
              })
              .catch((err) => {
                toast.error("An error occurred while deleting");
              })
              .finally(() => {
                fetchData();
              });
          } catch (error) {
            Swal.fire(
              "Error",
              "An error occurred while delete the item.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "The shop was not deleted.", "info");
        }
      });
    } catch (error) {
      console.error("An error occurred while updating status.", error);
    } finally {
      handleMenuClose();
    }
  }

  const actionItems = [
    { type: "edit" },
    { type: "active" },
    { type: "disabled" },
    { type: "delete" },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Shop name", width: 200 },
    { field: "shopCode", headerName: "Shop Code", width: 150 },
    { field: "address", headerName: "Owner name", width: 200 },
    { field: "rc", headerName: "RC", width: 100 },
    { field: "number", headerName: "Number", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status.toLowerCase();

        if (status === "active") {
          return <Chip size="small" label={status} color="success" />;
        } else if (status === "disabled") {
          return <Chip size="small" label={status} color="info" />;
        } else {
          return <Chip size="small" label={status} color="warning" />;
        }
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex">
          <IconButton
            onClick={(event) => handleMenuOpen(event, params.row.itemId)}
          >
            <MoreHoriz />
          </IconButton>
          <Dropdownmenu
            anchorEl={anchorEl}
            handleMenuClose={handleMenuClose}
            handleAction={(actionType) => handleAction(actionType)}
            actionItems={actionItems}
          />
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const newData = shopList.map((data, index) => ({
      itemId: data.id,
      id: index + 1,
      name: data.name || "",
      shopCode: data.shop_code || "",
      address: data.address || "",
      rc: data?.rc || "",
      number: data?.number || "",
      status: data.status || "Active",
    }));

    setData(newData);
  }, [shopList]);

  // handle file submit
  const [open, setOpen] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    if (file) {
      const formData = new FormData();
      formData.append("file", file[0]);
      try {
        await postApi("add-shop", formData);
        fetchData();
        toast.success("Shops uploaded successfully");
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "An error occurred while uploading data."
        );
      } finally {
        setOpen(false);
        setLoading(false);
      }
    } else {
      toast.error("please select a file");
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);




  // Mahedi

  // handle fillter
  const handleFilter = async () => {
    setLoading(true);
    try {
      const rc1 = value.value;
      const response = await getApi(`rc-shop/${rc1}`);
      setShopList(response?.data?.task);
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Update userData when userEdit changes
    if (shopData) {
      setShopEdit({
        id: shopData.id || "",
        name: shopData.name || "",
        address: shopData.address || "",
        number: shopData.number || "",
      });
    }
  }, [shopData]);

  

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShopData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmitEdit = async () => {
    setEditLoading(true);

    try {
      const data = {
        name: shopData.name,
        address: shopData.address,
        number: shopData.number,
      };

      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}update-shops/${shopData.id}`,
        data
      );

      toast.success("Shop updated successfully");
      setOpenEdit(false);
      fetchData();
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setEditLoading(false);
    }
  };


  return (
    <AdminLayout title={"Shops list"}>
      <Helmet>
        <title>Shops list</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display={"flex"} gap={2}>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize", mb: 2 }}
              onClick={handleOpen}
            >
              Add Shops
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ textTransform: "capitalize", mb: 2 }}
              onClick={handleOnDelete}
            >
              Delete All Shops
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ textTransform: "capitalize", mb: 2 }}
              onClick={handleOnDeleteByRcOpen}
            >
              Delete By Rc
            </Button>
          </Box>
          <TransitionsModal
            title={"Upload shops data use excel"}
            handleSubmit={handleSubmit}
            open={open}
            setOpen={setOpen}
            isSubmitting={loading}
          >
            <ExcelFileUpload setFile={setFile} />
          </TransitionsModal>
          {loading ? (
            <CustomLoader />
          ) : (
            <DataTable data={data} columns={columns} />
          )}
        </Grid>

         {/* Shop edit  */}
         <TransitionsModal
            title={"Edit shop"}
            handleSubmit={handleSubmitEdit}
            open={openEdit}
            setOpen={setOpenEdit}
            isSubmitting={editLoading}
          >
            <form onSubmit={handleSubmitEdit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Shop Name"
                    name="name"
                    value={shopData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="address"
                    label="Owner Name"
                    name="address"
                    value={shopData.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="number"
                    label="Number"
                    name="number"
                    value={shopData.number}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </form>
          </TransitionsModal>


           {/* Shop delete by rc  */}
        <TransitionsModalDelete
          title={"Delete Shop by RC"}
          handleSubmit={handleSubmitEdit}
          open={openDeleteByRc}
          setOpen={setOpenDeleteByRc}
          isSubmitting={editLoading}
        >
            <Grid container spacing={2}>
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
                id="controllable-states-demo"
                options={rcOptions}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="select" />}
              />

            </Grid>
           <Grid container spacing={2}
           sx={{paddingTop: 2}}
           >
            <Button
              fullWidth
              variant="contained"
                color="secondary"
                sx={{ textTransform: "capitalize", mb: 2, marginTop: 2 }}
                onClick={handleOnDeleteByRc}
              >
                Delete
              </Button>
           </Grid>
        </TransitionsModalDelete>

      </Grid>
    </AdminLayout>
  );
};

export default ShopsList;
