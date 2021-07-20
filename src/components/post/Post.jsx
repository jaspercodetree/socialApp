import { useState } from 'react';
import { MoreVert } from '@material-ui/icons';
import { Users } from "../../dummyData";
import './post.css';

export default function Post({ post }) {
    // console.log(post);

    // let user = Users.filter(u => u.id === 1);
    // console.log(user[0])

    const [like, setLike] = useState(post.like);
    const [isLiked, setIsLiked] = useState(false);

    const likeHandler = () => {
        isLiked ? setLike(like - 1) : setLike(like + 1);
        setIsLiked(!isLiked);
    }

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img src={Users.filter(u => u.id === post.userId)[0].profilePicture} alt="" className="postProfileImg" />
                        <span className="postUsername">{Users.filter(u => u.id === post.userId)[0].username}</span>
                        <span className="postDate">{post.date}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img src={post.photo} alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img src="./assets/like.png" alt="" className="likeIcon" onClick={likeHandler} />
                        <img src="./assets/heart.png" alt="" className="likeIcon" onClick={likeHandler} />
                        <span className="postLikeCounter">{like}個人喜歡</span>
                    </div>
                    <div className="postBottomRight">
                        <div className="postCommentText">{post.comment}comments</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
