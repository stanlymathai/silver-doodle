import React from "react";

import { Menu, MenuItem } from "@szhsin/react-menu";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const LikeButton = () => {
    let hasThumbsUp = Math.random() < 0.5;
    let hasBrilliant = Math.random() < 0.5;
    let hasThoughtFul = Math.random() < 0.5;

    return (
        <div className="likeBtn">
            <span>
                <Menu
                    menuButton={<button className="likeBtn">Like</button>}
                    position={"anchor"}
                    viewScroll={"auto"}
                    direction={"top"}
                    align={"center"}
                    arrow={true}
                    transition
                >
                    <MenuItem>
                        <span
                            // title='Thumbs Up'
                            className={
                                hasThumbsUp
                                    ? "emoji-selected emoji-blue"
                                    : "emoji-un-selected emoji-blue"
                            }
                        >
                            &#128077;
                        </span>
                        <span
                            // title='Brilliant'
                            className={hasBrilliant ? "emoji-selected" : "emoji-un-selected"}
                        >
                            &#128161;
                        </span>
                        <span
                            // title='Thoughtful'
                            className={hasThoughtFul ? "emoji-selected" : "emoji-un-selected"}
                        >
                            &#129300;
                        </span>
                    </MenuItem>
                </Menu>
            </span>
        </div>
    );
};

export default LikeButton;