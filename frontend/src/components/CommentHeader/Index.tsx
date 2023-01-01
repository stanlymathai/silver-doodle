import React, { useContext, useState } from "react";

import { GlobalContext } from "../../context/Provider";

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";

import "./Style.scss";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const CommentHeader = () => {
  const INITIAL_FETCH = 6;
  const labels = [
    {
      value: "newest",
      title: "All comments",
      desc: "Show all comments, sorted newest to oldest",
    },
    {
      value: "oldest",
      title: "All comments",
      desc: "Show all comments, sorted oldest to newest",
    },
    {
      value: "engaged",
      title: "Most relevant",
      desc: "Show the most engaging  comment first",
    },
  ];
  const reportReasons = [
    "False Information",
    "Bully & Harassment",
    "Offensive",
    "Terrorism",
    "Scam or Fraud",
    "Something else"
  ]

  const globalStore: any = useContext(GlobalContext);
  const [displayLabel, setDisplayLabel] = useState(labels[0].title);

  const previosComments: number = globalStore.totalCount - INITIAL_FETCH;
  const showLoadMore =
    previosComments > 0 && globalStore.data.length < globalStore.totalCount;

  const renderSortMenu = (el: { title: string; desc: string }, idx: number) => (
    <div
      onClick={() => setDisplayLabel(el.title)}
      className={`sort-box ${idx != 2 && "box-border"}`}
    >
      <h3 className="sort-title">{el.title}</h3>
      <p className="sort-desc">{el.desc}</p>
    </div>
  );


  const sortComments = () => (
    <Menu
      transition
      menuButton={
        ({ open }) =>
          <MenuButton className="all-comments">
            {displayLabel} <div className={`chev-down ${open && "chev-rotate"}`} />
          </MenuButton>
      }
      align={"end"}
      offsetY={10}
      viewScroll={"close"}
    >
      {labels.map((el, idx) => (
        <MenuItem key={idx} value={el.value} onClick={globalStore.handleSort}>
          {renderSortMenu(el, idx)}
        </MenuItem>
      ))}
    </Menu>
  );

  const reportComments = () => (
    <div className="report-comment">
      <Menu
        transition
        offsetY={25}
        align={"center"}
        viewScroll={"close"}
        menuButton={<MenuButton id='rpt-btn' className="hidden" />}
      >
        <div className="report-box">
          <div className="box-header">
            <div>&nbsp;</div>
            <div className="title">REPORT</div>
            <div className="close">X</div>
          </div>
          <hr />
          <div className="info">
            <h4>Report comment</h4>
            <span>You can report the comment after selecting a problem.</span>
          </div>
          <hr />
          {reportReasons.map((el: any) => (
            <MenuItem key={el}>{el}</MenuItem>
          ))}
        </div>
      </Menu>
    </div>
  );

  return (
    <div className="session-header">
      {showLoadMore ? (
        <div
          onClick={() => {
            globalStore.loadMore();
            setDisplayLabel(labels[0].title)
          }}
          className="prev-comments"
        >
          View {previosComments} previous comments
        </div>
      ) : (
        <div />
      )}
      {!!globalStore.data.length && reportComments()}
      {!!globalStore.data.length && sortComments()}
    </div>
  );
};
export default CommentHeader;