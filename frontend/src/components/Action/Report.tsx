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
    const Community_standard_url = "https://monitalks.xyz/en/about"
    // handlers

    const handleClose = () => {
        document.getElementById("close-menu-btn")?.click()
    }
    const handleMenuClick = () => {
        document.getElementById("rpt-cnfrm")?.click()
    }
    const handleSubmit = () => {
        document.getElementById("rpt-fdbk")?.click()
    }
    const reportConfirm = () => (
        <div className="report-confirm">
            {reportFeedback()}
            <Menu
                transition
                offsetY={25}
                align={"center"}
                menuButton={<MenuButton id='rpt-cnfrm' className="hidden" />}
            >
                <div className="report-box">
                    <div className="box-header">
                        <div>&nbsp;</div>
                        <div className="title">REPORT</div>
                        <div className="close" onClick={handleClose}>X</div>
                    </div>
                    <hr />
                    <div className="info">
                        <h4>Does this go against our Community Standards?</h4>
                        <p>Our standards explain what we do and don't allow. We review</p>
                        <p>and update our standards regularly, with help of experts.</p>
                        <p>
                            <a href={Community_standard_url} target="_blank">
                                See Community Standards
                            </a>
                        </p>
                    </div>
                    <MenuItem onClick={handleSubmit} />
                </div>
            </Menu>
        </div>
    );
    const reportFeedback = () => (
        <div className="report-feedback">
            <Menu
                transition
                offsetY={25}
                align={"center"}
                menuButton={<MenuButton id='rpt-fdbk' className="hidden" />}
            >
                <div className="report-box">
                    <div className="box-header">
                        <div>&nbsp;</div>
                        <div className="title">Thanks for letting us know</div>
                        <div className="close" onClick={handleClose}>X</div>
                    </div>
                    <hr />
                    <div className="info">
                        <p>We'll use this information to improve our process. Indepen-</p>
                        <p>dent fact-checkers may review the content.</p>
                    </div>
                    <MenuItem />
                </div>
            </Menu>
        </div>
    );
    const closeModal = () => (
        <div className="modal-close">
            <Menu
                viewScroll={"close"}
                menuButton={<MenuButton className="hidden" id="close-menu-btn" />}
            />
        </div>
    );
    return (
        <div className="report-comment">
            {closeModal()}
            {reportConfirm()}
            <Menu
                transition
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
                        <p>You can report the comment after selecting a problem.</p>
                    </div>
                    <hr />
                    {reportReasons.map((el: any) => (
                        <MenuItem key={el} onClick={handleMenuClick}>{el}</MenuItem>
                    ))}
                </div>
            </Menu>
        </div>
    )
};

export default ReportMenu