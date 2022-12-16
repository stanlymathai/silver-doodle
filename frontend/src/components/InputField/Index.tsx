import "./InputField.scss"
import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../context/Provider"
import React from "react"
const { v4: uuidv4 } = require("uuid")
import InputComponent from "./InputComponent"

interface InputFieldProps {
  formStyle?: object
  comId?: string
  fillerText?: string
  parentId?: string
  mode?: string
  customImg?: string
  inputStyle?: object
  cancelBtnStyle?: object
  submitBtnStyle?: object
  imgStyle?: object
  imgDiv?: object
}

const InputField = ({
  formStyle,
  comId,
  fillerText,
  parentId,
  mode,
  customImg,
  inputStyle,
  cancelBtnStyle,
  submitBtnStyle,
  imgStyle,
  imgDiv
}: InputFieldProps) => {
  const [text, setText] = useState("")

  useEffect(() => {
    if (fillerText) {
      setText(fillerText)
    }
  }, [fillerText])

  const globalStore: any = useContext(GlobalContext)

  const editMode = async (advText?: string) => {
    const textToSend = advText ? advText : text

    return (
      await globalStore.onEdit(textToSend, comId, parentId),
      globalStore.onEditAction &&
        (await globalStore.onEditAction({
          userId: globalStore.currentUserData.currentUserId,
          comId: comId,
          avatarUrl: globalStore.currentUserData.currentUserImg,
          userProfile: globalStore.currentUserData.currentUserProfile
            ? globalStore.currentUserData.currentUserProfile
            : null,
          fullName: globalStore.currentUserData.currentUserFullName,
          text: textToSend,
          parentOfEditedCommentId: parentId
        }))
    )
  }

  const replyMode = async (replyUuid: string, advText?: string) => {
    const textToSend = advText ? advText : text

    return (
      await globalStore.onReply(textToSend, comId, parentId, replyUuid),
      globalStore.onReplyAction &&
        (await globalStore.onReplyAction({
          userId: globalStore.currentUserData.currentUserId,
          repliedToCommentId: comId,
          avatarUrl: globalStore.currentUserData.currentUserImg,
          userProfile: globalStore.currentUserData.currentUserProfile
            ? globalStore.currentUserData.currentUserProfile
            : null,
          fullName: globalStore.currentUserData.currentUserFullName,
          text: textToSend,
          parentOfRepliedCommentId: parentId,
          comId: replyUuid
        }))
    )
  }
  const submitMode = async (createUuid: string, advText?: string) => {
    const textToSend = advText ? advText : text

    return (
      await globalStore.handleSubmit(textToSend, createUuid),
      globalStore.onSubmitAction &&
        (await globalStore.onSubmitAction({
          userId: globalStore.currentUserData.currentUserId,
          comId: createUuid,
          avatarUrl: globalStore.currentUserData.currentUserImg,
          userProfile: globalStore.currentUserData.currentUserProfile
            ? globalStore.currentUserData.currentUserProfile
            : null,
          fullName: globalStore.currentUserData.currentUserFullName,
          text: textToSend,
          replies: []
        }))
    )
  }

  const handleSubmit = async (event: any, advText?: string) => {
    event.preventDefault()
    const createUuid = uuidv4()
    const replyUuid = uuidv4()
    mode === "editMode"
      ? editMode(advText)
      : mode === "replyMode"
      ? replyMode(replyUuid, advText)
      : submitMode(createUuid, advText)
    setText("")
  }

  return (
    <div>
      <InputComponent
        formStyle={formStyle}
        imgDiv={imgDiv}
        imgStyle={imgStyle}
        customImg={customImg}
        mode={mode}
        inputStyle={inputStyle}
        cancelBtnStyle={cancelBtnStyle}
        comId={comId}
        submitBtnStyle={submitBtnStyle}
        handleSubmit={handleSubmit}
        text={text}
        setText={setText}
      />
    </div>
  )
}
export default InputField
