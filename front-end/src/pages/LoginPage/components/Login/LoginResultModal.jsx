
/* eslint-disable */
import "../../LoginPage.scss";
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




function LoginResultModal({dialog, setDialog}){

    return(
  
      <Dialog
                  header="Your registration"
                  visible={dialog.visible}
                  className="dialog-signup"
                  style={{ width: "150px", wordBreak: "break-word" }}
                  breakpoints={{ "400px": "300px", "338px": "250px" }}
                  onHide={() => setDialog({ ...dialog, visible: false })}
                  footer={
                    <div>
                      <Button
                        label="OK"
                        icon="pi pi-check"
                        onClick={() => setDialog({ ...dialog, visible: false })}
                        autoFocus
                      />
                    </div>
                  }
                >
                  <DialogContent
                    message={dialog.message}
                    
                  />
                </Dialog>
     )
   }
  
  
  function DialogContent({ message }) {
    return (
      <>
        <div className="mt-4 ml-6px">{message}</div>
      </>
    );
  }


  export default LoginResultModal; 