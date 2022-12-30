import React from "react";

const ReactionView = () => {
    let reactionCount = Math.floor(Math.random() * 9 + 1) + "K";
    return (
        <div className="reactionGroup">
            <span className="emoji-blue">&#128077;</span>
            <span>&#128161;</span>
            <span>&#129300;</span>
            <span className="reaction-count-text">{reactionCount}</span>
        </div>
    );
};

export default ReactionView