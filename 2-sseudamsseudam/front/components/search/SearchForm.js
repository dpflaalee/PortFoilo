import { Input } from 'antd';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import SearchResult from './SearchResult';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import TARGET_TYPE from '../../../shared/constants/TARGET_TYPE';
import { LOAD_MY_INFO_REQUEST } from '@/reducers/user';

const { Search } = Input;

const SearchForm = () => {
    const dispatch = useDispatch();
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState({ post: [], group: [], member: [] });

    const { user } = useSelector((state) => state.user);
    const { mainComplainCard } = useSelector((state) => state.complain); // 필터 조건에 사용

    const onSearch = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:3065/search/${searchInput}`);
            setSearchResult(res.data);
        } catch (err) {
        }
    }, [searchInput]);

    const filteredData = useMemo(() => {
        if (!searchInput.trim()) return { post: [], group: [], member: [] };

        const lowerKeyword = searchInput.toLowerCase();

        // 🔍 게시글 필터링 조건
        const filteredPost = searchResult.post
            .filter((post) => post.content?.toLowerCase().includes(lowerKeyword))
            .filter((post) => {
                const openScope = post.OpenScope?.content;
                const myId = user?.id;
                const postOwnerId = post.UserId;

                const isUserBlinded = mainComplainCard?.some(
                    (report) =>
                        report.targetId === post.User?.id &&
                        report.isBlind &&
                        report.targetType === TARGET_TYPE.USER
                );
                if (isUserBlinded) return false;
                if (myId === postOwnerId) return true;
                if (openScope === 'public') return true;
                if (openScope === 'private') return false;

                const followings = user?.Followings?.map((u) => u.id) || [];
                if (openScope === 'follower') {
                    return followings.includes(postOwnerId);
                }
                if (openScope === 'group') return false;
                return false;
            });

        return {
            post: filteredPost,
            group: searchResult.group.filter((item) =>
                item.title?.toLowerCase().includes(lowerKeyword)
            ),
            member: searchResult.member.filter((item) =>
                item.nickname?.toLowerCase().includes(lowerKeyword)
            ),
        };
    }, [searchInput, searchResult, user, mainComplainCard]);

    // 마이페이지로 이동할 때 내 정보
    useEffect(() => {
        dispatch({ type: LOAD_MY_INFO_REQUEST });
    }, []);

    return (
        <div>
            <Search
                placeholder="검색하실 단어를 입력해주세요"
                onSearch={onSearch}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ width: '100%' }}
            />
            <SearchResult results={filteredData} />
        </div>
    );
};

export default SearchForm;
