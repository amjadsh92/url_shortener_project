/* eslint-disable */
import urlShortenerLogo from "../../../../assets/urlShortener.png";
import "../../homePage.scss";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "../../../../App.css";
import "../../../../styles/spaces.css";
import "../../../../styles/fonts.css";
import "../../../../styles/colors.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import ConfirmDeletionModal from "./ConfirmDeletionModal";

function ListOfURLs({ listOfURLs, setListOfURLs, listOfURLsRef }) {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    original_url: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    short_slug: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [dialog, setDialog] = useState({
    map_id: 0,
    visible: false,
    message: "",
  });
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [finalizeDelete, setFinalizeDelete] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_URL;

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="keywordSearch"
          />
        </IconField>
      </div>
    );
  };

  const confirmDeleteURL = async (map_id) => {
    setLoadingDelete(true);

    try {
      const res = await fetch(`${baseURL}/api/deleteURL/${map_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",
      });

      if (res.ok) {
        const result = await res.json();
        listOfURLs = listOfURLs.filter((url) => url.map_id !== dialog.map_id);
        setListOfURLs(listOfURLs);
        setDialog({ ...dialog, message: result.message, map_id: 0 });
      }
      if (!res.ok) {
        const result = await res.json();
        setDialog({ ...dialog, message: result.error, map_id: 0 });
      }
    } catch (err) {
      console.log(err);
      setDialog({
        ...dialog,
        message: "Failed to delete URL. The server is down",
        map_id: 0,
      });
    } finally {
      setLoadingDelete(false);
      setFinalizeDelete(true);
    }
  };

  const deleteURL = (map_id) => {
    setFinalizeDelete(false);
    setDialog({
      ...dialog,
      map_id,
      visible: true,
      message: "Are you sure you want to delete this URL?",
    });
  };

  const deleteButtonTemplate = (rowData) => {
    const map_id = rowData.map_id;

    return (
      <>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          onClick={() => deleteURL(map_id)}
        />
      </>
    );
  };

  const originalUrlTemplate = (rowData) => {
    return (
      <a
        href={rowData.original_url}
        className="truncate-text"
        target="_blank"
        rel="noopener noreferrer"
      >
        {rowData.original_url}
      </a>
    );
  };

  const shortUrlTemplate = (rowData) => {
    return (
      <>
      <img src={urlShortenerLogo} alt="Logo" className="urlShortenerLogo" />
      <a
        href={rowData.short_url}
        className="truncate-text"
        target="_blank"
        rel="noopener noreferrer"
      >
        {rowData.short_slug}
      </a>
      </>
    );
  };

  const header = renderHeader();

  return (
    <div className="listOfURLs p-1px mb-8" ref={listOfURLsRef}>
      <div className="tableOfURLs mt-6">
        <p className="listOfURLsTitle text-center text-white mb-6">
          Here is the list of your URLs:
        </p>
        <div className="home-table">
          <DataTable
            value={listOfURLs}
            paginator
            rows={10}
            dataKey="map_id"
            filters={filters}
            filterDisplay="row"
            globalFilterFields={["original_url", "short_slug"]}
            header={header}
            emptyMessage="No URLs found."
          >
            
            <Column
              header="Short URL"
              field="short_slug"
              body={shortUrlTemplate}
              filter
              filterPlaceholder="Search by short URL"
              className="shortURLColumn"
            />
            <Column
              field="original_url"
              header="Original URL"
              filter
              filterPlaceholder="Search by original URL"
              body={originalUrlTemplate}
              className="originalURLColumn"
              headerClassName="text-center"
            />
            <Column body={deleteButtonTemplate} className="deleteURLColumn" />
          </DataTable>

          <ConfirmDeletionModal
            dialog={dialog}
            setDialog={setDialog}
            setFinalizeDelete={setFinalizeDelete}
            finalizeDelete={finalizeDelete}
            loadingDelete={loadingDelete}
            confirmDeleteURL={confirmDeleteURL}
          />
        </div>
      </div>
    </div>
  );
}

export default ListOfURLs;
