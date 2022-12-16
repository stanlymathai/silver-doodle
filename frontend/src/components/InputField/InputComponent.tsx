import React from "react"
import "./InputField.scss"
import { useContext } from "react"
import { GlobalContext } from "../../context/Provider"

interface InputComponentProps {
  formStyle?: object
  comId?: string
  mode?: string
  customImg?: string
  inputStyle?: object
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
    <form
      className='form'
      style={{ backgroundColor: "#1a1a2b" }}
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
          onClick={(e) => (text ? handleSubmit(e) : null)}
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
  )
}

export default InputComponent
