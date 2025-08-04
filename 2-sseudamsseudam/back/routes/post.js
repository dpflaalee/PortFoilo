const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const multer = require('multer');  
const path = require('path'); 
const fs = require('fs');  

const { Post, User, Image, Comment, Hashtag, OpenScope, Category, Blacklist, UserProfileImage } = require('../models');
const { isLoggedIn } = require('./middlewares');

try {
  fs.accessSync('uploads');
} catch (error) {
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + '_' + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g)

    const openScopeMap = {
      public: 1,
      private: 2,
      follower: 3,
      group: 4,
    };
    const OpenScopeId = openScopeMap[req.body.openScope] || 1;

    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
      OpenScopeId,
      GroupId: req.body.groupId || null,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { content: tag.slice(1).toLowerCase() }
          })
        )
      )
      await post.addHashtags(result.map(v => v[0]))
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {

        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);

      } else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    if (req.body.categoryIds) {
      const categoryIds = Array.isArray(req.body.categoryIds)
        ? req.body.categoryIds
        : [req.body.categoryIds];

      await post.setCategorys([]);

      const categories = await Category.findAll({
        where: { id: categoryIds },
      });
      await post.addCategorys(categories);
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: OpenScope },
        { model: Image },
        { model: User, as: 'Likers', attributes: ['id'] },
        { model: User, attributes: ['id', 'nickname', 'isAdmin']
          , include: [{model:UserProfileImage}]
         },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'] }] },
        {
          model: Category,
          as: 'Categorys',
          through: { attributes: [] }, 
          attributes: ['id', 'content', 'isAnimal']
        },
      ]
    });

    res.status(201).json(fullPost);
  } catch (error) {
    next(error);
  }
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
  res.json(req.files.map((v) => v.filename));
});

router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        { model: OpenScope },
        { model: Image },
        { model: User, as: 'Likers', attributes: ['id'] },
        { model: User, attributes: ['id', 'nickname', 'isAdmin'] },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'] }] },
        { model: Post, as: 'Retweet', include: [User, Image] },
        {
          model: Category,
          as: 'Categorys',
          through: { attributes: [] }, 
          attributes: ['id', 'content', 'isAnimal']
        }
      ],
    });
    if (!post) {
      return res.status(404).send('게시글이 존재하지 않습니다.');
    }

if (post?.Retweet?.UserId && req.user) {
  const blockedRetweet = await Blacklist.findOne({
    where: {
      [Sequelize.Op.or]: [
        { BlockingId: req.user.id, BlockedId: post.Retweet.UserId },
        { BlockingId: post.Retweet.UserId, BlockedId: req.user.id },
      ]
    }
  });

  if (blockedRetweet) {
    post.Retweet.content = '비공개된 게시물입니다.';
    post.Retweet.User = null;
    post.Retweet.Images = [];
    post.Retweet.Comments = [];
    post.Retweet.Likers = [];
  }
}

    const isBlocked = await Blacklist.findOne({
      where: {
        [Sequelize.Op.or]: [
          { BlockingId: post.UserId, BlockedId: req.user.id },  
          { BlockingId: req.user.id, BlockedId: post.UserId },  
        ]
      }
    });

    if (isBlocked) {
      return res.status(403).send('차단된 사용자와의 상호작용이 제한됩니다.');
    }

    const comments = post.Comments.map(comment => {
    const c = comment.toJSON();
      if (c.isDeleted) {
        c.content = '삭제된 댓글입니다.';
        c.User = null;
      }
    return c;
    });
    const parentComments = comments.filter(c => !c.RecommentId);
    const childComments = comments.filter(c => c.RecommentId);

    const commentsWithReplies = parentComments.map(parent => ({
      ...parent,
      Recomments: childComments.filter(child => child.RecommentId === parent.id),
    }));

    const postData = post.toJSON();
    postData.Comments = commentsWithReplies;

    res.json(postData);
  } catch (error) {
    next(error);
  }
});


router.patch('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const { content, openScope } = req.body;

    const openScopeMap = {
      public: 1,
      private: 2,
      follower: 3,
      group: 4,
    };
    const OpenScopeId = openScopeMap[openScope] || 1;

    await Post.update({
      content,
      OpenScopeId,
    }, {
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      }
    });
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (hashtags) {
      const result = await Promise.all(hashtags.map(
        (tag) => Hashtag.findOrCreate({
          where: { content: tag.slice(1).toLowerCase() },
        })
      ));
      await post.setHashtags(result.map((v) => v[0]));
    }
    res.status(200).json({ PostId: parseInt(req.params.postId, 10), content: req.body.content, openScope: req.body.openScope, });
  } catch (error) {
    next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id
      }
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });

  } catch (error) {
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) { return req.status(403).send('게시글을 확인해주세요'); }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
      RecommentId: req.body.RecommentId || null,
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{ model: User, attributes: ['id', 'nickname'] }]
    });
    res.status(200).json({
      ...fullComment.toJSON(),
      PostId: post.id,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:postId/comment/:commentId', isLoggedIn, async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await Comment.findOne({
      where: {
        id: commentId,
        PostId: postId,
        UserId: req.user.id,
      },
    });

    if (!comment) {
      return res.status(404).json({ message: '댓글이 존재하지 않거나 권한이 없습니다.' });
    }

    comment.isDeleted = true;
    await comment.save();

    res.status(200).json({ PostId: parseInt(postId, 10), CommentId: parseInt(commentId, 10) });
  } catch (error) {
    next(error);
  }
});

