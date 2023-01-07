import React, { useContext } from "react";

import { Menu, MenuItem } from "@szhsin/react-menu";
import { GlobalContext } from "../../context/Index";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

interface ILike {
    reaction: {
        like: boolean
        brilliant: boolean
        thoughtful: boolean
    }
}
const emojiClass = (hasOne: any) =>
    `icn-dft ${!!hasOne ? 'emoji-selected' : 'emoji-un-selected'}`

export const LikeButton = (info: ILike) => {

    const globalStore: any = useContext(GlobalContext);

    const emoji = {
        like: `thumpsup-blue ${emojiClass(info.reaction.like)}`,
        brilliant: `light-bulb ${emojiClass(info.reaction.brilliant)}`,
        thoughtful: `thought-full ${emojiClass(info.reaction.thoughtful)}`
    }

    return (
        <div className="like-btn">
            <Menu
                transition
                arrow={true}
                align={"center"}
                direction={"top"}
                viewScroll={"auto"}
                position={"anchor"}
                menuButton={<button className="like-btn">Like</button>}
            >
                <MenuItem>
                    {Object
                        .entries(emoji)
                        .map(el => (
                            <span
                                key={el[0]}
                                className={el[1]}
                                onClick={() => globalStore.handleReaction(el[0], { ...info })}
                            />))}
                </MenuItem>
            </Menu>
        </div>
    );
};