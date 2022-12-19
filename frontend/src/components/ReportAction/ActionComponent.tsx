import React from "react";


const ActionComponent = () => {
    const reportReasons = [
        "False Information",
        "Bully & Harassment",
        "Offensive",
        "Terrorism",
        "Scam or Fraud",
        "Something else"
    ]

    return (
        <div className="report-container">
            <div className="items">
                <div className="items-head">
                    <h3>Report comment</h3>
                    <h4>You can report the comment after selecting a problem.</h4>
                    <hr />
                </div>

                <div className="items-body">
                    {reportReasons.map((content, index) => (
                        <div className="items-body-content" key={index}>
                            <span>{content}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ActionComponent