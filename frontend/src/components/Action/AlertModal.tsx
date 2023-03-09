import React, { useContext } from 'react';

import { GlobalContext } from '../../context/Index';

import { Menu, MenuButton } from '@szhsin/react-menu';

import './Style.scss';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

const AlertModal = () => {
  const store: any = useContext(GlobalContext);

  return (
    <div className="report-comment">
      <div className="modal-close">
        <Menu
          viewScroll={'close'}
          menuButton={<MenuButton className="hidden" id="close-alert" />}
        />
      </div>
      <Menu
        transition
        align={'center'}
        menuButton={<MenuButton id="alert-modal" className="hidden" />}
      >
        <div className="report-box">
          <div className="box-header">
            <div>&nbsp;</div>
            <div className="title">{store.alertData?.title}</div>
            <div className="close" onClick={store.alert.close}>
              X
            </div>
          </div>
          <hr />
          <div className="alert-message">
            <p>{store.alertData?.content}</p>
          </div>
          <div className="box-header">
            <div>&nbsp;</div>
            <button
              type="button"
              className="acknowledge"
              onClick={store.alert.close}
            >
              Dismiss
            </button>
            <div>&nbsp;</div>
          </div>
        </div>
      </Menu>
    </div>
  );
};
export { AlertModal };
