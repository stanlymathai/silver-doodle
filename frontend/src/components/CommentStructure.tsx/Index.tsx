import "./CommentStructure.scss"
import { useContext, useState } from "react"
import { GlobalContext } from "../../context/Provider"
import InputField from "../InputField/Index"
import { Menu, MenuItem } from "@szhsin/react-menu"
import "@szhsin/react-menu/dist/index.css"
import "@szhsin/react-menu/dist/transitions/slide.css"
import "react-responsive-modal/styles.css"
import { Modal } from "react-responsive-modal"
import React from "react"
import moment from "moment"

interface CommentStructureProps {
  info: {
    userId: string
    comId: string
    fullName: string
    avatarUrl: string
    text: string
    timeStamp?: string
    userProfile?: string
    replies?: Array<object> | undefined
    replyComponent?: boolean | undefined
  }
  parentId?: string
  replyMode: boolean
}

const CommentStructure = ({
  info,
  parentId,
  replyMode
}: CommentStructureProps) => {
  const globalStore: any = useContext(GlobalContext)
  const currentUser = globalStore.currentUserData

  const userInfo = () => {
    return (
      <div className='commentsTwo'>
        <a className='userLink' target='_blank' href={info.userProfile}>
          <div>
            <img
              src={info.avatarUrl}
              alt='userIcon'
              className='imgdefault'
              style={
                globalStore.imgStyle || {
                  position: "relative",
                  borderRadius: "50%",
                  top: 7
                }
              }
            />
          </div>
          <div className='fullName'>{info.fullName} </div>
        </a>
      </div>
    )
  }

  const likeButton = () => {
    let hasThumbsUp = Math.random() < 0.5
    let hasBrilliant = Math.random() < 0.5
    let hasThoughtFul = Math.random() < 0.5

    return (
      <div className='likeBtn'>
        <span>
          <Menu
            menuButton={<button className='likeBtn'>Like</button>}
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
                className={
                  hasBrilliant ? "emoji-selected" : "emoji-un-selected"
                }
              >
                &#128161;
              </span>
              <span
                // title='Thoughtful'
                className={
                  hasThoughtFul ? "emoji-selected" : "emoji-un-selected"
                }
              >
                &#129300;
              </span>
            </MenuItem>
          </Menu>
        </span>
      </div>
    )
  }

  const reactionOverview = () => {
    let reactionCount = Math.floor(Math.random() * 9 + 1) + "K"
    return (
      <div className='reactionGroup'>
        <span className='emoji-blue'>&#128077;</span>
        <span>&#128161;</span>
        <span>&#129300;</span>
        <span className='reaction-count-text'>{reactionCount}</span>
      </div>
    )
  }

  const replyButton = () => {
    let d_fromNOw = moment(info.timeStamp).fromNow(true)
    return (
      <div className='replyBtn'>
        <span className='vertical-line' />
        {!info.replyComponent && (
          <span
            className='reply-btn-text'
            onClick={() => globalStore.handleReply(info.comId)}
          >
            Reply
          </span>
        )}
        <span className='published-time-text'>{d_fromNOw}</span>
      </div>
    )
  }

  const commentBox = () => {
    return (
      <div className='comment-box'>
        <div className='userInfo'>
          {userInfo()}
          <div className='infoStyle'>{info.text}</div>
          {currentUser && (
            <div className='actionDiv'>
              <div className='halfDiv'>
                {likeButton()}
                {reactionOverview()}
                {replyButton()}
              </div>
              <div className='float-right flagBtn' onClick={onOpenModal} />
            </div>
          )}
        </div>
      </div>
    )
  }

  const commentBoxWithInput = () => {
    return (
      <div className='replysection'>
        {commentBox()}
        <InputField
          formStyle={{
            backgroundColor: "transparent",
            padding: "20px 0px",
            marginLeft: "-15px"
          }}
          comId={info.comId}
          fillerText={""}
          mode={"replyMode"}
          parentId={parentId}
        />
      </div>
    )
  }

  // report action modal
  const [open, setOpen] = useState(false)
  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

  const reportAction = () => {
    return
    const reportContent = [
      "False Information",
      "Bully & Harassment",
      "Offensive",
      "Terrorism",
      "Scam or Fraud",
      "Something else"
    ]
    return (
      <Modal open={open} onClose={onCloseModal} center>
        <hr />
        <ul>
          {reportContent.map((content, index) => (
            <li className='report-content' key={index}>
              {content}
            </li>
          ))}
        </ul>
      </Modal>
    )
  }

  return (
    <div className='comment-structure'>
      {replyMode ? commentBoxWithInput() : commentBox()}
      {reportAction()}
    </div>
  )
}

export default CommentStructure
