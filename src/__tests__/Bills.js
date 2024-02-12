/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { bills } from "../fixtures/bills.js";
import router from "../app/Router";

jest.mock("../app/Store", () => mockStore);

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
      const dates = screen
        .getAllByTestId("formated-date")
        .map((a) => a.innerHTML);

      expect(dates.length).toEqual(4);

      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

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
        const bill = new Bills({ document, onNavigate, store: null, localStorage });

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
      test("function handleClickIconEye has been called, and the modal should be opened ", async () => {
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
        const bill = new Bills({ document, onNavigate, store: null, localStorage });
        await waitFor(() => screen.getAllByTestId("icon-eye"));

        const spyClickIconEye = jest.spyOn(bill, "handleClickIconEye");
        const iconEye = screen.getAllByTestId("icon-eye")[0];
        $.fn.modal = jest.fn();
        userEvent.click(iconEye);

        expect(spyClickIconEye).toBeCalledTimes(1);
        expect($.fn.modal).toBeCalledWith("show");
      });

      test("the modal should be linked to the bill url", async () => {
        const iconEye = screen.getAllByTestId("icon-eye")[0];
        await waitFor(() => screen.getByAltText("Bill"));
        const img = screen.getByAltText("Bill");
        expect(img.getAttribute("src")).toBe(
          iconEye.getAttribute("data-bill-url")
        );
      });
    });
  });
});

// Test d'intégration GET

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    test ("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({type: "Employee", email: "a@a"}));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills); 
      const store = mockStore;
      const bill = new Bills({document, onNavigate, store, localStorage});
      await bill.getBills();

      const statusEnAttente = screen.getAllByText("En attente");
      expect(statusEnAttente.length).toBe(1);
      const statusAccepte = screen.getAllByText("Accepté");
      expect(statusAccepte.length).toBe(1);
      const statusRefused = screen.getAllByText("refused");
      expect(statusRefused.length).toBe(2);

    })
  })
  describe("When an error occurs on API",  () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });

    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message =  await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  });
});
