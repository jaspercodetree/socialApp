import "./topbar.css";
import { Search } from '@material-ui/icons';

export default function Topbar() {
    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <div className="logo">
                    JasperBook
                </div>
            </div>
            <div className="tipbarCenter">
                <div className="searchbar">
                    <Search />
                    <input type="text" />
                </div></div>
            <div className="topbarRight">3</div>
        </div>
    )
}
