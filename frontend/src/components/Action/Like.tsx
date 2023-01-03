import React from "react";

import { Menu, MenuItem } from "@szhsin/react-menu";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const LikeButton = (info: any) => {
    let hasThumbsUp = !!info.like;
    let hasBrilliant = !!info.brilliant;
    let hasThoughtFul = !!info.thoughtful;
    let hasArticleLike = !!info.article?.like


    const emojiStyle = {
        articleLike: `svgBtn ${hasArticleLike ? 'thumpsup-blue' : 'svgLike'}`,
        lightBulb: `svg-icn ${hasBrilliant ? 'emoji-selected' : 'emoji-un-selected'}`,
        thumbsUp: `svg-icn thumpsup-blue ${hasThumbsUp ? 'emoji-selected' : 'emoji-un-selected'}`,
        thoughtFull: `svg-icn thought-full ${hasThoughtFul ? 'emoji-selected' : 'emoji-un-selected'}`
    }
    const menuButton = () => info.article ?
        (<div className={emojiStyle.articleLike} id="artLike" />)
        : (<button className="likeBtn">Like</button>)

    return (
        <div className="likeBtn">
            <span>
                <Menu
                    transition
                    arrow={true}
                    align={"center"}
                    direction={"top"}
                    viewScroll={"auto"}
                    position={"anchor"}
                    menuButton={menuButton}
                >
                    <MenuItem>
                        <span className={emojiStyle.thumbsUp} />
                        <span className={emojiStyle.lightBulb} >&#128161;</span>
                        <span className={emojiStyle.thoughtFull} />
                    </MenuItem>
                </Menu>
            </span>
        </div>
    );
};

export default LikeButton;