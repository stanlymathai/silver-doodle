import React from "react"
import { useContext } from "react"
import { GlobalContext } from "../../context/Provider"

interface InputComponentProps {
  formStyle?: object
  comId?: string
  mode?: string
  customImg?: string
  cancelBtnStyle?: object
  submitBtnStyle?: object
  imgStyle?: object
  imgDiv?: object
  handleSubmit: Function
  text: string
  setText: Function
}

const InputComponent = ({
  imgDiv,
  imgStyle,
  customImg,
  mode,
  cancelBtnStyle,
  comId,
  submitBtnStyle,
  handleSubmit,
  text,
  setText
}: InputComponentProps) => {
  const globalStore: any = useContext(GlobalContext)

  return (
    <div className='comment-session-input'>
      <form
        className='input-form'
        onSubmit={() => handleSubmit}
      >
        <div className='userImg' style={imgDiv}>
          <a
            target='_blank'
            href={globalStore.currentUserData.currentUserProfile}
          >
            <img
              src={
                globalStore.customImg ||
                customImg ||
                globalStore.currentUserData.currentUserImg
              }
              style={globalStore.imgStyle || imgStyle}
              alt='userIcon'
              className='imgdefault'
            />
          </a>
        </div>
        <input
          className='postComment'
          type='text'
          placeholder='Write a comment....'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {text != "" ? (
          <button
            className='postBtn'
            type='submit'
            disabled={text != "" ? false : true}
            style={globalStore.submitBtnStyle || submitBtnStyle}
            onClick={(e) => handleSubmit(e)}
          >
            Post
          </button>
        ) : (
          ""
        )}
        {mode && (
          <button
            className='cancelBtn'
            style={globalStore.cancelBtnStyle || cancelBtnStyle}
            type='button'
            onClick={() => globalStore.handleReply(comId)}
          >
            Cancel
          </button>
        )}
      </form>
      <div className="horizontal-line" />
    </div>
  )
}

export default InputComponent
