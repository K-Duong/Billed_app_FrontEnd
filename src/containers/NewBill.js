import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
  }
  handleChangeFile = (e) => {
    e.preventDefault();
    const input = this.document.querySelector(`input[data-testid="file"]`);
    const file = e.target.files[0];
    // console.log(e.target.value);
    // const filePath = e.target.value.split(/\\/g);
    // const fileName = filePath[filePath.length - 1];
    const fileName = file.name;
    console.log(fileName);
    const regexImg = /^.+(\.jpeg|\.jpg|\.png)$/;
    if (regexImg.test(fileName)) {
      const formData = new FormData();
      const email = JSON.parse(localStorage.getItem("user")).email;
      formData.append("file", file);
      formData.append("email", email);
      // TODO: à voir pour ne pas créer de nouveau data
      this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true,
          },
        })
        .then(({ fileUrl, key }) => {
          this.billId = key;
          this.fileUrl = fileUrl;
          this.fileName = fileName;
        })
        .catch((error) => console.error(error));
    }else{
      input.value = "";
      return false;
    };
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(
    //   'e.target.querySelector(`input[data-testid="datepicker"]`).value',
    //   e.target.querySelector(`input[data-testid="datepicker"]`).value
    // );
    
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    // const validValue = (val) => val ? true: false;

    // for (const key in bill) {
    //   if (key !== "commentary" && key !== "commentary") {
    //     if (validValue(key)) {
    //       this.updateBill(bill);
    //       this.onNavigate(ROUTES_PATH["Bills"]);
    //     } else {
    //       console.log("form not valid!!!");
    //       return
    //     }
    //   }
    // }

    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH["Bills"]);
    
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    console.log("updated store", this.store);
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
