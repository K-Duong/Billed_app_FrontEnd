/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

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

    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage,
    });

    const mockHandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
    input.addEventListener("change", mockHandleChangeFile);
    await waitFor(() => fireEvent.change(input, event));

    expect(mockHandleChangeFile).toHaveBeenCalled();
    expect(newBill.fileName).toBe("test.jpg");
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

    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage,
    });

    const mockHandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
    input.addEventListener("change", mockHandleChangeFile);
    await waitFor(() => fireEvent.change(input, event));

    expect(mockHandleChangeFile).toHaveBeenCalled();
    expect(newBill.fileName).toBeNull();
  });

});
describe("When I finish the form and click on submit button", () => {
  test("Then function handleSubmit has been called", async () => {
    document.body.innerHTML = NewBillUI()
    const newBill = new NewBill({
      document,
      onNavigate,
      store: null,
      localStorage: window.localStorage,
    });

    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
    const formNewBill = screen.getByTestId("form-new-bill");
    formNewBill.addEventListener("submit", handleSubmit);
    fireEvent.submit(formNewBill);

    expect(handleSubmit).toHaveBeenCalled();
  })
})

//Test d'intégration
describe("When an error occurs on API", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills");
    jest.spyOn(console, "error");
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
