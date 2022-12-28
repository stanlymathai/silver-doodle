import React, { useContext } from "react";

import { GlobalContext } from "../../context/Provider";


const Header = () => {
    const globalStore: any = useContext(GlobalContext);

    return (
        <div className="session-header">
            <div>View {globalStore.data.length} previous comments</div>
            <div>All comments</div>
        </div>
    )
}
export default Header


