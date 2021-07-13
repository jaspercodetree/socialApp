import "./topbar.css";
import { Search, Person, Chat, Notifications } from '@material-ui/icons';

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
                    <input type="text" className="searchInput" placeholder="搜尋您的朋友，或是發布文章、影片" />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <span className="topbarLink">HomePage</span>
                    <span className="topbarLink">Timeline</span>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Person />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Chat />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">1</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
