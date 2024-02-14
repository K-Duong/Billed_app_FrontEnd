/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
// import { bills } from "../fixtures/bills.js";

import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
// import BillsUI from "../views/BillsUI.js";

jest.mock("../app/Store", () => mockStore);

describe(" Given I am connected as an employee and I am on NewBill Page", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.NewBill);
  });
  test("Then when I upload an img file, input is valid", async () => {
    const file = new File(["test file content"], "test.jpg", {
      type: "image/jpeg",
    });
    const input = screen.getByTestId("file");
    const preventDefault = jest.fn();
    const event = {
      preventDefault,
      target: { files: [file] },
    };

    const bill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage,
    });

    const mockHandleChangeFile = jest.fn((e) => bill.handleChangeFile(e));
    input.addEventListener("change", mockHandleChangeFile);
    await waitFor(() => fireEvent.change(input, event));

    expect(mockHandleChangeFile).toHaveBeenCalled();
    expect(bill.fileName).toBe("test.jpg");
  });
  test("Then when I upload an pdf file, input is not valid", async () => {
    const file = new File(["test file content"], "test.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByTestId("file");
    const preventDefault = jest.fn();
    const event = {
      preventDefault,
      target: { files: [file] },
    };

    const bill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage,
    });

    const mockHandleChangeFile = jest.fn((e) => bill.handleChangeFile(e));
    input.addEventListener("change", mockHandleChangeFile);
    await waitFor(() => fireEvent.change(input, event));

    expect(mockHandleChangeFile).toHaveBeenCalled();
    expect(bill.fileName).toBeNull();
  });

  // describe("When I finish the form and click on submit button", () => {
  //   beforeEach(() => {
  //     Object.defineProperty(window, "localStorage", {
  //       value: localStorageMock,
  //     });

  //     window.localStorage.setItem(
  //       "user",
  //       JSON.stringify({
  //         type: "Employee",
  //       })
  //     );
  //     const root = document.createElement("div");
  //     root.setAttribute("id", "root");
  //     document.body.append(root);
  //     router();
  //     window.onNavigate(ROUTES_PATH.NewBill);
  //   })
  //   test("function handleSubmit has been called", async () => {
  //     // const input = screen.getByTestId("file");
  //     const form = screen.getByTestId("form-new-bill");
  //     // const email = JSON.parse(localStorage.getItem("user")).email;
  //     // const file = new File(["test file content"], "test.jpg", {
  //     //   type: "image/jpeg",
  //     // });
  //     // const valForm = {
  //     //   email,
  //     //   type: "Transports",
  //     //   name: "Train Lyon Paris",
  //     //   amount: "100",
  //     //   date: "2024-01-10",
  //     //   vat: "10",
  //     //   pct: "10",
  //     //   commentary: "merci",
  //     //   fileUrl: null,
  //     //   fileName: "test.jpg",
  //     //   status: "pending",
  //     // };
  //     const onNavigate = (pathname) => {
  //       document.body.innerHTML = ROUTES({ pathname });
  //     };
  //     window.onNavigate(ROUTES_PATH.NewBill);
  //     const preventDefault = jest.fn();
  //     const event = {
  //       preventDefault,
  //       target: { files: [file] },
  //     };

  //     const bill = new NewBill({
  //       document,
  //       onNavigate,
  //       store: mockStore,
  //       localStorage,
  //     });
  //     // await waitFor(() => {
  //     //   fireEvent.change(screen.getByTestId("expense-type"), {
  //     //     target: { value: valForm.type },
  //     //   });
  //     //   fireEvent.change(screen.getByTestId("expense-name"), {
  //     //     target: { value: valForm.name },
  //     //   });
  //     //   fireEvent.change(screen.getByTestId("amount"), {
  //     //     target: { value: valForm.amount },
  //     //   });
  //     //   fireEvent.change(screen.getByTestId("datepicker"), {
  //     //     target: { value: valForm.date },
  //     //   });
  //     //   fireEvent.change(screen.getByTestId("vat"), {
  //     //     target: { value: valForm.vat },
  //     //   });
  //     //   fireEvent.change(screen.getByTestId("pct"), {
  //     //     target: { value: valForm.pct },
  //     //   });
  //     //   fireEvent.change(screen.getByTestId("commentary"), {
  //     //     target: { value: valForm.commentary },
  //     //   });
  //     // });

  //     const mockHandleChangeFile = jest.fn((e) => bill.handleChangeFile(e));
  //     input.addEventListener("change", mockHandleChangeFile);
  //     await waitFor(() => fireEvent.change(input, event));

  //       screen.getByTestId("expense-type").value = valForm.type;
  //       screen.getByTestId("expense-name").value = valForm.name;
  //       screen.getByTestId("amount").value = valForm.amount;
  //       screen.getByTestId("datepicker").value = valForm.date;
  //       screen.getByTestId("vat").value = valForm.vat;
  //       screen.getByTestId("pct").value = valForm.pct;
  //       screen.getByTestId("commentary").value = valForm.commentary;

  //     expect(screen.getByTestId("expense-type")).toBeTruthy();
  //     expect(screen.getByTestId("expense-type").value).toBe(valForm.type);
  //     expect(screen.getByTestId("expense-name").value).toBe(valForm.name);
  //     expect(screen.getByTestId("amount").value).toBe(valForm.amount);
  //     expect(screen.getByTestId("datepicker").value).toBe(valForm.date);
  //     expect(screen.getByTestId("vat").value).toBe(valForm.vat);
  //     expect(screen.getByTestId("pct").value).toBe(valForm.pct);
  //     expect(screen.getByTestId("commentary").value).toBe(valForm.commentary);

  //     //   expect(mockHandleChangeFile).toHaveBeenCalled();
  //     //   expect(form).toBeTruthy();
  //     // const mockHandleSubmit = jest.fn((e) => bill.handleSubmit(e));
  //     // form.addEventListener("submit", mockHandleSubmit);
  //     //   //   //   await waitFor(() => fireEvent.submit(form));
  //     // fireEvent.submit(form);
  //     // // document.body.innerHTML = BillsUI({data: bills});
  //     // expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  //   //   fireEvent.submit(form, {
  //   //     preventDefault,
  //   //     target: {
  //   //         querySelector: (selector) => document.querySelector(selector)
  //   //     }
  //   //   });
  //   });
  //   // test("New bill appears on list of bills on Bill page", () => {});
  // });
});


//Test d'intégration
describe("When an error occurs on API", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills");
    jest.spyOn(console, "error").mockImplementation();
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);
    router();
  });
  afterEach(() => {
    console.error.mockReset();
  });
  test("fetches bills from an API and fails with 404 message error", async () => {
    const error404 = new Error("Erreur 404");
    mockStore.bills.mockImplementationOnce(() => {
      return {
        create: () => {
          return Promise.reject(error404);
        },
      };
    });
    window.onNavigate(ROUTES_PATH.NewBill);
    await new Promise(process.nextTick);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0].toString()).toBe(error404.toString());
  });

  test("fetches messages from an API and fails with 500 message error", async () => {
    const error500 = new Error("Erreur 500");

    mockStore.bills.mockImplementationOnce(() => {
      return {
        create: () => {
          return Promise.reject(new Error("Erreur 500"));
        },
      };
    });

    window.onNavigate(ROUTES_PATH.NewBill);
    await new Promise(process.nextTick);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0].toString()).toBe(error500.toString());
  });
});
