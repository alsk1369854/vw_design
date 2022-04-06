import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App'




describe("Router Test", () => {
    describe("Home Page", () => {
        test("navigate to Project Manage page", () => {
            navigateTo("Home");
            render (
                <App />
            )
    
            userEvent.click(screen.getByTestId("linkProjectManagePage"));
            expect(screen.getByTestId("ProjectManagePage")).toBeInTheDocument();
        });
        test("navigate to Edit page", () => {
            navigateTo("Home");
            render (
                <App />
            )
    
            userEvent.click(screen.getByTestId("linkEditPage"));
            expect(screen.getByTestId("EditPage")).toBeInTheDocument();
        });
    });

    describe("Project Manage Page", () => {
        test("navigate to Home page", () => {
            navigateTo("ProjectManage");
            render (
                <App />
            )

            userEvent.click(screen.getByTestId("linkHomePage"));
            expect(screen.getByTestId("HomePage")).toBeInTheDocument();
        });
    });

    describe("Edit Page", () => {
        test("navigate to Home page", () => {
            navigateTo("Edit");
            render (
                <App />
            )
    
            userEvent.click(screen.getByTestId("linkHomePage"));
            expect(screen.getByTestId("HomePage")).toBeInTheDocument();
        });
    });

    function navigateTo(strPageName: string){
        if (strPageName === "Home") strPageName = "";
        window.history.pushState({}, '', ('/' + strPageName) );
    }
});