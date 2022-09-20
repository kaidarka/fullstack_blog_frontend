import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown'

import { Post } from "../components";
import { Index } from "../components";
import { CommentsBlock } from "../components";
import axios from "../axios";

export const FullPost = () => {
    const [data, setData] = useState({});
    const [comments, setComments] = useState([]);
    const [isPostLoading, setIsPostLoading] = useState(true);
    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const { id } = useParams();
    useEffect(() => {
        axios.get(`/posts/${id}`).then(res => {
            setData(res.data);
            setIsPostLoading(false)
        }).catch(err => {
            console.warn(err);
            alert('Ошибка при получении статьи.');
        });
        axios.get(`/comments/${id}`).then(res => {
            setComments(res.data);
            setIsCommentsLoading(false)
        }).catch(err => {
            console.warn(err);
            alert('Ошибка при получении статьи.');
        });
        // eslint-disable-next-line
    }, []);
    if (isPostLoading) {
        return <Post isLoading={isPostLoading} isFullPost/>
    }
        return (
            <>
                <Post
                    _id={data._id}
                    key={data._id}
                    title={data.title}
                    imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
                    user={data.user}
                    createdAt={data.createdAt}
                    viewsCount={data.viewsCount}
                    commentsCount={3}
                    tags={data.tags}
                    isFullPost
                >
                    <ReactMarkdown children={data.text} />
                </Post>
                <CommentsBlock
                    items={comments}
                    isLoading={isCommentsLoading}
                >
                    <Index id={id} setIsCommentsLoading={setIsCommentsLoading} setComments={setComments}/>
                </CommentsBlock>
            </>
        );


};
