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
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

function ConfirmDeletionModal({
  dialog,
  setDialog,
  setFinalizeDelete,
  finalizeDelete,
  loadingDelete,
  confirmDeleteURL,
}) {
  return (
    <Dialog
      header="Confirmation"
      visible={dialog.visible}
      className="dialog-delete"
      style={{ width: "150px", wordBreak: "break-word" }}
      breakpoints={{ "400px": "300px", "338px": "250px" }}
      onHide={() => {
        setFinalizeDelete(false);
        setDialog({ ...dialog, visible: false });
      }}
      footer={
        <div>
          {!finalizeDelete ? (
            <>
              <Button
                label="Yes"
                icon={
                  loadingDelete ? "pi pi pi-spin pi-spinner" : "pi pi-check"
                }
                onClick={() => {
                  confirmDeleteURL(dialog.map_id);
                }}
              />
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => {
                  setDialog({ ...dialog, visible: false });
                }}
                autoFocus
              />
            </>
          ) : (
            <Button
              label="OK"
              icon="pi pi-check"
              onClick={() => {
                setDialog({ ...dialog, visible: false });
              }}
              autoFocus
            />
          )}
        </div>
      }
    >
      <DialogContent message={dialog.message} />
    </Dialog>
  );
}

function DialogContent({ message }) {
  return (
    <>
      <div className="mt-4 ml-6px">{message}</div>
    </>
  );
}

export default ConfirmDeletionModal;
