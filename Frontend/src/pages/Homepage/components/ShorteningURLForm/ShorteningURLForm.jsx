/* eslint-disable */
import "../../homePage.scss";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "../../../../App.css";
import "../../../../styles/spaces.css";
import "../../../../styles/fonts.css";
import "../../../../styles/colors.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ShortURLModal from "./ShortURLModal";

function ShorteningURLForm({
  listOfURLs,
  setListOfURLs,
  setAuthorizationMessage,
  username,
  toLoginPage,
}) {
  let [originalURL, setOriginalURL] = useState("");
  let [shortURL, setShortURL] = useState("");
  let [shortSlug, setShortSlug] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [badRequest, setBadRequest] = useState(true);
  const [borderRedZone, setBorderRedZone] = useState({});
  const [shorturlLoading, setShorturlLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    setErrorMessage("");
    setBorderRedZone(false);
    setBadRequest(false);

    const savedOriginal = sessionStorage.getItem("originalURL") || "";
    const savedSlug = sessionStorage.getItem("shortSlug") || "";

    setOriginalURL(savedOriginal);
    setShortSlug(savedSlug);
  }, [username]);

  const handleOriginalURLChange = (e) => {
    setOriginalURL(e.value);
    sessionStorage.setItem("originalURL", e.value);
    setErrorMessage(false);
    setBorderRedZone({});
    setBadRequest(false);
  };

  const handleShortURLChange = (e) => {
    setShortSlug(e.value);
    sessionStorage.setItem("shortSlug", e.value);
    setBorderRedZone({});
    setErrorMessage(false);
    setBadRequest(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShorturlLoading(true);

    let url = { originalURL, shortSlug, username };

    try {
      const response = await fetch(`${baseURL}/api/short-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(url),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setShorturlLoading(false);
        setShortURL(result.short_url);
        setListOfURLs([
          ...listOfURLs,
          {
            map_id: result.map_id,
            original_url: result.original_url,
            short_slug:result.short_slug,
            short_url: result.short_url,
          },
        ]);
        setShowDialog(true);
        setErrorMessage("");
        setBadRequest(false);
        setBorderRedZone({});
        sessionStorage.removeItem("originalURL");
        sessionStorage.removeItem("shortSlug");
        setShortSlug("")
        setOriginalURL("")
      } else if (response.status === 401) {
        setErrorMessage("");
        setAuthorizationMessage(true);
        toLoginPage();
      } else {
        const result = await response.json();
        setShorturlLoading(false);
        setErrorMessage(result.error);
        setBadRequest(true);
        if (result.name === "long") {
          setBorderRedZone({ ...borderRedZone, long: true });
        } else if (result.name === "short") {
          setBorderRedZone({ ...borderRedZone, short: true });
        }
      }
    } catch (error) {
      console.log(error);
      setBadRequest(true)
      setErrorMessage("The server is down. Please Try again later.");
      setShorturlLoading(false);
    }
  };

  return (
    <div className="form-home p-1px">
      <Card title="Shorten a long link" className=" shortURLForm mx-auto">
        <form onSubmit={handleSubmit}>
          <p className="url font-semibold mb-2">Paste your long link here</p>

          <AutoComplete
            className={`${borderRedZone?.long ? "border-red borderRedZone" : "border-grey"}`}
            value={originalURL}
            field="label"
            optionGroupLabel="label"
            optionGroupChildren="items"
            placeholder="https://www.example.com"
            onChange={handleOriginalURLChange}
            required
          />

          <p className="url font-semibold mb-2">
            Create your own slug (optional)
          </p>
          <AutoComplete
            value={shortSlug}
            className={`${borderRedZone?.short ? "border-red borderRedZone" : "border-grey"}`}
            field="label"
            optionGroupLabel="label"
            optionGroupChildren="items"
            placeholder="your slug"
            onChange={handleShortURLChange}
          />
          {badRequest && (
            <p className="errorMessage text-red-700 ml-1 mb-2 mt-5">
              {errorMessage}
            </p>
          )}
          <Button
            className="mt-4 min-w-183px"
            icon={`${!shorturlLoading ? "pi pi-arrow-right" : "pi pi-spin pi-spinner"}`}
            iconPos={"right"}
            label={"Get your link for free"}
          />
        </form>

        <ShortURLModal
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          shortURL={shortURL}
        />
      </Card>
    </div>
  );
}

export default ShorteningURLForm;
