/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, waitFor, fireEvent, wait } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import { ROUTES } from "../constants/routes";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
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
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      expect(windowIcon).toHaveClass("active-icon");
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const dates = screen
        .getAllByTestId("formated-date")
        .map((a) => a.innerHTML);

      expect(dates.length).toEqual(4);

      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

   

    // TODO: do we need async function ?

    // beforeEach(() => {
    //   Object.defineProperty(window, "localStorage", {
    //     value: localStorageMock,
    //   });
    //   window.localStorage.setItem(
    //     "user",
    //     JSON.stringify({
    //       type: "Employee",
    //     })
    //   );
    //   const root = document.createElement("div");
    //   root.setAttribute("id", "root");
    //   document.body.append(root);
    //   router();

    //   const onNavigate = (pathname) => {
    //     document.body.innerHTML = ROUTES({ pathname })
    //   }

    //   window.onNavigate(ROUTES_PATH.Bills);
    //   document.body.innerHTML = BillsUI({ data: bills });

    // });

    describe("When I click on the button new bill", () => {
      test("then handleClickNewBill has to be called ", () => {
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

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        window.onNavigate(ROUTES_PATH.Bills);
        document.body.innerHTML = BillsUI({ data: bills });
        const btnNewBill = screen.getByTestId("btn-new-bill");
        expect(btnNewBill).toBeTruthy();

        const bill = new Bills({ document, onNavigate, localStorage });

        const handleClickNewBill = jest.fn(bill.handleClickNewBill);
        btnNewBill.addEventListener("click", handleClickNewBill);
        userEvent.click(btnNewBill);
        expect(handleClickNewBill).toBeCalled();
      });

      test("it should render new bill page", () => {
        expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
      });
    });

    describe("When I click on eye icon", () => {
      test("Then a modal should be opened", async () => {
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

        window.onNavigate(ROUTES_PATH.Bills);
        document.body.innerHTML = BillsUI({ data: bills });
        const bill = new Bills({ document, onNavigate, localStorage });

        await waitFor(() => screen.getAllByTestId("icon-eye"));
        const spyClickIconEye = jest.spyOn(bill, "handleClickIconEye");
        const iconEye = screen.getAllByTestId("icon-eye")[0];

        $.fn.modal = jest.fn();
        
        userEvent.click(iconEye);
        await spyClickIconEye(iconEye);
        await waitFor(() => document.querySelector("#modaleFile"));
        
        const modal = document.querySelector("#modaleFile");
        
        // expect(iconEye.length).toStrictEqual(4);
        expect(spyClickIconEye).toBeCalledTimes(1);
        // expect(modale).toHaveClass("show");
        expect(modal).toBeTruthy();
       
      });

      test("modal should contain an image file", () => {});
    });
  });
});