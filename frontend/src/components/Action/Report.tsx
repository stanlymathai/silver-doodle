import React from "react";

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";

import "./Style.scss";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const ReportMenu = () => {
    const reportReasons = [
        "False Information",
        "Bully & Harassment",
        "Offensive",
        "Terrorism",
        "Scam or Fraud",
        "Something else"
    ]

    // handlers

    const handleClose = () => {
        console.log("hai from clonse")
        const el = document.getElementById("close-menu-btn")
        el?.click()

    }
    const closeModal = () => (
        <div className="modal-close">
            <Menu
                viewScroll={"close"}
                menuButton={<MenuButton className="hidden" id="close-menu-btn" />}
            />
        </div>
    );
    // const closeModal = () => (
    //     <div className="modal-close">
    //         <Menu
    //             viewScroll={"close"}
    //             menuButton={<MenuButton className="hidden" id="close-menu-btn" />}
    //         />
    //     </div>
    // );

    return (
        <div className="report-comment">
            {closeModal()}
            <Menu
                transition
                offsetX={5}
                offsetY={25}
                align={"center"}
                menuButton={<MenuButton id='rpt-btn' className="hidden" />}
            >
                <div className="report-box">
                    <div className="box-header">
                        <div>&nbsp;</div>
                        <div className="title">REPORT</div>
                        <div className="close" onClick={handleClose}>X</div>
                    </div>
                    <hr />
                    <div className="info">
                        <h4>Report comment</h4>
                        <span>You can report the comment after selecting a problem.</span>
                    </div>
                    <hr />
                    {reportReasons.map((el: any) => (
                        <MenuItem key={el}>{el}</MenuItem>
                    ))}
                </div>
            </Menu>
        </div>
    )
};

export default ReportMenu