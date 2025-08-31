/* eslint-disable */
import "../../SignupPage.scss";
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

function SignupResultModal({ dialog, setDialog, username, toLoginPage }) {
  return (
    <div className="form-signup">
      <Dialog
        header="Your registration"
        visible={dialog.visible}
        className="dialog-signup"
        onHide={() => setDialog({ ...dialog, visible: false })}
        footer={
          <div>
            <Button
              label="OK"
              icon="pi pi-check"
              onClick={() => {
                setDialog({ ...dialog, visible: false });
                toLoginPage();
              }}
              autoFocus
            />
          </div>
        }
      >
        <DialogContent
          message={dialog.message}
          username={username}
          toLoginPage={toLoginPage}
          closeDialog={() => setDialog({ ...dialog, visible: false })}
        />
      </Dialog>
    </div>
  );
}

function DialogContent({ message, username, toLoginPage, closeDialog }) {
  const handleClick = () => {
    closeDialog();
    toLoginPage();
  };

  return (
    <div className="dialogContent-signup">
      <div className="mt-4 ml-6px">{message}</div>
      <p className="ml-6px">
        Your username is <b>{username}</b>
      </p>
      <span className="ml-6px">You can log in </span>
      <span
        className="cursor-pointer text-primary font-semibold"
        onClick={handleClick}
      >
        here
      </span>
    </div>
  );
}

export default SignupResultModal;
