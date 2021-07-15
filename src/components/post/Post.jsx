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
                        <span className="postDate">10分鐘前</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">我的第一po</span>
                    <img src="./assets/post/1.jpeg" alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img src="./assets/like.png" alt="" className="likeIcon" />
                        <img src="./assets/heart.png" alt="" className="likeIcon" />
                        <span className="postLikeCounter">23個人喜歡</span>
                    </div>
                    <div className="postBottomRight">
                        <div className="postCommentText">9 comments</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
