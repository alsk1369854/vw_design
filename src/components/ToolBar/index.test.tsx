import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ToolBarButton, Menu, Group, Node, ToolBar } from './';




const arrToolBarButtons: Array<ToolBarButton> = [
    new ToolBarButton("File",
        new Menu([
            new Group([
                new Node("Open Project",        "HotKey01", () => {}),
                new Node("Open File",           "HotKey02", () => {}),
            ]),
            new Group([
                new Node("Save",                "HotKey03", () => {}),
                new Node("Save As",             "HotKey03", () => {}),
            ])
        ])
    ),
    new ToolBarButton("Edit",
        new Menu([
            new Group([
                new Node("Undo",            "HotKey04", () => {}),
                new Node("Redo",            "HotKey05", () => {}),
            ]),
            new Group([
                new Node("Cut",             "HotKey06", () => {}),
                new Node("Copy",            "HotKey07", () => {}),
                new Node("Paste",           "HotKey08", () => {}),
                new Node("Clear",           "HotKey08", () => {}),
            ])
        ])
    ),
    new ToolBarButton("Help",
        new Menu([
            new Group([
                new Node("Version",         null,       () => {}),
                new Node("About",           null,       () => {}),
            ])
        ])
    ),
    new ToolBarButton("Test",
        new Menu([
            new Group([
                new Node("Test1",         null,       () => {}),
                new Node("Test2",           null,       () => {}),
            ])
        ])
    ),
]

jest.mock("./ToolBarMenu", () => (props: {toolBarMenu: Menu, isShow: boolean}) => {
    return props.isShow? <div data-testid={props.toolBarMenu.setTestId()}></div> : <></>;
});