router.patch('/:postId/comment/:commentId', isLoggedIn, async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const { content, isRecomment } = req.body;

    let comment;

    if (isRecomment) {
      comment = await Comment.findOne({
        where: {
          id: commentId,
          UserId: req.user.id,
        }
      });
    } else {
      comment = await Comment.findOne({
        where: {
          id: commentId,
          PostId: postId,
          UserId: req.user.id,
        }
      });
    }

    if (!comment) {
      return res.status(404).send('댓글이 없거나 권한이 없습니다.');
    }

    await Comment.update(
      { content },
      { where: { id: commentId } }
    );

    const updatedComment = await Comment.findOne({
      where: { id: commentId },
      include: [{ model: User, attributes: ['id', 'nickname'] }]
    });

    res.status(200).json(updatedComment);

  } catch (error) {
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) { return res.status(403).send('게시글을 확인해주세요'); }

    await post.addLikers(req.user.id)
    res.json({ UserId: req.user.id, PostId: post.id })
  } catch (error) {
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) { return res.status(403).send('게시글을 확인해주세요'); }

    await post.removeLikers(req.user.id)
    res.json({ UserId: req.user.id, PostId: post.id })
  } catch (error) {
    next(error);
  }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: 'Retweet',
          include: [
            { model: OpenScope },
            { model: User, 
              include: [{ model: User, as: 'Followers', attributes: ['id'] }
                      , { model: UserProfileImage}] }
          ]
        },
        { model: OpenScope },
        { model: User, include: [{ model: User, as: 'Followers', attributes: ['id'] },
      { model: UserProfileImage},] },
      ]
    });

    if (!post) {
      return res.status(403).send('게시글을 확인해주세요');
    }

    const retweetTarget = post.Retweet || post;
    const targetUserId = retweetTarget.UserId;

    const isBlocked = await Blacklist.findOne({
      where: {
        [Sequelize.Op.or]: [
          { BlockingId: req.user.id, BlockedId: targetUserId },
          { BlockingId: targetUserId, BlockedId: req.user.id },
        ]
      }
    });

    if (isBlocked) {
      return res.status(403).send('차단된 사용자와의 게시물은 리트윗할 수 없습니다.');
    }

    if (
      retweetTarget.OpenScope?.content === 'private' && retweetTarget.UserId !== req.user.id
    ) {
      return res.status(403).send('비공개 게시물은 리트윗할 수 없습니다.');
    }

    if (
      retweetTarget.OpenScope?.content === 'follower' &&
      retweetTarget.UserId !== req.user.id &&
      !retweetTarget.User.Followers.some(f => f.id === req.user.id)
    ) {
      return res.status(403).send('팔로워 공개 게시물은 팔로워만 리트윗할 수 있습니다.');
    }

    if (req.user.id === post.UserId
      || (post.Retweet && post.Retweet.UserId === req.user.id)
    ) { return res.status(403).send('본인게시물은 리트윗할 수 없습니다.'); }

    const retweetTargetId = post.RetweetId || post.id

    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      }
    })
    if (exPost) { return res.status(403).send('이미 리트윗한 게시물입니다.'); }

    const retweet = await Post.create({
      UserId: req.user.id, RetweetId: retweetTargetId, content: 'retweet',
    });

    const retweetDetail = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post, as: 'Retweet', include: [
            { model: User, attributes: ['id', 'nickname'], 
              include: [{ model: User, as: 'Followers', attributes: ['id'] }
                      ,{ model: UserProfileImage}
            ] },
            { model: Image },
            { model: OpenScope }
          ]
        },
        { model: User,
          include : [{model: UserProfileImage}]
         },
        { model: Image },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nickname'] },] },
        { model: OpenScope },
        {
          model: Category,
          as: 'Categorys',
          through: { attributes: [] }, 
          attributes: ['id', 'content', 'isAnimal']
        }
      ]
    });

    if (retweetDetail?.OpenScope?.content) {
      retweetDetail.dataValues.scope = retweetDetail.OpenScope.content;
    }
    if (retweetDetail?.Retweet?.OpenScope?.content) {
      retweetDetail.Retweet.dataValues.scope = retweetDetail.Retweet.OpenScope.content;
    }

  return res.status(201).json(retweetDetail);

  } catch (error) {
    next(error)
  }
});

module.exports = router;
