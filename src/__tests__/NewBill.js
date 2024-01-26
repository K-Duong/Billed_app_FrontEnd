/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, waitFor} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";

import { ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


//TODO: test handleChangeFile ?
// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
    // test("Then when I upload a file in a correct format of image", async () => {
    //   const file = "C:\fakepath\Architecture_Cross_Bar.jpg"
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

    //   window.onNavigate(ROUTES_PATH.NewBill);
    //   document.body.innerHTML = NewBillUI({});

    //   const newBill = new NewBill({document, onNavigate, localStorage})

    //   await waitFor (() => screen.getByTestId("file"));
    //   const input = screen.getByTestId("file");
    //   // const spyHandleChangeFile = jest.spyOn(newBill,"handleChangeFile" );
    //   const mockHandleChangeFile = jest.fn(e => { newBill.handleChangeFile(e)})
    //   // const event = { preventDefault: () => {}};
    //   // const spyPreventDefault = jest.spyOn(event, "preventDefault");
    //   userEvent.upload(input,file);
    //   await mockHandleChangeFile();


    //   expect(mockHandleChangeFile).toBeCalledTimes(1);
    //   // expect(input.value).toBe(file.split(/\\/g));

    
    // })
//   })
// })
