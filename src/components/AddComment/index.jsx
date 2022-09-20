import React, {useState} from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from '../../axios';

export const Index = ({ id, setIsCommentsLoading, setComments }) => {
  const [message, setMessage] = useState("");

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  }

  const onSubmitComment = async () => {
    setIsCommentsLoading(true);
    const preparedData = {
      message,
      postId: id,
    };

    await axios.post(`/comments`, preparedData).then(() => {
        setMessage('')
      axios.get(`/comments/${id}`).then(res => {
        setComments(res.data);
        setIsCommentsLoading(false)
      }).catch(err => {
        console.warn(err);
        alert('Ошибка при получении комментариев.');
      });
    }).catch(err => {
      console.warn(err);
      alert('Ошибка при отправке комментариев.');
    });
  }

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src="https://mui.com/static/images/avatar/5.jpg"
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            onChange={onChangeMessage}
            value={message}
            multiline
            fullWidth
          />
          <Button onClick={onSubmitComment} variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
