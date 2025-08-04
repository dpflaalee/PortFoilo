import React, {useState, useCallback, useEffect} from "react";
import PropTypes from "prop-types";    
import { Button, Input } from "antd";  
import { useSelector } from "react-redux";  
import Link from 'next/Link';
import PostImages from "./PostImages";

const PostCardContent = ({ postData, editMode, onEditPost, onCancelUpdate, setLocationLink }) => {
  const { updatePostLoading, updatePostDone } = useSelector(state => state.post);
  const [editText, setEditText] = useState(postData);
  const onChangeText = useCallback((e) => { setEditText(e.target.value); });

  useEffect(() => {
    setEditText(postData);
    const locationMatch = postData.match(/\[location\]\((.*?)\)/);
    if (locationMatch && setLocationLink) {
      setLocationLink(locationMatch[1]);
    } else if (setLocationLink) {
      setLocationLink(null);
    }
  }, [postData, setLocationLink]);

  useEffect(() => { if(updatePostDone) { onCancelUpdate(); } }, [updatePostDone]);

  const onClickCancel = useCallback(() => { setEditText(postData); onCancelUpdate(); });

  const textWithoutLocation = editText.replace(/\[location\]\((.*?)\)/, '');

  return (
    <div>
      {editMode ? (
        <>
          <Input.TextArea value={editText} onChange={onChangeText} />
          <Button.Group>
            <Button loading={updatePostLoading} onClick={onEditPost(editText)}>수정</Button>
            <Button type="primary" onClick={onClickCancel}>취소</Button>
          </Button.Group>
        </>
      ) : (
        <div>
          {textWithoutLocation.split(/(#[^\s#]+)/g).map((v, i) => (
            v.match(/(#[^\s#]+)/)
              ? <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}>{v}</Link>
              : v
          ))}
        </div>
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onEditPost: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
  setLocationLink: PropTypes.func,  // 추가
};
PostCardContent.defaultProps = {
  editMode: false,
};
export default PostCardContent;
