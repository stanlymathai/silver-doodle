import React, { useContext, useState, useEffect } from "react";

import moment from "moment";
import { GlobalContext } from "../../../context/Index";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { ReactionView } from "../../Action/Overview";

import "./Style.scss";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";


export const ReactionBox = () => {
    const globalStore: any = useContext(GlobalContext);

    const article: any = globalStore.article
    const [reaction, setReaction] = useState<any>()
    const [reactionCount, setReactionCount] = useState<any>()

    useEffect(() => {
        setReaction(article?.reaction)
        setReactionCount(article?.reactionCount)
    }, [article])


    const ArticleOverview = () => {
        const totalComments: number = globalStore.totalCount
        return (
            <div className={totalComments > 0 || reactionCount > 0
                ? "article-overview" : "hidden"}>
                {reactionCount > 0 && ReactionView(reactionCount)}
                {totalComments > 0 &&
                    <div className="comments-count">
                        {totalComments} Comment{totalComments != 1 && "s"}
                    </div>}
            </div>
        )
    }

    const handleReaction = (event: string) => {
        if (globalStore?.currentUserData?.userId === 'GUEST')
            return globalStore.alert.open({
                title: 'Alert Message',
                content: 'Please login/signup to submit reaction.',
            });

        const action = article.reaction[event] ? 'REMOVE' : 'ADD';
        const ref: string = article.articleId

        let articleCopy = article
        articleCopy!.reaction[event] = !articleCopy!.reaction[event]

        if (action == "REMOVE") {
            setReactionCount(reactionCount - 1)
        } else setReactionCount(reactionCount + 1)

        setReaction(articleCopy.reaction)
        globalStore.onUserRection({
            ref,
            event,
            action,
            type: 'ARTICLE',
            timeStamp: moment().format(),
          });
    }

    const LikeAction = () => {
        const emojiClass = (hasOne: any) =>
            `icn-dft ${!!hasOne ? 'emoji-selected' : 'emoji-un-selected'}`

        const emoji = {
            like: `thumpsup-blue ${emojiClass(reaction?.like)}`,
            brilliant: `light-bulb ${emojiClass(reaction?.brilliant)}`,
            thoughtful: `thought-full ${emojiClass(reaction?.thoughtful)}`
        }

        const menuButton = () => (<div className="like-action">
            <div className={`svgBtn ${reaction?.like ? 'thumpsup-blue' : 'svgLike'}`} />
            Like</div>)

        return (
            <div className="like-btn">
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
                        {Object
                            .entries(emoji)
                            .map(el => (
                                <span
                                    key={el[0]}
                                    className={el[1]}
                                    onClick={() => handleReaction(el[0])}
                                />))}
                    </MenuItem>
                </Menu>
            </div>
        );
    };

    const actionBar = () => {
        return (
            <div className="reaction-bar" >
                <div className="reaction-wrap">{LikeAction()}</div>
                <div className="vertical-line" />
                <div className="reaction-wrap" onClick={() => globalStore.toggleDisscusionbox()} >
                    <div className="svgBtn svgChat" /> Comment</div>
                <div className="vertical-line" />
                <div className="reaction-wrap">
                    <div className="svgBtn svgShare" /> Share</div>
            </div >
        )
    }

    return (
        <div className="reaction-box">
            {ArticleOverview()}
            {actionBar()}
        </div>
    )
}