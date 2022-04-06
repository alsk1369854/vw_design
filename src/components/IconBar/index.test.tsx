import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 

import { Test } from '../../tools/Test'
import { IconButton, IconBar } from '.';




const arrFunctionFocusButton = Test.getMockFunctions(4);
const arrFunctionBlurButton = Test.getMockFunctions(4);
const arrIconButtons: Array<IconButton> = [
    new IconButton("Edit",            arrFunctionFocusButton[0], arrFunctionBlurButton[0]),
    new IconButton("Folder",          arrFunctionFocusButton[1], arrFunctionBlurButton[1]),
    new IconButton("Magnifier",       arrFunctionFocusButton[2], arrFunctionBlurButton[2]),
    new IconButton("PaperAirplane",   arrFunctionFocusButton[3], arrFunctionBlurButton[3]),
]
const arrFunctionFocusBottomButton = Test.getMockFunctions(4);
const arrIconButtonsBottom: Array<IconButton> = [
    new IconButton("User",      arrFunctionFocusBottomButton[0]),
    new IconButton("Setting",   arrFunctionFocusBottomButton[1]),
    new IconButton("Test01",    arrFunctionFocusBottomButton[2]),
    new IconButton("Test02",    arrFunctionFocusBottomButton[3]),
]


describe('IconBar Button Mouse Event Test', () => {
    test('initialization test (no event happen)', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );

        arrIconButtons.forEach((iconButton, index) => {
            expect(arrFunctionFocusButton[index]).toBeCalledTimes(0);
            expect(arrFunctionBlurButton[index]).toBeCalledTimes(0);
        })
    });
    test('click continuously test', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );

        arrIconButtons.forEach((iconButton, index) => {
            let intTime = 10;
            for (let intCurrentTime = 1; intCurrentTime <= intTime; intCurrentTime++){
                userEvent.click(screen.getByTestId( iconButton.getTestId() ));
                expect(arrFunctionFocusButton[index]).toBeCalledTimes(intCurrentTime);
                expect(arrFunctionBlurButton[index]).toBeCalledTimes(intCurrentTime - 1);
                
                userEvent.click(screen.getByTestId( iconButton.getTestId() ));
                expect(arrFunctionFocusButton[index]).toBeCalledTimes(intCurrentTime);
                expect(arrFunctionBlurButton[index]).toBeCalledTimes(intCurrentTime);
            }
        })
    });
    test('click interactively test (in order)', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );

        let lastIconButton: IconButton | null = null;
        arrIconButtons.forEach((iconButton, index) => {
            userEvent.click(screen.getByTestId( iconButton.getTestId() ));

            expect(arrFunctionFocusButton[index]).toBeCalledTimes(1);
            if (lastIconButton) expect(arrFunctionBlurButton[index - 1]).toBeCalledTimes(1);
            lastIconButton = iconButton;
        })

        userEvent.click(screen.getByTestId( arrIconButtons[arrIconButtons.length - 1].getTestId() ));
        checkEachButtonFunctionCalledOnce();
    });
    test('click interactively test (in reverse order)', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );

        let lastIconButton: IconButton | null = null;
        arrIconButtons.slice().reverse().forEach((iconButton, index) => {
            let intIndexInOrder = arrIconButtons.length - index - 1;

            userEvent.click(screen.getByTestId( iconButton.getTestId() ));

            expect(arrFunctionFocusButton[intIndexInOrder]).toBeCalledTimes(1);
            if (lastIconButton) expect(arrFunctionBlurButton[intIndexInOrder + 1]).toBeCalledTimes(1);
            lastIconButton = iconButton;
        })

        userEvent.click(screen.getByTestId( arrIconButtons[0].getTestId() ));
        checkEachButtonFunctionCalledOnce();
    });
    test('click interactively test (out of order)', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );
        
        
        userEvent.click(screen.getByTestId( arrIconButtons[0].getTestId() ));
        expect(arrFunctionFocusButton[0]).toBeCalledTimes(1);

        userEvent.click(screen.getByTestId( arrIconButtons[2].getTestId() ));
        expect(arrFunctionFocusButton[2]).toBeCalledTimes(1);
        expect(arrFunctionBlurButton[0]).toBeCalledTimes(1);

        userEvent.click(screen.getByTestId( arrIconButtons[1].getTestId() ));
        expect(arrFunctionFocusButton[1]).toBeCalledTimes(1);
        expect(arrFunctionBlurButton[2]).toBeCalledTimes(1);

        userEvent.click(screen.getByTestId( arrIconButtons[3].getTestId() ));
        expect(arrFunctionFocusButton[3]).toBeCalledTimes(1);
        expect(arrFunctionBlurButton[1]).toBeCalledTimes(1);

        userEvent.click(screen.getByTestId( arrIconButtons[3].getTestId() ));
        checkEachButtonFunctionCalledOnce();
    });

    function checkEachButtonFunctionCalledOnce(){
        arrIconButtons.forEach((iconButton, index) => {
            expect(arrFunctionFocusButton[index]).toBeCalledTimes(1);
            expect(arrFunctionBlurButton[index]).toBeCalledTimes(1);
        })
    }
});


