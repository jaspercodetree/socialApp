import { MoreVert } from '@material-ui/icons';
import './post.css';

export default function Post() {
    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img src="./assets/person/8.jpeg" alt="" className="postProfileImg" />
                        <span className="postUsername">Jasper</span>
                        <span className="postDate">20210701</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter"></div>
                <div className="postButtom"></div>
            </div>
        </div>
    )
}
