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
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function ShortURLModal({ showDialog, setShowDialog, shortURL }) {
  const [label, setLabel] = useState("Copy");
  const [icon, setIcon] = useState("pi pi-copy");
  const [copied, setCopied] = useState(false);

  return (
    <Dialog
      header="Here is your short URL!"
      visible={showDialog}
      className="shorturl"
      style={{ width: "60vw" }}
      onHide={() => {
        setShowDialog(false);
        setLabel("Copy");
        setIcon("pi pi-copy");
        setCopied(false);
      }}
      closable
    >
      <div className="dialog-input flex gap-3 mt-5 mb-2">
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
        <small className="linkCopied text-green-600 font-medium mt-3 ml-1 mb-3">
          Link copied to clipboard!
        </small>
      )}
    </Dialog>
  );
}

export default ShortURLModal;
