import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Test } from '../../../tools/Test';
import { Menu, Group, Node } from '../';
import ToolBarMenu from './index';




const arrFunctionClick = Test.getMockFunctions(4);
let toolBarMenu = (
    new Menu([
        new Group([
            new Node("Open Project",        "HotKey01", arrFunctionClick[0]),
            new Node("Open File",           "HotKey02", arrFunctionClick[1]),
        ]),
        new Group([
            new Node("Save",                "HotKey03", arrFunctionClick[2]),
            new Node("Save As",             "HotKey03", arrFunctionClick[3]),
        ])
    ])
)
let arrNodes = toolBarMenu.getNodes(false);


describe("ToolBar Node Mouse Event Test", () => {
    test("initialization test(no event happen)", () => {
        render (
            <ToolBarMenu toolBarMenu={toolBarMenu} isShow={true} closeToolBarMenu={() => {}} />
        )

        arrNodes.forEach((toolBarNode, index) => {
            expect(arrFunctionClick[index]).toBeCalledTimes(0);
        })
    });

    describe("Click Event", () => {
        test("click continuously test", () => {
            render (
                <ToolBarMenu toolBarMenu={toolBarMenu} isShow={true} closeToolBarMenu={() => {}} />
            )
    
            arrNodes.forEach((toolBarNode, index) => {
                let intTime = 10;
                for (let intCurrentTime = 1; intCurrentTime <= intTime; intCurrentTime++){
                    userEvent.click(screen.getByTestId( toolBarNode.getTestId() ));
                    expect(arrFunctionClick[index]).toBeCalledTimes(intCurrentTime);
                }
            })
        });
        test("click interactively test (in order)", () => {
            render (
                <ToolBarMenu toolBarMenu={toolBarMenu} isShow={true} closeToolBarMenu={() => {}} />
            )
    
            arrNodes.forEach((toolBarNode, index) => {
                userEvent.click(screen.getByTestId( toolBarNode.getTestId() ));
                expect(arrFunctionClick[index]).toBeCalledTimes(1);
            })
    
            checkEachNodeFunctionCalledOnce();
        });
        test("click interactively test (in reverse order)", () => {
            render (
                <ToolBarMenu toolBarMenu={toolBarMenu} isShow={true} closeToolBarMenu={() => {}} />
            )
    
            arrNodes.slice().reverse().forEach((toolBarNode, index) => {
                let intIndexInOrder = arrNodes.length - index - 1;
    
                userEvent.click(screen.getByTestId( toolBarNode.getTestId() ));
                expect(arrFunctionClick[intIndexInOrder]).toBeCalledTimes(1);
            })
    
            checkEachNodeFunctionCalledOnce();
        });
        test("click interactively test (out of order)", () => {
            render (
                <ToolBarMenu toolBarMenu={toolBarMenu} isShow={true} closeToolBarMenu={() => {}} />
            )
    
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(1);
            
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ))
            expect(arrFunctionClick[2]).toBeCalledTimes(1);
            
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ))
            expect(arrFunctionClick[1]).toBeCalledTimes(1);
    
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ))
            expect(arrFunctionClick[3]).toBeCalledTimes(1);
    
            checkEachNodeFunctionCalledOnce();
        });
    });

    describe("Disable Test", () => {
        test("disable each node (in order)", () => {
            resetToolBarMenu();
            render (
                <ToolBarMenu toolBarMenu={toolBarMenu} isShow={true} closeToolBarMenu={() => {}} />
            )

            toolBarMenu.getNode("Open Project").disabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(0);
            expect(arrFunctionClick[1]).toBeCalledTimes(1);
            expect(arrFunctionClick[2]).toBeCalledTimes(1);
            expect(arrFunctionClick[3]).toBeCalledTimes(1);
            
            toolBarMenu.getNode("Open File").disabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(0);
            expect(arrFunctionClick[1]).toBeCalledTimes(1);
            expect(arrFunctionClick[2]).toBeCalledTimes(2);
            expect(arrFunctionClick[3]).toBeCalledTimes(2);

            toolBarMenu.getNode("Save").disabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(0);
            expect(arrFunctionClick[1]).toBeCalledTimes(1);
            expect(arrFunctionClick[2]).toBeCalledTimes(2);
            expect(arrFunctionClick[3]).toBeCalledTimes(3);

            toolBarMenu.getNode("Save As").disabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(0);
            expect(arrFunctionClick[1]).toBeCalledTimes(1);
            expect(arrFunctionClick[2]).toBeCalledTimes(2);
            expect(arrFunctionClick[3]).toBeCalledTimes(3);
        });
        
        test("enable each node (in order)", () => {
            resetToolBarMenu();
            render (
                <ToolBarMenu toolBarMenu={toolBarMenu} isShow={true} closeToolBarMenu={() => {}} />
            )
            toolBarMenu.getNode("Open Project").disabled();
            toolBarMenu.getNode("Open File").disabled();
            toolBarMenu.getNode("Save").disabled();
            toolBarMenu.getNode("Save As").disabled();

            toolBarMenu.getNode("Open Project").enabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(1);
            expect(arrFunctionClick[1]).toBeCalledTimes(0);
            expect(arrFunctionClick[2]).toBeCalledTimes(0);
            expect(arrFunctionClick[3]).toBeCalledTimes(0);
            
            toolBarMenu.getNode("Open File").enabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(2);
            expect(arrFunctionClick[1]).toBeCalledTimes(1);
            expect(arrFunctionClick[2]).toBeCalledTimes(0);
            expect(arrFunctionClick[3]).toBeCalledTimes(0);

            toolBarMenu.getNode("Save").enabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(3);
            expect(arrFunctionClick[1]).toBeCalledTimes(2);
            expect(arrFunctionClick[2]).toBeCalledTimes(1);
            expect(arrFunctionClick[3]).toBeCalledTimes(0);

            toolBarMenu.getNode("Save As").enabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(4);
            expect(arrFunctionClick[1]).toBeCalledTimes(3);
            expect(arrFunctionClick[2]).toBeCalledTimes(2);
            expect(arrFunctionClick[3]).toBeCalledTimes(1);
        });
        
        test("enable and disable each node (in order)", () => {
            resetToolBarMenu();
            render (
                <ToolBarMenu toolBarMenu={toolBarMenu} isShow={true} closeToolBarMenu={() => {}} />
            )

            toolBarMenu.getNode("Open Project").disabled();
            toolBarMenu.getNode("Open Project").enabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(1);
            expect(arrFunctionClick[1]).toBeCalledTimes(1);
            expect(arrFunctionClick[2]).toBeCalledTimes(1);
            expect(arrFunctionClick[3]).toBeCalledTimes(1);
            
            toolBarMenu.getNode("Open File").disabled();
            toolBarMenu.getNode("Open File").enabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(2);
            expect(arrFunctionClick[1]).toBeCalledTimes(2);
            expect(arrFunctionClick[2]).toBeCalledTimes(2);
            expect(arrFunctionClick[3]).toBeCalledTimes(2);

            toolBarMenu.getNode("Save").disabled();
            toolBarMenu.getNode("Save").enabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(3);
            expect(arrFunctionClick[1]).toBeCalledTimes(3);
            expect(arrFunctionClick[2]).toBeCalledTimes(3);
            expect(arrFunctionClick[3]).toBeCalledTimes(3);

            toolBarMenu.getNode("Save As").disabled();
            toolBarMenu.getNode("Save As").enabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(4);
            expect(arrFunctionClick[1]).toBeCalledTimes(4);
            expect(arrFunctionClick[2]).toBeCalledTimes(4);
            expect(arrFunctionClick[3]).toBeCalledTimes(4);
            
            
            toolBarMenu.getNode("Open Project").disabled();
            toolBarMenu.getNode("Open File").disabled();
            toolBarMenu.getNode("Save").disabled();
            toolBarMenu.getNode("Save As").disabled();

            toolBarMenu.getNode("Open Project").enabled();
            toolBarMenu.getNode("Open Project").disabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(4);
            expect(arrFunctionClick[1]).toBeCalledTimes(4);
            expect(arrFunctionClick[2]).toBeCalledTimes(4);
            expect(arrFunctionClick[3]).toBeCalledTimes(4);
            
            toolBarMenu.getNode("Open File").enabled();
            toolBarMenu.getNode("Open File").disabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(4);
            expect(arrFunctionClick[1]).toBeCalledTimes(4);
            expect(arrFunctionClick[2]).toBeCalledTimes(4);
            expect(arrFunctionClick[3]).toBeCalledTimes(4);

            toolBarMenu.getNode("Save").enabled();
            toolBarMenu.getNode("Save").disabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(4);
            expect(arrFunctionClick[1]).toBeCalledTimes(4);
            expect(arrFunctionClick[2]).toBeCalledTimes(4);
            expect(arrFunctionClick[3]).toBeCalledTimes(4);

            toolBarMenu.getNode("Save As").enabled();
            toolBarMenu.getNode("Save As").disabled();
            userEvent.click(screen.getByTestId( arrNodes[0].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[1].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[2].getTestId() ));
            userEvent.click(screen.getByTestId( arrNodes[3].getTestId() ));
            expect(arrFunctionClick[0]).toBeCalledTimes(4);
            expect(arrFunctionClick[1]).toBeCalledTimes(4);
            expect(arrFunctionClick[2]).toBeCalledTimes(4);
            expect(arrFunctionClick[3]).toBeCalledTimes(4);
        });
    });
    

    function checkEachNodeFunctionCalledOnce(){
        arrNodes.forEach((toolBarNode, index) => {
            expect(arrFunctionClick[index]).toBeCalledTimes(1);
        })
    }

    function resetToolBarMenu(){
        toolBarMenu = (
            new Menu([
                new Group([
                    new Node("Open Project",        "HotKey01", arrFunctionClick[0]),
                    new Node("Open File",           "HotKey02", arrFunctionClick[1]),
                ]),
                new Group([
                    new Node("Save",                "HotKey03", arrFunctionClick[2]),
                    new Node("Save As",             "HotKey03", arrFunctionClick[3]),
                ])
            ])
        )
        arrNodes = toolBarMenu.getNodes(false);
    }
});