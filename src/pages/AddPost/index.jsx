import { useRef, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import axios from '../../axios';

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useEffect } from "react";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(id);

  const inputFileRef = useRef(null);

  useEffect(() => {
    console.log(id);
    if (id) {
      axios.get(`/posts/${id}`)
        .then(({ data }) => {
          setText(data.text)
          setTitle(data.title)
          setTags(data.tags.join(','))
          setImageUrl(data.imageUrl)
        }).catch((err) => {
          console.warn(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert('Ошибка при загрузке файла!');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  }

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const preparedData = {
        title,
        imageUrl,
        text,
        tags: tags.split(','),
      }
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, preparedData)
        : await axios.post('/posts', preparedData);
      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);

    } catch (error) {
      console.warn(error);
      alert('Ошибка при создании статьи!');
    }
  }

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} className={styles.buttons} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input type="file" ref={inputFileRef} hidden onChange={handleChangeFile} />
      {imageUrl && (
        <>
          <Button className={styles.buttons} variant="contained" color="error" onClick={onClickRemoveImage}>Удалить</Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt={"Uploaded"} />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button disabled={isLoading} onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <Button onClick={() => navigate('/')} size="large">Отмена</Button>
      </div>
    </Paper>
  );
};
