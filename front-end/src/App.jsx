/* eslint-disable */

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "./App.css";
import "./styles/spaces.css";
import "./styles/fonts.css";
import "./styles/colors.css";
import "primeicons/primeicons.css";
import { AutoComplete } from "primereact/autocomplete";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";


function App() {
  let [originalURL, setOriginalURL] = useState("");
  let [shortURL, setShortURL] = useState("");
  let [shortSlug, setShortSlug] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [label, setLabel] = useState("Copy");
  const [icon, setIcon] = useState("pi pi-copy");
  const [copied, setCopied] = useState(false);
  const [badRequest, setBadRequest] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [borderRedZone, setBorderRedZone] = useState({})

  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleOriginalURLChange = (e) => {
    setOriginalURL(e.value);
  };

  const handleShortURLChange = (e) => {
    setShortSlug(e.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url = { originalURL, shortSlug };

    try {
        const response = await fetch(`${baseURL}/api/short-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(url),
      });

      if (response.ok) {
        const result = await response.json();
        originalURL = result.original_url;
        setShortURL(result.short_url);
        // url = {originalURL, shortURL};
        setShowDialog(true);
        setErrorMessage("")
        setBadRequest(false)
        setBorderRedZone({})
      }
      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(result.error)
        setBadRequest(true)
        if (result.name === "long"){
              setBorderRedZone({...borderRedZone, long:true})
        }
        else if (result.name === "short"){
              setBorderRedZone({...borderRedZone, short:true})
        }

      }
    } catch (error) {
      console.log("an error has occured");
    }
  };

  return (
    <div className="bg-hero w-full h-full p-1px">
      <div className="title">
        <h1 className="text-center text-white mt-100px text-5xl">
          URL Shortener App
        </h1>
        <h1 className="text-center text-white mt-5 ">
          Build stronger digital connections
        </h1>
        <p className="text-center text-white text-xl font-normal font-helvetica mx-auto w-8 mt-5">
          Use our URL shortener to engage your audience and connect them to the
          right information.
        </p>

        <Card
          title="Shorten a long link"
          className="w-10 mb-100px mt-6 mx-auto"
        >
          <form onSubmit={handleSubmit}>
            <p className="url font-semibold mb-2">Paste your long link here</p>
            <AutoComplete
              className={`${borderRedZone?.long ? "border-red" : "border-grey"}`}
              value={originalURL}
              field="label"
              optionGroupLabel="label"
              optionGroupChildren="items"
              placeholder="https://www.example.com/my-long-url"
              onChange={handleOriginalURLChange}
              required
            />

            <p className="url font-semibold mb-2">Create your own slug (optional)</p>
            <AutoComplete
              value={shortSlug}
              className={`${borderRedZone?.short ? "border-red" : "border-grey"}`}
              field="label"
              optionGroupLabel="label"
              optionGroupChildren="items"
              placeholder="my-short-url"
              onChange={handleShortURLChange}
            />
            {badRequest && (<p className="text-red-700 text-sm ml-1 mb-3">
                {errorMessage}
              </p>) }
            <Button
              className="mt-4"
              icon="pi pi-arrow-right"
              iconPos="right"
              label="Get your link for free"
            />

            
          </form>

          <Dialog
            header = "Here is your short URL!"
            visible={showDialog}
            style={{ width: "60vw" }}
            onHide={() => {
              setShowDialog(false);
              setLabel("Copy");
              setIcon("pi pi-copy");
              setCopied(false); 
            }}
            closable
          >
            {/* <p className="m-2 font-montserrat font-medium">
              short URL:
            </p> */}

            <div className="flex gap-3 mt-5 mb-2">
              <InputText value={shortURL} readOnly className="w-full" />
              <Button
                className="min-w-max"
                label={label}
                icon={icon}
                onClick={() => {
                  navigator.clipboard.writeText(shortURL);
                  setLabel("Copied");
                  setIcon("pi pi-check");
                  setCopied(true);
                }}
              />
            </div>

            {copied && (
              <small className="text-green-600 font-medium ml-1 mb-3">
                Link copied to clipboard!
              </small>
            )}
          </Dialog>
        </Card>
      </div>
    </div>
  );
}

export default App;
