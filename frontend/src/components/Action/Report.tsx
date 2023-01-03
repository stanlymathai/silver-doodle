import React, { useContext } from "react";

import { GlobalContext } from "../../context/Provider";

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";

import "./Style.scss";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";


const ReportFlag = (info: any) => {
    const store: any = useContext(GlobalContext);

    return (<div className="flagBtn" onClick={() => store.report.open(info)} />)
}

const ReportMenu = () => {
    const reportReasons = [
        "False Information",
        "Bully & Harassment",
        "Offensive",
        "Terrorism",
        "Scam or Fraud",
        "Something else"
    ]
    const store: any = useContext(GlobalContext);

    const Community_standard_url = "https://monitalks.xyz/en/about" // temp placeholder

    const reportConfirm = () => (
        <div className="report-confirm">
            {reportFeedback()}
            <Menu
                transition
                offsetY={10}
                menuButton={<MenuButton id='report-menu' className="hidden" />}
            >
                <div className="report-box">
                    <div className="box-header">
                        <div>&nbsp;</div>
                        <div className="title">REPORT</div>
                        <div className="close" onClick={store.report.close}>X</div>
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
                    <MenuItem onClick={store.report.submit} />
                </div>
            </Menu>
        </div>
    );
    const reportFeedback = () => (
        <div className="report-feedback">
            <Menu
                transition
                offsetY={25}
                menuButton={<MenuButton id='feedback' className="hidden" />}
            >
                <div className="report-box">
                    <div className="box-header">
                        <div>&nbsp;</div>
                        <div className="title">Thanks for letting us know</div>
                        <div className="close" onClick={store.report.close}>X</div>
                    </div>
                    <hr />
                    <div className="info">
                        <h4>We'll use this information to improve our process. Indepen-</h4>
                        <h4>dent fact-checkers may review the content.</h4>
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
                menuButton={<MenuButton className="hidden" id="close-menu" />}
            />
        </div>
    );
    return (
        <div className="report-comment">
            {reportConfirm()}
            {closeModal()}
            <Menu
                transition
                menuButton={<MenuButton id='report-main' className="hidden" />}
            >
                <div className="report-box">
                    <div className="box-header">
                        <div>&nbsp;</div>
                        <div className="title">REPORT</div>
                        <div className="close" onClick={store.report.close}>X</div>
                    </div>
                    <hr />
                    <div className="info">
                        <h4>Report comment</h4>
                        <p>You can report the comment after selecting a problem.</p>
                    </div>
                    <hr />
                    {reportReasons.map((reson: any) => (
                        <MenuItem
                            key={reson}
                            onClick={() => store.report.menu(reson)}
                        >{reson}</MenuItem>
                    ))}
                </div>
            </Menu>
        </div>
    )
};

export { ReportFlag, ReportMenu }