describe("ToolBar Button Mouse Event Test", () => {
    // test("initialization test(no event happen)", () => {
    //     render (
    //         <ToolBar arrToolBarButtons={arrToolBarButtons} />
    //     )

    //     checkEachMenuNotInDocument();
    // });

    // describe("Hover Event", () => {
    //     test("hover continuously test", () => {
    //         render (
    //             <ToolBar arrToolBarButtons={arrToolBarButtons} />
    //         )
    
    //         arrToolBarButtons.forEach(toolBarButton => {
    //             let intTime = 10;
    //             for (let intCurrentTime = 1; intCurrentTime <= intTime; intCurrentTime++){
    //                 userEvent.hover(screen.getByTestId( toolBarButton.getTestId() ));
    //                 expect(screen.queryByTestId( toolBarButton.getMenu().getTestId() )).not.toBeInTheDocument();
    //             }
    //         })
    //     });
    //     test("hover interactively test (in order)", () => {
    //         render (
    //             <ToolBar arrToolBarButtons={arrToolBarButtons} />
    //         )
    
    //         arrToolBarButtons.forEach(toolBarButton => {
    //             userEvent.hover(screen.getByTestId( toolBarButton.getTestId() ));
    //             checkEachMenuNotInDocument();
    //         })
    //     });
    //     test("hover interactively test (in reverse order)", () => {
    //         render (
    //             <ToolBar arrToolBarButtons={arrToolBarButtons} />
    //         )
    
    //         arrToolBarButtons.slice().reverse().forEach(toolBarButton => {
    //             userEvent.hover(screen.getByTestId( toolBarButton.getTestId() ));
    //             checkEachMenuNotInDocument();
    //         })
    //     });
    //     test("hover interactively test (out of order)", () => {
    //         render (
    //             <ToolBar arrToolBarButtons={arrToolBarButtons} />
    //         )
    
    //         userEvent.hover(screen.getByTestId( arrToolBarButtons[0].getTestId() ));
    //         checkEachMenuNotInDocument();
            
    //         userEvent.hover(screen.getByTestId( arrToolBarButtons[2].getTestId() ));
    //         checkEachMenuNotInDocument();

    //         userEvent.hover(screen.getByTestId( arrToolBarButtons[1].getTestId() ));
    //         checkEachMenuNotInDocument();

    //         userEvent.hover(screen.getByTestId( arrToolBarButtons[3].getTestId() ));
    //         checkEachMenuNotInDocument();
    //     });
    // });

    // describe("Click Event", () => {
    //     test("click continuously test", () => {
    //         render (
    //             <ToolBar arrToolBarButtons={arrToolBarButtons} />
    //         )
    
    //         arrToolBarButtons.forEach(toolBarButton => {
    //             let intTime = 10;
    //             for (let intCurrentTime = 1; intCurrentTime <= intTime; intCurrentTime++){
    //                 userEvent.click(screen.getByTestId( toolBarButton.getTestId() ));
    //                 expect(screen.queryByTestId( toolBarButton.getMenu().getTestId() )).toBeInTheDocument();
    //             }
    //         })
    //     });
    //     test("click interactively test (in order)", () => {
    //         render (
    //             <ToolBar arrToolBarButtons={arrToolBarButtons} />
    //         )
    
    //         arrToolBarButtons.forEach(toolBarButton => {
    //             userEvent.click(screen.getByTestId( toolBarButton.getTestId() ));
    //             checkEachMenuNotInDocumentExceptThisOne(toolBarButton);
    //         })
    //     });
    //     test("click interactively test (in reverse order)", () => {
    //         render (
    //             <ToolBar arrToolBarButtons={arrToolBarButtons} />
    //         )
    
    //         arrToolBarButtons.slice().reverse().forEach(toolBarButton => {
    //             userEvent.click(screen.getByTestId( toolBarButton.getTestId() ));
    //             checkEachMenuNotInDocumentExceptThisOne(toolBarButton);
    //         })
    //     });
    //     test("click interactively test (out of order)", () => {
    //         render (
    //             <ToolBar arrToolBarButtons={arrToolBarButtons} />
    //         )
    
    //         userEvent.click(screen.getByTestId( arrToolBarButtons[0].getTestId() ));
    //         checkEachMenuNotInDocumentExceptThisOne(arrToolBarButtons[0]);

    //         userEvent.click(screen.getByTestId( arrToolBarButtons[2].getTestId() ));
    //         checkEachMenuNotInDocumentExceptThisOne(arrToolBarButtons[2]);

    //         userEvent.click(screen.getByTestId( arrToolBarButtons[1].getTestId() ));
    //         checkEachMenuNotInDocumentExceptThisOne(arrToolBarButtons[1]);

    //         userEvent.click(screen.getByTestId( arrToolBarButtons[3].getTestId() ));
    //         checkEachMenuNotInDocumentExceptThisOne(arrToolBarButtons[3]);
    //     });
    // });

    describe("Click And Hover Event", () => {
        // test("click button (open menu) and hover interactively test (in order)", () => {
        //     render (
        //         <ToolBar arrToolBarButtons={arrToolBarButtons} />
        //     )
    
        //     userEvent.click(screen.getByTestId( arrToolBarButtons[0].getTestId() ));
        //     arrToolBarButtons.forEach(toolBarButton => {
        //         userEvent.hover(screen.getByTestId( toolBarButton.getTestId() ));
        //         checkEachMenuNotInDocumentExceptThisOne(toolBarButton);
        //     })
        // });
        // test("click button (open menu) and hover interactively test (in reverse order)", () => {
        //     render (
        //         <ToolBar arrToolBarButtons={arrToolBarButtons} />
        //     )
    
        //     userEvent.click(screen.getByTestId( arrToolBarButtons[0].getTestId() ));
        //     arrToolBarButtons.slice().reverse().forEach(toolBarButton => {
        //         userEvent.hover(screen.getByTestId( toolBarButton.getTestId() ));
        //         checkEachMenuNotInDocumentExceptThisOne(toolBarButton);
        //     })
        // });
        // test("click button (open menu) and hover interactively test (out of order)", () => {
        //     render (
        //         <ToolBar arrToolBarButtons={arrToolBarButtons} />
        //     )
    
        //     userEvent.click(screen.getByTestId( arrToolBarButtons[0].getTestId() ));

        //     userEvent.hover(screen.getByTestId( arrToolBarButtons[0].getTestId() ));
        //     checkEachMenuNotInDocumentExceptThisOne(arrToolBarButtons[0]);
            
        //     userEvent.hover(screen.getByTestId( arrToolBarButtons[2].getTestId() ));
        //     checkEachMenuNotInDocumentExceptThisOne(arrToolBarButtons[2]);

        //     userEvent.hover(screen.getByTestId( arrToolBarButtons[1].getTestId() ));
        //     checkEachMenuNotInDocumentExceptThisOne(arrToolBarButtons[1]);

        //     userEvent.hover(screen.getByTestId( arrToolBarButtons[3].getTestId() ));
        //     checkEachMenuNotInDocumentExceptThisOne(arrToolBarButtons[3]);
        // });
        test("click button (open menu) and hover outside element", () => {
            render (
                <div data-testid="outsideElement">
                    <ToolBar arrToolBarButtons={arrToolBarButtons} />
                </div>
            )
    
            arrToolBarButtons.slice().reverse().forEach(toolBarButton => {
                userEvent.click(screen.getByTestId( toolBarButton.getTestId() ));
                userEvent.hover(screen.getByTestId("outsideElement"));
                checkEachMenuNotInDocumentExceptThisOne(toolBarButton);
            })
        });
        test("click button (open menu) and click outside element (close menu)", () => {
            render (
                <div data-testid="outsideElement">
                    <ToolBar arrToolBarButtons={arrToolBarButtons} />
                </div>
            )
    
            arrToolBarButtons.slice().reverse().forEach(toolBarButton => {
                userEvent.click(screen.getByTestId( toolBarButton.getTestId() ));
                userEvent.click(screen.getByTestId("outsideElement"));
                checkEachMenuNotInDocument();
            })
        });
    });

    function checkEachMenuNotInDocument(): void {
        arrToolBarButtons.forEach(toolBarButton => {
            expect(screen.queryByTestId( toolBarButton.getMenu().getTestId() )).not.toBeInTheDocument();
        })
    }
    function checkEachMenuNotInDocumentExceptThisOne(toolBarButtonException: ToolBarButton): void {
        arrToolBarButtons.forEach(toolBarButton => {
            if (toolBarButton === toolBarButtonException){
                expect(screen.queryByTestId( toolBarButton.getMenu().getTestId() )).toBeInTheDocument();
            }
            else 
                expect(screen.queryByTestId( toolBarButton.getMenu().getTestId() )).not.toBeInTheDocument();
        })
    }
});