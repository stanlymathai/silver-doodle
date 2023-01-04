import React, { useContext } from "react";

import { GlobalContext } from "../../context/Provider";
import { LikeButton } from "../Action/Like"
import "./Style.scss"

export const ReactionBar = () => {
    const globalStore: any = useContext(GlobalContext);

    return (
        <div className="reaction-bar" >
            <div className="reaction-wrap">
                {LikeButton(globalStore.article)}
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