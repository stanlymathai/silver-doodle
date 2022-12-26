import React, { useState, useEffect } from "react";

import CommentBox from "../commentBox/Index";

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState<any>();
    const [articleId, setAriticleId] = useState<string>("");
    const [showCommentBox, setCommentBoxVisibility] = useState<Boolean>(false);

    useEffect(() => {
        let sessionUser = sessionStorage.getItem("sessionUser");
        if (sessionUser) setCurrentUser(JSON.parse(sessionUser));
    }, []);

    return (
        <div style={{ background: "#1a1a2b", minHeight: "250px" }}>
            <div
                style={{
                    margin: "auto",
                    width: "50%",
                }}
            >
                {!showCommentBox && (
                    <div
                        style={{
                            paddingTop: "25px",
                            margin: "auto",
                            width: "50%",
                        }}
                    >
                        <form onSubmit={() => setCommentBoxVisibility(true)}>
                            <input
                                required
                                type="text"
                                value={articleId}
                                style={{ padding: "4px" }}
                                placeholder="enter article Id"
                                onChange={(e) => setAriticleId(e.target.value)}
                            />
                        </form>
                    </div>
                )}
                {(showCommentBox && currentUser) && <CommentBox articleId={articleId} currentUser={currentUser} />}
            </div>
            {!currentUser && (
                <div style={{ color: "red", padding: "20px" }}>
                    <h2>No user found</h2>
                    <p>
                        Please make sure url contains user params for backoffice
                        <small>eg:http://localhost:3000?q=token+userId</small>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