describe("IconBar Bottom Button Mouse Event Test", () => {
    test('initialization test(no click event happen)', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );

        arrIconButtonsBottom.forEach((iconButtonBottom, index) => {
            expect(arrFunctionFocusBottomButton[index]).toBeCalledTimes(0);
        })
    });
    test('click continuously test', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );

        arrIconButtonsBottom.forEach((iconButtonBottom, index) => {
            let intTime = 10;
            for (let intCurrentTime = 1; intCurrentTime <= intTime; intCurrentTime++){
                userEvent.click(screen.getByTestId( iconButtonBottom.getTestId() ));
                expect(arrFunctionFocusBottomButton[index]).toBeCalledTimes(intCurrentTime);
            }
        })
    });
    test('click interactively test (in order)', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );

        arrIconButtonsBottom.forEach((iconButtonBottom, index) => {
            userEvent.click(screen.getByTestId( iconButtonBottom.getTestId() ));
            expect(arrFunctionFocusBottomButton[index]).toBeCalledTimes(1);
        })

        checkEachButtonFunctionCalledOnce();
    });
    test('click interactively test (in reverse order)', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );

        arrIconButtonsBottom.slice().reverse().forEach((iconButtonBottom, index) => {
            let intIndexInOrder = arrIconButtons.length - index - 1;

            userEvent.click(screen.getByTestId( iconButtonBottom.getTestId() ));
            expect(arrFunctionFocusBottomButton[intIndexInOrder]).toBeCalledTimes(1);
        })

        checkEachButtonFunctionCalledOnce();
    });
    test('click interactively test (out of order)', () => {
        render(
            <IconBar arrIconButtons={arrIconButtons} arrIconButtonsBottom={arrIconButtonsBottom} />
        );
        

        userEvent.click(screen.getByTestId( arrIconButtonsBottom[0].getTestId() ));
        expect(arrFunctionFocusBottomButton[0]).toBeCalledTimes(1);

        userEvent.click(screen.getByTestId( arrIconButtonsBottom[2].getTestId() ));
        expect(arrFunctionFocusBottomButton[2]).toBeCalledTimes(1);

        userEvent.click(screen.getByTestId( arrIconButtonsBottom[1].getTestId() ));
        expect(arrFunctionFocusBottomButton[1]).toBeCalledTimes(1);

        userEvent.click(screen.getByTestId( arrIconButtonsBottom[3].getTestId() ));
        expect(arrFunctionFocusBottomButton[3]).toBeCalledTimes(1);

        checkEachButtonFunctionCalledOnce();
    });

    function checkEachButtonFunctionCalledOnce(){
        arrIconButtonsBottom.forEach((iconButtonBottom, index) => {
            expect(arrFunctionFocusBottomButton[index]).toBeCalledTimes(1);
        })
    }
});