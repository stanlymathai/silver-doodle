import React, { useContext } from "react";

import { GlobalContext } from "../../context/Provider";
import LikeButton from "../Action/Like"

import "./Style.scss"

const ReactionBar = () => {
    const globalStore: any = useContext(GlobalContext);

    const info = {
        article: {
            id: "test",
            liked: Math.random() < 0.5
        }
    }
    return (
        <div className="reaction-bar">
            <div className="reaction-wrap">
                {LikeButton(info)}
                <div
                    onClick={() => document.getElementById("artLike")?.click()}>
                    Like</div></div>

            <div className="vertical-line" />
            <div className="reaction-wrap" onClick={globalStore.toggleDisscusionbox} >
                <div className="svgBtn svgChat" /> Comment</div>

            <div className="vertical-line" />
            <div className="reaction-wrap">
                <div className="svgBtn svgShare" /> Share</div>
        </div >
    )
}

export default ReactionBar