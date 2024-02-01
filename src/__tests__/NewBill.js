/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
// import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";

// import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

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
      // TODO: pourquoi on doit refaire addEventListener ?
      input.addEventListener("change", mockHandleChangeFile);
      await waitFor(() => fireEvent.change(input, event));

      expect(mockHandleChangeFile).toHaveBeenCalled();
      expect(bill.fileName).toBe("test.jpg");
    });
    test("Then when I upload an pdf file, input is not valid", async () => {
      const file = new File(["test file content"], "test.pdf", {
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
      expect(bill.fileName).toBeNull();
    });
  });
