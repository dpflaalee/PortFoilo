import axios from 'axios';
import DetailCard from '@/components/detail/DetailCard';

const DetailPage = ({ post }) => {
  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }
  return <DetailCard post={post} />;
};

export async function getServerSideProps(context) {
  const { postId } = context.params;

  try {
    const response = await axios.get(`http://localhost:3065/post/${postId}`);
    return { props: { post: response.data } };
  } catch (error) {
    console.error(error);
    return { props: { post: null } };
  }
}

export default DetailPage;
